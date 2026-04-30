import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  fromJson,
  toJson,
  create,
  AuthSession,
  AuthSessionSchema,
  ShowListSchema,
  Show,
  ShowSchema,
  ShowStatus,
  AppShow,
  AppShowSchema,
  Submission,
  SubmissionSchema,
  SubmissionListSchema,
  BookingReview,
  BookingReviewSchema,
  Artist,
  ArtistListSchema,
  ArtistSchema,
  CalendarEvent,
  CalendarEventListSchema,
  CalendarHold,
  CalendarHoldSchema,
  CalendarBlocked,
  CalendarBlockedSchema,
  AuditLogEntry,
  AuditLogEntryListSchema,
  Settings,
  SettingsSchema,
  SuccessResponse,
  SuccessResponseSchema,
  FlyerUploadResponse,
  FlyerUploadResponseSchema,
} from 'pyxis-types';
import { endpoints } from './endpoints';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

type CalendarHoldInput = Pick<CalendarHold, 'date' | 'label'>;
type CalendarBlockedInput = Pick<CalendarBlocked, 'date' | 'reason'>;
export type ShowLogStatus = 'needs-log' | 'logged' | 'incident';
export type ShowLogEntry = {
  showId: number;
  showLogId?: number;
  artist: string;
  date: string;
  genre?: string;
  showStatus: ShowStatus;
  showNotes?: string;
  draw?: number;
  postShowNotes?: string;
  quickHighlight?: string;
  totalDoorCents?: number;
  incident: boolean;
  incidentNotes?: string;
  loggedBy?: number;
  loggedByName?: string;
  loggedAt?: string;
  updatedAt?: string;
  logStatus: ShowLogStatus;
};
export type ShowLogList = { entries: ShowLogEntry[] };
export type ShowLogQuery = { status?: ShowLogStatus | 'all'; search?: string; limit?: number; offset?: number };
export type ShowLogUpdateInput = Pick<ShowLogEntry, 'showId' | 'draw' | 'postShowNotes' | 'quickHighlight' | 'totalDoorCents' | 'incident' | 'incidentNotes'>;
type FlyerUploadInput = { showId: number; file: File };
type BookingReviewInput = Pick<BookingReview, 'note' | 'decision'> & { submissionId: number };
type BookingUpdateInput = Pick<Submission, 'id' | 'artistName' | 'preferredDate' | 'genre' | 'expectedDraw' | 'links' | 'techRider' | 'message' | 'contactDiscord'> & Partial<Pick<Submission, 'status'>>;
type ArtistInput = Pick<Artist, 'name' | 'genre' | 'links' | 'notes'>;

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Session', 'Show', 'Booking', 'Artist', 'Calendar', 'ShowLog', 'AuditLog', 'Settings'],
  endpoints: (builder) => ({
    getSession: builder.query<AuthSession, void>({
      query: () => endpoints.session,
      transformResponse: (response: unknown) => fromJson(AuthSessionSchema, response as any),
      providesTags: ['Session'],
    }),

    logout: builder.mutation<SuccessResponse, void>({
      query: () => ({ url: endpoints.logout, method: 'POST' }),
      transformResponse: (response: unknown) => fromJson(SuccessResponseSchema, response as any),
      invalidatesTags: ['Session'],
    }),

    getShows: builder.query<AppShow[], void>({
      query: () => endpoints.shows,
      transformResponse: (response: unknown) => {
        const list = fromJson(ShowListSchema, response as any);
        return list.shows.map((show) => {
          const appShow = create(AppShowSchema, {
            id: show.id,
            artist: show.artist,
            date: show.date,
            doors: show.doorsTime,
            age: show.age,
            price: show.price,
            status: show.status,
            genre: show.genre,
            draw: show.draw,
            capacity: show.capacity,
            pinned: false,
            notes: show.notes,
            reserveTicketEnabled: show.reserveTicketEnabled,
          }) as AppShow & { flyerUrl?: string };
          // Staff list rows need flyer readiness even though the generated
          // AppShow view model does not yet carry it in protobuf. Assign after
          // create() because protobuf message construction drops unknown fields.
          appShow.flyerUrl = show.flyerUrl;
          return appShow;
        });
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

    createShow: builder.mutation<Show, Show>({
      query: (show) => ({ url: endpoints.shows, method: 'POST', body: toJson(ShowSchema, show) }),
      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
      invalidatesTags: [{ type: 'Show', id: 'LIST' }, 'AuditLog'],
    }),

    updateShow: builder.mutation<Show, Show>({
      query: (show) => ({ url: endpoints.show(show.id), method: 'PATCH', body: toJson(ShowSchema, show) }),
      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
      invalidatesTags: (_r, _e, show) => [{ type: 'Show', id: show.id }, { type: 'Show', id: 'LIST' }, 'AuditLog'],
    }),

    cancelShow: builder.mutation<Show, number>({
      query: (id) => ({ url: endpoints.showCancel(id), method: 'PATCH' }),
      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
      invalidatesTags: (_r, _e, id) => [{ type: 'Show', id }, { type: 'Show', id: 'LIST' }, 'AuditLog'],
    }),

    archiveShow: builder.mutation<SuccessResponse, number>({
      query: (id) => ({ url: endpoints.showArchive(id), method: 'PATCH' }),
      transformResponse: (response: unknown) => fromJson(SuccessResponseSchema, response as any),
      invalidatesTags: (_r, _e, id) => [{ type: 'Show', id }, { type: 'Show', id: 'LIST' }, 'AuditLog'],
    }),

    announceShow: builder.mutation<SuccessResponse, number>({
      query: (id) => ({ url: endpoints.showAnnounce(id), method: 'POST' }),
      transformResponse: (response: unknown) => fromJson(SuccessResponseSchema, response as any),
      invalidatesTags: ['AuditLog'],
    }),

    uploadShowFlyer: builder.mutation<FlyerUploadResponse, FlyerUploadInput>({
      query: ({ showId, file }) => {
        const body = new FormData();
        body.append('flyer', file);
        return { url: endpoints.showFlyer(showId), method: 'POST', body };
      },
      transformResponse: (response: unknown) => fromJson(FlyerUploadResponseSchema, response as any),
      invalidatesTags: (_r, _e, { showId }) => [{ type: 'Show', id: showId }, { type: 'Show', id: 'LIST' }],
    }),

    deleteShowFlyer: builder.mutation<void, { showId: number; filename: string }>({
      query: ({ showId, filename }) => ({ url: `${endpoints.showFlyer(showId)}?filename=${encodeURIComponent(filename)}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, { showId }) => [{ type: 'Show', id: showId }, { type: 'Show', id: 'LIST' }],
    }),

    getBookings: builder.query<Submission[], void>({
      query: () => endpoints.bookings,
      transformResponse: (response: unknown) => {
        const list = fromJson(SubmissionListSchema, response as any);
        return list.submissions;
      },
      providesTags: ['Booking'],
    }),

    updateBooking: builder.mutation<Submission, BookingUpdateInput>({
      query: (booking) => ({ url: endpoints.booking(booking.id), method: 'PATCH', body: toJson(SubmissionSchema, create(SubmissionSchema, booking)) }),
      transformResponse: (response: unknown) => fromJson(SubmissionSchema, response as any),
      invalidatesTags: ['Booking', 'AuditLog'],
    }),

    approveBooking: builder.mutation<Show, number>({
      query: (id) => ({ url: endpoints.bookingApprove(id), method: 'PATCH' }),
      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
      invalidatesTags: ['Booking', { type: 'Show', id: 'LIST' }, 'Artist', 'AuditLog'],
    }),

    declineBooking: builder.mutation<SuccessResponse, number>({
      query: (id) => ({ url: endpoints.bookingDecline(id), method: 'PATCH' }),
      transformResponse: (response: unknown) => fromJson(SuccessResponseSchema, response as any),
      invalidatesTags: ['Booking', 'AuditLog'],
    }),

    getBookingReview: builder.query<BookingReview, number>({
      query: endpoints.bookingReview,
      transformResponse: (response: unknown) => fromJson(BookingReviewSchema, response as any),
      providesTags: (_r, _e, id) => [{ type: 'Booking', id: `review-${id}` }],
    }),

    updateBookingReview: builder.mutation<BookingReview, BookingReviewInput>({
      query: ({ submissionId, ...review }) => ({ url: endpoints.bookingReview(submissionId), method: 'PATCH', body: toJson(BookingReviewSchema, create(BookingReviewSchema, { submissionId, ...review })) }),
      transformResponse: (response: unknown) => fromJson(BookingReviewSchema, response as any),
      invalidatesTags: (_r, _e, { submissionId }) => [{ type: 'Booking', id: `review-${submissionId}` }, 'AuditLog'],
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

    createArtist: builder.mutation<Artist, ArtistInput>({
      query: (artist) => ({ url: endpoints.artists, method: 'POST', body: toJson(ArtistSchema, create(ArtistSchema, artist)) }),
      transformResponse: (response: unknown) => fromJson(ArtistSchema, response as any),
      invalidatesTags: ['Artist', 'AuditLog'],
    }),

    updateArtist: builder.mutation<Artist, Artist>({
      query: (artist) => ({ url: endpoints.artist(artist.id), method: 'PATCH', body: toJson(ArtistSchema, artist) }),
      transformResponse: (response: unknown) => fromJson(ArtistSchema, response as any),
      invalidatesTags: (_r, _e, artist) => [{ type: 'Artist', id: artist.id }, 'Artist', 'AuditLog'],
    }),

    getCalendar: builder.query<CalendarEvent[], void>({
      query: () => endpoints.calendar,
      transformResponse: (response: unknown) => {
        const list = fromJson(CalendarEventListSchema, response as any);
        return list.events;
      },
      providesTags: ['Calendar'],
    }),

    createCalendarHold: builder.mutation<CalendarHold, CalendarHoldInput>({
      query: (body) => ({ url: endpoints.calendarHolds, method: 'POST', body }),
      transformResponse: (response: unknown) => fromJson(CalendarHoldSchema, response as any),
      invalidatesTags: ['Calendar', 'AuditLog'],
    }),

    deleteCalendarHold: builder.mutation<void, number>({
      query: (id) => ({ url: endpoints.calendarHold(id), method: 'DELETE' }),
      invalidatesTags: ['Calendar', 'AuditLog'],
    }),

    createCalendarBlocked: builder.mutation<CalendarBlocked, CalendarBlockedInput>({
      query: (body) => ({ url: endpoints.calendarBlocked, method: 'POST', body }),
      transformResponse: (response: unknown) => fromJson(CalendarBlockedSchema, response as any),
      invalidatesTags: ['Calendar', 'AuditLog'],
    }),

    deleteCalendarBlocked: builder.mutation<void, number>({
      query: (id) => ({ url: endpoints.calendarBlockedDay(id), method: 'DELETE' }),
      invalidatesTags: ['Calendar', 'AuditLog'],
    }),

    getShowLog: builder.query<ShowLogEntry[], ShowLogQuery | void>({
      query: (params) => ({ url: endpoints.showLog, params: params ? Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== 'all')) : undefined }),
      transformResponse: (response: ShowLogList) => response.entries,
      providesTags: ['ShowLog'],
    }),

    getShowLogEntry: builder.query<ShowLogEntry, number>({
      query: (showId) => endpoints.showLogShow(showId),
      providesTags: (_r, _e, showId) => [{ type: 'ShowLog', id: showId }],
    }),

    updateShowLog: builder.mutation<ShowLogEntry, ShowLogUpdateInput>({
      query: ({ showId, ...body }) => ({ url: endpoints.showLogShow(showId), method: 'PATCH', body }),
      invalidatesTags: ['ShowLog', 'AuditLog'],
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

    updateSettings: builder.mutation<Settings, Settings>({
      query: (settings) => ({ url: endpoints.settings, method: 'PATCH', body: settings }),
      transformResponse: (response: unknown) => fromJson(SettingsSchema, response as any),
      invalidatesTags: ['Settings', 'AuditLog'],
    }),
  }),
});

export const {
  useApproveBookingMutation,
  useArchiveShowMutation,
  useCancelShowMutation,
  useCreateCalendarBlockedMutation,
  useCreateCalendarHoldMutation,
  useCreateShowMutation,
  useCreateArtistMutation,
  useDeclineBookingMutation,
  useDeleteCalendarBlockedMutation,
  useDeleteCalendarHoldMutation,
  useDeleteShowFlyerMutation,
  useGetArtistQuery,
  useGetArtistsQuery,
  useGetAuditLogQuery,
  useGetBookingReviewQuery,
  useGetBookingsQuery,
  useGetCalendarQuery,
  useGetSessionQuery,
  useLogoutMutation,
  useGetSettingsQuery,
  useGetShowLogQuery,
  useGetShowLogEntryQuery,
  useGetShowQuery,
  useGetShowsQuery,
  useAnnounceShowMutation,
  useUpdateArtistMutation,
  useUpdateBookingMutation,
  useUpdateBookingReviewMutation,
  useUpdateSettingsMutation,
  useUpdateShowLogMutation,
  useUpdateShowMutation,
  useUploadShowFlyerMutation,
} = appApi;
