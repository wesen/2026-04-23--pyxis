import React, { useState } from 'react';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';

export type MailingListCTAProps = {
  onSubscribe?: (email: string) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
  'data-part'?: string;
};

export const MailingListCTA = ({ onSubscribe, isSubmitting, className, 'data-part': dataPart }: MailingListCTAProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await onSubscribe?.(email);
    setEmail('');
  };

  return (
    <div
      data-part={dataPart ?? 'mailing-list-cta'}
      className={className}
      style={{
        padding: '32px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 500,
          margin: '0 0 8px',
        }}
      >
        Stay in the loop
      </h3>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          margin: '0 0 20px',
          fontSize: 'var(--text-sm)',
        }}
      >
        Get show announcements, artist confirmations, and venue news.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', gap: 8, maxWidth: 360, margin: '0 auto' }}>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button variant="dark" type="submit" isLoading={isSubmitting}>
            Subscribe
          </Button>
        </div>
      </form>
    </div>
  );
};
