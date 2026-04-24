(() => {
  const e = window.React.createElement;
  const rootId = 'molecule-capture-root';

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

  const row = (label, children) => e('div', {
    style: { display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, alignItems: 'start' },
  },
    e('div', { style: { fontSize: 12, color: '#8E887E', paddingTop: 8 } }, label),
    e('div', { style: { display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' } }, ...children),
  );

  const fixture = e(window.React.Fragment, null,
    e('h1', { style: { margin: 0, fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, fontWeight: 500 } }, 'Molecule diff fixture'),

    row('Cards', [
      e('div', { 'data-comp': 'card-default', style: { width: 260 } },
        e(window.Card, null, 'Basic card content'),
      ),
    ]),

    row('Fields', [
      e('div', { 'data-comp': 'field-default', style: { width: 260 } },
        e(window.Field, { label: 'Artist name', hint: 'Use the public billing name.' },
          e(window.Input, { placeholder: 'Enter artist', value: 'Moor Mother', onChange: () => {} }),
        ),
      ),
      e('div', { 'data-comp': 'field-error', style: { width: 260 } },
        e(window.Field, { label: 'Contact email', hint: 'Enter a valid email.' },
          e(window.Input, { placeholder: 'booking@example.com', value: 'bad-address', onChange: () => {}, style: { borderColor: '#C8270D' } }),
        ),
      ),
    ]),

    row('Stats', [
      e('div', { 'data-comp': 'stat-default', style: { width: 220 } },
        e(window.Stat, { label: 'Shows', value: 12, sub: 'This month', trend: '+3' }),
      ),
    ]),

    row('Empty', [
      e('div', { 'data-comp': 'empty-cta', style: { width: 320 } },
        e(window.Empty, {
          title: 'No bookings yet',
          sub: 'When artists submit booking requests, they will appear here.',
          action: e(window.Btn, { variant: 'primary', size: 'sm' }, 'Create hold'),
        }),
      ),
    ]),
  );

  if (window.ReactDOM.createRoot) {
    window.ReactDOM.createRoot(root).render(fixture);
  } else {
    window.ReactDOM.render(fixture, root);
  }
})();
