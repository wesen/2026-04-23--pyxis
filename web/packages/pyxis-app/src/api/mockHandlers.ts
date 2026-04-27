import { http, HttpResponse } from 'msw';
import {
  create,
  toJson,
  ArtistListSchema,
  ArtistSchema,
  AttendanceLogSchema,
  AttendanceLogListSchema,
  AuditLogEntryListSchema,
  AuthSessionSchema,
  CalendarBlockedSchema,
  CalendarEventKind,
  CalendarEventListSchema,
  CalendarEventSchema,
  CalendarHoldSchema,
  FlyerUploadResponseSchema,
  SettingsSchema,
  ShowSchema,
  ShowListSchema,
  ShowStatus,
  SubmissionSchema,
  SubmissionListSchema,
  SubmissionStatus,
  SuccessResponseSchema,
} from 'pyxis-types';
import type { AppShow, Submission } from 'pyxis-types';
import { artists, attendance, auditLog, bookings, calendarEvents, session, settings, shows } from './mockData';

function appShowToShow(show: AppShow) {
  return create(ShowSchema, {
    id: show.id,
    artist: show.artist,
    date: show.date,
    doorsTime: show.doors,
    age: show.age,
    price: show.price,
    status: show.status,
    genre: show.genre,
    draw: show.draw,
    capacity: show.capacity,
    notes: show.notes,
  });
}

type MockState = {
  shows: ReturnType<typeof appShowToShow>[];
  bookings: Submission[];
  calendarEvents: typeof calendarEvents;
};

let state: MockState;

export function resetMockState() {
  state = {
    shows: shows.map(appShowToShow),
    bookings: bookings.map(cloneSubmission),
    calendarEvents: calendarEvents.map((event) => create(CalendarEventSchema, event as any)),
  };
}

function cloneSubmission(booking: Submission) {
  return create(SubmissionSchema, booking as any);
}

function ensureMockState() {
  if (!state) {
    state = {
      shows: shows.map(appShowToShow),
      bookings: bookings.map(cloneSubmission),
      calendarEvents: calendarEvents.map((event) => create(CalendarEventSchema, event as any)),
    };
  }
  return state;
}

function successJson() {
  return toJson(SuccessResponseSchema, create(SuccessResponseSchema, { success: true }));
}

resetMockState();

