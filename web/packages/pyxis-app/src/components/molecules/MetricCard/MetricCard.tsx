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

export function MetricCard({ label, value, caption, trend, tone = 'neutral' }: MetricCardProps) {
  return <article className="app-metric-card" data-tone={tone} {...appPart('metric-card')}><span {...appPart('metric-card','label')}>{label}</span><strong {...appPart('metric-card','value')}>{value}</strong>{caption && <small {...appPart('metric-card','caption')}>{caption}</small>}{trend && <em {...appPart('metric-card','trend')}>{trend}</em>}</article>;
}
