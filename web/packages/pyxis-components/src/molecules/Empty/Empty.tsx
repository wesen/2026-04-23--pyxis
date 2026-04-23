import React from 'react';
export type EmptyProps = {
  icon?: string; // SVG path for the icon
  title: string;
  description?: string;
  action?: React.ReactNode;
};
export const Empty = ({ title, description, action }: EmptyProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '48px 24px',
      gap: 12,
    }}
  >
    <svg width="32" height="32" viewBox="0 0 20 20" fill="var(--color-text-disabled)" aria-hidden>
      <circle cx="10" cy="10" r="3" />
    </svg>
    <div style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{title}</div>
    {description && (
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', maxWidth: '320px' }}>
        {description}
      </div>
    )}
    {action}
  </div>
);
