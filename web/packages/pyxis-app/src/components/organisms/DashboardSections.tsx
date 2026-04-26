import type { AppShow } from 'pyxis-types';
import { Button } from 'pyxis-components';

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
        <h2>{show.artist}</h2>
        <p className="app-dashboard-hero-desktop">
          Fri, May 2, 2025 <i /> Doors {show.doors} <i /> {show.age} <i /> {show.price}
        </p>
        <p className="app-dashboard-hero-mobile">
          Fri, May 2, 2025 · Doors {show.doors} · {show.age}
        </p>
      </div>
      <div className="app-dashboard-hero-actions">
        <Button variant="outline" size="sm">Open show</Button>
        <Button variant="outline" size="sm">Discord</Button>
      </div>
      <div className="app-dashboard-hero-mark" aria-hidden="true">✦</div>
    </section>
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

const attentionItems = [
  ['warning', '2 past shows need logging', 'Planning for Burial · Actress'],
  ['info', 'Zola Jesus · Jun 6', 'Check price for a 160-draw headliner'],
  ['danger', 'Discord token expires in 14d', 'Reconnect to keep pinning working'],
] as const;

export function DashboardAttentionCount() {
  return <span className="app-attention-count">3</span>;
}

export function DashboardAttentionContent() {
  return (
    <div className="app-attention-list">
      {attentionItems.map(([tone, title, caption]) => (
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
