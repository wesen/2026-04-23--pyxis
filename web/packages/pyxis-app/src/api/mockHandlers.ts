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
  BookingReviewSchema,
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
import type { AppShow, Artist, Submission } from 'pyxis-types';
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
  bookingReviews: Record<number, ReturnType<typeof createBookingReview>>;
  artists: Artist[];
  attendance: typeof attendance;
  settings: typeof settings;
  calendarEvents: typeof calendarEvents;
};

let state: MockState;

export function resetMockState() {
  state = {
    shows: shows.map(appShowToShow),
    bookings: bookings.map(cloneSubmission),
    bookingReviews: Object.fromEntries(bookings.map((booking) => [booking.id, createBookingReview(booking.id, booking.id === 1 ? 'Good fit. Pair with local opener.' : '')])),
    artists: artists.map((artist) => create(ArtistSchema, artist as any)),
    attendance: attendance.map((entry) => create(AttendanceLogSchema, entry as any)),
    settings: create(SettingsSchema, settings as any),
    calendarEvents: calendarEvents.map((event) => create(CalendarEventSchema, event as any)),
  };
}

function cloneSubmission(booking: Submission) {
  return create(SubmissionSchema, booking as any);
}

function createBookingReview(submissionId: number, note = '') {
  return create(BookingReviewSchema, { submissionId, note, decision: 'none', updatedBy: 1, updatedAt: '2026-04-26T00:00:00Z' });
}

function ensureMockState() {
  if (!state) {
    state = {
      shows: shows.map(appShowToShow),
      bookings: bookings.map(cloneSubmission),
      bookingReviews: Object.fromEntries(bookings.map((booking) => [booking.id, createBookingReview(booking.id, booking.id === 1 ? 'Good fit. Pair with local opener.' : '')])),
      artists: artists.map((artist) => create(ArtistSchema, artist as any)),
      attendance: attendance.map((entry) => create(AttendanceLogSchema, entry as any)),
      settings: create(SettingsSchema, settings as any),
      calendarEvents: calendarEvents.map((event) => create(CalendarEventSchema, event as any)),
    };
  }
  return state;
}

function successJson() {
  return toJson(SuccessResponseSchema, create(SuccessResponseSchema, { success: true }));
}

function showLogStatus(entry: { draw?: number; incident?: boolean }) {
  if (entry.incident) return 'incident';
  if (!entry.draw || entry.draw <= 0) return 'needs-log';
  return 'logged';
}

