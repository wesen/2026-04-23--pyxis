(() => {
  const e = window.React.createElement;
  const rootId = 'atom-capture-root';

  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
  document.body.innerHTML = `<div id="${rootId}"></div>`;
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.background = '#F3F1EB';

  const root = document.getElementById(rootId);
  root.style.width = '920px';
  root.style.padding = '24px';
  root.style.background = '#F3F1EB';
  root.style.color = '#1A1A18';
  root.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.gap = '18px';

  const wrap = (id, child, style = {}) => e('span', { 'data-comp': id, style }, child);
  const row = (label, children) => e('div', {
    style: { display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, alignItems: 'start' },
  },
    e('div', { style: { fontSize: 12, color: '#8E887E', paddingTop: 8 } }, label),
    e('div', { style: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' } }, ...children),
  );

  const field = (id, label, child) => e('div', { 'data-comp': id, style: { width: 260 } }, e(window.Field, { label }, child));

  const fixture = e(window.React.Fragment, null,
    e('h1', { style: { margin: 0, fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, fontWeight: 500 } }, 'Atom diff fixture'),

    row('Buttons', [
      wrap('button-primary', e(window.Btn, { variant: 'primary', iconRight: 'chev' }, 'Get tickets')),
      wrap('button-dark', e(window.Btn, { variant: 'dark' }, 'Dark')),
      wrap('button-outline', e(window.Btn, { variant: 'outline', icon: 'calendar' }, 'Add to calendar')),
      wrap('button-ghost', e(window.Btn, { variant: 'ghost' }, 'Ghost')),
      wrap('button-danger', e(window.Btn, { variant: 'danger' }, 'Danger')),
      wrap('button-success', e(window.Btn, { variant: 'success' }, 'Success')),
    ]),

    row('Badges', [
      wrap('badge-confirmed', e(window.Badge, { status: 'confirmed' })),
      wrap('badge-pending', e(window.Badge, { status: 'pending' })),
      wrap('badge-declined', e(window.Badge, { status: 'declined' })),
      wrap('badge-archived', e(window.Badge, { status: 'archived' })),
    ]),

    row('Tags', [
      wrap('tag-default', e(window.Tag, null, 'Darkwave')),
      wrap('tag-accent', e(window.Tag, { color: '#C8270D' }, 'Featured')),
    ]),

    row('Avatars', [
      wrap('avatar-md', e(window.Avatar, { name: 'Ada Lovelace', size: 36 })),
      wrap('avatar-lg', e(window.Avatar, { name: 'Moor Mother', size: 48, tone: '#C8270D' })),
    ]),

    row('Icons', [
      wrap('icon-calendar', e(window.Icon, { name: 'calendar', size: 20 })),
      wrap('icon-ticket', e(window.Icon, { name: 'ticket', size: 20 })),
      wrap('icon-discord', e(window.Icon, { name: 'discord', size: 20 })),
      wrap('icon-button', e(window.IconBtn, { icon: 'edit', tooltip: 'Edit' })),
    ]),

    row('Inputs', [
      field('input-search', 'Search', e(window.Input, { icon: 'search', placeholder: 'Find a show', value: 'Burial', onChange: () => {} })),
      field('input-error', 'Email', e(window.Input, { placeholder: 'you@example.com', value: '', onChange: () => {}, style: { borderColor: '#C8270D' } })),
    ]),

    row('Select', [
      field('select-status', 'Status', e(window.Select, {
        value: 'confirmed',
        onChange: () => {},
        options: [
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'pending', label: 'Pending' },
          { value: 'archived', label: 'Archived' },
        ],
      })),
    ]),

    row('Textarea', [
      field('textarea-notes', 'Notes', e(window.Textarea, {
        rows: 2,
        value: 'Very loud — warn neighbours.',
        onChange: () => {},
      })),
    ]),
  );

  if (window.ReactDOM.createRoot) {
    window.ReactDOM.createRoot(root).render(fixture);
  } else {
    window.ReactDOM.render(fixture, root);
  }
})();
