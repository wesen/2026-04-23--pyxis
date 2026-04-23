import React from 'react';
export type YearGroupProps = {
  year: number;
  showCount: number;
  children?: React.ReactNode;
  className?: string;
  'data-part'?: string;
};
export const YearGroup = ({ year, showCount, children, className, 'data-part': dataPart }: YearGroupProps) => (
  <div data-part={dataPart ?? 'year-group'} className={className}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 500, margin: 0 }}>{year}</h3>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{showCount} show{showCount !== 1 ? 's' : ''}</span>
    </div>
    {children}
  </div>
);
