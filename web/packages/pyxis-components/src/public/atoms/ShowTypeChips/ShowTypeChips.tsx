import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './ShowTypeChips.css';

export type ShowTypeChipsProps = {
  options?: string[];
  active?: string;
  className?: string;
};

export const ShowTypeChips = ({
  options = ['DJ night', 'Live music', 'Listening party', 'Workshop / meet-up', 'Screening', 'Other'],
  active = 'Live music',
  className,
}: ShowTypeChipsProps) => (
  <div {...pyxisPart('show-type-chips')} className={clsx('pyxis-show-type-chips', className)}>
    {options.map((type) => {
      const isActive = type === active;
      return (
        <button
          key={type}
          type="button"
          className="pyxis-show-type-chips__chip"
          {...pyxisPart('show-type-chips', 'chip')}
          data-state={isActive ? 'active' : undefined}
        >
          {type}
        </button>
      );
    })}
  </div>
);
