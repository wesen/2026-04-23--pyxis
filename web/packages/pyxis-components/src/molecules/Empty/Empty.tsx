import React from 'react';
import { pyxisPart } from '../../utils/parts';
export type EmptyProps = {
  icon?: string; // SVG path for the icon
  title: string;
  description?: string;
  action?: React.ReactNode;
};
export const Empty = ({ title, description, action }: EmptyProps) => (
  <div
    {...pyxisPart('empty')}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '48px 24px',
      gap: 12,
    }}
  >
    <svg {...pyxisPart('empty', 'icon')} width="32" height="32" viewBox="0 0 20 20" fill="var(--color-text-disabled)" aria-hidden>
      <circle cx="10" cy="10" r="3" />
    </svg>
    <div {...pyxisPart('empty', 'title')} style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{title}</div>
    {description && (
      <div {...pyxisPart('empty', 'description')} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', maxWidth: '320px' }}>
        {description}
      </div>
    )}
    {action}
  </div>
);
