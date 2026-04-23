import { Outlet, useLocation } from 'react-router-dom';
import { PubNav, PubFooter } from 'pyxis-components';

export function Layout() {
  const location = useLocation();

  const pageMap: Record<string, 'shows' | 'archive' | 'book' | 'about'> = {
    '/': 'shows',
    '/shows': 'shows',
    '/archive': 'archive',
    '/book': 'book',
    '/about': 'about',
  };

  const currentPage = pageMap[location.pathname] ?? 'shows';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PubNav currentPage={currentPage} />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <PubFooter />
    </div>
  );
}
