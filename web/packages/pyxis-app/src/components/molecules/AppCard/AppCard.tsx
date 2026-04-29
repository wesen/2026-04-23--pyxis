import type { HTMLAttributes, ReactNode } from 'react';
import { appPart } from '../../parts';
import './AppCard.css';

export type AppCardTone = 'default' | 'success' | 'warning' | 'danger' | 'muted';
export type AppCardDensity = 'compact' | 'comfortable';

export type AppCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'article' | 'section' | 'div';
  tone?: AppCardTone;
  density?: AppCardDensity;
  interactive?: boolean;
};

export function AppCard({ children, as: Element = 'article', tone = 'default', density = 'comfortable', interactive = false, className = '', ...rest }: AppCardProps) {
  return <Element className={`app-card ${className}`.trim()} data-tone={tone} data-density={density} data-interactive={interactive || undefined} {...appPart('app-card')} {...rest}>{children}</Element>;
}
