import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { create, ArchiveStatsSchema, ArchivedShowListSchema, ArchivedShowSchema, Show_LineupEntrySchema, ShowListSchema, ShowSchema, ShowStatus, toJson } from 'pyxis-types';
import { handlers } from 'pyxis-components/mocks/handlers';
import { Layout } from '../components/layout/Layout';
import { makeStore } from '../store';
import { Shows, ShowDetail, Archive, Book, BookSuccess, About } from './Pages';

export const publicDesktopArgs = { width: 920, minHeight: 1100 };
export const publicMobileArgs = { width: 390, minHeight: 844 };

export const prototypeShows = [
  create(ShowSchema, {
    id: 1,
    artist: 'Redroom Inferno',
    date: 'Fri, Feb 14',
    doorsTime: '9:00 PM',
    age: '25+',
    price: '$10 adv / $15 door',
    genre: '',
    description: "A Dusknight residency. A kink, electronica & queer music party — the room turns red, the floor turns into cinder, and we don't stop 'til dawn.",
    lineup: [
      create(Show_LineupEntrySchema, { artist: 'Doors', role: 'dj', startTime: '9:00' }),
      create(Show_LineupEntrySchema, { artist: 'sable witch', role: 'support', startTime: '9:45' }),
      create(Show_LineupEntrySchema, { artist: 'RONE', role: 'headline', startTime: '10:45' }),
      create(Show_LineupEntrySchema, { artist: 'DJ VEILED', role: 'headline', startTime: '12:00' }),
      create(Show_LineupEntrySchema, { artist: 'Close', role: 'dj', startTime: '2:00' }),
    ],
    status: ShowStatus.CONFIRMED,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }),
  create(ShowSchema, { id: 2, artist: '808 Collective', date: 'Fri, Feb 21', doorsTime: '8:00 PM', age: '21+', price: '$12', genre: '', status: ShowStatus.CONFIRMED, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }),
  create(ShowSchema, { id: 3, artist: 'Petals of Love', date: 'Sat, Feb 28', doorsTime: '6:30 PM', age: 'All Ages', price: '$15', genre: '', status: ShowStatus.CONFIRMED, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }),
  create(ShowSchema, { id: 4, artist: 'Monday Meet-Ups', date: 'Every Monday', doorsTime: '7:00 PM', age: 'All Ages', price: 'Free — Sliding Scale', genre: '', status: ShowStatus.CONFIRMED, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }),
  create(ShowSchema, { id: 5, artist: 'Basement Frequencies', date: 'Fri, Feb 28', doorsTime: '9:30 PM', age: '21+', price: '$12', genre: '', status: ShowStatus.CONFIRMED, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }),
  create(ShowSchema, { id: 6, artist: 'Orphx', date: 'Fri, Jul 4', doorsTime: '9:00 PM', age: '18+', price: '$12', genre: '', status: ShowStatus.CONFIRMED, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }),
  create(ShowSchema, { id: 7, artist: 'Moor Mother', date: 'Fri, May 9', doorsTime: '7:00 PM', age: 'All Ages', price: '$15', genre: '', status: ShowStatus.CONFIRMED, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }),
  create(ShowSchema, { id: 8, artist: 'Cygnus + Guests', date: 'Sat, May 17', doorsTime: '9:00 PM', age: '18+', price: '$8', genre: '', status: ShowStatus.CONFIRMED, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }),
  create(ShowSchema, { id: 9, artist: 'Zola Jesus', date: 'Fri, Jun 6', doorsTime: '8:00 PM', age: '21+', price: '$20', genre: '', status: ShowStatus.CONFIRMED, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }),
];

export const prototypeShowDetail = create(ShowSchema, {
  ...prototypeShows[0],
  age: '21+',
  price: '$15',
  lineup: [
    create(Show_LineupEntrySchema, { artist: 'Doors', role: 'dj', startTime: '9:00' }),
    create(Show_LineupEntrySchema, { artist: 'sable witch', role: 'support', startTime: '9:45' }),
    create(Show_LineupEntrySchema, { artist: 'RONE', role: 'headline', startTime: '10:45' }),
    create(Show_LineupEntrySchema, { artist: 'DJ VEILED', role: 'headline', startTime: '12:00' }),
    create(Show_LineupEntrySchema, { artist: 'Close', role: 'dj', startTime: '2:00' }),
  ],
});

