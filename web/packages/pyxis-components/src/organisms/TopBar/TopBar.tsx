import React from 'react';
export type TopBarProps = {
  breadcrumb?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};
export const TopBar = ({ breadcrumb, title, subtitle, actions }: TopBarProps) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: subtitle ? 'flex-start' : 'center', gap: 16, padding: '20px 24px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
    <div>
      {breadcrumb && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 2 }}>{breadcrumb}</div>}
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
      {subtitle && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>{subtitle}</div>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
  </div>
);
