import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { badgeColors, type BadgeStatus } from '../../tokens';

export type BadgeProps = {
  /** Which status to display */
  status: BadgeStatus;
  /** Custom label text (overrides default label) */
  children?: React.ReactNode;
  /** Custom dot color (overrides status color) */
  dotColor?: string;
  className?: string;
  'data-part'?: string;
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
  ({ status, children, dotColor, className, 'data-part': dataPart }, ref) => {
    const { bg, fg, label } = badgeColors[status];

    return (
      <span
        ref={ref}
        className={clsx('pyxis-badge', `pyxis-badge--${status}`, className)}
        data-part={dataPart ?? 'badge'}
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
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: dotColor ?? fg,
            flexShrink: 0,
          }}
          aria-hidden
        />
        {children ?? label}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

/* ─── Exports ──────────────────────────────────────────── */

export type { BadgeStatus };
export { badgeColors };
