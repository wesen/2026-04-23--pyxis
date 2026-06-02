#!/usr/bin/env python3
import os, re, sqlite3, subprocess, pathlib, json
root=pathlib.Path('.').resolve()
ticket=root/'ttmp/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK--convert-html-designs-into-production-react-sites'
db=ticket/'various/evidence.sqlite'
if db.exists(): db.unlink()
con=sqlite3.connect(db)
con.executescript('''
create table files(path text primary key, kind text, lines int, bytes int);
create table docs(path text primary key, ticket text, title text, kind text, lines int, text text);
create table components(path text primary key, package text, layer text, name text, has_css int, has_story int, lines int);
create table commits(hash text primary key, subject text, ticket text);
create table mentions(doc_path text, component text, count int);
''')
# Files of interest
for base in ['prototype-design','web/packages/pyxis-components/src','web/packages/pyxis-app/src','prototype-design/visual-diff/userland','../corporate-headquarters/css-visual-diff']:
    p=(root/base).resolve()
    if not p.exists(): continue
    for f in p.rglob('*'):
        if f.is_file() and f.suffix in ['.md','.tsx','.ts','.css','.js','.jsx','.yml','.json','.py','.sh']:
            try:
                txt=f.read_text(errors='ignore')
            except Exception: continue
            rel=os.path.relpath(f, root)
            kind=f.suffix.lstrip('.')
            con.execute('insert or replace into files values (?,?,?,?)',(rel,kind,txt.count('\n')+1,f.stat().st_size))
# Docs relevant by ticket keywords
for f in (root/'ttmp/2026').rglob('*.md'):
    rel=str(f.relative_to(root))
    if any(k in rel for k in ['PYXIS-SCREENSHOT-EXTRACTION','PYXIS-STORYBOOK-CATALOG','PYXIS-PUBLIC-PAGES','PYXIS-COMPONENT-VISUAL-PARITY','PYXIS-CSSVD-JS','PYXIS-APP-REACT','PYXIS-PUBLIC-COMPONENT-TAXONOMY','PYXIS-PUBLIC-VISUAL-MOBILE-TUNING','PYXIS-SHOW-EDIT-VISUAL-REDESIGN','PYXIS-ARCHIVE-VISUAL-REDESIGN']):
        txt=f.read_text(errors='ignore')
        title=''
        for line in txt.splitlines():
            if line.startswith('# '): title=line[2:].strip(); break
        parts=rel.split('/')
        ticket_name=parts[3] if len(parts)>4 else ''
        kind=parts[4] if len(parts)>5 else ''
        con.execute('insert or replace into docs values (?,?,?,?,?,?)',(rel,ticket_name,title,kind,txt.count('\n')+1,txt[:200000]))
# Components
for pkg in ['pyxis-components','pyxis-app']:
    base=root/'web/packages'/pkg/'src'
    if not base.exists(): continue
    for f in base.rglob('*.tsx'):
        if f.name.endswith('.stories.tsx'): continue
        rel=str(f.relative_to(root))
        parts=f.relative_to(base).parts
        layer=''
        for cand in ['atoms','molecules','organisms','pages','public']:
            if cand in parts: layer=cand; break
        name=f.stem
        has_css=(f.with_suffix('.css')).exists()
        has_story=(f.with_name(f.stem+'.stories.tsx')).exists()
        lines=f.read_text(errors='ignore').count('\n')+1
        con.execute('insert or replace into components values (?,?,?,?,?,?,?)',(rel,pkg,layer,name,int(has_css),int(has_story),lines))
# Commits
log=subprocess.check_output(['git','log','--oneline','--all','--','web','prototype-design','ttmp'], text=True, errors='ignore')
for line in log.splitlines():
    if not line.strip(): continue
    h, subj=line.split(' ',1)
    m=re.match(r'([A-Z0-9-]+):', subj)
    con.execute('insert or replace into commits values (?,?,?)',(h,subj,m.group(1) if m else ''))
# Mentions
components=[r[0] for r in con.execute('select name from components')]
for doc_path, text in con.execute('select path,text from docs'):
    low=text.lower()
    for c in components:
        n=low.count(c.lower())
        if n:
            con.execute('insert into mentions values (?,?,?)',(doc_path,c,n))
con.commit()
print(db)
print('files', con.execute('select count(*) from files').fetchone()[0])
print('docs', con.execute('select count(*) from docs').fetchone()[0])
print('components', con.execute('select count(*) from components').fetchone()[0])
print('commits', con.execute('select count(*) from commits').fetchone()[0])
