import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';

export type AvatarProps = {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
};

const sizeMap = { sm: 28, md: 36, lg: 48, xl: 64 };
const fontMap = { sm: 11.2, md: 14.4, lg: 19.2, xl: 25.6 };

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, size = 'md', color, className }, ref) => {
    const dim = sizeMap[size];
    const fs = fontMap[size];
    return (
      <div
        ref={ref}
        className={clsx('pyxis-avatar', className)}
        {...pyxisPart('avatar')}
        data-size={size}
        style={{
          width: dim, height: dim, borderRadius: '50%',
          background: color ?? 'var(--color-ink)',
          color: 'var(--color-text-inverse)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: fs, fontWeight: 600, letterSpacing: '.02em', flexShrink: 0,
          fontFamily: 'var(--font-body)',
        }}
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