function buildShowLogEntries(current: MockState) {
  return current.shows
    .filter((show) => [ShowStatus.CONFIRMED, ShowStatus.ARCHIVED, ShowStatus.CANCELLED].includes(show.status))
    .map((show) => {
      const log = current.attendance.find((entry) => entry.showId === show.id);
      return {
        showId: show.id,
        attendanceLogId: log?.id,
        artist: show.artist,
        date: show.date,
        genre: show.genre,
        showStatus: show.status,
        showNotes: show.notes,
        draw: log?.draw,
        postShowNotes: log?.notes ?? '',
        quickHighlight: (log as any)?.quickHighlight ?? '',
        totalDoorCents: (log as any)?.totalDoorCents,
        incident: log?.incident ?? false,
        incidentNotes: log?.incidentNotes ?? '',
        loggedBy: log?.loggedBy,
        loggedByName: log?.loggedBy ? 'Ada Dove' : '',
        loggedAt: log?.createdAt,
        updatedAt: log?.updatedAt,
        logStatus: showLogStatus({ draw: log?.draw, incident: log?.incident }),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
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

  http.patch('*/api/app/bookings/:id', async ({ params, request }) => {
    const current = ensureMockState();
    const id = Number(params.id);
    const body = await request.json() as Partial<Submission>;
    const previous = current.bookings.find((candidate) => candidate.id === id) ?? current.bookings[0];
    const updated = create(SubmissionSchema, { ...previous, ...body, id });
    current.bookings = current.bookings.map((candidate) => candidate.id === id ? updated : candidate);
    return HttpResponse.json(toJson(SubmissionSchema, updated));
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

  http.get('*/api/app/bookings/:id/review', ({ params }) => {
    const current = ensureMockState();
    const id = Number(params.id);
    const review = current.bookingReviews[id] ?? createBookingReview(id);
    return HttpResponse.json(toJson(BookingReviewSchema, review));
  }),

  http.patch('*/api/app/bookings/:id/review', async ({ params, request }) => {
    const current = ensureMockState();
    const id = Number(params.id);
    const body = await request.json() as { note?: string; decision?: string };
    const review = create(BookingReviewSchema, { submissionId: id, note: body.note ?? '', decision: body.decision ?? 'none', updatedBy: 1, updatedAt: '2026-04-26T00:00:00Z' });
    current.bookingReviews[id] = review;
    return HttpResponse.json(toJson(BookingReviewSchema, review));
  }),

  http.patch('*/api/app/bookings/:id/decline', ({ params }) => {
    const current = ensureMockState();
    const id = Number(params.id);
    current.bookings = current.bookings.map((candidate) =>
      candidate.id === id ? create(SubmissionSchema, { ...candidate, status: SubmissionStatus.DECLINED }) : candidate
    );
    return HttpResponse.json(successJson());
  }),

  http.get('*/api/app/artists', () => {
    const current = ensureMockState();
    return HttpResponse.json(toJson(ArtistListSchema, create(ArtistListSchema, { artists: current.artists })));
  }),
  http.post('*/api/app/artists', async ({ request }) => {
    const current = ensureMockState();
    const body = await request.json() as Partial<Artist>;
    const id = Math.max(0, ...current.artists.map((artist) => artist.id)) + 1;
    const artist = create(ArtistSchema, {
      id,
      name: body.name ?? '',
      genre: body.genre ?? '',
      links: body.links ?? '',
      notes: body.notes ?? '',
      createdAt: '2026-04-26T00:00:00Z',
      updatedAt: '2026-04-26T00:00:00Z',
    });
    current.artists = [...current.artists, artist];
    return HttpResponse.json(toJson(ArtistSchema, artist), { status: 201 });
  }),
  http.get('*/api/app/artists/:id', ({ params }) => {
    const current = ensureMockState();
    const artist = current.artists.find((candidate) => candidate.id === Number(params.id)) ?? current.artists[0];
    return HttpResponse.json(toJson(ArtistSchema, artist));
  }),
  http.patch('*/api/app/artists/:id', async ({ params, request }) => {
    const current = ensureMockState();
    const id = Number(params.id);
    const body = await request.json() as Partial<Artist>;
    const previous = current.artists.find((candidate) => candidate.id === id) ?? current.artists[0];
    const updated = create(ArtistSchema, { ...previous, ...body, id, updatedAt: '2026-04-26T00:00:00Z' });
    current.artists = current.artists.map((candidate) => candidate.id === id ? updated : candidate);
    return HttpResponse.json(toJson(ArtistSchema, updated));
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

  http.get('*/api/app/attendance', () => {
    const current = ensureMockState();
    return HttpResponse.json(toJson(AttendanceLogListSchema, create(AttendanceLogListSchema, { logs: current.attendance })));
  }),
  http.patch('*/api/app/attendance/:showId', async ({ params, request }) => {
    const current = ensureMockState();
    const showId = Number(params.showId);
    const body = await request.json() as Partial<typeof attendance[number]>;
    const previous = current.attendance.find((entry) => entry.showId === showId) ?? current.attendance[0];
    const updated = create(AttendanceLogSchema, { ...previous, ...body, showId, updatedAt: '2026-04-26T00:00:00Z' });
    current.attendance = current.attendance.map((entry) => entry.showId === showId ? updated : entry);
    return HttpResponse.json(toJson(AttendanceLogSchema, updated));
  }),
  http.get('*/api/app/show-log', ({ request }) => {
    const current = ensureMockState();
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'all';
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const entries = buildShowLogEntries(current).filter((entry) =>
      (status === 'all' || entry.logStatus === status) &&
      (!search || [entry.artist, entry.date, entry.genre, entry.showNotes, entry.postShowNotes, entry.incidentNotes].some((value) => String(value || '').toLowerCase().includes(search)))
    );
    return HttpResponse.json({ entries });
  }),
  http.patch('*/api/app/show-log/:showId', async ({ params, request }) => {
    const current = ensureMockState();
    const showId = Number(params.showId);
    const body = await request.json() as { draw?: number; postShowNotes?: string; quickHighlight?: string; totalDoorCents?: number; incident?: boolean; incidentNotes?: string };
    const previous = current.attendance.find((entry) => entry.showId === showId);
    const show = current.shows.find((candidate) => candidate.id === showId) ?? current.shows[0];
    const updated = {
      ...(previous ?? {}),
      id: previous?.id ?? showId,
      showId,
      artist: show.artist,
      date: show.date,
      draw: body.draw ?? previous?.draw ?? 0,
      notes: body.postShowNotes ?? previous?.notes ?? '',
      quickHighlight: body.quickHighlight ?? (previous as any)?.quickHighlight ?? '',
      totalDoorCents: body.totalDoorCents ?? (previous as any)?.totalDoorCents,
      incident: body.incident ?? previous?.incident ?? false,
      incidentNotes: body.incidentNotes ?? previous?.incidentNotes ?? '',
      loggedBy: 1,
      createdAt: previous?.createdAt || '2026-04-26T00:00:00Z',
      updatedAt: '2026-04-26T00:00:00Z',
    } as typeof current.attendance[number] & { quickHighlight?: string; totalDoorCents?: number };
    current.attendance = previous ? current.attendance.map((entry) => entry.showId === showId ? updated : entry) : [updated, ...current.attendance];
    const entry = buildShowLogEntries(current).find((candidate) => candidate.showId === showId);
    return HttpResponse.json(entry);
  }),
  http.get('*/api/app/audit-log', () => HttpResponse.json(toJson(AuditLogEntryListSchema, create(AuditLogEntryListSchema, { entries: auditLog })))),
  http.get('*/api/app/settings', () => {
    const current = ensureMockState();
    return HttpResponse.json(toJson(SettingsSchema, current.settings));
  }),
  http.patch('*/api/app/settings', async ({ request }) => {
    const current = ensureMockState();
    const body = await request.json() as Partial<typeof settings>;
    current.settings = create(SettingsSchema, { ...current.settings, ...body });
    return HttpResponse.json(toJson(SettingsSchema, current.settings));
  }),
];
