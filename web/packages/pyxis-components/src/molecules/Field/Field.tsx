import React from 'react';
import { pyxisPart } from '../../utils/parts';
export type FieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};
export const Field = ({ label, hint, error, children }: FieldProps) => (
  <div {...pyxisPart('field')} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    {label && <label {...pyxisPart('field', 'label')} style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: error ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>{label}</label>}
    {children}
    {error && <span {...pyxisPart('field', 'error')} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}>{error}</span>}
    {!error && hint && <span {...pyxisPart('field', 'hint')} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{hint}</span>}
  </div>
);
