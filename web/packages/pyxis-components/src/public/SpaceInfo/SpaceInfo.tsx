import { pyxisPart } from '../../utils/parts';
export type SpaceInfoProps = {
  address?: string;
  capacity?: number;
  email?: string;
  className?: string;
};
export const SpaceInfo = ({ email = 'book@ppxis.space', className }: SpaceInfoProps) => (
  <div {...pyxisPart('space-info')} className={className} style={{ fontSize: 14, color: '#4A463E', lineHeight: 1.8 }}>
    25 Manton Ave, Unit #2<br />
    Providence, RI 02909<br />
    <br />
    <span style={{ color: '#C8270D' }}>{email}</span>
  </div>
);
