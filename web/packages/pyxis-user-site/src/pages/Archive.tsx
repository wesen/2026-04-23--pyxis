import { useState } from 'react';
import { useArchive, useArchiveStats } from '../api/hooks';
import { Input, ArchiveStats } from 'pyxis-components';
import type { ArchivedShow } from 'pyxis-types';

export function Archive() {
  const [search, setSearch] = useState('');
  const { data: shows = [], isLoading } = useArchive(search || undefined);
  const { data: stats } = useArchiveStats();

  return (
    <div data-page="archive" style={{ maxWidth: 980, margin: '0 auto', padding: '0 32px 64px' }}>
      {/* Header */}
      <div data-section="archive-header" style={{ padding: '48px 0 32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 500, margin: '0 0 8px', letterSpacing: '-0.03em' }}>
          Archive
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 24px' }}>Every show since day one.</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ flex: 1, maxWidth: 360 }}>
            <Input
              icon="search"
              placeholder="Search by artist or genre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
            {isLoading ? '…' : `${shows.length} of ${stats?.total_shows ?? '—'} shows`}
          </span>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div data-section="archive-stats" style={{ marginBottom: 48 }}>
          <ArchiveStats stats={stats} />
        </div>
      )}

      {/* Year groups */}
      {shows.length > 0 ? (
        <div data-section="archive-years"><YearGroups shows={shows} /></div>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: '64px 0' }}>
          No shows found{search ? ` for "${search}"` : ''}.
        </p>
      )}
    </div>
  );
}

function YearGroups({ shows }: { shows: ArchivedShow[] }) {
  const groups = shows.reduce<Record<number, ArchivedShow[]>>((acc, show) => {
    const year = new Date(show.date + 'T00:00:00').getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(show);
    return acc;
  }, {});

  const years = Object.keys(groups).map(Number).sort((a, b) => b - a);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {years.map((year) => (
        <section key={year}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 500, marginBottom: 16, display: 'flex', alignItems: 'baseline', gap: 16 }}>
            {year}
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--color-text-tertiary)' }}>
              {groups[year].length} show{groups[year].length !== 1 ? 's' : ''}
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            {groups[year].map((show) => (
              <ArchiveRow key={show.id} show={show} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ArchiveRow({ show }: { show: ArchivedShow }) {
  const month = new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' });
  const day = new Date(show.date + 'T00:00:00').getDate();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', background: 'var(--color-surface)', transition: 'background 0.15s' }}>
      <div style={{ width: 48, textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{month}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 500, lineHeight: 1 }}>{day}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500 }}>{show.artist}</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{show.genre}</div>
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
        {show.draw} through the door
      </div>
    </div>
  );
}
