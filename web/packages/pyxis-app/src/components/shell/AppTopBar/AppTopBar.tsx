import type { ReactNode } from 'react';
import { Button } from 'pyxis-components';
import { appPart } from '../../parts';
import '../AppShell/AppShell.css';

export type AppTopBarProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: ReactNode;
};

export function AppTopBar({ title, eyebrow, subtitle, action }: AppTopBarProps) {
  return (
    <header className="app-topbar" data-section="app-topbar" {...appPart('app-topbar')}>
      <div>
        <span>{eyebrow ?? 'Home'}</span>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action ?? (
        <div className="app-topbar-actions">
          <Button variant="outline" size="sm" iconLeft="search" aria-label="Search" />
          <Button variant="outline" size="sm" iconLeft="bell" aria-label="Notifications" />
          <Button size="sm" iconLeft="plus">New show</Button>
        </div>
      )}
    </header>
  );
}
