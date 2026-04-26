import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './Textarea.css';

export type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
  label?: string;
  hint?: string;
  error?: string;
  rows?: number;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, rows = 4, className, id, ...rest }, ref) => {
    const taId = id ?? `ta-${Math.random().toString(36).slice(2)}`;
    const hasError = !!error;
    return (
      <div className={clsx('pyxis-field', className)} {...pyxisPart('textarea')}>
        {label && <label htmlFor={taId} className="pyxis-field__label" data-has-error={hasError ? 'true' : undefined} {...pyxisPart('textarea', 'label')}>{label}</label>}
        <textarea
          ref={ref}
          id={taId}
          rows={rows}
          className="pyxis-field__textarea"
          aria-invalid={hasError}
          {...pyxisPart('textarea', 'control')}
          {...rest}
        />
        {hasError && <span className="pyxis-field__message" data-status="error" {...pyxisPart('textarea', 'error')}>{error}</span>}
        {!hasError && hint && <span className="pyxis-field__message" {...pyxisPart('textarea', 'hint')}>{hint}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
