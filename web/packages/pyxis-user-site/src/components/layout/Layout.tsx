import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PubNav, PubFooter } from 'pyxis-components';
import '../../pages/PublicPage.css';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const pageMap: Record<string, 'shows' | 'archive' | 'book' | 'about'> = {
    '/': 'shows',
    '/shows': 'shows',
    '/archive': 'archive',
    '/book': 'book',
    '/about': 'about',
  };
  const routeMap: Record<'shows' | 'archive' | 'book' | 'about', string> = {
    shows: '/',
    archive: '/archive',
    book: '/book',
    about: '/about',
  };

  const currentPage = pageMap[location.pathname] ?? (location.pathname.startsWith('/shows/') ? 'shows' : 'shows');

  return (
    <div className="pyxis-public-page-shell" data-page-shell="public">
      <div data-region="nav"><PubNav currentPage={currentPage} onNavigate={(page) => navigate(routeMap[page as keyof typeof routeMap] ?? '/')} /></div>
      <div className="pyxis-public-page-shell__main" data-region="main">
        <Outlet />
      </div>
      <div data-region="footer"><PubFooter /></div>
    </div>
  );
}
