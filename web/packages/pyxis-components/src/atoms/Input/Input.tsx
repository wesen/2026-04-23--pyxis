import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Icon, type IconName } from '../Icon';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** Label text */
  label?: string;
  /** Hint text shown below the input */
  hint?: string;
  /** Error message — turns input red and shows message */
  error?: string;
  /** Icon to show inside the input */
  icon?: IconName;
  /** Icon position. Default: 'left' */
  iconPosition?: 'left' | 'right';
  'data-part'?: string;
};

/**
 * A text input field.
 *
 * ```tsx
 * <Input label="Artist name" placeholder="Enter artist name" />
 * <Input label="Email" type="email" error="Invalid email address" />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      icon,
      iconPosition = 'left',
      className,
      'data-part': dataPart,
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;
    const hasError = !!error;

    return (
      <div className={clsx('pyxis-field', className)} data-part={dataPart ?? 'field'}>
        {label && (
          <label
            htmlFor={inputId}
            className="pyxis-field__label"
            data-has-error={hasError ? 'true' : undefined}
          >
            {label}
          </label>
        )}
        <div
          className="pyxis-field__input-wrap"
          data-icon={icon ? iconPosition : undefined}
          data-has-error={hasError ? 'true' : undefined}
        >
          {icon && iconPosition === 'left' && (
            <Icon name={icon} size={15} className="pyxis-field__icon" aria-hidden />
          )}
          <input
            ref={ref}
            id={inputId}
            className="pyxis-field__input"
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            data-part="input"
            {...rest}
          />
          {icon && iconPosition === 'right' && (
            <Icon name={icon} size={15} className="pyxis-field__icon" aria-hidden />
          )}
        </div>
        {hasError && (
          <span id={`${inputId}-error`} className="pyxis-field__message" data-status="error">
            {error}
          </span>
        )}
        {!hasError && hint && (
          <span id={`${inputId}-hint`} className="pyxis-field__message">
            {hint}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
