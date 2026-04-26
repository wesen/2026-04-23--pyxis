import { ShowStatus, SubmissionStatus } from 'pyxis-types';
import { appPart } from '../../parts';
import './StatusDot.css';

export type StatusTone = 'confirmed' | 'pending' | 'approved' | 'declined' | 'archived' | 'hold' | 'blocked' | 'draft' | 'bot' | 'neutral';

export type ProtoStatus = ShowStatus | SubmissionStatus;

export function statusToTone(status: ProtoStatus): StatusTone {
  switch (status) {
    case ShowStatus.CONFIRMED: return 'confirmed';
    case ShowStatus.ARCHIVED: return 'archived';
    case ShowStatus.CANCELLED: return 'declined';
    case ShowStatus.DRAFT: return 'draft';
    case ShowStatus.HOLD: return 'hold';
    case ShowStatus.BLOCKED: return 'blocked';
    case SubmissionStatus.PENDING: return 'pending';
    case SubmissionStatus.APPROVED: return 'approved';
    case SubmissionStatus.DECLINED: return 'declined';
    case SubmissionStatus.HOLD: return 'hold';
    case SubmissionStatus.CANCELLED: return 'declined';
    default: return 'neutral';
  }
}

export function statusToLabel(status: ProtoStatus): string {
  switch (status) {
    case ShowStatus.CONFIRMED: return 'Confirmed';
    case ShowStatus.ARCHIVED: return 'Archived';
    case ShowStatus.CANCELLED: return 'Cancelled';
    case ShowStatus.DRAFT: return 'Draft';
    case ShowStatus.HOLD: return 'Hold';
    case ShowStatus.BLOCKED: return 'Blocked';
    case SubmissionStatus.PENDING: return 'Pending';
    case SubmissionStatus.APPROVED: return 'Approved';
    case SubmissionStatus.DECLINED: return 'Declined';
    case SubmissionStatus.HOLD: return 'Hold';
    case SubmissionStatus.CANCELLED: return 'Cancelled';
    default: return 'Unspecified';
  }
}

export type StatusDotProps = {
  tone?: StatusTone;
  status?: ProtoStatus;
  label?: string;
};

export function StatusDot({ tone, status, label }: StatusDotProps) {
  const resolved = status ? statusToTone(status) : (tone ?? 'neutral');
  return <span className="app-status-dot" data-tone={resolved} aria-label={label ?? resolved} {...appPart('status-dot')} />;
}
