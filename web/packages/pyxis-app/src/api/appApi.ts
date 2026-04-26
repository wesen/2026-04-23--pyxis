import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  fromJson,
  AuthSession,
  AuthSessionSchema,
  ShowList,
  ShowListSchema,
  Show,
  ShowSchema,
} from 'pyxis-types';
import type {
  ArtistProfile,
  AttendanceEntry,
  AuditLogEntry,
  BookingRequest,
  CalendarEvent,
  DiscordChannelMapping,
  SpaceSettings,
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
  tagTypes: ['Session', 'Show', 'Booking', 'Artist', 'Calendar', 'Attendance', 'AuditLog', 'Discord', 'Settings'],
  endpoints: (builder) => ({
    getSession: builder.query<AuthSession, void>({
      query: () => endpoints.session,
      transformResponse: (response: unknown) => fromJson(AuthSessionSchema, response as any),
      providesTags: ['Session'],
    }),

    getShows: builder.query<Show[], void>({
      query: () => endpoints.shows,
      transformResponse: (response: unknown) => {
        const list = fromJson(ShowListSchema, response as any);
        return list.shows;
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

    getBookings: builder.query<BookingRequest[], void>({
      query: () => endpoints.bookings,
      providesTags: ['Booking'],
    }),

    getBooking: builder.query<BookingRequest, number>({
      query: endpoints.booking,
      providesTags: (_r, _e, id) => [{ type: 'Booking', id }],
    }),

    getArtists: builder.query<ArtistProfile[], void>({
      query: () => endpoints.artists,
      providesTags: ['Artist'],
    }),

    getArtist: builder.query<ArtistProfile, number>({
      query: endpoints.artist,
      providesTags: (_r, _e, id) => [{ type: 'Artist', id }],
    }),

    getCalendar: builder.query<CalendarEvent[], void>({
      query: () => endpoints.calendar,
      providesTags: ['Calendar'],
    }),

    getAttendance: builder.query<AttendanceEntry[], void>({
      query: () => endpoints.attendance,
      providesTags: ['Attendance'],
    }),

    getAuditLog: builder.query<AuditLogEntry[], void>({
      query: () => endpoints.auditLog,
      providesTags: ['AuditLog'],
    }),

    getDiscordMappings: builder.query<DiscordChannelMapping[], void>({
      query: () => endpoints.discord,
      providesTags: ['Discord'],
    }),

    getSettings: builder.query<SpaceSettings, void>({
      query: () => endpoints.settings,
      providesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetArtistQuery,
  useGetArtistsQuery,
  useGetAttendanceQuery,
  useGetAuditLogQuery,
  useGetBookingQuery,
  useGetBookingsQuery,
  useGetCalendarQuery,
  useGetDiscordMappingsQuery,
  useGetSessionQuery,
  useGetSettingsQuery,
  useGetShowQuery,
  useGetShowsQuery,
} = appApi;
