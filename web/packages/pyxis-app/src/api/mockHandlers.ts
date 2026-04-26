import { http, HttpResponse } from 'msw';
import { artists, attendance, auditLog, bookings, discordMappings, session, settings, shows } from './mockData';

export const mockHandlers = [
  http.get('*/api/app/session', () => HttpResponse.json(session)),
  http.get('*/api/app/shows', () => HttpResponse.json({ shows })),
  http.get('*/api/app/shows/:id', ({ params }) => HttpResponse.json(shows.find((show) => show.id === Number(params.id)) ?? shows[0])),
  http.get('*/api/app/bookings', () => HttpResponse.json({ submissions: bookings })),
  http.get('*/api/app/artists', () => HttpResponse.json({ artists })),
  http.get('*/api/app/artists/:id', ({ params }) => HttpResponse.json(artists.find((artist) => artist.id === Number(params.id)) ?? artists[0])),
  http.get('*/api/app/calendar', () => HttpResponse.json({ holds: [], blocked: [] })),
  http.get('*/api/app/attendance', () => HttpResponse.json({ logs: attendance })),
  http.get('*/api/app/audit-log', () => HttpResponse.json({ entries: auditLog })),
  http.get('*/api/app/discord', () => HttpResponse.json(discordMappings)),
  http.get('*/api/app/settings', () => HttpResponse.json(settings)),
];
