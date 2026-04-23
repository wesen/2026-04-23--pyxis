import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Icon, type IconName } from '../Icon';
import { buttonVariants, buttonSizes, type ButtonVariant, type ButtonSize } from '../../tokens';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: IconName;
  iconRight?: IconName;
  isLoading?: boolean;
  fullWidth?: boolean;
  'data-part'?: string;
};

/**
 * A clickable element that triggers an action.
 *
 * **Variants:** `primary` · `dark` · `outline` · `ghost` · `danger` · `success` · `discord`
 * **Sizes:** `sm` (32px) · `md` (40px) · `lg` (48px)
 *
 * ```tsx
 * <Button variant="primary" iconRight="chevron-right">Get tickets</Button>
 * <Button variant="outline" size="sm">Cancel</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      iconLeft,
      iconRight,
      isLoading,
      fullWidth,
      className,
      children,
      disabled,
      'data-part': dataPart,
      ...rest
    },
    ref
  ) => {
    const v = buttonVariants[variant];
    const s = buttonSizes[size];
    const isDisabled = disabled || isLoading;
    // Convert rem fontSize string to px number for Icon size prop
    const iconSize = parseFloat(s.fontSize.replace('rem', '')) * 16 + 2;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx('pyxis-btn', `pyxis-btn--${variant}`, `pyxis-btn--${size}`, className)}
        data-part={dataPart ?? 'btn'}
        data-variant={variant}
        data-size={size}
        data-full-width={fullWidth ? 'true' : undefined}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7px',
          background: v.bg,
          color: v.fg,
          border: `1px solid ${v.bd}`,
          height: s.height,
          padding: s.padding,
          fontSize: s.fontSize,
          fontWeight: 'var(--weight-medium)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          borderRadius: 'var(--radius-md)',
          whiteSpace: 'nowrap',
          lineHeight: 1.2,
          WebkitFontSmoothing: 'antialiased',
          '--btn-hover': v.hover,
        } as React.CSSProperties}
        {...rest}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {iconLeft && <Icon name={iconLeft} size={iconSize} aria-hidden />}
            {children}
            {iconRight && <Icon name={iconRight} size={iconSize} aria-hidden />}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

/* ─── Spinner ──────────────────────────────────────────── */

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      style={{ animation: 'pyxis-spin 0.7s linear infinite', flexShrink: 0 }}
    >
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="30"
        strokeDashoffset="10"
      />
      <style>{`@keyframes pyxis-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

/* ─── Exports ──────────────────────────────────────────── */

export type { ButtonVariant, ButtonSize };
export { buttonVariants, buttonSizes };
