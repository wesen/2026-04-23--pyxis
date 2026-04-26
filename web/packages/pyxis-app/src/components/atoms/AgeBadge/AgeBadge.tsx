import type { ReactNode } from 'react';
import { appPart } from '../../parts';
import './AgeBadge.css';

export type AgeBadgeProps = {
  children: ReactNode;
};

export function AgeBadge({ children }: AgeBadgeProps) {
  return <span className="app-age-badge" {...appPart('age-badge')}>{children}</span>;
}
