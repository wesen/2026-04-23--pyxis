import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './YearGroup.css';

export type YearGroupProps = {
  year: number;
  showCount: number;
  children?: ReactNode;
  className?: string;
};

export const YearGroup = ({ year, showCount, children, className }: YearGroupProps) => (
  <div {...pyxisPart('year-group')} className={clsx('pyxis-year-group', className)}>
    <div className="pyxis-year-group__header" {...pyxisPart('year-group', 'header')}>
      <div className="pyxis-year-group__year" {...pyxisPart('year-group', 'year')}>
        {year}
      </div>
      <div className="pyxis-year-group__count" {...pyxisPart('year-group', 'count')}>
        {showCount} show{showCount !== 1 ? 's' : ''}
      </div>
    </div>
    {children}
  </div>
);
