// MSW handlers — define all API mock responses here.
// Import these in stories via mswDecorator or in tests.

import { http, HttpResponse } from 'msw';
import type {
  Show,
  ArchivedShow,
  ArchiveStats,
  BookingFormData,
  BookingConfirmation,
} from './types';

/* ─── Seed data ─────────────────────────────────────── */

export const seedShows: Show[] = [
  {
    id: 42,
    artist: 'Burial Hex',
    date: '2025-05-02',
    doors_time: '8:00 PM',
    start_time: '9:00 PM',
    age: '21+',
    price: '$12 adv / $15 door',
    genre: 'Darkwave / Ritual Ambient',
    description:
      "Cole Coonce's long-running ritual electronics project. Heavy drones, processed vocals, and an immersive ceremony-like performance. Support TBA.",
    lineup: [
      { artist: 'Burial Hex', role: 'headline', start_time: '9:00 PM' },
    ],
    flyer_url: 'https://placehold.co/600x900/C8270D/white?text=Burial+Hex',
    status: 'confirmed',
    artist_id: 101,
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
  },
  {
    id: 43,
    artist: 'Moor Mother',
    date: '2025-05-09',
    doors_time: '7:00 PM',
    start_time: '8:00 PM',
    age: 'All Ages',
    price: '$15',
    genre: 'Experimental / Noise Poetry',
    description:
      'Philadelphia-based poet, musician, and activist Camae Ayewa performing as Moor Mother. Raw, confrontational, essential.',
    lineup: [
      { artist: 'Moor Mother', role: 'headline', start_time: '8:00 PM' },
    ],
    flyer_url: 'https://placehold.co/600x900/C8270D/white?text=Moor+Mother',
    status: 'confirmed',
    artist_id: 102,
    created_at: '2025-04-02T00:00:00Z',
    updated_at: '2025-04-02T00:00:00Z',
  },
  {
    id: 44,
    artist: 'Cygnus + Guests',
    date: '2025-05-17',
    doors_time: '9:00 PM',
    start_time: '10:00 PM',
    age: '18+',
    price: '$8',
    genre: 'Techno',
    description:
      'Cygnus brings his signature hybrid live/DJ set of hard techno and electro, joined by local guests TBA. Dance floor in full effect.',
    lineup: [
      { artist: 'Cygnus', role: 'headline', start_time: '11:00 PM' },
      { artist: 'DJ TBA', role: 'dj', start_time: '10:00 PM' },
    ],
    flyer_url: 'https://placehold.co/600x900/C8270D/white?text=Cygnus',
    status: 'confirmed',
    artist_id: 103,
    created_at: '2025-04-03T00:00:00Z',
    updated_at: '2025-04-03T00:00:00Z',
  },
  {
    id: 45,
    artist: 'Open Mic Night',
    date: '2025-05-23',
    doors_time: '7:00 PM',
    age: 'All Ages',
    price: 'Free',
    genre: 'Open Format',
    description:
      'Monthly open mic. All formats welcome — music, spoken word, performance, whatever you\'ve got. Sign up at the door from 6:30.',
    status: 'confirmed',
    created_at: '2025-04-04T00:00:00Z',
    updated_at: '2025-04-04T00:00:00Z',
  },
  {
    id: 46,
    artist: 'Zola Jesus',
    date: '2025-06-06',
    doors_time: '8:00 PM',
    start_time: '9:00 PM',
    age: '21+',
    price: '$20',
    genre: 'Art Pop / Darkwave',
    description:
      'Nika Roza Danilova returns to Providence on her headline tour. One of the most powerful live performers working today.',
    lineup: [
      { artist: 'Zola Jesus', role: 'headline', start_time: '9:00 PM' },
    ],
    flyer_url: 'https://placehold.co/600x900/C8270D/white?text=Zola+Jesus',
    status: 'confirmed',
    artist_id: 104,
    created_at: '2025-04-05T00:00:00Z',
    updated_at: '2025-04-05T00:00:00Z',
  },
  {
    id: 47,
    artist: 'Orphx',
    date: '2025-07-04',
    doors_time: '9:00 PM',
    start_time: '10:00 PM',
    age: '18+',
    price: '$12',
    genre: 'EBM / Industrial',
    description:
      'Canadian EBM veterans Orphx make a rare US appearance. Driving beats, sharp synths, a wall of sound.',
    lineup: [
      { artist: 'Orphx', role: 'headline', start_time: '10:00 PM' },
    ],
    flyer_url: 'https://placehold.co/600x900/C8270D/white?text=Orphx',
    status: 'confirmed',
    artist_id: 105,
    created_at: '2025-04-06T00:00:00Z',
    updated_at: '2025-04-06T00:00:00Z',
  },
];

