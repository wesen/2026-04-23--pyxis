import type { FormEvent } from 'react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './MailingListCTA.css';

export type MailingListCTAProps = {
  onSubscribe?: (email: string) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
};

export const MailingListCTA = ({ onSubscribe, isSubmitting, className }: MailingListCTAProps) => {
  const [email, setEmail] = useState('');
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email) return;
    await onSubscribe?.(email);
    setEmail('');
  };
  return (
    <div {...pyxisPart('mailing-list-cta')} className={clsx('pyxis-mailing-list-cta', className)}>
      <h3 className="pyxis-mailing-list-cta__title" {...pyxisPart('mailing-list-cta', 'title')}>Stay in the loop</h3>
      <p className="pyxis-mailing-list-cta__description" {...pyxisPart('mailing-list-cta', 'description')}>Get show announcements and venue news.</p>
      <form className="pyxis-mailing-list-cta__form" {...pyxisPart('mailing-list-cta', 'form')} onSubmit={handleSubmit} noValidate>
        <input className="pyxis-mailing-list-cta__input" {...pyxisPart('mailing-list-cta', 'input')} placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="pyxis-mailing-list-cta__button" {...pyxisPart('mailing-list-cta', 'button')} type="submit" disabled={isSubmitting}>Subscribe</button>
      </form>
    </div>
  );
};
