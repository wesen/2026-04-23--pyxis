import { NavLink } from 'react-router-dom';
import { Avatar, Icon, PyxisLogo, type IconName } from 'pyxis-components';
import { appPart } from '../../parts';
import '../AppShell/AppShell.css';

type AppNavItem = readonly [to: string, label: string, icon: IconName, badge?: number];
type AppNavSection = {
  heading: string;
  items: readonly AppNavItem[];
};

const navSections = [
  {
    heading: 'Program',
    items: [
      ['/', 'Dashboard', 'home'],
      ['/shows', 'Shows', 'music'],
      ['/calendar', 'Calendar', 'calendar'],
      ['/bookings', 'Bookings', 'mail', 3],
    ],
  },
  {
    heading: 'Roster',
    items: [
      ['/artists', 'Artists', 'users'],
      ['/attendance', 'Post-show log', 'check'],
    ],
  },
  {
    heading: 'Operate',
    items: [
      ['/log', 'Audit log', 'log'],
      ['/discord', 'Discord', 'discord'],
      ['/settings', 'Settings', 'cog'],
    ],
  },
] as const satisfies readonly AppNavSection[];

export { navSections };
export type { AppNavItem, AppNavSection };

export function AppSidebarMenu() {
  return (
    <nav className="app-sidebar-menu" data-section="app-sidebar-menu">
      {navSections.map((section) => (
        <div className="app-sidebar-section" key={section.heading}>
          <span>{section.heading}</span>
          {section.items.map(([to, label, icon, badge]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              <Icon name={icon} size={15} />
              <b>{label}</b>
              {badge && <em>{badge}</em>}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

export function AppSidebarUserFooter() {
  return (
    <footer className="app-sidebar-user" data-section="app-sidebar-user">
      <Avatar name="Ada Dove" size="sm" />
      <div>
        <strong>Ada Dove</strong>
        <span>admin · online</span>
      </div>
      <Icon name="chevron-right" size={14} />
    </footer>
  );
}

export function AppSidebar() {
  return (
    <aside className="app-sidebar" data-section="app-sidebar" {...appPart('app-sidebar')}>
      <div className="app-brand">
        <PyxisLogo size={26} stack />
      </div>
      <AppSidebarMenu />
      <AppSidebarUserFooter />
    </aside>
  );
}
