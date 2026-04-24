(() => {
  const root = document.createElement('div');
  root.id = 'public-capture-root';
  root.style.cssText = [
    'width: 920px',
    'padding: 24px',
    'background: #F3F1EB',
    'color: #1F1E1C',
    "font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    'display: flex',
    'flex-direction: column',
    'gap: 22px',
    'box-sizing: border-box',
  ].join(';');

  const PINK = '#C8270D';
  const PMUTE = '#8E887E';
  const PRULE = '#EAE7E0';

  const e = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (key === 'style' && value && typeof value === 'object') Object.assign(node.style, value);
      else if (key.startsWith('data-')) node.setAttribute(key, value);
      else node[key] = value;
    }
    for (const child of children.flat()) {
      if (child == null) continue;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return node;
  };

  const row = (label, children) => e('div', { style: { display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px', alignItems: 'start' } },
    e('div', { style: { fontSize: '12px', color: PMUTE, paddingTop: '8px' } }, label),
    e('div', { style: { display: 'flex', gap: '18px', alignItems: 'flex-start', flexWrap: 'wrap' } }, children),
  );

  root.append(
    e('h1', { style: { margin: '0', fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: '500' } }, 'Public diff fixture'),

    row('Lineup', [
      e('div', { 'data-comp': 'public-lineup-row-default', style: { width: '360px' } },
        e('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' } },
          e('tbody', null,
            e('tr', { style: { borderTop: `1px solid ${PRULE}` } },
              e('td', { style: { padding: '12px 12px 12px 0', color: PMUTE, fontVariantNumeric: 'tabular-nums', width: '60px', verticalAlign: 'top' } }, '9:45'),
              e('td', { style: { padding: '12px 0', color: PINK, fontWeight: '600', verticalAlign: 'top' } },
                'sable witch',
                e('div', { style: { fontSize: '11.5px', color: PMUTE, fontWeight: '400', marginTop: '2px', fontStyle: 'italic' } }, 'opener · dj set'),
              ),
            ),
          ),
        ),
      ),
    ]),

    row('Ticket', [
      e('div', { 'data-comp': 'public-ticket-stub-default', style: { width: '260px' } },
        e('div', { style: { border: `1px solid ${PRULE}`, borderRadius: '4px', background: '#fff', padding: '14px', display: 'grid', gap: '8px' } },
          e('div', { style: { fontSize: '10.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: PMUTE, fontWeight: '600' } }, 'Admit one'),
          e('div', { style: { fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '600', color: PINK, letterSpacing: '-.02em' } }, 'Redroom Inferno'),
          e('div', { style: { height: '1px', background: PRULE, margin: '2px 0' } }),
          e('div', { style: { display: 'flex', justifyContent: 'space-between', color: PMUTE, fontSize: '12.5px' } },
            e('span', null, '$10 adv / $15 door'),
            e('span', null, '25+'),
          ),
        ),
      ),
    ]),

    row('Archive stats', [
      e('div', { 'data-comp': 'public-archive-stats-default', style: { width: '680px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', padding: '18px 0', borderTop: `1px solid ${PRULE}`, borderBottom: `1px solid ${PRULE}` } },
        [['194', 'shows'], ['312', 'artists'], ['31', 'residencies'], ['0', 'cops called']].map(([n, l]) =>
          e('div', null,
            e('div', { style: { fontFamily: "'Fraunces', serif", fontSize: '34px', fontWeight: '600', color: PINK, letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums' } }, n),
            e('div', { style: { fontSize: '11px', color: PMUTE, letterSpacing: '.12em', textTransform: 'uppercase', marginTop: '2px' } }, l),
          ),
        ),
      ),
    ]),

    row('Year group', [
      e('div', { 'data-comp': 'public-year-group-default', style: { width: '560px' } },
        e('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px', borderBottom: `1px solid ${PRULE}`, paddingBottom: '8px' } },
          e('div', { style: { fontFamily: "'Fraunces', serif", fontSize: '34px', fontWeight: '500', color: PINK, letterSpacing: '-.02em' } }, '2025'),
          e('div', { style: { fontSize: '11px', color: PMUTE, letterSpacing: '.12em', textTransform: 'uppercase' } }, '8 shows'),
        ),
      ),
    ]),



    row('Nav', [
      e('div', { 'data-comp': 'public-pub-nav-default', style: { width: '920px' } },
        e('header', { style: { background: '#fff', borderBottom: `1px solid ${PRULE}`, position: 'sticky', top: '0', zIndex: '50' } },
          e('div', { style: { maxWidth: '920px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', boxSizing: 'border-box' } },
            e('button', { style: { background: 'none', border: 'none', cursor: 'pointer', padding: '0', fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: '700', letterSpacing: '-.025em', color: PINK } }, 'ppxis'),
            e('nav', { style: { display: 'flex', gap: '2px' } }, ['Shows','Archive','Book us','About'].map((l,i)=>e('button',{style:{background:i===0?'#F3F1EC':'none',border:'none',cursor:'pointer',fontFamily:'inherit',padding:'6px 14px',fontSize:'13px',fontWeight:i===0?'600':'400',borderRadius:'6px',color:i===0?PINK:PMUTE}},l))),
          ),
        ),
      ),
    ]),

    row('Footer', [
      e('div', { 'data-comp': 'public-pub-footer-default', style: { width: '920px' } },
        e('footer', { style: { borderTop: `1px solid ${PRULE}`, marginTop: '60px', padding: '28px 32px' } },
          e('div', { style: { maxWidth: '920px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' } },
            e('div', null, e('div', { style: { fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: '700', letterSpacing: '-.025em', color: PINK } }, 'ppxis'), e('div', { style: { fontSize: '11.5px', color: PMUTE, fontStyle: 'italic', lineHeight: '1.65', marginTop: '4px' } }, 'a music artist space', e('br'), '25 Manton Ave, Providence RI 02909')),
            e('div', { style: { display: 'flex', gap: '32px', flexWrap: 'wrap' } }, ['Instagram','Discord','Mailing list'].map(l=>e('a',{href:'#',style:{fontSize:'13px',color:PMUTE,textDecoration:'none'}},l))),
          ),
        ),
      ),
    ]),

    row('About hero', [
      e('div', { 'data-comp': 'public-about-hero-default', style: { width: '620px', padding: '48px 0 32px' } },
        e('p', { style: { fontSize: '11px', fontWeight: '600', letterSpacing: '.14em', color: PMUTE, textTransform: 'uppercase', margin: '0 0 10px' } }, 'Est. 2023'),
        e('h1', { style: { fontFamily: "'Fraunces', serif", fontSize: '42px', fontWeight: '700', letterSpacing: '-.025em', lineHeight: '1.05', margin: '0', color: PINK } }, 'About ppxis'),
        e('p', { style: { fontFamily: "'Fraunces', serif", fontSize: '30px', fontWeight: '400', fontStyle: 'italic', letterSpacing: '-.015em', lineHeight: '1.3', color: PINK, margin: '28px 0 0' } }, 'a music artist space in a former print shop — 150 cap, one beautiful PA, and a deep love for the loud end of the spectrum.'),
      ),
    ]),

    row('Hero', [
      e('div', { 'data-comp': 'public-pub-hero-default', style: { width: '720px' } },
        e('section', { style: { borderTop: `1px solid ${PRULE}`, padding: '24px 0', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '24px' } },
          e('div', { style: { color: PMUTE, fontVariantNumeric: 'tabular-nums' } }, e('div',{style:{fontSize:'12px',textTransform:'uppercase',letterSpacing:'.12em'}},'Feb'), e('div',{style:{fontFamily:"'Fraunces', serif",fontSize:'42px',color:PINK,lineHeight:'1'}},'14')),
          e('div', null, e('h2',{style:{fontFamily:"'Fraunces', serif",fontSize:'34px',fontWeight:'700',letterSpacing:'-.025em',margin:'0 0 6px',color:PINK}},'Redroom Inferno'), e('p',{style:{fontSize:'13px',color:PMUTE,margin:'0 0 12px'}},'electronic / noise'), e('div',{style:{fontSize:'12.5px',color:PMUTE}},'Doors 9:00 PM · 21+ · $10 adv / $15 door')),
        ),
      ),
    ]),

    row('Venue/space', [
      e('div', { 'data-comp': 'public-venue-card-default', style: { width: '300px' } }, e('aside',{style:{background:'#1F1E1C',color:'#E8E3D8',padding:'26px',borderRadius:'6px',fontSize:'13px',lineHeight:'1.7'}}, e('div',{style:{fontFamily:"'Fraunces', serif",fontSize:'22px',fontWeight:'500',fontStyle:'italic',letterSpacing:'-.02em',marginBottom:'14px'}},'the space'), e('div',{style:{color:'#BCB7AD'}},'150 standing · 80 seated'))),
      e('div', { 'data-comp': 'public-space-info-default', style: { width: '300px' } }, e('div',{style:{fontSize:'14px',color:'#4A463E',lineHeight:'1.8'}}, '25 Manton Ave, Unit #2', e('br'), 'Providence, RI 02909', e('br'), e('br'), e('span',{style:{color:PINK}},'book@ppxis.space'))),
    ]),

    row('Ethos', [
      e('div', { 'data-comp': 'public-ethos-strip-default', style: { width: '860px', marginTop: '56px', borderTop: `1px solid ${PRULE}`, paddingTop: '36px' } },
        e('div',{style:{fontSize:'11px',fontWeight:'600',letterSpacing:'.14em',color:PMUTE,textTransform:'uppercase',marginBottom:'28px'}},'Our ethos'),
        e('div',{style:{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'28px'}}, ['Artists first','A safer room','Loud by design'].map((h,i)=>e('div',null,e('div',{style:{fontFamily:"'Fraunces', serif",fontSize:'44px',fontWeight:'500',fontStyle:'italic',color:PINK,lineHeight:'1'}},`0${i+1}`),e('div',{style:{fontFamily:"'Fraunces', serif",fontSize:'20px',fontWeight:'500',color:PINK,marginTop:'10px'}},h),e('div',{style:{fontSize:'13px',color:'#4A463E',lineHeight:'1.65',marginTop:'8px'}},'we exist to book weird shows and pay the people who play them.')))),
      ),
    ]),

    row('Mailing list', [
      e('div', { 'data-comp': 'public-mailing-list-cta-default', style: { width: '520px', borderTop: `1px solid ${PRULE}`, paddingTop: '28px' } }, e('h3',{style:{fontFamily:"'Fraunces', serif",fontSize:'24px',fontWeight:'500',color:PINK,margin:'0 0 8px'}},'Stay in the loop'), e('p',{style:{fontSize:'13px',color:PMUTE,margin:'0 0 16px'}},'Get show announcements and venue news.'), e('div',{style:{display:'flex',gap:'8px'}}, e('input',{placeholder:'your@email.com',style:{flex:'1',border:`1px solid ${PRULE}`,padding:'9px 12px'}}), e('button',{style:{background:'#1F1E1C',color:'#fff',border:'none',borderRadius:'4px',padding:'9px 14px'}},'Subscribe'))),
    ]),

    row('Booking', [
      e('div', { 'data-comp': 'public-booking-rules-default', style: { width: '320px' } }, e('aside',{style:{background:'#1F1E1C',color:'#E8E3D8',padding:'26px',borderRadius:'6px',fontSize:'13px',lineHeight:'1.7'}}, e('div',{style:{fontFamily:"'Fraunces', serif",fontSize:'22px',fontWeight:'500',fontStyle:'italic',marginBottom:'14px'}},'the space'), e('div',{style:{color:'#BCB7AD'}},'we book 6–10 weeks out; late requests get the unused-dates list.'))),
      e('div', { 'data-comp': 'public-booking-success-default', style: { width: '420px', textAlign: 'center', padding: '48px 24px' } }, e('h2',{style:{fontFamily:"'Fraunces', serif",fontSize:'24px',fontWeight:'500',color:PINK,margin:'0 0 8px'}},'Inquiry sent — sable witch'), e('p',{style:{color:PMUTE,margin:'0 0 24px'}},"We'll be in touch within a week or two.")),
    ]),

    row('Booking form', [
      e('div', { 'data-comp': 'public-booking-form-default', style: { width: '560px' } },
        e('form', { style: { display: 'grid', gap: '18px' } },
          e('div', { style: { fontSize: '13.5px', color: PMUTE, lineHeight: '1.7', fontStyle: 'italic' } }, 'tell us about your show. we read every submission. responses in 3–7 days. we book 6–10 weeks out; late requests get the unused-dates list.'),
          ['Your name', 'Email', 'Project / artist name'].map((label, i) =>
            e('label', { style: { display: 'block' } },
              e('div', { style: { fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: PMUTE, fontWeight: '600', marginBottom: '6px' } }, label),
              e('input', { placeholder: i === 1 ? 'you@label.com' : '', style: { width: '100%', border: 'none', borderBottom: `1.5px solid ${PRULE}`, background: 'transparent', padding: '8px 0', fontFamily: 'inherit', fontSize: '14.5px', color: PINK, outline: 'none', boxSizing: 'border-box' } }),
            ),
          ),
          e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' } },
            ['Preferred date', 'Expected draw'].map((label) =>
              e('label', null,
                e('div', { style: { fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: PMUTE, fontWeight: '600', marginBottom: '6px' } }, label),
                e(label === 'Expected draw' ? 'select' : 'input', { placeholder: label === 'Preferred date' ? 'e.g. late April' : '', style: { width: '100%', border: 'none', borderBottom: `1.5px solid ${PRULE}`, background: 'transparent', padding: '8px 0', fontFamily: 'inherit', fontSize: '14.5px', color: PINK, outline: 'none', boxSizing: 'border-box' } }, label === 'Expected draw' ? e('option', null, 'Under 50') : null),
              ),
            ),
          ),
          e('label', null,
            e('div', { style: { fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: PMUTE, fontWeight: '600', marginBottom: '6px' } }, 'Tell us about it'),
            e('textarea', { rows: 6, placeholder: "who's on the bill, what it sounds like, what you need from us", style: { width: '100%', border: `1px solid ${PRULE}`, background: '#fff', borderRadius: '4px', padding: '12px', fontFamily: 'inherit', fontSize: '14px', color: PINK, outline: 'none', resize: 'vertical', boxSizing: 'border-box' } }),
          ),
          e('button', { type: 'submit', style: { justifySelf: 'start', background: PINK, color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 22px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '.02em' } }, 'Send inquiry →'),
        ),
      ),
    ]),

    row('Show row', [
      e('div', { 'data-comp': 'public-pub-show-row-default', style: { width: '640px' } },
        e('a', { style: { display: 'grid', gridTemplateColumns: '80px 1fr auto auto', gap: '18px', padding: '14px 0', textDecoration: 'none', alignItems: 'baseline', borderTop: `1px solid ${PRULE}` } },
          e('div', { style: { fontSize: '12px', color: PMUTE, fontVariantNumeric: 'tabular-nums', letterSpacing: '.05em' } }, 'Dec 12'),
          e('div', { style: { fontFamily: "'Fraunces', serif", fontSize: '18px', color: PINK, fontWeight: '500' } }, 'Winter Solstice Rave'),
          e('div', { style: { fontSize: '11.5px', color: PMUTE, fontStyle: 'italic' } }, 'Electronic'),
          e('div', { style: { fontSize: '11.5px', color: PMUTE } }, 'recap →'),
        ),
      ),
    ]),
  );

  document.body.innerHTML = '';
  document.body.style.margin = '0';
  document.body.style.background = '#F3F1EB';
  document.body.appendChild(root);
})();
