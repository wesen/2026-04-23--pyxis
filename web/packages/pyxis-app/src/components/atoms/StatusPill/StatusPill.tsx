import type { ReactNode } from 'react';
import type { StatusTone } from '../StatusDot';
import { StatusDot } from '../StatusDot';
import { appPart } from '../../parts';
import './StatusPill.css';

export type StatusPillProps = {
  tone?: StatusTone;
  children: ReactNode;
};

export function StatusPill({ tone = 'neutral', children }: StatusPillProps) {
  return <span className="app-status-pill" data-tone={tone} {...appPart('status-pill')}><StatusDot tone={tone}/>{children}</span>;
}
