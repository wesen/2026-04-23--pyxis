import React, { forwardRef, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';

export type TagProps = {
  children: React.ReactNode;
  /** Override the default color */
  color?: string;
  className?: string;
  rootProps?: HTMLAttributes<HTMLSpanElement>;
};

/**
 * A small label for categories, genres, or keywords.
 *
 * ```tsx
 * <Tag>Darkwave</Tag>
 * <Tag color="var(--color-accent)">Featured</Tag>
 * ```
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ children, color, className, rootProps }, ref) => (
    <span
      ref={ref}
      {...pyxisPart('tag')}
      {...rootProps}
      className={clsx('pyxis-tag', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '11px',
        color: color ?? 'var(--color-text-secondary)',
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border)',
        padding: '2px 8px',
        borderRadius: 'var(--radius-xs)',
        whiteSpace: 'nowrap',
        lineHeight: 1.5,
      }}
    >
      {children}
    </span>
  )
);
Tag.displayName = 'Tag';
