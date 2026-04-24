import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Icon, type IconName } from '../Icon';
import { buttonVariants, buttonSizes, type ButtonVariant, type ButtonSize } from '../../tokens';
import { pyxisPart } from '../../utils/parts';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: IconName;
  iconRight?: IconName;
  isLoading?: boolean;
  fullWidth?: boolean;
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
      ...rest
    },
    ref
  ) => {
    const v = buttonVariants[variant];
    const s = buttonSizes[size];
    const isDisabled = disabled || isLoading;
    const iconSize = getIconSizeFromFontSize(s.fontSize);

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx('pyxis-btn', `pyxis-btn--${variant}`, `pyxis-btn--${size}`, className)}
        {...pyxisPart('button')}
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
            {iconLeft && <Icon name={iconLeft} size={iconSize} aria-hidden {...pyxisPart('button', 'icon-start')} />}
            <span {...pyxisPart('button', 'label')}>{children}</span>
            {iconRight && <Icon name={iconRight} size={iconSize} aria-hidden {...pyxisPart('button', 'icon-end')} />}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

/* ─── Spinner ──────────────────────────────────────────── */

function getIconSizeFromFontSize(fontSize: string) {
  const numeric = parseFloat(fontSize);
  if (Number.isNaN(numeric)) return 15;
  return fontSize.endsWith('rem') ? numeric * 16 + 2 : numeric + 2;
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      {...pyxisPart('button', 'spinner')}
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
