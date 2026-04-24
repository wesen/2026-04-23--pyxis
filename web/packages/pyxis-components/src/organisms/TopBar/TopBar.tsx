import React from 'react';
import { pyxisPart } from '../../utils/parts';
export type TopBarProps = {
  breadcrumb?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};
export const TopBar = ({ breadcrumb, title, subtitle, actions }: TopBarProps) => (
  <div {...pyxisPart('top-bar')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '20px 28px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
    <div {...pyxisPart('top-bar', 'title-group')} style={{ minWidth: 0 }}>
      {breadcrumb && <div {...pyxisPart('top-bar', 'breadcrumb')} style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>{breadcrumb}</div>}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>{title}</h1>
      {subtitle && <div {...pyxisPart('top-bar', 'subtitle')} style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', marginTop: 3 }}>{subtitle}</div>}
    </div>
    {actions && <div {...pyxisPart('top-bar', 'actions')} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>}
  </div>
);
