import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './SpaceInfo.css';

export type SpaceInfoProps = {
  address?: string;
  capacity?: number;
  email?: string;
  className?: string;
};

export const SpaceInfo = ({ email = 'book@ppxis.space', className }: SpaceInfoProps) => (
  <div {...pyxisPart('space-info')} className={clsx('pyxis-space-info', className)}>
    25 Manton Ave, Unit #2<br />
    Providence, RI 02909<br />
    <br />
    <span className="pyxis-space-info__email" {...pyxisPart('space-info', 'email')}>
      {email}
    </span>
  </div>
);