export const mockHandlers = [
  http.get('*/api/app/session', () => HttpResponse.json(toJson(AuthSessionSchema, session))),

  http.get('*/api/app/shows', () => {
    const current = ensureMockState();
    return HttpResponse.json(toJson(ShowListSchema, create(ShowListSchema, { shows: current.shows })));
  }),

  http.get('*/api/app/shows/:id', ({ params }) => {
    const current = ensureMockState();
    const show = current.shows.find((candidate) => candidate.id === Number(params.id)) ?? current.shows[0];
    return HttpResponse.json(toJson(ShowSchema, show));
  }),

  http.post('*/api/app/shows', async ({ request }) => {
    const current = ensureMockState();
    const body = await request.json();
    const nextId = Math.max(0, ...current.shows.map((show) => show.id)) + 1;
    const show = create(ShowSchema, { ...(body as any), id: nextId });
    current.shows = [show, ...current.shows];
    return HttpResponse.json(toJson(ShowSchema, show), { status: 201 });
  }),

  http.patch('*/api/app/shows/:id', async ({ params, request }) => {
    const current = ensureMockState();
    const body = await request.json();
    const id = Number(params.id);
    const previous = current.shows.find((candidate) => candidate.id === id) ?? current.shows[0];
    const updated = create(ShowSchema, { ...previous, ...(body as any), id });
    current.shows = current.shows.map((candidate) => (candidate.id === id ? updated : candidate));
    return HttpResponse.json(toJson(ShowSchema, updated));
  }),

  http.post('*/api/app/shows/:id/flyer', async ({ params, request }) => {
    const current = ensureMockState();
    const id = Number(params.id);
    const form = await request.formData();
    const file = form.get('flyer') as File | null;
    const filename = file?.name ?? 'flyer.png';
    const url = `/flyers/${id}/${filename}`;
    current.shows = current.shows.map((candidate) => candidate.id === id ? create(ShowSchema, { ...candidate, flyerUrl: url }) : candidate);
    return HttpResponse.json(toJson(FlyerUploadResponseSchema, create(FlyerUploadResponseSchema, { url })));
  }),

  http.delete('*/api/app/shows/:id/flyer', ({ params }) => {
    const current = ensureMockState();
    const id = Number(params.id);
    current.shows = current.shows.map((candidate) => candidate.id === id ? create(ShowSchema, { ...candidate, flyerUrl: '' }) : candidate);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('*/api/app/shows/:id/cancel', ({ params }) => {
    const current = ensureMockState();
    const show = current.shows.find((candidate) => candidate.id === Number(params.id)) ?? current.shows[0];
    const updated = create(ShowSchema, { ...show, status: ShowStatus.CANCELLED });
    current.shows = current.shows.map((candidate) => (candidate.id === updated.id ? updated : candidate));
    return HttpResponse.json(toJson(ShowSchema, updated));
  }),

  http.patch('*/api/app/shows/:id/archive', () => HttpResponse.json(successJson())),
  http.post('*/api/app/shows/:id/announce', () => HttpResponse.json(successJson())),

  http.get('*/api/app/bookings', () => {
    const current = ensureMockState();
    return HttpResponse.json(toJson(SubmissionListSchema, create(SubmissionListSchema, { submissions: current.bookings })));
  }),

  http.patch('*/api/app/bookings/:id/approve', ({ params }) => {
    const current = ensureMockState();
    const id = Number(params.id);
    const booking = current.bookings.find((candidate) => candidate.id === id) ?? current.bookings[0];
    current.bookings = current.bookings.map((candidate) =>
      candidate.id === id ? create(SubmissionSchema, { ...candidate, status: SubmissionStatus.APPROVED }) : candidate
    );
    const show = create(ShowSchema, {
      id: 900 + id,
      artist: booking.artistName,
      date: booking.preferredDate,
      doorsTime: '8:00 PM',
      age: '21+',
      price: '$12',
      status: ShowStatus.CONFIRMED,
      genre: booking.genre,
      draw: booking.expectedDraw,
      capacity: 150,
    });
    current.shows = [...current.shows, show];
    return HttpResponse.json(toJson(ShowSchema, show));
  }),

  http.patch('*/api/app/bookings/:id/decline', ({ params }) => {
    const current = ensureMockState();
    const id = Number(params.id);
    current.bookings = current.bookings.map((candidate) =>
      candidate.id === id ? create(SubmissionSchema, { ...candidate, status: SubmissionStatus.DECLINED }) : candidate
    );
    return HttpResponse.json(successJson());
  }),

  http.get('*/api/app/artists', () => HttpResponse.json(toJson(ArtistListSchema, create(ArtistListSchema, { artists })))),
  http.get('*/api/app/artists/:id', ({ params }) => {
    const artist = artists.find((candidate) => candidate.id === Number(params.id)) ?? artists[0];
    return HttpResponse.json(toJson(ArtistSchema, artist));
  }),

  http.get('*/api/app/calendar', () => {
    const current = ensureMockState();
    return HttpResponse.json(toJson(CalendarEventListSchema, create(CalendarEventListSchema, { events: current.calendarEvents })));
  }),
  http.post('*/api/app/calendar/holds', async ({ request }) => {
    const body = await request.json() as { date?: string; label?: string };
    const current = ensureMockState();
    const hold = create(CalendarHoldSchema, { id: 101 + current.calendarEvents.length, date: body.date ?? '2025-06-01', label: body.label ?? 'Hold' });
    current.calendarEvents = [...current.calendarEvents, create(CalendarEventSchema, { id: hold.id, date: hold.date, label: hold.label, status: ShowStatus.HOLD, kind: CalendarEventKind.HOLD })];
    return HttpResponse.json(toJson(CalendarHoldSchema, hold), { status: 201 });
  }),
  http.delete('*/api/app/calendar/holds/:id', ({ params }) => {
    const current = ensureMockState();
    current.calendarEvents = current.calendarEvents.filter((event) => !(event.kind === CalendarEventKind.HOLD && event.id === Number(params.id)));
    return new HttpResponse(null, { status: 204 });
  }),
  http.post('*/api/app/calendar/blocked', async ({ request }) => {
    const body = await request.json() as { date?: string; reason?: string };
    const current = ensureMockState();
    const blocked = create(CalendarBlockedSchema, { id: 201 + current.calendarEvents.length, date: body.date ?? '2025-06-02', reason: body.reason ?? 'Closed' });
    current.calendarEvents = [...current.calendarEvents, create(CalendarEventSchema, { id: blocked.id, date: blocked.date, label: blocked.reason, status: ShowStatus.BLOCKED, kind: CalendarEventKind.BLOCKED })];
    return HttpResponse.json(toJson(CalendarBlockedSchema, blocked), { status: 201 });
  }),
  http.delete('*/api/app/calendar/blocked/:id', ({ params }) => {
    const current = ensureMockState();
    current.calendarEvents = current.calendarEvents.filter((event) => !(event.kind === CalendarEventKind.BLOCKED && event.id === Number(params.id)));
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/api/app/attendance', () => HttpResponse.json(toJson(AttendanceLogListSchema, create(AttendanceLogListSchema, { logs: attendance })))),
  http.patch('*/api/app/attendance/:showId', () => HttpResponse.json(toJson(AttendanceLogSchema, attendance[0]))),
  http.get('*/api/app/audit-log', () => HttpResponse.json(toJson(AuditLogEntryListSchema, create(AuditLogEntryListSchema, { entries: auditLog })))),
  http.get('*/api/app/settings', () => HttpResponse.json(toJson(SettingsSchema, settings))),
  http.patch('*/api/app/settings', async ({ request }) => HttpResponse.json(await request.json())),
];
