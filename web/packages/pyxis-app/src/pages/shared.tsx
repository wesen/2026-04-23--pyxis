import { create, AppShowSchema, type Show } from 'pyxis-types';
import type { ReactNode } from 'react';
import { Panel } from '../components/organisms/Panels';
import './pages.css';

export type PageStateProps = {
  title: string;
  message?: string;
  action?: ReactNode;
};

export function PageState({ title, message, action }: PageStateProps) {
  return (
    <Panel title={title} section="page-state">
      <div className="app-page-state">
        {message && <p>{message}</p>}
        {action}
      </div>
    </Panel>
  );
}

export function LoadingState({ label = 'Loading real backend data…' }: { label?: string }) {
  return <PageState title="Loading" message={label} />;
}

export function ErrorState({ label = 'The real backend request failed. Check your session and backend logs.' }: { label?: string }) {
  return <PageState title="Could not load data" message={label} />;
}

export function EmptyState({ label = 'No records returned from the real backend yet.' }: { label?: string }) {
  return <PageState title="Nothing here yet" message={label} />;
}

export function ActionMessages({ error, success }: { error?: string; success?: string }) {
  return <>{error && <div className="app-action-error" role="alert">{error}</div>}{success && <div className="app-action-success" role="status">{success}</div>}</>;
}

export function parseRouteId(raw: string | undefined) {
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}

export function appShowFromShow(show: Show) {
  return create(AppShowSchema, {
    id: show.id,
    artist: show.artist,
    date: show.date,
    doors: show.doorsTime,
    age: show.age,
    price: show.price,
    status: show.status,
    genre: show.genre,
    draw: show.draw,
    capacity: show.capacity,
    pinned: false,
    notes: show.notes,
  });
}
