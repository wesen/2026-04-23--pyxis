import React from 'react';
import { pyxisPart } from '../../utils/parts';
export type FieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};
export const Field = ({ label, hint, error, children }: FieldProps) => (
  <div {...pyxisPart('field')} style={{ marginBottom: 14 }}>
    {label && (
      <label
        {...pyxisPart('field', 'label')}
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
    )}
    {children}
    {error && <div {...pyxisPart('field', 'error')} style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 5 }}>{error}</div>}
    {!error && hint && <div {...pyxisPart('field', 'hint')} style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 5 }}>{hint}</div>}
  </div>
);
