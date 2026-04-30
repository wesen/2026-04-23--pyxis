import type { HTMLAttributes, ReactNode } from 'react';
import { Tag } from 'pyxis-components';
import { appPart } from '../../parts';
import './AgeBadge.css';

export type AgeBadgeProps = {
  children: ReactNode;
};

export function AgeBadge({ children }: AgeBadgeProps) {
  const label = typeof children === 'string' && children.trim() === '' ? '—' : children;
  return <Tag className="app-age-badge" rootProps={appPart('age-badge') as HTMLAttributes<HTMLSpanElement>}>{label}</Tag>;
}
