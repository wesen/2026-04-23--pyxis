import type { AppShow } from 'pyxis-types';
import { Button, PyxisMark } from 'pyxis-components';
import { MetricCard } from '../molecules/MetricCard';
import './DashboardSections.css';

export function DashboardMobileHeader() {
  return (
    <header className="app-dashboard-mobile-header" data-section="dashboard-mobile-header">
      <div>
        <b>pyxis</b>
        <span>Wed, Apr 23</span>
      </div>
      <div className="app-dashboard-mobile-actions">
        <span>⌕</span>
        <strong>AD</strong>
      </div>
    </header>
  );
}

export function DashboardMobileCopy() {
  return (
    <div className="app-dashboard-mobile-copy">
      <span>Welcome back</span>
      <h2>Good morning, Ada.</h2>
      <p>6 shows booked · 3 need your eye.</p>
    </div>
  );
}

export function DashboardHero({ show }: { show?: AppShow }) {
  if (!show) return null;
  return (
    <section className="app-dashboard-hero" data-section="dashboard-hero">
      <div>
        <span>Next on stage · in 9 days</span>
        <h2 data-element="hero-artist">{show.artist}</h2>
        <p className="app-dashboard-hero-desktop" data-element="hero-date-line">
          <span data-element="hero-date">Fri, May 2, 2025</span><span data-element="hero-doors">Doors {show.doors}</span><span data-element="hero-age">{show.age}</span><span data-element="hero-price">{show.price}</span>
        </p>
        <p className="app-dashboard-hero-mobile">
          Fri, May 2, 2025 · Doors {show.doors} · {show.age}
        </p>
      </div>
      <div className="app-dashboard-hero-actions" data-element="hero-actions">
        <Button data-element="hero-discord-action" className="app-dashboard-hero-discord" variant="outline" iconLeft="external">View on Discord</Button>
        <Button data-element="hero-edit-action" className="app-dashboard-hero-edit" variant="outline" iconLeft="edit">Edit show</Button>
      </div>
      <div className="app-dashboard-hero-mark" aria-hidden="true"><PyxisMark size={300} /></div>
    </section>
  );
}

export function DashboardMetricsGrid({ upcomingCount, pendingCount, variant = 'desktop' }: { upcomingCount: number; pendingCount: number; variant?: 'desktop' | 'mobile' }) {
  const mobile = variant === 'mobile';
  return (
    <div className="app-metrics-grid" data-section="dashboard-metrics" data-variant={variant}>
      <MetricCard label="Upcoming" value={upcomingCount} caption={mobile ? 'next 60 days' : 'Next 60 days'} tone="accent" />
      <MetricCard label={mobile ? 'Pending' : 'Pending bookings'} value={pendingCount} caption={mobile ? 'review needed' : 'Awaiting review'} trend={mobile ? undefined : '2 new today'} tone="warning" />
      <MetricCard label="Avg draw" value="84" caption={mobile ? 'last 6 shows' : 'Last 6 shows'} trend={mobile ? undefined : '↑ 12 vs. prior 6'} tone="success" />
      <MetricCard label={mobile ? 'Capacity' : 'Capacity use'} value="56%" caption="May 2025" tone="info" />
    </div>
  );
}

export function DashboardQuickActionsContent({ pendingCount }: { pendingCount: number }) {
  return (
    <div className="app-quick-actions">
      <Button fullWidth iconLeft="plus">Add a show</Button>
      <Button fullWidth variant="outline" iconLeft="mail">Review bookings · {pendingCount}</Button>
      <Button fullWidth variant="ghost" iconLeft="log">Open audit log</Button>
    </div>
  );
}

export type DashboardAttentionItem = {
  tone: 'warning' | 'info' | 'danger';
  title: string;
  caption: string;
};

export const defaultDashboardAttentionItems: DashboardAttentionItem[] = [
  { tone: 'warning', title: '2 past shows need logging', caption: 'Planning for Burial · Actress' },
  { tone: 'info', title: 'Zola Jesus · Jun 6', caption: 'Check price for a 160-draw headliner' },
  { tone: 'danger', title: 'Discord token expires in 14d', caption: 'Reconnect to keep pinning working' },
];

export function DashboardAttentionCount({ count = defaultDashboardAttentionItems.length }: { count?: number }) {
  return <span className="app-attention-count">{count}</span>;
}

export function DashboardAttentionContent({ items = defaultDashboardAttentionItems }: { items?: DashboardAttentionItem[] }) {
  if (items.length === 0) return <p className="app-empty-state">No issues need attention right now.</p>;
  return (
    <div className="app-attention-list">
      {items.map(({ tone, title, caption }) => (
        <article key={title} className="app-attention-item" data-tone={tone}>
          <b>{tone === 'info' ? '✺' : '△'}</b>
          <div>
            <strong>{title}</strong>
            <span>{caption}</span>
          </div>
          <em>›</em>
        </article>
      ))}
    </div>
  );
}
