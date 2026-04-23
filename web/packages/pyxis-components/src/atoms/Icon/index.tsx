import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Icon, type IconName } from './Icon';
import type { ButtonSize } from '../../tokens';

export type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> & {
  icon: IconName;
  size?: ButtonSize;
  label: string;
  tooltip?: string;
  'data-part'?: string;
};

/**
 * An icon-only button for toolbar actions, close buttons, etc.
 * Always provide a text `label` for accessibility.
 *
 * ```tsx
 * <IconButton icon="x" label="Close" onClick={onClose} />
 * <IconButton icon="edit" label="Edit" size="sm" />
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', label, tooltip, className, 'data-part': dataPart, ...rest }, ref) => {
    const dimMap = { sm: 28, md: 30, lg: 40 } as const;
    const dim = dimMap[size];

    return (
      <button
        ref={ref}
        aria-label={label}
        title={tooltip ?? label}
        className={clsx('pyxis-icon-btn', className)}
        data-part="icon-btn"
        data-size={size}
        style={{ width: dim, height: dim }}
        {...rest}
      >
        <Icon name={icon} size={dim / 2} aria-hidden />
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';

/* ─── Barrel exports ──────────────────────────────────── */

export type { IconName } from './Icon';
export { Icon, PyxisMark, PyxisLogo } from './Icon';
