import { appPart } from '../../parts';
import './StatusDot.css';
export type StatusTone = 'confirmed' | 'pending' | 'approved' | 'declined' | 'archived' | 'hold' | 'blocked' | 'draft' | 'bot' | 'neutral';

export type StatusDotProps = {
  tone?: StatusTone;
  label?: string;
};

export function StatusDot({ tone = 'neutral', label }: StatusDotProps) {
  return <span className="app-status-dot" data-tone={tone} aria-label={label ?? tone} {...appPart('status-dot')} />;
}