export const prototypeArchiveShows = [
  create(ArchivedShowSchema, { id: 101, artist: 'Winter Solstice Rave', date: '2025-12-12', genre: 'Electronic', draw: 118 }),
  create(ArchivedShowSchema, { id: 102, artist: 'Jake Meginsky · live', date: '2025-11-29', genre: 'Noise', draw: 76 }),
  create(ArchivedShowSchema, { id: 103, artist: 'Bottom Feeders', date: '2025-11-15', genre: 'Hardcore', draw: 104 }),
  create(ArchivedShowSchema, { id: 104, artist: 'The Halloween Drone', date: '2025-10-31', genre: 'Drone', draw: 92 }),
  create(ArchivedShowSchema, { id: 105, artist: 'Cecile Believe', date: '2025-10-18', genre: 'Pop', draw: 125 }),
  create(ArchivedShowSchema, { id: 106, artist: 'Moor Mother', date: '2025-09-27', genre: 'Noise poetry', draw: 140 }),
  create(ArchivedShowSchema, { id: 107, artist: '808 Collective vol. 4', date: '2025-09-06', genre: 'House', draw: 99 }),
  create(ArchivedShowSchema, { id: 108, artist: 'Petals of Love', date: '2025-08-23', genre: 'Community', draw: 150 }),
  create(ArchivedShowSchema, { id: 201, artist: 'Year-end all-nighter', date: '2024-12-20', genre: 'Mixed', draw: 150 }),
  create(ArchivedShowSchema, { id: 202, artist: 'Basement Frequencies', date: '2024-11-08', genre: 'Techno', draw: 88 }),
  create(ArchivedShowSchema, { id: 203, artist: 'Lolina', date: '2024-10-26', genre: 'Experimental', draw: 67 }),
  create(ArchivedShowSchema, { id: 204, artist: "Working Men's Club", date: '2024-09-14', genre: 'Post-punk', draw: 126 }),
  create(ArchivedShowSchema, { id: 205, artist: 'Wet Tennis', date: '2024-08-02', genre: 'Indie', draw: 74 }),
  create(ArchivedShowSchema, { id: 206, artist: 'Fire Toolz', date: '2024-07-13', genre: 'Vaporwave', draw: 62 }),
  create(ArchivedShowSchema, { id: 207, artist: 'Redroom Inferno I', date: '2024-06-22', genre: 'Electronic', draw: 150 }),
];

export const prototypeArchiveStats = create(ArchiveStatsSchema, {
  totalShows: 194,
  totalAttendance: 312,
  yearsRunning: 31,
  uniqueArtists: 0,
});

const publicHandlersForShows = (shows = prototypeShows) => [
  http.get('*/api/public/shows', () => HttpResponse.json(toJson(ShowListSchema, create(ShowListSchema, { shows })))),
  http.get('*/api/public/archive', () => HttpResponse.json(toJson(ArchivedShowListSchema, create(ArchivedShowListSchema, { shows: prototypeArchiveShows })))),
  http.get('*/api/public/archive/stats', () => HttpResponse.json(toJson(ArchiveStatsSchema, prototypeArchiveStats))),
  http.get('*/api/public/shows/:id', ({ params }) => {
    const id = Number(params.id);
    const show = id === prototypeShowDetail.id ? prototypeShowDetail : (shows.find((candidate) => candidate.id === id) ?? shows[0] ?? prototypeShows[0]);
    return HttpResponse.json(toJson(ShowSchema, show));
  }),
];

export const prototypePublicHandlers = publicHandlersForShows(prototypeShows);
export const prototypeMobilePublicHandlers = publicHandlersForShows(prototypeShows.slice(0, 6));

export const publicPageParameters = {
  layout: 'fullscreen',
  msw: { handlers: [...prototypePublicHandlers, ...handlers] },
};

export const publicMobilePageParameters = {
  layout: 'fullscreen',
  msw: { handlers: [...prototypeMobilePublicHandlers, ...handlers] },
};

export type PublicPageRouteProps = {
  route: string;
  storyName: string;
  width: number;
  minHeight: number;
};

export function renderPublicPageRoute(args: PublicPageRouteProps): ReactElement {
  return <PublicPageRoute {...args} />;
}

function PublicPageRoute({ route, storyName, width, minHeight }: PublicPageRouteProps) {
  const store = makeStore();

  return (
    <div
      data-story="pyxis-public-page"
      data-story-name={storyName}
      style={{ minHeight, width: '100%', background: 'var(--color-canvas)', display: 'flex', justifyContent: 'center', padding: 0 }}
    >
      <div data-story-frame="pyxis-page-shell" style={{ width, background: '#fff', minHeight }}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Shows />} />
                <Route path="shows" element={<Shows />} />
                <Route path="shows/:id" element={<ShowDetail />} />
                <Route path="archive" element={<Archive />} />
                <Route path="book" element={<Book />} />
                <Route path="book/success" element={<BookSuccess />} />
                <Route path="about" element={<About />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Provider>
      </div>
    </div>
  );
}
