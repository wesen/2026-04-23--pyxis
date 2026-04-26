import type { StatusTone } from './StatusDot';
import { StatusDot } from './StatusDot';
import { appPart } from '../parts';
import './StatusPill.css';

export function StatusPill({ tone = 'neutral', children }: { tone?: StatusTone; children: string }) {
  return <span className="app-status-pill" data-tone={tone} {...appPart('status-pill')}><StatusDot tone={tone}/>{children}</span>;
}
