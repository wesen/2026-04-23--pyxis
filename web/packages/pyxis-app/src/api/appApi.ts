import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  fromJson,
  create,
  AuthSession,
  AuthSessionSchema,
  ShowListSchema,
  Show,
  ShowSchema,
  AppShow,
  AppShowSchema,
  Submission,
  SubmissionListSchema,
  Artist,
  ArtistListSchema,
  ArtistSchema,
  CalendarEvent,
  CalendarResponseSchema,
  AttendanceLog,
  AttendanceLogListSchema,
  AuditLogEntry,
  AuditLogEntryListSchema,
  Settings,
  SettingsSchema,
} from 'pyxis-types';
import { endpoints } from './endpoints';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Session', 'Show', 'Booking', 'Artist', 'Calendar', 'Attendance', 'AuditLog', 'Settings'],
  endpoints: (builder) => ({
    getSession: builder.query<AuthSession, void>({
      query: () => endpoints.session,
      transformResponse: (response: unknown) => fromJson(AuthSessionSchema, response as any),
      providesTags: ['Session'],
    }),

    getShows: builder.query<AppShow[], void>({
      query: () => endpoints.shows,
      transformResponse: (response: unknown) => {
        const list = fromJson(ShowListSchema, response as any);
        return list.shows.map((show) =>
          create(AppShowSchema, {
            id: show.id,
            artist: show.artist,
            date: show.date,
            doors: show.doorsTime,
            age: show.age,
            price: show.price,
            status: show.status,
            genre: show.genre,
            draw: 0,
            capacity: 150,
            pinned: false,
            notes: '',
          })
        );
      },
      providesTags: (result) =>
        result
          ? [...result.map((s) => ({ type: 'Show' as const, id: s.id })), { type: 'Show' as const, id: 'LIST' }]
          : [{ type: 'Show' as const, id: 'LIST' }],
    }),

    getShow: builder.query<Show, number>({
      query: (id) => endpoints.show(id),
      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
      providesTags: (_r, _e, id) => [{ type: 'Show', id }],
    }),

    getBookings: builder.query<Submission[], void>({
      query: () => endpoints.bookings,
      transformResponse: (response: unknown) => {
        const list = fromJson(SubmissionListSchema, response as any);
        return list.submissions;
      },
      providesTags: ['Booking'],
    }),

    getArtists: builder.query<Artist[], void>({
      query: () => endpoints.artists,
      transformResponse: (response: unknown) => {
        const list = fromJson(ArtistListSchema, response as any);
        return list.artists;
      },
      providesTags: ['Artist'],
    }),

    getArtist: builder.query<Artist, number>({
      query: endpoints.artist,
      transformResponse: (response: unknown) => fromJson(ArtistSchema, response as any),
      providesTags: (_r, _e, id) => [{ type: 'Artist', id }],
    }),

    getCalendar: builder.query<CalendarEvent[], void>({
      query: () => endpoints.calendar,
      transformResponse: (response: unknown) => {
        const cal = fromJson(CalendarResponseSchema, response as any);
        const events: CalendarEvent[] = [
          ...cal.holds.map((h) => ({ date: h.date, label: h.label, status: 'hold' as const })),
          ...cal.blocked.map((b) => ({ date: b.date, label: b.reason, status: 'blocked' as const })),
        ];
        return events;
      },
      providesTags: ['Calendar'],
    }),

    getAttendance: builder.query<AttendanceLog[], void>({
      query: () => endpoints.attendance,
      transformResponse: (response: unknown) => {
        const list = fromJson(AttendanceLogListSchema, response as any);
        return list.logs;
      },
      providesTags: ['Attendance'],
    }),

    getAuditLog: builder.query<AuditLogEntry[], void>({
      query: () => endpoints.auditLog,
      transformResponse: (response: unknown) => {
        const list = fromJson(AuditLogEntryListSchema, response as any);
        return list.entries;
      },
      providesTags: ['AuditLog'],
    }),

    getSettings: builder.query<Settings, void>({
      query: () => endpoints.settings,
      transformResponse: (response: unknown) => fromJson(SettingsSchema, response as any),
      providesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetArtistQuery,
  useGetArtistsQuery,
  useGetAttendanceQuery,
  useGetAuditLogQuery,
  useGetBookingsQuery,
  useGetCalendarQuery,
  useGetSessionQuery,
  useGetSettingsQuery,
  useGetShowQuery,
  useGetShowsQuery,
} = appApi;
