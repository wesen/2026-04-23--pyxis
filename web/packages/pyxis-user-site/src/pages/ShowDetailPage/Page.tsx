import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Poster,
  ReserveTicketCard,
  SafetyNote,
  ShowDetailHeader,
  ShowLineup,
  ShowMetaStrip,
} from 'pyxis-components';
import { useShow } from '../../api/hooks';
import './Page.css';

export function ShowDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showId = id ? Number(id) : undefined;
  const { data: show, isLoading, isError } = useShow(Number.isFinite(showId) ? showId : undefined);
  const [flyerOpen, setFlyerOpen] = useState(false);

  if (isLoading) return <ShowDetailSkeleton />;
  if (isError || !show) return <ShowDetailNotFound onBack={() => navigate('/')} />;

  const dateLabel = formatLongDate(show.date);
  const timeLabel = formatHeaderTime(show.startTime || show.doorsTime);
  const flyerUrl = isMockPlaceholderFlyer(show.flyerUrl) ? undefined : show.flyerUrl;

  return (
    <main className="pyxis-public-page pyxis-show-detail-page" data-page="show-detail">
      <div className="pyxis-public-page__inner">
        <button className="pyxis-show-detail-page__back" onClick={() => navigate('/')} type="button">
          ← All shows
        </button>

        <section className="pyxis-show-detail-page__content" data-section="show-detail-content">
          <aside className="pyxis-show-detail-page__aside" data-section="show-detail-aside">
            {flyerUrl ? (
              <button className="pyxis-show-detail-page__flyer-button" type="button" onClick={() => setFlyerOpen(true)}>
                <img src={flyerUrl} alt={`${show.artist} flyer`} />
                <span>View flyer fullscreen</span>
              </button>
            ) : (
              <Poster kind="redroom" />
            )}
            {show.reserveTicketEnabled && (
              <ReserveTicketCard
                price={show.price || 'Price TBA'}
                note="sliding. cash or card at door."
                onReserve={() => {
                  window.location.href = `mailto:book@ppxis.space?subject=${encodeURIComponent(`Ticket reservation: ${show.artist}`)}`;
                }}
              />
            )}
          </aside>

          <div className="pyxis-show-detail-page__main">
            <section className="pyxis-show-detail-page__hero" data-section="show-detail-hero">
              <ShowDetailHeader
                meta={[dateLabel, timeLabel].filter(Boolean).join(' · ')}
                title={show.artist}
                description={show.description ?? show.genre}
              />
              <div className="pyxis-show-detail-page__meta" data-section="show-detail-meta">
                <ShowMetaStrip
                  items={[
                    { label: 'Doors', value: show.doorsTime },
                    { label: 'Age', value: show.age },
                    { label: 'Door', value: show.price },
                  ]}
                />
              </div>
            </section>

            {show.lineup && show.lineup.length > 0 && (
              <ShowLineup entries={show.lineup} />
            )}

            <SafetyNote />
          </div>
        </section>
      </div>
      {flyerOpen && flyerUrl && <div className="pyxis-show-detail-page__lightbox" role="dialog" aria-label="Flyer lightbox" onClick={() => setFlyerOpen(false)}><div onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => setFlyerOpen(false)}>Close</button><img src={flyerUrl} alt={`${show.artist} flyer`} /><a href={flyerUrl} download>Download flyer</a></div></div>}
    </main>
  );
}

function ShowDetailNotFound({ onBack }: { onBack: () => void }) {
  return (
    <main className="pyxis-public-page pyxis-show-detail-page" data-page="show-detail">
      <div className="pyxis-public-page__status" role="alert">
        <p className="pyxis-public-page__status-message">Show not found.</p>
        <Button variant="outline" onClick={onBack}>Back to shows</Button>
      </div>
    </main>
  );
}

function ShowDetailSkeleton() {
  return (
    <main className="pyxis-public-page pyxis-show-detail-page" data-page="show-detail">
      <div className="pyxis-public-page__inner pyxis-show-detail-page__skeleton" role="status" aria-label="Loading show…">
        <div className="pyxis-show-detail-page__skeleton-block" />
        <div className="pyxis-show-detail-page__skeleton-block" />
      </div>
    </main>
  );
}

function formatLongDate(date: string) {
  if (!date.includes('-')) return date.replace(',', ' ·').replace(',', ' ·') + ' · 2026';

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatHeaderTime(time?: string) {
  if (!time) return '';
  return time.replace(':00 ', '').replace(' PM', 'PM').replace(' AM', 'AM');
}

const isMockPlaceholderFlyer = (url?: string) => Boolean(url?.includes('placehold.co/'));
