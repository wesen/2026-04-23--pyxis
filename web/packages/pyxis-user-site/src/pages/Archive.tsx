import { useState } from 'react';
import {
  ArchiveSearchFilters,
  ArchiveShowList,
  ArchiveStats,
  PublicPageHeader,
  YearGroup,
} from 'pyxis-components';
import type { ArchivedShow } from 'pyxis-types';
import { useArchive, useArchiveStats } from '../api/hooks';
import './Archive.css';

type ArchiveGroup = {
  year: number;
  shows: ArchivedShow[];
};

export function Archive() {
  const [search, setSearch] = useState('');
  const { data: shows = [], isLoading } = useArchive(search || undefined);
  const { data: stats } = useArchiveStats();
  const groups = groupShowsByYear(shows);

  return (
    <main className="pyxis-public-page pyxis-archive-page" data-page="archive">
      <div className="pyxis-public-page__inner">
        <header className="pyxis-archive-page__header" data-section="archive-header">
          <PublicPageHeader kicker="Every show since day one" title="Archive" />
        </header>

        <section data-section="archive-filters">
          <ArchiveSearchFilters
            value={search}
            onSearchChange={setSearch}
            resultLabel={isLoading ? '…' : `${shows.length} of ${stats?.total_shows ?? '—'} shows`}
          />
        </section>

        {stats && (
          <section className="pyxis-archive-page__stats" data-section="archive-stats">
            <ArchiveStats stats={stats} />
          </section>
        )}

        {groups.length > 0 ? (
          <section className="pyxis-archive-page__years" data-section="archive-years">
            {groups.map((group) => (
              <YearGroup key={group.year} year={group.year} showCount={group.shows.length}>
                <ArchiveShowList shows={group.shows.map(toArchiveListShow)} />
              </YearGroup>
            ))}
          </section>
        ) : (
          <p className="pyxis-archive-page__empty" data-section="archive-empty">
            No shows found{search ? ` for "${search}"` : ''}.
          </p>
        )}
      </div>
    </main>
  );
}

function groupShowsByYear(shows: ArchivedShow[]): ArchiveGroup[] {
  const groups = shows.reduce<Record<number, ArchivedShow[]>>((acc, show) => {
    const year = new Date(`${show.date}T00:00:00`).getFullYear();
    acc[year] ??= [];
    acc[year].push(show);
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([year, groupShows]) => ({ year: Number(year), shows: groupShows }))
    .sort((a, b) => b.year - a.year);
}

function toArchiveListShow(show: ArchivedShow) {
  return {
    date: formatArchiveDate(show.date),
    name: show.artist,
    tag: show.genre,
  };
}

function formatArchiveDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
