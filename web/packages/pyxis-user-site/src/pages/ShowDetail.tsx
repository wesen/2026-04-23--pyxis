import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  LineupRow,
  ReserveTicketCard,
  SafetyNote,
  ShowDetailHeader,
  ShowMetaStrip,
  VenueCard,
} from 'pyxis-components';
import { useShow } from '../api/hooks';
import './ShowDetail.css';

export function ShowDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showId = id ? Number(id) : undefined;
  const { data: show, isLoading, isError } = useShow(Number.isFinite(showId) ? showId : undefined);

  if (isLoading) return <ShowDetailSkeleton />;
  if (isError || !show) return <ShowDetailNotFound onBack={() => navigate('/')} />;

  const dateLabel = formatLongDate(show.date);
  const timeLabel = show.start_time ? `${show.doors_time} doors · ${show.start_time} show` : `${show.doors_time} doors`;

  return (
    <main className="pyxis-public-page pyxis-show-detail-page" data-page="show-detail">
      <div className="pyxis-public-page__inner">
        <section className="pyxis-show-detail-page__hero" data-section="show-detail-hero">
          <button className="pyxis-show-detail-page__back" onClick={() => navigate('/')} type="button">
            ← All shows
          </button>
          <ShowDetailHeader
            meta={`${dateLabel} · ${timeLabel}`}
            title={show.artist}
            description={show.description ?? show.genre}
          />
          <div className="pyxis-show-detail-page__meta" data-section="show-detail-meta">
            <ShowMetaStrip
              items={[
                { label: 'Doors', value: show.doors_time },
                { label: 'Age', value: show.age },
                { label: 'Door', value: show.price },
              ]}
            />
          </div>
        </section>

        <section className="pyxis-show-detail-page__content" data-section="show-detail-content">
          <div className="pyxis-show-detail-page__main">
            {show.description && (
              <section data-section="show-detail-description">
                <h2 className="pyxis-show-detail-page__section-title">About the show</h2>
                <p className="pyxis-show-detail-page__description">{show.description}</p>
              </section>
            )}

            {show.lineup && show.lineup.length > 0 && (
              <section data-section="show-detail-lineup">
                <h2 className="pyxis-show-detail-page__section-title">Lineup</h2>
                <div className="pyxis-show-detail-page__lineup">
                  {show.lineup.map((entry) => (
                    <LineupRow key={`${entry.artist}-${entry.start_time}`} entry={entry} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="pyxis-show-detail-page__aside" data-section="show-detail-aside">
            <ReserveTicketCard price={show.price} note={`${show.age} · ${show.genre}`} />
            <SafetyNote />
            <VenueCard />
          </aside>
        </section>
      </div>
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
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
