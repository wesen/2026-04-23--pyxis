import type { HTMLAttributes, ReactNode } from 'react';
import { Badge, type BadgeStatus } from 'pyxis-components';
import type { StatusTone } from '../StatusDot';
import { appPart } from '../../parts';
import './StatusPill.css';

export type StatusPillProps = {
  tone?: StatusTone;
  children: ReactNode;
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

export function StatusPill({ tone = 'neutral', children }: StatusPillProps) {
  return (
    <Badge
      className="app-status-pill"
      status={toneStatus[tone]}
      rootProps={{ ...appPart('status-pill'), 'data-tone': tone } as HTMLAttributes<HTMLSpanElement>}
    >
      {children}
    </Badge>
  );
}
