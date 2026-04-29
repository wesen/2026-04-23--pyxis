import type { HTMLAttributes } from 'react';
import { appPart } from '../../parts';
import './StatusBadge.css';

export type StatusBadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'discord';
export type StatusBadgeSize = 'sm' | 'md';

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
  tone?: StatusBadgeTone;
  size?: StatusBadgeSize;
};

export function StatusBadge({ label, tone = 'neutral', size = 'sm', className = '', ...rest }: StatusBadgeProps) {
  return <span className={`app-status-badge ${className}`.trim()} data-tone={tone} data-size={size} {...appPart('status-badge')} {...rest}>{label}</span>;
}
