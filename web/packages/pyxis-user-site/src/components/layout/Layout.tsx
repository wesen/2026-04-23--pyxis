import { Outlet, useLocation } from 'react-router-dom';
import { PubNav, PubFooter } from 'pyxis-components';
import '../../pages/PublicPage.css';

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
    <div className="pyxis-public-page-shell" data-page-shell="public">
      <div data-region="nav"><PubNav currentPage={currentPage} /></div>
      <div className="pyxis-public-page-shell__main" data-region="main">
        <Outlet />
      </div>
      <div data-region="footer"><PubFooter /></div>
    </div>
  );
}
