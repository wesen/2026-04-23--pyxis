import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../Icon';

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  label?: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  'data-part'?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, placeholder, className, 'data-part': dataPart, id, ...rest }, ref) => {
    const selectId = id ?? `select-${Math.random().toString(36).slice(2)}`;
    const hasError = !!error;
    return (
      <div className={clsx('pyxis-field', className)} data-part={dataPart ?? 'field'}>
        {label && <label htmlFor={selectId} className="pyxis-field__label" data-has-error={hasError ? 'true' : undefined}>{label}</label>}
        <div className="pyxis-field__select-wrap" data-has-error={hasError ? 'true' : undefined}>
          <select ref={ref} id={selectId} className="pyxis-field__select" aria-invalid={hasError} data-part="select" {...rest}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <Icon name="chevron-down" size={14} className="pyxis-field__select-icon" aria-hidden />
        </div>
        {hasError && <span className="pyxis-field__message" data-status="error">{error}</span>}
        {!hasError && hint && <span className="pyxis-field__message">{hint}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
