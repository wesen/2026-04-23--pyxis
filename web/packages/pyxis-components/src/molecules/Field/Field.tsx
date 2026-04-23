import React from 'react';
export type FieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};
export const Field = ({ label, hint, error, children }: FieldProps) => (
  <div data-part="field" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    {label && <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: error ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>{label}</label>}
    {children}
    {error && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}>{error}</span>}
    {!error && hint && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{hint}</span>}
  </div>
);
