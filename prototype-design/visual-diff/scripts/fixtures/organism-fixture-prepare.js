(() => {
  const e = window.React.createElement;
  const rootId = 'organism-capture-root';

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
    e('h1', { style: { margin: 0, fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, fontWeight: 500 } }, 'Organism diff fixture'),

    row('Top bars', [
      e('div', { 'data-comp': 'topbar-default', style: { width: 760 } },
        e(window.TopBar, {
          breadcrumb: 'Admin / Shows',
          title: 'Upcoming shows',
          subtitle: 'Manage holds, confirmations, and settlements.',
          actions: e(window.React.Fragment, null,
            e(window.Btn, { variant: 'outline', size: 'sm' }, 'Export'),
            e(window.Btn, { variant: 'primary', size: 'sm' }, 'New show'),
          ),
        }),
      ),
    ]),

    row('Modals', [
      e('div', { 'data-comp': 'modal-default', style: { position: 'relative', width: 760, height: 460, background: '#F3F1EB', borderRadius: 12, overflow: 'hidden' } },
        e(window.Modal, {
          title: 'Confirm booking',
          subtitle: 'Send this show to the public calendar.',
          onClose: () => {},
          footer: e(window.React.Fragment, null,
            e(window.Btn, { variant: 'outline' }, 'Cancel'),
            e(window.Btn, { variant: 'primary' }, 'Confirm'),
          ),
        },
          e(window.Field, { label: 'Internal note' },
            e(window.Input, { placeholder: 'Optional note', value: '', onChange: () => {} }),
          ),
        ),
      ),
    ]),
  );

  if (window.ReactDOM.createRoot) {
    window.ReactDOM.createRoot(root).render(fixture);
  } else {
    window.ReactDOM.render(fixture, root);
  }
})();
