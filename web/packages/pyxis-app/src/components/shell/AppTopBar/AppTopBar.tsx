import type { ReactNode } from 'react';
import { Button, IconButton } from 'pyxis-components';
import { appPart } from '../../parts';
import './AppTopBar.css';

export type AppTopBarProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: ReactNode;
};

export function AppTopBar({ title, eyebrow, subtitle, action }: AppTopBarProps) {
  return <header className="app-topbar" data-section="app-topbar" {...appPart('app-topbar')}><div className="app-topbar-heading"><span className="app-topbar-eyebrow">{eyebrow ?? 'Home'}</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action ?? <div className="app-topbar-actions"><IconButton icon="search" label="Search"/><IconButton icon="bell" label="Notifications"/><Button iconLeft="plus">New show</Button></div>}</header>;
}
