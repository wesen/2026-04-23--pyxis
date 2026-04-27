import type { ReactNode } from 'react';
import { appPart } from '../../parts';
import { AppMobileBottomNav } from '../AppMobileBottomNav';
import { AppSidebar } from '../AppSidebar';
import { AppTopBar, type AppTopBarProps } from '../AppTopBar';
import './AppShell.css';

export type AppShellProps = AppTopBarProps & {
  children: ReactNode;
  page: string;
};

export function AppShell({ title, eyebrow, subtitle, action, children, page }: AppShellProps) {
  return <div className="app-shell" data-page={page} {...appPart('app-shell')}><AppSidebar/><main className="app-main"><AppTopBar title={title} eyebrow={eyebrow} subtitle={subtitle} action={action}/><div className="app-main-scroll">{children}</div></main><AppMobileBottomNav/></div>;
}
