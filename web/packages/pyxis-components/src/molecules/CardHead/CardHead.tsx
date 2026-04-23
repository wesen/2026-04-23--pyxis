import React from 'react';
export type CardHeadProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};
export const CardHead = ({ title, subtitle, action }: CardHeadProps) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: subtitle ? 'flex-start' : 'center', gap: 16 }}>
    <div>
      <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 3 }}>{subtitle}</div>}
    </div>
    {action}
  </div>
);
