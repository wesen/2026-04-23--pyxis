import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, Button, Icon, PyxisLogo, type IconName } from 'pyxis-components';
import { appPart } from '../parts';
import './AppShell.css';

type AppNavItem = readonly [to: string, label: string, icon: IconName, badge?: number];
type AppNavSection = {
  heading: string;
  items: readonly AppNavItem[];
};

const navSections = [
  { heading: 'Program', items: [ ['/', 'Dashboard', 'home'], ['/shows', 'Shows', 'music'], ['/calendar', 'Calendar', 'calendar'], ['/bookings', 'Bookings', 'mail', 3] ] },
  { heading: 'Roster', items: [ ['/artists', 'Artists', 'users'], ['/attendance', 'Post-show log', 'check'] ] },
  { heading: 'Operate', items: [ ['/log', 'Audit log', 'log'], ['/discord', 'Discord', 'discord'], ['/settings', 'Settings', 'cog'] ] },
] as const satisfies readonly AppNavSection[];

export type AppTopBarProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: ReactNode;
};

export type AppShellProps = AppTopBarProps & {
  children: ReactNode;
  page: string;
};

export function AppSidebarMenu() {
  return <nav className="app-sidebar-menu" data-section="app-sidebar-menu">{navSections.map((section) => <div className="app-sidebar-section" key={section.heading}><span>{section.heading}</span>{section.items.map(([to,label,icon,badge])=><NavLink key={to} to={to} end={to === '/'}><Icon name={icon} size={15}/><b>{label}</b>{badge && <em>{badge}</em>}</NavLink>)}</div>)}</nav>;
}

export function AppSidebarUserFooter() {
  return <footer className="app-sidebar-user" data-section="app-sidebar-user"><Avatar name="Ada Dove" size="sm"/><div><strong>Ada Dove</strong><span>admin · online</span></div><Icon name="chevron-right" size={14}/></footer>;
}

export function AppSidebar() { return <aside className="app-sidebar" data-section="app-sidebar" {...appPart('app-sidebar')}><div className="app-brand"><PyxisLogo size={26} stack /></div><AppSidebarMenu/><AppSidebarUserFooter/></aside>; }
export function AppTopBar({ title, eyebrow, subtitle, action }: AppTopBarProps) { return <header className="app-topbar" data-section="app-topbar" {...appPart('app-topbar')}><div><span>{eyebrow ?? 'Home'}</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action ?? <div className="app-topbar-actions"><Button variant="outline" size="sm" iconLeft="search" aria-label="Search"/><Button variant="outline" size="sm" iconLeft="bell" aria-label="Notifications"/><Button size="sm" iconLeft="plus">New show</Button></div>}</header>; }
export function AppMobileBottomNav() { const mobileNav = [ ['/', 'Dashboard'], ['/shows', 'Shows'], ['/calendar', 'Calendar'], ['/bookings', 'Bookings'], ['/settings', 'More'] ] as const; return <nav className="app-bottom-nav" data-section="app-mobile-bottom-nav" {...appPart('app-bottom-nav')}>{mobileNav.map(([to,label])=><NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}</nav>; }
export function AppShell({ title, eyebrow, subtitle, action, children, page }: AppShellProps) { return <div className="app-shell" data-page={page} {...appPart('app-shell')}><AppSidebar/><main className="app-main"><AppTopBar title={title} eyebrow={eyebrow} subtitle={subtitle} action={action}/><div className="app-main-scroll">{children}</div></main><AppMobileBottomNav/></div>; }
