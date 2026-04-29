import type { Show } from 'pyxis-types';
import { appPart } from '../../../parts';
import './ShowEditMain.css';

export type ShowEditMainProps = {
  show: Show;
};

const dash = (value?: string | number) => (value === undefined || value === '' || value === 0 ? '—' : value);

export function ShowEditMain({ show }: ShowEditMainProps) {
  return (
    <div className="app-show-edit-main" {...appPart('show-edit-main')}>
      <section className="app-show-edit-card" data-section="show-edit-basics">
        <h2>Basics</h2>
        <div className="app-show-edit-field app-show-edit-field--full"><span>Artist / Act name</span><b>{dash(show.artist)}</b></div>
        <div className="app-show-edit-field app-show-edit-field--full"><span>Public description</span><p>{show.description || 'No public description yet.'}</p></div>
      </section>

      <section className="app-show-edit-card" data-section="show-edit-date-time">
        <h2>Date & time</h2>
        <div className="app-show-edit-grid app-show-edit-grid--3">
          <div className="app-show-edit-field"><span>Date</span><b>{dash(show.date)}</b></div>
          <div className="app-show-edit-field"><span>Doors</span><b>{dash(show.doorsTime)}</b></div>
          <div className="app-show-edit-field"><span>Show starts</span><b>{dash(show.startTime)}</b></div>
        </div>
      </section>

      <section className="app-show-edit-card" data-section="show-edit-details">
        <h2>Details</h2>
        <div className="app-show-edit-grid app-show-edit-grid--4">
          <div className="app-show-edit-field"><span>Age restriction</span><b>{dash(show.age)}</b></div>
          <div className="app-show-edit-field"><span>Price</span><b>{dash(show.price)}</b></div>
          <div className="app-show-edit-field"><span>Capacity</span><b>{dash(show.capacity)}</b></div>
          <div className="app-show-edit-field"><span>Genre</span><b>{dash(show.genre)}</b></div>
        </div>
        <div className="app-show-edit-field app-show-edit-field--full"><span>Reserve ticket</span><b>{show.reserveTicketEnabled ? 'Enabled' : 'Off'}</b></div>
      </section>

      <section className="app-show-edit-card" data-section="show-edit-lineup">
        <h2>Lineup</h2>
        {show.lineup.length > 0 ? (
          <div className="app-show-edit-lineup">
            {show.lineup.map((entry, index) => (
              <div className="app-show-edit-lineup-row" key={`${entry.artist}-${entry.startTime}-${index}`}>
                <b>{entry.artist}</b>
                <span>{entry.role || 'Artist'}</span>
                <span>{[entry.startTime, entry.endTime && `– ${entry.endTime}`].filter(Boolean).join(' ') || 'Time TBD'}</span>
              </div>
            ))}
          </div>
        ) : <p className="app-show-edit-muted">No lineup rows have been added yet.</p>}
      </section>

      <section className="app-show-edit-card" data-section="show-edit-staff-notes">
        <h2>Staff notes</h2>
        <p className="app-show-edit-notes">{show.notes || 'No staff notes recorded.'}</p>
      </section>
    </div>
  );
}
