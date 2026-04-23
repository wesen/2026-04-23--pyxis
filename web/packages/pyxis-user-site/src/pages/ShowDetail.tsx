import { useParams, useNavigate } from 'react-router-dom';
import { useShow } from '../api/hooks';
import { Button, LineupRow, TicketStub, VenueCard } from 'pyxis-components';

export function ShowDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: show, isLoading, isError } = useShow(id ? Number(id) : undefined);

  if (isLoading) return <ShowDetailSkeleton />;
  if (isError || !show) return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '64px 32px', textAlign: 'center' }}>
      <p>Show not found.</p>
      <Button variant="outline" onClick={() => navigate('/')}>Back to shows</Button>
    </div>
  );

  const fmtDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div data-page="show-detail">
      {/* Dark hero */}
      <div data-section="show-detail-hero" style={{ background: 'var(--color-ink)', color: 'var(--color-text-inverse)', padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 32px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', marginBottom: 32 }}>
            ← All shows
          </button>
          <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Date: {fmtDate(show.date)}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 500, margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            {show.artist}
          </h1>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', margin: '0 0 24px' }}>{show.genre}</p>
          <div style={{ display: 'flex', gap: 32 }}>
            <TicketStub show={show} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div data-section="show-detail-content" style={{ maxWidth: 980, margin: '0 auto', padding: '48px 32px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48 }}>
        {/* Left column */}
        <div>
          {show.description && (
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, marginBottom: 16 }}>About the show</h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{show.description}</p>
              <div style={{ marginTop: 24 }}>
                <Button variant="primary" iconRight="chevron-right">Get tickets — {show.price}</Button>
                <Button variant="outline" iconLeft="calendar" style={{ marginLeft: 12 }}>Add to calendar</Button>
              </div>
            </section>
          )}

          {show.lineup && show.lineup.length > 0 && (
            <section>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, marginBottom: 16 }}>Lineup</h2>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {show.lineup.map((entry, i) => (
                  <LineupRow key={i} entry={entry} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div>
          <VenueCard />
          {show.status === 'confirmed' && (
            <div style={{ marginTop: 16, padding: '16px', background: 'var(--color-warning-subtle)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--color-warning)' }}>
              ⚠️ Capacity is 150. We always sell out — get tickets early.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShowDetailSkeleton() {
  return (
    <div>
      <div style={{ background: 'var(--color-ink)', height: 320 }} />
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '48px 32px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ height: 24, width: '60%', background: 'var(--color-surface-raised)', borderRadius: 4 }} />
          <div style={{ height: 100, background: 'var(--color-surface-raised)', borderRadius: 4 }} />
        </div>
        <div style={{ height: 200, background: 'var(--color-surface-raised)', borderRadius: 8 }} />
      </div>
    </div>
  );
}
