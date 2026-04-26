import type { AppShow } from 'pyxis-types';
import { Button, PyxisMark } from 'pyxis-components';
import './DashboardHero.css';

export function DashboardHero({ show }: { show?: AppShow }) {
  if (!show) return null;
  return (
    <section className="app-dashboard-hero" data-section="dashboard-hero">
      <div>
        <span>Next on stage · in 9 days</span>
        <h2 data-element="hero-artist">{show.artist}</h2>
        <p className="app-dashboard-hero-desktop" data-element="hero-date-line"><span data-element="hero-date">Fri, May 2, 2025</span><span data-element="hero-doors">Doors {show.doors}</span><span data-element="hero-age">{show.age}</span><span data-element="hero-price">{show.price}</span></p>
        <p className="app-dashboard-hero-mobile">Fri, May 2, 2025 · Doors {show.doors} · {show.age}</p>
      </div>
      <div className="app-dashboard-hero-actions" data-element="hero-actions"><Button data-element="hero-discord-action" className="app-dashboard-hero-discord" variant="outline" iconLeft="external">View on Discord</Button><Button data-element="hero-edit-action" className="app-dashboard-hero-edit" variant="outline" iconLeft="edit">Edit show</Button></div>
      <div className="app-dashboard-hero-mark" aria-hidden="true"><PyxisMark size={300} /></div>
    </section>
  );
}
