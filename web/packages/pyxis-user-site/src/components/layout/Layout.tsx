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
    <div data-page-shell="public" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div data-region="nav"><PubNav currentPage={currentPage} /></div>
      <main data-region="main" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <div data-region="footer"><PubFooter /></div>
    </div>
  );
}
