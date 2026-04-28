import { useNavigate } from 'react-router-dom';
import { Empty, MailingListCTA, PublicPageHeader, ShowGrid } from 'pyxis-components';
import { getApiErrorMessage } from '../../api/errors';
import { usePublicSettings, useUpcomingShows } from '../../api/hooks';
import './Page.css';

export function Shows() {
  const navigate = useNavigate();
  const { data: shows, isLoading, isError, error } = useUpcomingShows();
  const { data: settings } = usePublicSettings();

  if (isLoading) return <ShowsSkeleton />;
  if (isError || !shows) return <ShowsError error={error} />;

  return (
    <main className="pyxis-public-page pyxis-shows-page" data-page="shows">
      <div className="pyxis-public-page__inner">
        <header className="pyxis-shows-page__header" data-section="shows-header">
          <PublicPageHeader kicker={settings?.address || 'Providence, RI'} title={`${settings?.spaceName || 'ppxis'} shows`} />
        </header>

        {shows.length === 0 ? (
          <section className="pyxis-shows-page__empty" data-section="shows-empty">
            <Empty title="No upcoming shows" description={settings?.tagline || 'Check back soon for announcements.'} />
          </section>
        ) : (
          <section className="pyxis-shows-page__grid-section" data-section="shows-list">
            <ShowGrid
              shows={shows}
              onShowClick={(show) => navigate(`/shows/${show.id}`)}
            />
          </section>
        )}

        <section className="pyxis-shows-page__mailing-list" data-section="mailing-list">
          <MailingListCTA />
        </section>
      </div>
    </main>
  );
}

function ShowsSkeleton() {
  return (
    <main className="pyxis-public-page pyxis-shows-page" data-page="shows">
      <div className="pyxis-public-page__inner pyxis-shows-page__skeleton" role="status" aria-label="Loading shows…">
        <div className="pyxis-shows-page__skeleton-header" />
        <div className="pyxis-shows-page__skeleton-grid" />
      </div>
    </main>
  );
}

function ShowsError({ error }: { error?: unknown }) {
  return (
    <main className="pyxis-public-page pyxis-shows-page" data-page="shows">
      <div className="pyxis-public-page__status" role="alert">
        <p className="pyxis-public-page__status-message">Failed to load shows.</p>
        <p className="pyxis-public-page__status-detail">{getApiErrorMessage(error)}</p>
      </div>
    </main>
  );
}
