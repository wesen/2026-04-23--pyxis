import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  label?: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, placeholder, className, id, ...rest }, ref) => {
    const selectId = id ?? `select-${Math.random().toString(36).slice(2)}`;
    const hasError = !!error;
    return (
      <div className={clsx('pyxis-field', className)} {...pyxisPart('select')}>
        {label && <label htmlFor={selectId} className="pyxis-field__label" data-has-error={hasError ? 'true' : undefined} {...pyxisPart('select', 'label')}>{label}</label>}
        <div className="pyxis-field__select-wrap" data-has-error={hasError ? 'true' : undefined} {...pyxisPart('select', 'control-shell')}>
          <select ref={ref} id={selectId} className="pyxis-field__select" aria-invalid={hasError} {...pyxisPart('select', 'control')} {...rest}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {hasError && <span className="pyxis-field__message" data-status="error" {...pyxisPart('select', 'error')}>{error}</span>}
        {!hasError && hint && <span className="pyxis-field__message" {...pyxisPart('select', 'hint')}>{hint}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
