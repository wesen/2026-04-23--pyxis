import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
  label?: string;
  hint?: string;
  error?: string;
  rows?: number;
  'data-part'?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, rows = 4, className, 'data-part': dataPart, id, ...rest }, ref) => {
    const taId = id ?? `ta-${Math.random().toString(36).slice(2)}`;
    const hasError = !!error;
    return (
      <div className={clsx('pyxis-field', className)} data-part={dataPart ?? 'field'}>
        {label && <label htmlFor={taId} className="pyxis-field__label" data-has-error={hasError ? 'true' : undefined}>{label}</label>}
        <textarea
          ref={ref}
          id={taId}
          rows={rows}
          className="pyxis-field__textarea"
          aria-invalid={hasError}
          data-part="textarea"
          {...rest}
        />
        {hasError && <span className="pyxis-field__message" data-status="error">{error}</span>}
        {!hasError && hint && <span className="pyxis-field__message">{hint}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
