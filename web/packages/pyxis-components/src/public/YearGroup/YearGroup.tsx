import { pyxisPart } from '../../utils/parts';
import React from 'react';
export type YearGroupProps = {
  year: number;
  showCount: number;
  children?: React.ReactNode;
  className?: string;
};
export const YearGroup = ({ year, showCount, children, className }: YearGroupProps) => (
  <div {...pyxisPart('year-group')} className={className}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid #EAE7E0', paddingBottom: 8 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 500, color: '#C8270D', letterSpacing: '-.02em' }}>{year}</div>
      <div style={{ fontSize: 11, color: '#8E887E', letterSpacing: '.12em', textTransform: 'uppercase' }}>{showCount} show{showCount !== 1 ? 's' : ''}</div>
    </div>
    {children}
  </div>
);
