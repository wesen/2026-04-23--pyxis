import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from 'pyxis-components';
import './AppSidebarMenu.css';

type AppNavItem = readonly [to: string, label: string, icon: IconName, badge?: number];
type AppNavSection = {
  heading: string;
  items: readonly AppNavItem[];
};

const navSections: readonly AppNavSection[] = [
  { heading: 'Program', items: [ ['/', 'Dashboard', 'home'], ['/shows', 'Shows', 'music'], ['/calendar', 'Calendar', 'calendar'], ['/bookings', 'Bookings', 'mail'] ] },
  { heading: 'Roster', items: [ ['/artists', 'Artists', 'users'], ['/show-log', 'Post-show log', 'check'] ] },
  { heading: 'Operate', items: [ ['/log', 'Audit log', 'log'], ['/discord', 'Discord', 'discord'], ['/settings', 'Settings', 'cog'] ] },
];

export function AppSidebarMenu() {
  return <nav className="app-sidebar-menu" data-section="app-sidebar-menu">{navSections.map((section) => <div className="app-sidebar-section" key={section.heading}><span>{section.heading}</span>{section.items.map(([to,label,icon,badge])=><NavLink key={to} to={to} end={to === '/'}><Icon name={icon} size={15}/><b>{label}</b>{badge && <em>{badge}</em>}</NavLink>)}</div>)}</nav>;
}
