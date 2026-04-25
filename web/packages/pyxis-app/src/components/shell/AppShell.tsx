import { NavLink } from 'react-router-dom';
import { Button } from 'pyxis-components';
import { appPart } from '../parts';
import './AppShell.css';
const nav = [ ['/', 'Dashboard'], ['/shows', 'Shows'], ['/calendar', 'Calendar'], ['/bookings', 'Bookings'], ['/artists', 'Artists'], ['/attendance', 'Post-show'], ['/log', 'Audit log'], ['/discord', 'Discord'], ['/settings', 'Settings'] ] as const;
export function AppSidebar() { return <aside className="app-sidebar" {...appPart('app-sidebar')}><div className="app-brand"><b>pyxis</b><span>staff portal</span></div><nav>{nav.map(([to,label])=><NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}</nav></aside>; }
export function AppTopBar({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: React.ReactNode }) { return <header className="app-topbar" {...appPart('app-topbar')}><div><span>{eyebrow ?? 'Home'}</span><h1>{title}</h1></div>{action ?? <Button size="sm">New show</Button>}</header>; }
export function AppBottomNav() { return <nav className="app-bottom-nav" {...appPart('app-bottom-nav')}>{nav.slice(0,5).map(([to,label])=><NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}</nav>; }
export function AppShell({ title, eyebrow, action, children, page }: { title: string; eyebrow?: string; action?: React.ReactNode; children: React.ReactNode; page: string }) { return <div className="app-shell" data-page={page} {...appPart('app-shell')}><AppSidebar/><main className="app-main"><AppTopBar title={title} eyebrow={eyebrow} action={action}/>{children}</main><AppBottomNav/></div>; }
