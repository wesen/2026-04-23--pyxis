import type { HTMLAttributes, ReactNode } from 'react';
import { Badge, type BadgeStatus } from 'pyxis-components';
import { statusToTone, statusToLabel, type StatusTone, type ProtoStatus } from '../StatusDot';
import { appPart } from '../../parts';
import './StatusPill.css';

export type StatusPillProps = {
  tone?: StatusTone;
  status?: ProtoStatus;
  children?: ReactNode;
};

const toneStatus: Record<StatusTone, BadgeStatus> = {
  confirmed: 'confirmed',
  pending: 'pending',
  approved: 'approved',
  declined: 'declined',
  archived: 'archived',
  hold: 'hold',
  blocked: 'blocked',
  draft: 'draft',
  bot: 'live',
  neutral: 'draft',
};

export function StatusPill({ tone, status, children }: StatusPillProps) {
  const resolved = status ? statusToTone(status) : (tone ?? 'neutral');
  return (
    <Badge
      className="app-status-pill"
      status={toneStatus[resolved]}
      rootProps={{ ...appPart('status-pill'), 'data-tone': resolved } as HTMLAttributes<HTMLSpanElement>}
    >
      {children ?? (status ? statusToLabel(status) : undefined)}
    </Badge>
  );
}
