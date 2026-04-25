import { useNavigate } from 'react-router-dom';
import { useUpcomingShows } from '../api/hooks';
import { getApiErrorMessage } from '../api/errors';
import { PubHero, PubShowRow, MailingListCTA, Empty } from 'pyxis-components';

export function Shows() {
  const navigate = useNavigate();
  const { data: shows, isLoading, isError, error } = useUpcomingShows();

  if (isLoading) return <ShowsSkeleton />;
  if (isError || !shows) return <ShowsError error={error} />;
  if (shows.length === 0) return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 32px' }}>
      <Empty title="No upcoming shows" description="Check back soon for announcements." />
    </div>
  );

  const [hero, ...rest] = shows;

  return (
    <div data-page="shows" style={{ maxWidth: 980, margin: '0 auto', padding: '0 32px 64px' }}>
      {/* Hero section for the next show */}
      {hero && (
        <div data-section="shows-hero">
        <PubHero
          show={hero}
          onTicketClick={() => navigate(`/shows/${hero.id}`)}
          onShowClick={() => navigate(`/shows/${hero.id}`)}
        />
        </div>
      )}

      {/* Show list */}
      <section data-section="shows-list" style={{ marginTop: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 500, marginBottom: 24 }}>
          Upcoming shows
          {shows.length > 1 && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontWeight: 400, marginLeft: 8 }}>{shows.length - 1} more</span>}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          {rest.map((show) => (
            <PubShowRow
              key={show.id}
              show={show}
              onClick={() => navigate(`/shows/${show.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Mailing list */}
      <div data-section="mailing-list" style={{ marginTop: 64 }}>
        <MailingListCTA />
      </div>
    </div>
  );
}

function ShowsSkeleton() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '32px' }}>
      <div style={{ height: 280, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[1,2,3].map(i => <div key={i} style={{ height: 72, background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }} />)}
      </div>
    </div>
  );
}

function ShowsError({ error }: { error?: unknown }) {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '64px 32px', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-accent)' }}>Failed to load shows.</p>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
        {getApiErrorMessage(error)}
      </p>
    </div>
  );
}
