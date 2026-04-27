import { NavLink } from 'react-router-dom';
import { appPart } from '../../parts';
import '../AppShell/AppShell.css';

const mobileNav = [
  ['/', 'Dashboard'],
  ['/shows', 'Shows'],
  ['/calendar', 'Calendar'],
  ['/bookings', 'Bookings'],
  ['/settings', 'More'],
] as const;

export function AppMobileBottomNav() {
  return (
    <nav
      className="app-bottom-nav"
      data-section="app-mobile-bottom-nav"
      {...appPart('app-mobile-bottom-nav')}
    >
      {mobileNav.map(([to, label]) => (
        <NavLink key={to} to={to} end={to === '/'}>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