export const seedArchive: ArchivedShow[] = [
  { id: 41, artist: 'Planning for Burial', date: '2025-03-14', genre: 'Ambient',     draw: 34 },
  { id: 40, artist: 'Actress',              date: '2025-02-28', genre: 'Electronic',  draw: 61 },
  { id: 39, artist: 'Container',           date: '2025-01-18', genre: 'Noise',       draw: 55 },
  { id: 38, artist: 'Burial Hex',          date: '2024-11-15', genre: 'Darkwave',    draw: 55 },
  { id: 37, artist: 'Moor Mother',         date: '2024-09-06', genre: 'Experimental', draw: 94 },
  { id: 36, artist: 'Pharmakon',           date: '2024-08-02', genre: 'Industrial',  draw: 80 },
  { id: 35, artist: 'Cygnus',              date: '2024-07-19', genre: 'Techno',      draw: 88 },
  { id: 34, artist: 'Actress',             date: '2024-05-10', genre: 'Electronic',  draw: 72 },
  { id: 33, artist: 'Planning for Burial', date: '2024-04-12', genre: 'Ambient',     draw: 41 },
  { id: 32, artist: 'Container',           date: '2024-02-23', genre: 'Noise',       draw: 49 },
  { id: 31, artist: 'Zola Jesus',          date: '2023-12-08', genre: 'Art Pop',     draw: 148 },
  { id: 30, artist: 'Orphx',               date: '2023-10-27', genre: 'EBM',          draw: 77 },
];

export const seedStats: ArchiveStats = {
  total_shows: 247,
  total_attendance: 18400,
  years_running: 4,
  unique_artists: 132,
};

/* ─── Handlers ────────────────────────────────────────── */

export const handlers = [
  // GET /public/shows
  http.get('/api/public/shows', () => {
    return HttpResponse.json(seedShows);
  }),

  // GET /public/shows/:id
  http.get('/api/public/shows/:id', ({ params }) => {
    const id = Number(params.id);
    const show = seedShows.find((s) => s.id === id);
    if (!show) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: `Show ${id} not found` } },
        { status: 404 }
      );
    }
    return HttpResponse.json(show);
  }),

  // GET /public/shows/:id/flyer
  http.get('/api/public/shows/:id/flyer', ({ params }) => {
    const id = Number(params.id);
    const show = seedShows.find((s) => s.id === id);
    if (!show) {
      return new HttpResponse(null, { status: 404 });
    }
    // In production this would redirect to the flyer URL.
    // In mock, return 204 No Content to signal "no flyer".
    if (!show.flyer_url) {
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ url: show.flyer_url });
  }),

  // GET /public/archive
  http.get('/api/public/archive', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    if (search) {
      const q = search.toLowerCase();
      return HttpResponse.json(
        seedArchive.filter(
          (s) =>
            s.artist.toLowerCase().includes(q) ||
            s.genre.toLowerCase().includes(q)
        )
      );
    }
    return HttpResponse.json(seedArchive);
  }),

  // GET /public/archive/stats
  http.get('/api/public/archive/stats', () => {
    return HttpResponse.json(seedStats);
  }),

  // POST /public/submissions
  http.post('/api/public/submissions', async ({ request }) => {
    const body = (await request.json()) as BookingFormData;
    if (!body.artist_name || !body.links) {
      return HttpResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'artist_name and links are required',
          },
        },
        { status: 422 }
      );
    }
    return HttpResponse.json<BookingConfirmation>({
      success: true,
      submission_id: 999,
    });
  }),
];
