import React, { forwardRef, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { badgeColors, type BadgeStatus } from '../../tokens';
import { pyxisPart } from '../../utils/parts';

export type BadgeProps = {
  /** Which status to display */
  status: BadgeStatus;
  /** Custom label text (overrides default label) */
  children?: React.ReactNode;
  /** Custom dot color (overrides status color) */
  dotColor?: string;
  className?: string;
  rootProps?: HTMLAttributes<HTMLSpanElement>;
};

/**
 * A small status indicator with a dot and label.
 * Used to communicate state at a glance.
 *
 * **Statuses:** `confirmed` · `pending` · `approved` · `declined` · `cancelled` · `archived` · `hold` · `blocked` · `live` · `draft` · `needslog` · `logged`
 *
 * ```tsx
 * <Badge status="confirmed" />
 * <Badge status="cancelled">Cancelled</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ status, children, dotColor, className, rootProps }, ref) => {
    const { bg, fg, label } = badgeColors[status];

    return (
      <span
        ref={ref}
        {...pyxisPart('badge')}
        {...rootProps}
        className={clsx('pyxis-badge', `pyxis-badge--${status}`, className)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: bg,
          color: fg,
          fontSize: '11px',
          fontWeight: 'var(--weight-medium)',
          padding: '2px 9px',
          borderRadius: '999px',
          whiteSpace: 'nowrap',
          lineHeight: 1.6,
        }}
      >
        <span
          {...pyxisPart('badge', 'indicator')}
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: dotColor ?? fg,
            flexShrink: 0,
          }}
          aria-hidden
        />
        <span {...pyxisPart('badge', 'label')}>{children ?? label}</span>
      </span>
    );
  }
);
Badge.displayName = 'Badge';

/* ─── Exports ──────────────────────────────────────────── */

export type { BadgeStatus };
export { badgeColors };
