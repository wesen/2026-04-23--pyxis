import { clsx } from 'clsx';
import { pyxisPart } from '../../../utils/parts';
import './FindUsBlock.css';

export type FindUsBlockProps = {
  heading?: string;
  addressLines?: string[];
  emailLines?: { email: string; label?: string }[];
  note?: string;
  className?: string;
};

export const defaultFindUsAddressLines = ['25 Manton Ave, Unit #2', 'Providence, RI 02909'];
export const defaultFindUsEmailLines = [
  { email: 'hello@ppxis.space' },
  { email: 'book@ppxis.space', label: 'bookings' },
];
export const defaultFindUsNote = 'we share a block with an auto body. buzzer on the right. steel door painted red.';

export const FindUsBlock = ({
  heading = 'Find us',
  addressLines = defaultFindUsAddressLines,
  emailLines = defaultFindUsEmailLines,
  note = defaultFindUsNote,
  className,
}: FindUsBlockProps) => (
  <div {...pyxisPart('find-us-block')} className={clsx('pyxis-find-us-block', className)}>
    <div className="pyxis-find-us-block__heading" {...pyxisPart('find-us-block', 'heading')}>
      {heading}
    </div>
    <div className="pyxis-find-us-block__body" {...pyxisPart('find-us-block', 'body')}>
      {addressLines.map((line) => (
        <span key={line}>{line}<br /></span>
      ))}
      <br />
      {emailLines.map(({ email, label }) => (
        <span key={`${email}-${label ?? ''}`}>
          <span className="pyxis-find-us-block__email" {...pyxisPart('find-us-block', 'email')}>{email}</span>
          {label ? ` — ${label}` : null}
          <br />
        </span>
      ))}
      {note ? (
        <>
          <br />
          <em className="pyxis-find-us-block__note" {...pyxisPart('find-us-block', 'note')}>
            {note}
          </em>
        </>
      ) : null}
    </div>
  </div>
);
