import { appPart } from '../parts';
import './MetricCard.css';
export function MetricCard({ label, value, caption, tone = 'neutral' }: { label: string; value: string | number; caption?: string; tone?: 'neutral' | 'accent' | 'success' | 'warning' }) {
  return <article className="app-metric-card" data-tone={tone} {...appPart('metric-card')}><span {...appPart('metric-card','label')}>{label}</span><strong {...appPart('metric-card','value')}>{value}</strong>{caption && <small {...appPart('metric-card','caption')}>{caption}</small>}</article>;
}
