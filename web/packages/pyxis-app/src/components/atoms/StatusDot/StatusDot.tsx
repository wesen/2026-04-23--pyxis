import { appPart } from '../../parts';
import './StatusDot.css';
export type StatusTone = 'confirmed' | 'pending' | 'approved' | 'declined' | 'archived' | 'hold' | 'blocked' | 'draft' | 'bot' | 'neutral';
export function StatusDot({ tone = 'neutral', label }: { tone?: StatusTone; label?: string }) {
  return <span className="app-status-dot" data-tone={tone} aria-label={label ?? tone} {...appPart('status-dot')} />;
}
