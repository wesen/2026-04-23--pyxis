import { useState } from 'react';
import {
  ArchiveSearchFilters,
  ArchiveShowList,
  ArchiveStats,
  PublicPageHeader,
  YearGroup,
} from 'pyxis-components';
import type { ArchiveStats as ArchiveStatsData, ArchivedShow } from 'pyxis-types';
import { getApiErrorMessage } from '../../api/errors';
import { useArchive, useArchiveStats } from '../../api/hooks';
import './Page.css';

type ArchiveGroup = {
  year: number;
  shows: ArchivedShow[];
};

export type ArchivePageViewProps = {
  shows: ArchivedShow[];
  stats?: ArchiveStatsData;
  search: string;
  selectedYear: string;
  onSearchChange: (value: string) => void;
  onYearChange: (value: string) => void;
  isLoading?: boolean;
  archiveError?: string | null;
  statsError?: string | null;
  headerKicker?: string;
  headerTitle?: string;
};

export function Archive() {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const { data: list, isLoading, isError: isArchiveError, error: archiveError } = useArchive(search || undefined);
  const { data: stats, isError: isStatsError } = useArchiveStats();

  return (
    <ArchivePageView
      shows={list?.shows ?? []}
      stats={stats}
      search={search}
      selectedYear={selectedYear}
      onSearchChange={setSearch}
      onYearChange={setSelectedYear}
      isLoading={isLoading}
      archiveError={isArchiveError ? getApiErrorMessage(archiveError) : null}
      statsError={isStatsError ? 'Archive totals are temporarily unavailable.' : null}
    />
  );
}

export function ArchivePageView({
  shows,
  stats,
  search,
  selectedYear,
  onSearchChange,
  onYearChange,
  isLoading = false,
  archiveError = null,
  statsError = null,
  headerKicker = 'Since 2023',
  headerTitle = 'The archive',
}: ArchivePageViewProps) {
  const years = getArchiveYears(shows);
  const filteredShows = selectedYear === 'All'
    ? shows
    : shows.filter((show) => String(getShowYear(show)) === selectedYear);
  const groups = groupShowsByYear(filteredShows);
  const resultLabel = `${filteredShows.length} ${filteredShows.length === 1 ? 'show' : 'shows'}${selectedYear !== 'All' ? ` in ${selectedYear}` : ''}`;

  return (
    <main className="pyxis-public-page pyxis-archive-page" data-page="archive">
      <div className="pyxis-public-page__inner">
        <header className="pyxis-archive-page__header" data-section="archive-header">
          <PublicPageHeader kicker={headerKicker} title={headerTitle} />
        </header>

        {stats && (
          <section className="pyxis-archive-page__stats" data-section="archive-stats">
            <ArchiveStats stats={stats} />
          </section>
        )}

        <section data-section="archive-filters">
          <ArchiveSearchFilters
            years={years}
            active={selectedYear}
            value={search}
            resultLabel={resultLabel}
            onSearchChange={onSearchChange}
            onYearChange={onYearChange}
          />
        </section>

        {statsError && (
          <p className="pyxis-public-page__status-detail" role="status" data-section="archive-stats-error">
            {statsError}
          </p>
        )}

        {archiveError ? (
          <section className="pyxis-public-page__status" role="alert" data-section="archive-error">
            <p className="pyxis-public-page__status-message">Failed to load archive.</p>
            <p className="pyxis-public-page__status-detail">{archiveError}</p>
          </section>
        ) : groups.length > 0 ? (
          <section className="pyxis-archive-page__years" data-section="archive-years" aria-busy={isLoading || undefined}>
            {groups.map((group) => (
              <YearGroup key={group.year} year={group.year} showCount={group.shows.length}>
                <ArchiveShowList shows={group.shows.map(toArchiveListShow)} />
              </YearGroup>
            ))}
          </section>
        ) : (
          <p className="pyxis-archive-page__empty" data-section="archive-empty">
            No shows found{search ? ` for "${search}"` : ''}{selectedYear !== 'All' ? ` in ${selectedYear}` : ''}.
          </p>
        )}
      </div>
    </main>
  );
}

function groupShowsByYear(shows: ArchivedShow[]): ArchiveGroup[] {
  const groups = shows.reduce<Record<number, ArchivedShow[]>>((acc, show) => {
    const year = getShowYear(show);
    acc[year] ??= [];
    acc[year].push(show);
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([year, groupShows]) => ({ year: Number(year), shows: groupShows }))
    .sort((a, b) => b.year - a.year);
}

function getArchiveYears(shows: ArchivedShow[]) {
  const years = Array.from(new Set(shows.map((show) => String(getShowYear(show))))).sort((a, b) => Number(b) - Number(a));
  return ['All', ...years];
}

function getShowYear(show: ArchivedShow) {
  return new Date(`${show.date}T00:00:00`).getFullYear();
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
