import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export type TagProps = {
  children: React.ReactNode;
  /** Override the default color */
  color?: string;
  className?: string;
  'data-part'?: string;
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
  ({ children, color, className, 'data-part': dataPart }, ref) => (
    <span
      ref={ref}
      className={clsx('pyxis-tag', className)}
      data-part={dataPart ?? 'tag'}
      style={{
        display: 'inline',
        fontSize: '11px',
        color: color ?? 'var(--color-text-secondary)',
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border)',
        padding: '2px 8px',
        borderRadius: 'var(--radius-xs)',
        whiteSpace: 'nowrap',
        lineHeight: 'normal',
      }}
    >
      {children}
    </span>
  )
);
Tag.displayName = 'Tag';
