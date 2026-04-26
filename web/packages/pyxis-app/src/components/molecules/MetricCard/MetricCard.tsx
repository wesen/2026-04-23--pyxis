import type { HTMLAttributes } from 'react';
import { Stat } from 'pyxis-components';
import { appPart } from '../../parts';
import './MetricCard.css';

export type MetricCardTone = 'neutral' | 'accent' | 'success' | 'warning' | 'info';

export type MetricCardProps = {
  label: string;
  value: string | number;
  caption?: string;
  trend?: string;
  tone?: MetricCardTone;
};

const toneAccent: Record<MetricCardTone, string> = {
  neutral: 'var(--app-accent)',
  accent: 'var(--app-accent)',
  success: 'var(--app-success)',
  warning: 'var(--app-warning)',
  info: 'var(--app-info)',
};

export function MetricCard({ label, value, caption, trend, tone = 'neutral' }: MetricCardProps) {
  return (
    <Stat
      className="app-metric-card"
      rootProps={{ ...appPart('metric-card'), 'data-tone': tone } as HTMLAttributes<HTMLDivElement>}
      label={label}
      value={value}
      sub={caption}
      trend={trend}
      accentColor={toneAccent[tone]}
    />
  );
}
