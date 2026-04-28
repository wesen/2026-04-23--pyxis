import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PubNav, PubFooter } from 'pyxis-components';
import { usePublicSettings } from '../../api/hooks';
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
  const { data: settings } = usePublicSettings();
  const discordUrl = import.meta.env.VITE_DISCORD_URL || (settings?.discordGuildId ? `https://discord.com/channels/${settings.discordGuildId}` : 'https://discord.com/channels/586274407350272042');
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/ppxis.space/';

  return (
    <div className="pyxis-public-page-shell" data-page-shell="public">
      <div data-region="nav"><PubNav currentPage={currentPage} onNavigate={(page) => navigate(routeMap[page as keyof typeof routeMap] ?? '/')} /></div>
      <div className="pyxis-public-page-shell__main" data-region="main">
        <Outlet />
      </div>
      <div data-region="footer"><PubFooter brand={settings?.spaceName || 'ppxis'} tagline={settings?.tagline || 'a music artist space'} address={settings?.address || '25 Manton Ave, Providence RI 02909'} discordUrl={discordUrl} instagramUrl={instagramUrl} /></div>
    </div>
  );
}
