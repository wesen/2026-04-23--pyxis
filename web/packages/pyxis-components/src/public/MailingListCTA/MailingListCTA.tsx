import { pyxisPart } from '../../utils/parts';
import React, { useState } from 'react';

export type MailingListCTAProps = {
  onSubscribe?: (email: string) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
};

export const MailingListCTA = ({ onSubscribe, isSubmitting, className }: MailingListCTAProps) => {
  const [email, setEmail] = useState('');
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!email) return; await onSubscribe?.(email); setEmail(''); };
  return (
    <div {...pyxisPart('mailing-list-cta')} className={className} style={{ borderTop: '1px solid #EAE7E0', paddingTop: 28 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, color: '#C8270D', margin: '0 0 8px' }}>Stay in the loop</h3>
      <p style={{ fontSize: 13, color: '#8E887E', margin: '0 0 16px' }}>Get show announcements and venue news.</p>
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', gap: 8 }}>
        <input placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1, border: '1px solid #EAE7E0', padding: '9px 12px', fontFamily: 'inherit', fontSize: 13 }} />
        <button type="submit" disabled={isSubmitting} style={{ background: '#1F1E1C', color: '#fff', border: 'none', borderRadius: 4, padding: '9px 14px', fontFamily: 'inherit' }}>Subscribe</button>
      </form>
    </div>
  );
};
