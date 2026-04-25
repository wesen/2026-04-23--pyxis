import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './SaferSpaceAgreement.css';

export type SaferSpaceAgreementProps = {
  className?: string;
};

export const SaferSpaceAgreement = ({ className }: SaferSpaceAgreementProps) => (
  <label {...pyxisPart('safer-space-agreement')} className={clsx('pyxis-safer-space-agreement', className)}>
    <input
      className="pyxis-safer-space-agreement__checkbox"
      {...pyxisPart('safer-space-agreement', 'checkbox')}
      type="checkbox"
      defaultChecked
    />
    <span className="pyxis-safer-space-agreement__text" {...pyxisPart('safer-space-agreement', 'text')}>
      i've read the{' '}
      <a className="pyxis-safer-space-agreement__link" {...pyxisPart('safer-space-agreement', 'link')} href="#">
        safer-space policy
      </a>{' '}
      and agree to uphold it for my show.
    </span>
  </label>
);
