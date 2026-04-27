---
title: Evidence line references
docType: reference
ticket: PYXIS-STAFF-OPS-FUNDAMENTALS
topics: [pyxis, react, frontend, backend, protobuf, postgresql, staff-app]
status: active
intent: short-term
---

# Evidence line references

## web/packages/pyxis-app/src/pages/Pages.tsx
```
     1	import { Button, Field, Input, PyxisMark } from 'pyxis-components';
     2	import { useParams } from 'react-router-dom';
     3	import { create, AppShowSchema, ShowStatus, SubmissionStatus } from 'pyxis-types';
     4	import { useState, type ReactNode } from 'react';
     5	import {
     6	  useGetArtistsQuery,
     7	  useGetAttendanceQuery,
     8	  useGetAuditLogQuery,
     9	  useGetBookingsQuery,
    10	  useGetCalendarQuery,
    11	  useGetSettingsQuery,
    12	  useGetShowQuery,
    13	  useGetShowsQuery,
    14	  useAnnounceShowMutation,
    15	  useApproveBookingMutation,
    16	  useArchiveShowMutation,
    17	  useCancelShowMutation,
    18	  useCreateCalendarBlockedMutation,
    19	  useCreateCalendarHoldMutation,
    20	  useDeclineBookingMutation,
    21	  useUpdateAttendanceMutation,
    22	  useUpdateSettingsMutation,
    23	} from '../api/appApi';
    24	import { discordMappings as seedMappings } from '../api/mockData';
    25	import { AppShell } from '../components/shell/AppShell';
    26	import {
    27	  ArtistRoster,
    28	  AttendancePanel,
    29	  AuditLogPanel,
    30	  DashboardOverview,
    31	  DiscordMappingPanel,
    32	  NewShowModal,
    33	  Panel,
    34	  SettingsPanel,
    35	} from '../components/organisms/Panels';
    36	import {
    37	  BookingReviewDatePanel,
    38	  BookingReviewHero,
    39	  BookingReviewNotePanel,
    40	  BookingReviewRequestPanel,
    41	  BookingsInboxPanel,
    42	  BookingsInsightsPanel,
    43	  BookingsProcessedPanel,
    44	  CalendarBoard,
    45	  ShowDetailDiscordPanel,
    46	  ShowDetailHero,
    47	  ShowDetailInfoPanel,
    48	} from '../components/organisms/Phase8Sections';
    49	import { ShowsArchivedPanel, ShowsConfirmedPanel, ShowsFilterBar } from '../components/organisms/ShowsSections';
    50	import './pages.css';
    51	
    52	type PageStateProps = {
    53	  title: string;
    54	  message?: string;
    55	  action?: ReactNode;
    56	};
    57	
    58	function PageState({ title, message, action }: PageStateProps) {
    59	  return (
    60	    <Panel title={title} section="page-state">
    61	      <div className="app-page-state">
    62	        {message && <p>{message}</p>}
    63	        {action}
    64	      </div>
    65	    </Panel>
    66	  );
    67	}
    68	
    69	function LoadingState({ label = 'Loading real backend data…' }: { label?: string }) {
    70	  return <PageState title="Loading" message={label} />;
    71	}
    72	
    73	function ErrorState({ label = 'The real backend request failed. Check your session and backend logs.' }: { label?: string }) {
    74	  return <PageState title="Could not load data" message={label} />;
    75	}
    76	
    77	function EmptyState({ label = 'No records returned from the real backend yet.' }: { label?: string }) {
    78	  return <PageState title="Nothing here yet" message={label} />;
    79	}
    80	
    81	function ActionMessages({ error, success }: { error?: string; success?: string }) {
    82	  return <>{error && <div className="app-action-error" role="alert">{error}</div>}{success && <div className="app-action-success" role="status">{success}</div>}</>;
    83	}
    84	
    85	function parseRouteId(raw: string | undefined) {
    86	  if (!raw) return undefined;
    87	  const id = Number(raw);
    88	  return Number.isFinite(id) && id > 0 ? id : undefined;
    89	}
    90	
    91	function appShowFromShow(show: NonNullable<ReturnType<typeof useGetShowQuery>['data']>) {
    92	  return create(AppShowSchema, {
    93	    id: show.id,
    94	    artist: show.artist,
    95	    date: show.date,
    96	    doors: show.doorsTime,
    97	    age: show.age,
    98	    price: show.price,
    99	    status: show.status,
   100	    genre: show.genre,
   101	    draw: show.draw,
   102	    capacity: show.capacity,
   103	    pinned: false,
   104	    notes: show.notes,
   105	  });
   106	}
   107	
   108	export function DashboardPage() {
   109	  const showsQuery = useGetShowsQuery();
   110	  const bookingsQuery = useGetBookingsQuery();
   111	  const logQuery = useGetAuditLogQuery();
   112	
   113	  const isLoading = showsQuery.isLoading || bookingsQuery.isLoading || logQuery.isLoading;
   114	  const isError = showsQuery.isError || bookingsQuery.isError || logQuery.isError;
   115	
   116	  return (
   117	    <AppShell
   118	      page="dashboard"
   119	      title="Welcome back, Ada"
   120	      eyebrow="Home / Dashboard"
   121	      subtitle="Wednesday, April 23 · live operations data"
   122	    >
   123	      {isLoading ? (
   124	        <LoadingState />
   125	      ) : isError || !showsQuery.data || !bookingsQuery.data || !logQuery.data ? (
   126	        <ErrorState />
   127	      ) : (
   128	        <div data-section="dashboard-summary">
   129	          <DashboardOverview shows={showsQuery.data} bookings={bookingsQuery.data} log={logQuery.data} />
   130	        </div>
   131	      )}
   132	    </AppShell>
   133	  );
   134	}
   135	
   136	export function ShowsPage() {
   137	  const { data: shows, isLoading, isError } = useGetShowsQuery();
   138	  const confirmed = (shows ?? [])
   139	    .filter((show) => show.status === ShowStatus.CONFIRMED)
   140	    .sort((a, b) => a.date.localeCompare(b.date));
   141	  const archived = (shows ?? []).filter((show) => show.status === ShowStatus.ARCHIVED);
   142	
   143	  return (
   144	    <AppShell
   145	      page="shows"
   146	      title="Shows"
   147	      eyebrow="Home / Shows"
   148	      action={
   149	        <div className="app-topbar-actions">
   150	          <Button variant="outline" size="sm" iconLeft="filter" aria-label="Filter shows" />
   151	          <Button variant="outline" size="sm" iconLeft="search" aria-label="Search shows" />
   152	          <Button size="sm" iconLeft="plus">New show</Button>
   153	        </div>
   154	      }
   155	    >
   156	      {isLoading ? (
   157	        <LoadingState />
   158	      ) : isError || !shows ? (
   159	        <ErrorState />
   160	      ) : shows.length === 0 ? (
   161	        <EmptyState label="No shows returned from the real backend." />
   162	      ) : (
   163	        <>
   164	          <ShowsFilterBar confirmedCount={confirmed.length} />
   165	          <ShowsConfirmedPanel shows={confirmed} />
   166	          <div style={{ height: 20 }} />
   167	          <ShowsArchivedPanel shows={archived} />
   168	        </>
   169	      )}
   170	    </AppShell>
   171	  );
   172	}
   173	
   174	export function ShowDetailPage() {
   175	  const id = parseRouteId(useParams().id);
   176	  const { data: show, isLoading, isError } = useGetShowQuery(id ?? 0, { skip: id === undefined });
   177	  const [cancelShow, cancelState] = useCancelShowMutation();
   178	  const [archiveShow, archiveState] = useArchiveShowMutation();
   179	  const [announceShow, announceState] = useAnnounceShowMutation();
   180	  const [actionError, setActionError] = useState<string | undefined>();
   181	  const [actionSuccess, setActionSuccess] = useState<string | undefined>();
   182	
   183	  const handleCancelShow = async () => {
   184	    if (!id) return;
   185	    setActionError(undefined);
   186	    setActionSuccess(undefined);
   187	    try {
   188	      await cancelShow(id).unwrap();
   189	      setActionSuccess('Show cancelled.');
   190	    } catch {
   191	      setActionError('Could not cancel this show. Check your session and backend logs.');
   192	    }
   193	  };
   194	
   195	  const handleArchiveShow = async () => {
   196	    if (!id) return;
   197	    setActionError(undefined);
   198	    setActionSuccess(undefined);
   199	    try {
   200	      await archiveShow(id).unwrap();
   201	      setActionSuccess('Show archived.');
   202	    } catch {
   203	      setActionError('Could not archive this show. Check your session and backend logs.');
   204	    }
   205	  };
   206	
   207	  const handleAnnounceShow = async () => {
   208	    if (!id) return;
   209	    setActionError(undefined);
   210	    setActionSuccess(undefined);
   211	    try {
   212	      await announceShow(id).unwrap();
   213	      setActionSuccess('Announcement requested.');
   214	    } catch {
   215	      setActionError('Could not announce this show. Check your session and backend logs.');
   216	    }
   217	  };
   218	
   219	  return (
   220	    <AppShell
```

## web/packages/pyxis-app/src/api/appApi.ts
```
     1	import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
     2	import {
     3	  fromJson,
     4	  toJson,
     5	  create,
     6	  AuthSession,
     7	  AuthSessionSchema,
     8	  ShowListSchema,
     9	  Show,
    10	  ShowSchema,
    11	  AppShow,
    12	  AppShowSchema,
    13	  Submission,
    14	  SubmissionListSchema,
    15	  Artist,
    16	  ArtistListSchema,
    17	  ArtistSchema,
    18	  CalendarEvent,
    19	  CalendarEventListSchema,
    20	  CalendarHold,
    21	  CalendarHoldSchema,
    22	  CalendarBlocked,
    23	  CalendarBlockedSchema,
    24	  AttendanceLog,
    25	  AttendanceLogSchema,
    26	  AttendanceLogListSchema,
    27	  AuditLogEntry,
    28	  AuditLogEntryListSchema,
    29	  Settings,
    30	  SettingsSchema,
    31	  SuccessResponse,
    32	  SuccessResponseSchema,
    33	  FlyerUploadResponse,
    34	  FlyerUploadResponseSchema,
    35	} from 'pyxis-types';
    36	import { endpoints } from './endpoints';
    37	
    38	const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
    39	
    40	type CalendarHoldInput = Pick<CalendarHold, 'date' | 'label'>;
    41	type CalendarBlockedInput = Pick<CalendarBlocked, 'date' | 'reason'>;
    42	type AttendanceUpdateInput = Pick<AttendanceLog, 'showId' | 'draw' | 'notes' | 'incident' | 'incidentNotes'>;
    43	type FlyerUploadInput = { showId: number; file: File };
    44	
    45	export const appApi = createApi({
    46	  reducerPath: 'appApi',
    47	  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    48	  tagTypes: ['Session', 'Show', 'Booking', 'Artist', 'Calendar', 'Attendance', 'AuditLog', 'Settings'],
    49	  endpoints: (builder) => ({
    50	    getSession: builder.query<AuthSession, void>({
    51	      query: () => endpoints.session,
    52	      transformResponse: (response: unknown) => fromJson(AuthSessionSchema, response as any),
    53	      providesTags: ['Session'],
    54	    }),
    55	
    56	    getShows: builder.query<AppShow[], void>({
    57	      query: () => endpoints.shows,
    58	      transformResponse: (response: unknown) => {
    59	        const list = fromJson(ShowListSchema, response as any);
    60	        return list.shows.map((show) =>
    61	          create(AppShowSchema, {
    62	            id: show.id,
    63	            artist: show.artist,
    64	            date: show.date,
    65	            doors: show.doorsTime,
    66	            age: show.age,
    67	            price: show.price,
    68	            status: show.status,
    69	            genre: show.genre,
    70	            draw: show.draw,
    71	            capacity: show.capacity,
    72	            pinned: false,
    73	            notes: show.notes,
    74	          })
    75	        );
    76	      },
    77	      providesTags: (result) =>
    78	        result
    79	          ? [...result.map((s) => ({ type: 'Show' as const, id: s.id })), { type: 'Show' as const, id: 'LIST' }]
    80	          : [{ type: 'Show' as const, id: 'LIST' }],
    81	    }),
    82	
    83	    getShow: builder.query<Show, number>({
    84	      query: (id) => endpoints.show(id),
    85	      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
    86	      providesTags: (_r, _e, id) => [{ type: 'Show', id }],
    87	    }),
    88	
    89	    createShow: builder.mutation<Show, Show>({
    90	      query: (show) => ({ url: endpoints.shows, method: 'POST', body: toJson(ShowSchema, show) }),
    91	      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
    92	      invalidatesTags: [{ type: 'Show', id: 'LIST' }, 'AuditLog'],
    93	    }),
    94	
    95	    updateShow: builder.mutation<Show, Show>({
    96	      query: (show) => ({ url: endpoints.show(show.id), method: 'PATCH', body: toJson(ShowSchema, show) }),
    97	      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
    98	      invalidatesTags: (_r, _e, show) => [{ type: 'Show', id: show.id }, { type: 'Show', id: 'LIST' }, 'AuditLog'],
    99	    }),
   100	
   101	    cancelShow: builder.mutation<Show, number>({
   102	      query: (id) => ({ url: endpoints.showCancel(id), method: 'PATCH' }),
   103	      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
   104	      invalidatesTags: (_r, _e, id) => [{ type: 'Show', id }, { type: 'Show', id: 'LIST' }, 'AuditLog'],
   105	    }),
   106	
   107	    archiveShow: builder.mutation<SuccessResponse, number>({
   108	      query: (id) => ({ url: endpoints.showArchive(id), method: 'PATCH' }),
   109	      transformResponse: (response: unknown) => fromJson(SuccessResponseSchema, response as any),
   110	      invalidatesTags: (_r, _e, id) => [{ type: 'Show', id }, { type: 'Show', id: 'LIST' }, 'AuditLog'],
   111	    }),
   112	
   113	    announceShow: builder.mutation<SuccessResponse, number>({
   114	      query: (id) => ({ url: endpoints.showAnnounce(id), method: 'POST' }),
   115	      transformResponse: (response: unknown) => fromJson(SuccessResponseSchema, response as any),
   116	      invalidatesTags: ['AuditLog'],
   117	    }),
   118	
   119	    uploadShowFlyer: builder.mutation<FlyerUploadResponse, FlyerUploadInput>({
   120	      query: ({ showId, file }) => {
   121	        const body = new FormData();
   122	        body.append('flyer', file);
   123	        return { url: endpoints.showFlyer(showId), method: 'POST', body };
   124	      },
   125	      transformResponse: (response: unknown) => fromJson(FlyerUploadResponseSchema, response as any),
   126	      invalidatesTags: (_r, _e, { showId }) => [{ type: 'Show', id: showId }, { type: 'Show', id: 'LIST' }],
   127	    }),
   128	
   129	    deleteShowFlyer: builder.mutation<void, { showId: number; filename: string }>({
   130	      query: ({ showId, filename }) => ({ url: `${endpoints.showFlyer(showId)}?filename=${encodeURIComponent(filename)}`, method: 'DELETE' }),
   131	      invalidatesTags: (_r, _e, { showId }) => [{ type: 'Show', id: showId }, { type: 'Show', id: 'LIST' }],
   132	    }),
   133	
   134	    getBookings: builder.query<Submission[], void>({
   135	      query: () => endpoints.bookings,
   136	      transformResponse: (response: unknown) => {
   137	        const list = fromJson(SubmissionListSchema, response as any);
   138	        return list.submissions;
   139	      },
   140	      providesTags: ['Booking'],
   141	    }),
   142	
   143	    approveBooking: builder.mutation<Show, number>({
   144	      query: (id) => ({ url: endpoints.bookingApprove(id), method: 'PATCH' }),
   145	      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
   146	      invalidatesTags: ['Booking', { type: 'Show', id: 'LIST' }, 'Artist', 'AuditLog'],
   147	    }),
   148	
   149	    declineBooking: builder.mutation<SuccessResponse, number>({
   150	      query: (id) => ({ url: endpoints.bookingDecline(id), method: 'PATCH' }),
   151	      transformResponse: (response: unknown) => fromJson(SuccessResponseSchema, response as any),
   152	      invalidatesTags: ['Booking', 'AuditLog'],
   153	    }),
   154	
   155	    getArtists: builder.query<Artist[], void>({
   156	      query: () => endpoints.artists,
   157	      transformResponse: (response: unknown) => {
   158	        const list = fromJson(ArtistListSchema, response as any);
   159	        return list.artists;
   160	      },
   161	      providesTags: ['Artist'],
   162	    }),
   163	
   164	    getArtist: builder.query<Artist, number>({
   165	      query: endpoints.artist,
   166	      transformResponse: (response: unknown) => fromJson(ArtistSchema, response as any),
   167	      providesTags: (_r, _e, id) => [{ type: 'Artist', id }],
   168	    }),
   169	
   170	    updateArtist: builder.mutation<Artist, Artist>({
   171	      query: (artist) => ({ url: endpoints.artist(artist.id), method: 'PATCH', body: artist }),
   172	      transformResponse: (response: unknown) => fromJson(ArtistSchema, response as any),
   173	      invalidatesTags: (_r, _e, artist) => [{ type: 'Artist', id: artist.id }, 'Artist', 'AuditLog'],
   174	    }),
   175	
   176	    getCalendar: builder.query<CalendarEvent[], void>({
   177	      query: () => endpoints.calendar,
   178	      transformResponse: (response: unknown) => {
   179	        const list = fromJson(CalendarEventListSchema, response as any);
   180	        return list.events;
   181	      },
   182	      providesTags: ['Calendar'],
   183	    }),
   184	
   185	    createCalendarHold: builder.mutation<CalendarHold, CalendarHoldInput>({
   186	      query: (body) => ({ url: endpoints.calendarHolds, method: 'POST', body }),
   187	      transformResponse: (response: unknown) => fromJson(CalendarHoldSchema, response as any),
   188	      invalidatesTags: ['Calendar', 'AuditLog'],
   189	    }),
   190	
   191	    deleteCalendarHold: builder.mutation<void, number>({
   192	      query: (id) => ({ url: endpoints.calendarHold(id), method: 'DELETE' }),
   193	      invalidatesTags: ['Calendar', 'AuditLog'],
   194	    }),
   195	
   196	    createCalendarBlocked: builder.mutation<CalendarBlocked, CalendarBlockedInput>({
   197	      query: (body) => ({ url: endpoints.calendarBlocked, method: 'POST', body }),
   198	      transformResponse: (response: unknown) => fromJson(CalendarBlockedSchema, response as any),
   199	      invalidatesTags: ['Calendar', 'AuditLog'],
   200	    }),
   201	
   202	    deleteCalendarBlocked: builder.mutation<void, number>({
   203	      query: (id) => ({ url: endpoints.calendarBlockedDay(id), method: 'DELETE' }),
   204	      invalidatesTags: ['Calendar', 'AuditLog'],
   205	    }),
   206	
   207	    getAttendance: builder.query<AttendanceLog[], void>({
   208	      query: () => endpoints.attendance,
   209	      transformResponse: (response: unknown) => {
   210	        const list = fromJson(AttendanceLogListSchema, response as any);
   211	        return list.logs;
   212	      },
   213	      providesTags: ['Attendance'],
   214	    }),
   215	
   216	    updateAttendance: builder.mutation<AttendanceLog, AttendanceUpdateInput>({
   217	      query: ({ showId, ...body }) => ({ url: endpoints.attendanceShow(showId), method: 'PATCH', body }),
   218	      transformResponse: (response: unknown) => fromJson(AttendanceLogSchema, response as any),
   219	      invalidatesTags: ['Attendance', 'AuditLog'],
   220	    }),
```

## web/packages/pyxis-app/src/api/endpoints.ts
```
     1	export const endpoints = {
     2	  session: '/api/app/session',
     3	  shows: '/api/app/shows',
     4	  show: (id: number) => `/api/app/shows/${id}`,
     5	  showCancel: (id: number) => `/api/app/shows/${id}/cancel`,
     6	  showArchive: (id: number) => `/api/app/shows/${id}/archive`,
     7	  showAnnounce: (id: number) => `/api/app/shows/${id}/announce`,
     8	  showFlyer: (id: number) => `/api/app/shows/${id}/flyer`,
     9	  bookings: '/api/app/bookings',
    10	  booking: (id: number) => `/api/app/bookings/${id}`,
    11	  bookingApprove: (id: number) => `/api/app/bookings/${id}/approve`,
    12	  bookingDecline: (id: number) => `/api/app/bookings/${id}/decline`,
    13	  artists: '/api/app/artists',
    14	  artist: (id: number) => `/api/app/artists/${id}`,
    15	  calendar: '/api/app/calendar',
    16	  calendarHolds: '/api/app/calendar/holds',
    17	  calendarHold: (id: number) => `/api/app/calendar/holds/${id}`,
    18	  calendarBlocked: '/api/app/calendar/blocked',
    19	  calendarBlockedDay: (id: number) => `/api/app/calendar/blocked/${id}`,
    20	  attendance: '/api/app/attendance',
    21	  attendanceShow: (showId: number) => `/api/app/attendance/${showId}`,
    22	  auditLog: '/api/app/audit-log',
    23	  discord: '/api/app/discord',
    24	  settings: '/api/app/settings',
    25	} as const;
```

## web/packages/pyxis-app/src/components/organisms/ShowDetailHero/ShowDetailHero.tsx
```
     1	import { AppShow } from 'pyxis-types';
     2	import { StatusDot, statusToLabel } from '../../atoms/StatusDot';
     3	import './ShowDetailHero.css';
     4	
     5	export type ShowDetailHeroProps = {
     6	  show: AppShow;
     7	  dateLabel?: string;
     8	};
     9	
    10	export function ShowDetailHero({ show, dateLabel = 'Fri, May 2, 2025' }: ShowDetailHeroProps) {
    11	  return (
    12	    <section className="app-detail-hero" data-section="show-detail-hero">
    13	      <div>
    14	        <span className="app-row-status"><StatusDot status={show.status} />{statusToLabel(show.status)}</span>
    15	        <h1>{show.artist}</h1>
    16	        <p>{dateLabel} · Doors {show.doors} · {show.age}</p>
    17	      </div>
    18	      <div className="app-poster-placeholder">poster · 1080×1080</div>
    19	    </section>
    20	  );
    21	}
```

## web/packages/pyxis-app/src/components/organisms/AttendancePanel/AttendancePanel.tsx
```
     1	import type { AttendanceLog } from 'pyxis-types';
     2	import { AttendanceStat } from '../../molecules/AttendanceStat';
     3	import { appPart } from '../../parts';
     4	import '../../molecules/BookingCard/BookingCard.css';
     5	import '../DashboardMetricsGrid/DashboardMetricsGrid.css';
     6	import './AttendancePanel.css';
     7	import { AppEmptyState } from '../../molecules/AppEmptyState';
     8	
     9	export type AttendancePanelProps = {
    10	  entries: AttendanceLog[];
    11	  onUpdateEntry?: (entry: AttendanceLog) => void;
    12	  isUpdating?: boolean;
    13	};
    14	
    15	export function AttendancePanel({ entries, onUpdateEntry, isUpdating }: AttendancePanelProps) {
    16	  const logged = entries.filter((entry) => entry.draw !== undefined && entry.draw > 0);
    17	  const avg = Math.round(logged.reduce((total, entry) => total + (entry.draw ?? 0), 0) / Math.max(logged.length, 1));
    18	  return <div {...appPart('attendance-panel')}><div className="app-metrics-grid compact"><AttendanceStat label="Logged" value={logged.length}/><AttendanceStat label="Needs log" value={entries.length-logged.length}/><AttendanceStat label="Average draw" value={avg}/></div>{entries.length > 0 ? <div className="app-card-list">{entries.map((entry)=><article className="app-booking-card" key={entry.id}><h3>{entry.artist}</h3><p>{entry.date} · {entry.draw !== undefined && entry.draw > 0 ? `${entry.draw} attendees` : 'needs report'}</p><small>{entry.notes ?? 'No notes yet.'}</small>{onUpdateEntry && <button className="app-inline-action" type="button" disabled={isUpdating} onClick={() => onUpdateEntry(entry)}>{entry.draw > 0 ? 'Save note' : 'Mark logged'}</button>}</article>)}</div> : <AppEmptyState title="No attendance reports yet." />}</div>;
    19	}
```

## web/packages/pyxis-app/src/components/organisms/SettingsPanel/SettingsPanel.tsx
```
     1	import type { Settings } from 'pyxis-types';
     2	import { SettingsToggleRow } from '../../molecules/SettingsToggleRow';
     3	import { appPart } from '../../parts';
     4	import './SettingsPanel.css';
     5	
     6	export type SettingsPanelProps = {
     7	  settings: Settings;
     8	  onToggleAutoArchive?: () => void;
     9	  onToggleDiscordPosting?: () => void;
    10	  onToggleSafeSpaceRequired?: () => void;
    11	  isUpdating?: boolean;
    12	};
    13	
    14	export function SettingsPanel({ settings, onToggleAutoArchive, onToggleDiscordPosting, onToggleSafeSpaceRequired, isUpdating }: SettingsPanelProps) {
    15	  return <div {...appPart('settings-panel')}><div className="app-settings-summary"><strong>{settings.spaceName}</strong><span>{settings.address} · {settings.capacity} cap · {settings.timezone || 'UTC'}</span></div><SettingsToggleRow label="Auto archive past shows" description="Move completed shows to archive after their date." enabled={settings.autoArchive} onToggle={onToggleAutoArchive} disabled={isUpdating}/><SettingsToggleRow label="Discord posting" description="Post approved events and booking activity to mapped channels." enabled={settings.discordPosting} onToggle={onToggleDiscordPosting} disabled={isUpdating}/><SettingsToggleRow label="Safer-space agreement" description="Require agreement text before confirming public bookings." enabled={settings.safeSpaceRequired} onToggle={onToggleSafeSpaceRequired} disabled={isUpdating}/></div>;
    16	}
```

## web/packages/pyxis-app/src/components/organisms/ArtistRoster/ArtistRoster.tsx
```
     1	import type { Artist } from 'pyxis-types';
     2	import { ArtistCard, ArtistRosterRow } from '../../molecules/ArtistCard';
     3	import { appPart } from '../../parts';
     4	import '../../molecules/Table/Table.css';
     5	import './ArtistRoster.css';
     6	import { AppEmptyState } from '../../molecules/AppEmptyState';
     7	
     8	export type ArtistRosterProps = {
     9	  artists: Artist[];
    10	};
    11	
    12	export function ArtistRoster({ artists }: ArtistRosterProps) { return <div {...appPart('artist-roster')}>{artists.length > 0 ? <><div className="app-card-list app-mobile-only">{artists.map((artist)=><ArtistCard key={artist.id} artist={artist}/>)}</div><div className="app-table-wrap app-desktop-only"><table className="app-table"><thead><tr><th>Artist</th><th>Genre</th><th>Shows</th><th>Avg draw</th><th>Last show</th><th>Notes</th></tr></thead><tbody>{artists.map((artist)=><ArtistRosterRow key={artist.id} artist={artist}/>)}</tbody></table></div></> : <AppEmptyState title="No artists in the roster yet." />}</div>; }
```

## web/packages/pyxis-app/src/components/molecules/ArtistCard/ArtistCard.tsx
```
     1	import type { Artist } from 'pyxis-types';
     2	import { Avatar } from 'pyxis-components';
     3	import { appPart } from '../../parts';
     4	import '../Table/Table.css';
     5	import './ArtistCard.css';
     6	
     7	export type ArtistCardProps = {
     8	  artist: Artist;
     9	};
    10	
    11	export type ArtistRosterRowProps = {
    12	  artist: Artist;
    13	};
    14	
    15	export function ArtistCard({ artist }: ArtistCardProps) { return <article className="app-artist-card" {...appPart('artist-card')}><Avatar className="app-avatar" name={artist.name} size="md"/><div><h3>{artist.name}</h3><p>{artist.genre} · {artist.links}</p><small>{artist.links}</small></div></article>; }
    16	export function ArtistRosterRow({ artist }: ArtistRosterRowProps) { return <tr className="app-table-row" {...appPart('artist-roster-row')}><td><strong>{artist.name}</strong><span>{artist.links}</span></td><td>{artist.genre}</td><td>—</td><td>—</td><td>—</td><td>{artist.notes}</td></tr>; }
```

## pkg/server/app.go
```
     1	package server
     2	
     3	import (
     4		"encoding/json"
     5		"fmt"
     6		"io"
     7		"net/http"
     8		"strconv"
     9		"time"
    10	
    11		"github.com/go-go-golems/pyxis/gen/proto/proto/pyxis/v1"
    12		"github.com/go-go-golems/pyxis/pkg/domain"
    13		"google.golang.org/protobuf/encoding/protojson"
    14	)
    15	
    16	func (s *Server) handleListAppShows(w http.ResponseWriter, r *http.Request) {
    17		ctx := r.Context()
    18	
    19		shows, err := s.showService.ListAll(ctx)
    20		if err != nil {
    21			respondError(w, err)
    22			return
    23		}
    24	
    25		pbShows := make([]*pyxisv1.AppShow, len(shows))
    26		for i, show := range shows {
    27			pbShows[i] = domainShowToAppShow(&show)
    28		}
    29	
    30		// Respond with Show proto (frontend can handle both public and staff views)
    31		pbShows2 := make([]*pyxisv1.Show, len(shows))
    32		for i, show := range shows {
    33			pbShows2[i] = showToProto(&show)
    34		}
    35		respondProtoJSON(w, http.StatusOK, &pyxisv1.ShowList{Shows: pbShows2})
    36	}
    37	
    38	func (s *Server) handleCreateShow(w http.ResponseWriter, r *http.Request) {
    39		ctx := r.Context()
    40		user := s.userFromContext(ctx)
    41		if user == nil {
    42			respondError(w, fmt.Errorf("unauthenticated"))
    43			return
    44		}
    45	
    46		body, err := io.ReadAll(r.Body)
    47		if err != nil {
    48			respondError(w, fmt.Errorf("read body: %w", err))
    49			return
    50		}
    51	
    52		var req pyxisv1.Show
    53		if err := protojson.Unmarshal(body, &req); err != nil {
    54			respondError(w, fmt.Errorf("invalid request body: %w", err))
    55			return
    56		}
    57	
    58		show := protoToDomainShow(&req)
    59		actorID := int(user.ID)
    60		actorName := user.DiscordUsername
    61	
    62		created, err := s.showService.Create(ctx, show, actorID, actorName)
    63		if err != nil {
    64			respondError(w, err)
    65			return
    66		}
    67	
    68		respondProtoJSON(w, http.StatusCreated, showToProto(created))
    69	}
    70	
    71	func (s *Server) handleUpdateShow(w http.ResponseWriter, r *http.Request) {
    72		ctx := r.Context()
    73		user := s.userFromContext(ctx)
    74		if user == nil {
    75			respondError(w, fmt.Errorf("unauthenticated"))
    76			return
    77		}
    78	
    79		idStr := r.PathValue("id")
    80		id, err := strconv.Atoi(idStr)
    81		if err != nil {
    82			respondError(w, fmt.Errorf("invalid show ID: %w", err))
    83			return
    84		}
    85	
    86		body, err := io.ReadAll(r.Body)
    87		if err != nil {
    88			respondError(w, fmt.Errorf("read body: %w", err))
    89			return
    90		}
    91	
    92		var req pyxisv1.Show
    93		if err := protojson.Unmarshal(body, &req); err != nil {
    94			respondError(w, fmt.Errorf("invalid request body: %w", err))
    95			return
    96		}
    97	
    98		show := protoToDomainShow(&req)
    99		show.ID = id
   100		actorID := int(user.ID)
   101		actorName := user.DiscordUsername
   102	
   103		updated, err := s.showService.Update(ctx, show, actorID, actorName)
   104		if err != nil {
   105			respondError(w, err)
   106			return
   107		}
   108	
   109		respondProtoJSON(w, http.StatusOK, showToProto(updated))
   110	}
   111	
   112	func (s *Server) handleCancelShow(w http.ResponseWriter, r *http.Request) {
   113		ctx := r.Context()
   114		user := s.userFromContext(ctx)
   115		if user == nil {
   116			respondError(w, fmt.Errorf("unauthenticated"))
   117			return
   118		}
   119	
   120		idStr := r.PathValue("id")
   121		id, err := strconv.Atoi(idStr)
   122		if err != nil {
   123			respondError(w, fmt.Errorf("invalid show ID: %w", err))
   124			return
   125		}
   126	
   127		actorID := int(user.ID)
   128		actorName := user.DiscordUsername
   129	
   130		updated, err := s.showService.Cancel(ctx, id, actorID, actorName)
   131		if err != nil {
   132			respondError(w, err)
   133			return
   134		}
   135	
   136		respondProtoJSON(w, http.StatusOK, showToProto(updated))
   137	}
   138	
   139	func (s *Server) handleArchiveShow(w http.ResponseWriter, r *http.Request) {
   140		ctx := r.Context()
   141		user := s.userFromContext(ctx)
   142		if user == nil {
   143			respondError(w, fmt.Errorf("unauthenticated"))
   144			return
   145		}
   146	
   147		idStr := r.PathValue("id")
   148		id, err := strconv.Atoi(idStr)
   149		if err != nil {
   150			respondError(w, fmt.Errorf("invalid show ID: %w", err))
   151			return
   152		}
   153	
   154		actorID := int(user.ID)
   155		actorName := user.DiscordUsername
   156	
   157		if err := s.showService.Archive(ctx, id, actorID, actorName); err != nil {
   158			respondError(w, err)
   159			return
   160		}
   161	
   162		respondProtoJSON(w, http.StatusOK, &pyxisv1.SuccessResponse{Success: true})
   163	}
   164	
   165	func protoToDomainShow(pb *pyxisv1.Show) *domain.Show {
   166		show := &domain.Show{
   167			Artist:      pb.Artist,
   168			DoorsTime:   pb.DoorsTime,
   169			StartTime:   pb.StartTime,
   170			Age:         pb.Age,
   171			Price:       pb.Price,
   172			Genre:       pb.Genre,
   173			Description: pb.Description,
   174			Notes:       pb.Notes,
   175			FlyerURL:    pb.FlyerUrl,
   176			Draw:        int(pb.Draw),
   177			Capacity:    int(pb.Capacity),
   178			Status:      pb.Status.String(),
   179		}
   180		if pb.Date != "" {
   181			t, _ := time.Parse(time.DateOnly, pb.Date)
   182			show.Date = t
   183		}
   184		if pb.SubmissionId > 0 {
   185			v := int(pb.SubmissionId)
   186			show.SubmissionID = &v
   187		}
   188		if pb.ArtistId > 0 {
   189			v := int(pb.ArtistId)
   190			show.ArtistID = &v
   191		}
   192		return show
   193	}
   194	
   195	func domainShowToAppShow(show *domain.Show) *pyxisv1.AppShow {
   196		return &pyxisv1.AppShow{
   197			Id:     int32(show.ID),
   198			Artist: show.Artist,
   199			Date:   show.Date.Format(time.DateOnly),
   200			Doors:  show.DoorsTime,
   201			Age:    show.Age,
   202			Price:  show.Price,
   203			Status: showStatusFromString(show.Status),
   204			Genre:  show.Genre,
   205		}
   206	}
   207	
   208	func (s *Server) handleListBookings(w http.ResponseWriter, r *http.Request) {
   209		ctx := r.Context()
   210		status := r.URL.Query().Get("status")
   211	
   212		subs, err := s.submissionService.List(ctx, status)
   213		if err != nil {
   214			respondError(w, err)
   215			return
   216		}
   217	
   218		pbSubs := make([]*pyxisv1.Submission, len(subs))
   219		for i, sub := range subs {
   220			pbSubs[i] = submissionToProto(&sub)
```

## proto/pyxis/v1/show.proto
```
     1	syntax = "proto3";
     2	
     3	package pyxis.v1;
     4	
     5	option go_package = "github.com/go-go-golems/pyxis/gen/proto/pyxis/v1;pyxisv1";
     6	
     7	enum ShowStatus {
     8	  SHOW_STATUS_UNSPECIFIED = 0;
     9	  SHOW_STATUS_CONFIRMED   = 1;
    10	  SHOW_STATUS_CANCELLED   = 2;
    11	  SHOW_STATUS_ARCHIVED    = 3;
    12	  SHOW_STATUS_DRAFT       = 4;
    13	  SHOW_STATUS_HOLD        = 5;
    14	  SHOW_STATUS_BLOCKED     = 6;
    15	}
    16	
    17	enum SubmissionStatus {
    18	  SUBMISSION_STATUS_UNSPECIFIED = 0;
    19	  SUBMISSION_STATUS_PENDING     = 1;
    20	  SUBMISSION_STATUS_APPROVED    = 2;
    21	  SUBMISSION_STATUS_DECLINED    = 3;
    22	  SUBMISSION_STATUS_HOLD        = 4;
    23	  SUBMISSION_STATUS_CANCELLED   = 5;
    24	}
    25	
    26	message Show {
    27	  int32  id            = 1;
    28	  string artist        = 2;
    29	  string date          = 3;
    30	  string doors_time    = 4;
    31	  string start_time    = 5;
    32	  string age           = 6;
    33	  string price         = 7;
    34	  string genre         = 8;
    35	  string description   = 9;
    36	  string notes         = 17;
    37	  repeated LineupEntry lineup = 10;
    38	  string flyer_url     = 11;
    39	  int32  draw          = 18;
    40	  int32  capacity      = 19;
    41	  ShowStatus status    = 12;
    42	  int32  submission_id = 13;
    43	  int32  artist_id     = 14;
    44	  string created_at    = 15;
    45	  string updated_at    = 16;
    46	
    47	  message LineupEntry {
    48	    string artist     = 1;
    49	    string role       = 2;
    50	    string start_time = 3;
    51	    string end_time   = 4;
    52	  }
    53	}
    54	
    55	message AppShow {
    56	  int32  id       = 1;
    57	  string artist   = 2;
    58	  string date     = 3;
    59	  string doors    = 4;
    60	  string age      = 5;
    61	  string price    = 6;
    62	  ShowStatus status = 7;
    63	  string genre    = 8;
    64	  int32  draw     = 9;
    65	  int32  capacity = 10;
    66	  bool   pinned   = 11;
    67	  string notes    = 12;
    68	}
    69	
    70	message ArchivedShow {
    71	  int32  id     = 1;
    72	  string artist = 2;
    73	  string date   = 3;
    74	  string genre  = 4;
    75	  int32  draw   = 5;
    76	}
    77	
    78	message ArchiveStats {
    79	  int32 total_shows      = 1;
    80	  int32 total_attendance = 2;
    81	  int32 years_running    = 3;
    82	  int32 unique_artists   = 4;
    83	}
    84	
    85	message BookingFormData {
    86	  string artist_name     = 1;
    87	  string genre           = 2;
    88	  string preferred_date  = 3;
    89	  int32  expected_draw   = 4;
    90	  string links           = 5;
    91	  string tech_rider      = 6;
    92	  string message         = 7;
    93	}
    94	
    95	message ShowList {
    96	  repeated Show shows = 1;
    97	}
    98	
    99	message ArchivedShowList {
   100	  repeated ArchivedShow shows = 1;
   101	}
   102	
   103	message BookingConfirmation {
   104	  bool  success       = 1;
   105	  int32 submission_id = 2;
   106	}
   107	
   108	message Submission {
   109	  int32  id             = 1;
   110	  int32  artist_id      = 2;
   111	  string artist_name    = 3;
   112	  string preferred_date = 4;
   113	  string genre          = 5;
   114	  int32  expected_draw  = 6;
   115	  string links          = 7;
   116	  string tech_rider     = 8;
   117	  string message        = 9;
   118	  string contact_discord = 10;
   119	  SubmissionStatus status = 11;
   120	  int32  reviewed_by    = 12;
   121	  string reviewed_at    = 13;
   122	  string created_at     = 14;
   123	}
   124	
   125	message SubmissionList {
   126	  repeated Submission submissions = 1;
   127	}
   128	
   129	message User {
   130	  int32  id              = 1;
   131	  string discord_id      = 2;
   132	  string discord_username = 3;
   133	  string avatar_url      = 4;
   134	  string role            = 5;
   135	  string created_at      = 6;
   136	  string last_login_at   = 7;
   137	}
   138	
   139	message AuthSession {
   140	  bool   authenticated = 1;
   141	  User   user          = 2;
   142	  string space_name    = 3;
   143	}
   144	
   145	message Artist {
   146	  int32  id         = 1;
   147	  string name       = 2;
   148	  string genre      = 3;
   149	  string links      = 4;
   150	  string notes      = 5;
   151	  string created_at = 6;
   152	  string updated_at = 7;
   153	}
   154	
   155	message ArtistList {
   156	  repeated Artist artists = 1;
   157	}
   158	
   159	message CalendarHold {
   160	  int32  id         = 1;
   161	  string date       = 2;
   162	  string label      = 3;
   163	}
   164	
   165	message CalendarBlocked {
   166	  int32  id     = 1;
   167	  string date   = 2;
   168	  string reason = 3;
   169	}
   170	
   171	enum CalendarEventKind {
   172	  CALENDAR_EVENT_KIND_UNSPECIFIED = 0;
   173	  CALENDAR_EVENT_KIND_SHOW        = 1;
   174	  CALENDAR_EVENT_KIND_HOLD        = 2;
   175	  CALENDAR_EVENT_KIND_BLOCKED     = 3;
   176	}
   177	
   178	message CalendarEvent {
   179	  int32             id      = 1;
   180	  string            date    = 2;
   181	  string            label   = 3;
   182	  ShowStatus        status  = 4;
   183	  CalendarEventKind kind    = 5;
   184	}
   185	
   186	message CalendarEventList {
   187	  repeated CalendarEvent events = 1;
   188	}
   189	
   190	message CalendarResponse {
   191	  repeated CalendarHold    holds   = 1;
   192	  repeated CalendarBlocked blocked = 2;
   193	}
   194	
   195	message AttendanceLog {
   196	  int32  id             = 1;
   197	  int32  show_id        = 2;
   198	  string artist         = 3;
   199	  string date           = 4;
   200	  int32  draw           = 5;
   201	  string notes          = 6;
   202	  bool   incident       = 7;
   203	  string incident_notes = 8;
   204	  int32  logged_by      = 9;
   205	  string created_at     = 10;
   206	  string updated_at     = 11;
   207	}
   208	
   209	message AttendanceLogList {
   210	  repeated AttendanceLog logs = 1;
   211	}
   212	
   213	message AuditLogEntry {
   214	  int32  id          = 1;
   215	  string actor       = 2;
   216	  int32  actor_id    = 3;
   217	  string action      = 4;
   218	  string entity_type = 5;
   219	  int32  entity_id   = 6;
   220	  string metadata    = 7;
```

## pkg/db/migrations/000001_init.up.sql
```
     1	CREATE TABLE users (
     2	    id               SERIAL PRIMARY KEY,
     3	    discord_id       TEXT NOT NULL UNIQUE,
     4	    discord_username TEXT NOT NULL,
     5	    avatar_url       TEXT,
     6	    role             TEXT NOT NULL DEFAULT 'staff',
     7	    created_at       TIMESTAMPTZ DEFAULT NOW(),
     8	    last_login_at    TIMESTAMPTZ
     9	);
    10	
    11	CREATE TABLE artists (
    12	    id         SERIAL PRIMARY KEY,
    13	    name       TEXT NOT NULL,
    14	    genre      TEXT,
    15	    links      TEXT,
    16	    notes      TEXT,
    17	    created_at TIMESTAMPTZ DEFAULT NOW(),
    18	    updated_at TIMESTAMPTZ DEFAULT NOW()
    19	);
    20	
    21	CREATE TABLE submissions (
    22	    id              SERIAL PRIMARY KEY,
    23	    artist_id       INT REFERENCES artists(id) ON DELETE SET NULL,
    24	    artist_name     TEXT NOT NULL,
    25	    preferred_date  DATE,
    26	    genre           TEXT,
    27	    expected_draw   INT,
    28	    links           TEXT,
    29	    tech_rider      TEXT,
    30	    message         TEXT,
    31	    contact_discord TEXT,
    32	    status          TEXT NOT NULL DEFAULT 'pending',
    33	    reviewed_by     INT REFERENCES users(id) ON DELETE SET NULL,
    34	    reviewed_at     TIMESTAMPTZ,
    35	    created_at      TIMESTAMPTZ DEFAULT NOW()
    36	);
    37	CREATE INDEX idx_submissions_status ON submissions(status);
    38	
    39	CREATE TABLE shows (
    40	    id                 SERIAL PRIMARY KEY,
    41	    artist             TEXT NOT NULL,
    42	    date               DATE NOT NULL,
    43	    doors_time         TEXT,
    44	    start_time         TEXT,
    45	    age                TEXT,
    46	    price              TEXT,
    47	    genre              TEXT,
    48	    description        TEXT,
    49	    notes              TEXT,
    50	    status             TEXT NOT NULL DEFAULT 'confirmed',
    51	    flyer_url          TEXT,
    52	    discord_message_id TEXT,
    53	    discord_channel_id TEXT,
    54	    submission_id      INT REFERENCES submissions(id) ON DELETE SET NULL,
    55	    artist_id          INT REFERENCES artists(id) ON DELETE SET NULL,
    56	    created_by         INT REFERENCES users(id) ON DELETE SET NULL,
    57	    created_at         TIMESTAMPTZ DEFAULT NOW(),
    58	    updated_at         TIMESTAMPTZ DEFAULT NOW()
    59	);
    60	CREATE INDEX idx_shows_status ON shows(status);
    61	CREATE INDEX idx_shows_date   ON shows(date);
    62	
    63	CREATE TABLE show_lineup (
    64	    id         SERIAL PRIMARY KEY,
    65	    show_id    INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    66	    artist     TEXT NOT NULL,
    67	    role       TEXT NOT NULL,
    68	    start_time TEXT,
    69	    end_time   TEXT,
    70	    sort_order INT NOT NULL DEFAULT 0
    71	);
    72	
    73	CREATE TABLE calendar_holds (
    74	    id         SERIAL PRIMARY KEY,
    75	    date       DATE NOT NULL,
    76	    label      TEXT,
    77	    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    78	    created_at TIMESTAMPTZ DEFAULT NOW()
    79	);
    80	
    81	CREATE TABLE calendar_blocked (
    82	    id         SERIAL PRIMARY KEY,
    83	    date       DATE NOT NULL,
    84	    reason     TEXT,
    85	    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    86	    created_at TIMESTAMPTZ DEFAULT NOW()
    87	);
    88	
    89	CREATE TABLE attendance_logs (
    90	    id             SERIAL PRIMARY KEY,
    91	    show_id        INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    92	    draw           INT,
    93	    notes          TEXT,
    94	    incident       BOOLEAN DEFAULT FALSE,
    95	    incident_notes TEXT,
    96	    logged_by      INT REFERENCES users(id) ON DELETE SET NULL,
    97	    created_at     TIMESTAMPTZ DEFAULT NOW(),
    98	    updated_at     TIMESTAMPTZ DEFAULT NOW(),
    99	    UNIQUE (show_id)
   100	);
   101	
   102	CREATE TABLE audit_log (
   103	    id          SERIAL PRIMARY KEY,
   104	    actor       TEXT NOT NULL,
   105	    actor_id    INT REFERENCES users(id) ON DELETE SET NULL,
   106	    action      TEXT NOT NULL,
   107	    entity_type TEXT,
   108	    entity_id   INT,
   109	    metadata    JSONB,
   110	    created_at  TIMESTAMPTZ DEFAULT NOW()
   111	);
   112	CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
   113	CREATE INDEX idx_audit_log_entity     ON audit_log(entity_type, entity_id);
   114	
   115	CREATE TABLE settings (
   116	    id                       INT PRIMARY KEY DEFAULT 1,
   117	    space_name               TEXT NOT NULL DEFAULT 'Pyxis',
   118	    tagline                  TEXT,
   119	    address                  TEXT,
   120	    capacity                 INT,
   121	    contact_email            TEXT,
   122	    website                  TEXT,
   123	    discord_guild_id         TEXT,
   124	    discord_ch_upcoming      TEXT,
   125	    discord_ch_announcements TEXT,
   126	    discord_ch_staff         TEXT,
   127	    discord_ch_bookings      TEXT,
   128	    setup_complete           BOOLEAN DEFAULT FALSE,
   129	    updated_at               TIMESTAMPTZ DEFAULT NOW(),
   130	    CONSTRAINT single_row CHECK (id = 1)
   131	);
   132	INSERT INTO settings DEFAULT VALUES;
   133	
   134	CREATE TABLE sessions (
   135	    id         TEXT PRIMARY KEY,
   136	    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   137	    expires_at TIMESTAMPTZ NOT NULL,
   138	    created_at TIMESTAMPTZ DEFAULT NOW()
   139	);
   140	CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
   141	
   142	-- Auto-update updated_at triggers
   143	CREATE OR REPLACE FUNCTION update_updated_at_column()
   144	RETURNS TRIGGER AS $$
   145	BEGIN
   146	    NEW.updated_at = NOW();
   147	    RETURN NEW;
   148	END;
   149	$$ LANGUAGE plpgsql;
   150	
   151	CREATE TRIGGER update_artists_updated_at
   152	    BEFORE UPDATE ON artists
   153	    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
   154	
   155	CREATE TRIGGER update_shows_updated_at
   156	    BEFORE UPDATE ON shows
   157	    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
   158	
   159	CREATE TRIGGER update_attendance_logs_updated_at
   160	    BEFORE UPDATE ON attendance_logs
   161	    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
   162	
   163	CREATE TRIGGER update_settings_updated_at
   164	    BEFORE UPDATE ON settings
   165	    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## fixtures/dev.sql
```
     1	-- Deterministic local development fixture for Pyxis.
     2	-- This file is intentionally destructive and should only be used against local/dev databases.
     3	
     4	TRUNCATE TABLE
     5	  sessions,
     6	  audit_log,
     7	  attendance_logs,
     8	  show_lineup,
     9	  calendar_holds,
    10	  calendar_blocked,
    11	  submissions,
    12	  shows,
    13	  artists,
    14	  users,
    15	  settings
    16	RESTART IDENTITY CASCADE;
    17	
    18	INSERT INTO settings (
    19	  id,
    20	  space_name,
    21	  tagline,
    22	  address,
    23	  capacity,
    24	  contact_email,
    25	  website,
    26	  setup_complete,
    27	  timezone,
    28	  booking_email,
    29	  auto_archive,
    30	  discord_posting,
    31	  safe_space_required,
    32	  updated_at
    33	)
    34	VALUES (
    35	  1,
    36	  'Pyxis',
    37	  'A room where the weird shows happen.',
    38	  '319 N 11th St, Philadelphia, PA',
    39	  150,
    40	  'booking@pyxis.test',
    41	  'https://pyxis.test',
    42	  TRUE,
    43	  'America/New_York',
    44	  'booking@pyxis.test',
    45	  TRUE,
    46	  TRUE,
    47	  TRUE,
    48	  NOW()
    49	);
    50	
    51	INSERT INTO users (id, discord_id, discord_username, role, created_at, last_login_at)
    52	VALUES
    53	  (1, 'dev:jamie', 'jamie', 'admin', NOW(), NOW()),
    54	  (2, 'dev:sam', 'sam', 'booker', NOW(), NOW()),
    55	  (3, 'dev:door', 'door', 'door', NOW(), NOW()),
    56	  (4, 'dev:dev-admin', 'dev-admin', 'admin', NOW(), NOW());
    57	
    58	INSERT INTO artists (id, name, genre, links, notes, created_at, updated_at)
    59	VALUES
    60	  (1, 'Burial Hex', 'Darkwave', 'https://burialhex.example', 'Great draw, always professional. Prefers no opener.', NOW(), NOW()),
    61	  (2, 'Moor Mother', 'Experimental', 'https://moormother.example', 'Powerful spoken word and electronics.', NOW(), NOW()),
    62	  (3, 'Cygnus', 'Techno', 'https://cygnus.example', 'Late-night techno works well.', NOW(), NOW()),
    63	  (4, 'Open Mic Collective', 'Various', '', 'Weekly community night.', NOW(), NOW()),
    64	  (5, 'Planning for Burial', 'Ambient', 'https://planningforburial.example', 'Headliner material.', NOW(), NOW()),
    65	  (6, 'Actress', 'Electronic', 'https://actress.example', 'Strong archived draw.', NOW(), NOW()),
    66	  (7, 'Pharmakon', 'Industrial', 'https://pharmakon.example', 'Pending booking.', NOW(), NOW()),
    67	  (8, 'Lust for Youth', 'Darkwave', 'https://lustforyouth.example', 'Pending booking.', NOW(), NOW()),
    68	  (9, 'Container', 'Noise', 'https://container.example', 'Very loud — warn neighbours.', NOW(), NOW()),
    69	  (10, 'Orphx', 'EBM', 'https://orphx.example', 'Approved booking.', NOW(), NOW()),
    70	  (11, 'Arca', 'Experimental', 'https://arca.example', 'Declined due to capacity mismatch.', NOW(), NOW());
    71	
    72	INSERT INTO submissions (
    73	  id,
    74	  artist_id,
    75	  artist_name,
    76	  preferred_date,
    77	  genre,
    78	  expected_draw,
    79	  links,
    80	  tech_rider,
    81	  message,
    82	  contact_discord,
    83	  status,
    84	  reviewed_by,
    85	  reviewed_at,
    86	  created_at
    87	)
    88	VALUES
    89	  (1, 7, 'Pharmakon', '2026-06-14', 'Industrial', 80, 'pharmakon.example', 'DI + vocal mic', 'Touring in June, looking for a basement date.', '@pharmakon', 'pending', NULL, NULL, NOW() - INTERVAL '7 days'),
    90	  (2, 8, 'Lust for Youth', '2026-06-21', 'Darkwave', 120, 'lustforyouth.example', 'Stereo backing tracks', 'Can route through Philly on the 21st.', '@lustyouth', 'pending', NULL, NULL, NOW() - INTERVAL '6 days'),
    91	  (3, 10, 'Orphx', '2026-07-04', 'EBM', 60, 'orphx.example', 'Table + two DI', 'Holiday weekend date request.', '@orphx', 'approved', 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '8 days'),
    92	  (4, 11, 'Arca', '2026-07-12', 'Experimental', 200, 'arca.example', 'Large production', 'Seeking intimate underplay.', '@arca', 'declined', 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '11 days'),
    93	  (5, 9, 'Container', '2026-07-19', 'Noise', 55, 'container.example', 'Very loud PA', 'Looking for a noise night.', '@container', 'pending', NULL, NULL, NOW() - INTERVAL '4 days');
    94	
    95	INSERT INTO shows (
    96	  id,
    97	  artist,
    98	  date,
    99	  doors_time,
   100	  start_time,
   101	  age,
   102	  price,
   103	  genre,
   104	  description,
   105	  notes,
   106	  status,
   107	  draw,
   108	  capacity,
   109	  submission_id,
   110	  artist_id,
   111	  created_by,
   112	  created_at,
   113	  updated_at
   114	)
   115	VALUES
   116	  (1, 'Burial Hex', '2026-05-02', '8:00 PM', '9:00 PM', '21+', '$12 adv / $15 door', 'Darkwave', 'An evening of dark electronics and noise.', 'Confirm projector needs.', 'confirmed', 70, 150, NULL, 1, 1, NOW(), NOW()),
   117	  (2, 'Moor Mother', '2026-05-09', '7:00 PM', '8:00 PM', 'All Ages', '$15', 'Experimental', 'Live electronics and spoken word.', '', 'confirmed', 120, 150, NULL, 2, 1, NOW(), NOW()),
   118	  (3, 'Cygnus + Guests', '2026-05-17', '9:00 PM', '10:00 PM', '18+', '$8', 'Techno', 'Chicago techno in the basement.', 'Late load-in.', 'confirmed', 90, 150, NULL, 3, 2, NOW(), NOW()),
   119	  (4, 'Open Mic Night', '2026-05-23', '7:00 PM', NULL, 'All Ages', 'Free', 'Various', 'Weekly open mic — all performers welcome.', '', 'confirmed', 40, 150, NULL, 4, 2, NOW(), NOW()),
   120	  (5, 'Planning for Burial', '2025-03-14', '8:00 PM', '9:00 PM', '18+', '$10', 'Ambient', 'Intimate ambient guitar set.', '', 'archived', 34, 150, NULL, 5, 1, NOW(), NOW()),
   121	  (6, 'Actress', '2025-02-28', '9:00 PM', '10:00 PM', '21+', '$12', 'Electronic', 'UK electronic legend.', '', 'archived', 61, 150, NULL, 6, 1, NOW(), NOW()),
   122	  (7, 'Orphx', '2026-07-04', '9:00 PM', '10:00 PM', '21+', '$12', 'EBM', 'Approved booking from the request inbox.', 'Generated from approved submission.', 'confirmed', 60, 150, 3, 10, 1, NOW(), NOW());
   123	
   124	INSERT INTO show_lineup (show_id, artist, role, start_time, end_time, sort_order)
   125	VALUES
   126	  (1, 'Burial Hex', 'headline', '9:00 PM', '11:00 PM', 0),
   127	  (1, 'Support Act', 'support', '8:30 PM', '9:00 PM', 1),
   128	  (2, 'Moor Mother', 'headline', '8:00 PM', '10:00 PM', 0),
   129	  (3, 'Cygnus', 'headline', '10:00 PM', '12:00 AM', 0),
   130	  (7, 'Orphx', 'headline', '10:00 PM', '12:00 AM', 0);
   131	
   132	INSERT INTO calendar_holds (id, date, label, created_by, created_at)
   133	VALUES
   134	  (1, '2026-06-01', 'Hold — TBD', 1, NOW()),
   135	  (2, '2026-06-14', 'Pharmakon request', 2, NOW());
   136	
   137	INSERT INTO calendar_blocked (id, date, reason, created_by, created_at)
   138	VALUES
   139	  (1, '2026-05-26', 'Closed', 1, NOW()),
   140	  (2, '2026-10-15', 'Venue maintenance', 1, NOW());
   141	
   142	INSERT INTO attendance_logs (show_id, draw, notes, incident, incident_notes, logged_by, created_at, updated_at)
   143	VALUES
   144	  (5, 34, 'Good energy, small crowd.', FALSE, '', 3, NOW(), NOW()),
   145	  (6, 61, 'Great turnout for a weeknight.', FALSE, '', 3, NOW(), NOW());
   146	
   147	INSERT INTO audit_log (actor, actor_id, action, entity_type, entity_id, metadata, created_at)
   148	VALUES
   149	  ('jamie', 1, 'approved show #7 · Orphx · Jul 4', 'show', 7, '{}'::jsonb, NOW() - INTERVAL '1 day'),
   150	  ('bot', NULL, 'posted + pinned #7 in #upcoming-shows', 'show', 7, '{}'::jsonb, NOW() - INTERVAL '1 day'),
   151	  ('sam', 2, 'declined submission · Arca · Jul 12', 'submission', 4, '{}'::jsonb, NOW() - INTERVAL '2 days'),
   152	  ('bot', NULL, 'auto-archived 2 past shows', 'show', 0, '{}'::jsonb, NOW() - INTERVAL '3 days'),
   153	  ('jamie', 1, 'edited show #1 · updated doors to 8:00 PM', 'show', 1, '{}'::jsonb, NOW() - INTERVAL '4 days');
   154	
   155	SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
   156	SELECT setval('artists_id_seq', (SELECT MAX(id) FROM artists));
   157	SELECT setval('submissions_id_seq', (SELECT MAX(id) FROM submissions));
   158	SELECT setval('shows_id_seq', (SELECT MAX(id) FROM shows));
   159	SELECT setval('show_lineup_id_seq', (SELECT MAX(id) FROM show_lineup));
   160	SELECT setval('calendar_holds_id_seq', (SELECT MAX(id) FROM calendar_holds));
   161	SELECT setval('calendar_blocked_id_seq', (SELECT MAX(id) FROM calendar_blocked));
   162	SELECT setval('attendance_logs_id_seq', (SELECT MAX(id) FROM attendance_logs));
   163	SELECT setval('audit_log_id_seq', (SELECT MAX(id) FROM audit_log));
```

## Additional backend handler evidence
```
   220			pbSubs[i] = submissionToProto(&sub)
   221		}
   222	
   223		respondProtoJSON(w, http.StatusOK, &pyxisv1.SubmissionList{Submissions: pbSubs})
   224	}
   225	
   226	func (s *Server) handleApproveBooking(w http.ResponseWriter, r *http.Request) {
   227		ctx := r.Context()
   228		user := s.userFromContext(ctx)
   229		if user == nil {
   230			respondError(w, fmt.Errorf("unauthenticated"))
   231			return
   232		}
   233	
   234		idStr := r.PathValue("id")
   235		id, err := strconv.Atoi(idStr)
   236		if err != nil {
   237			respondError(w, fmt.Errorf("invalid booking ID: %w", err))
   238			return
   239		}
   240	
   241		actorID := int(user.ID)
   242		actorName := user.DiscordUsername
   243	
   244		created, err := s.submissionService.Approve(ctx, id, actorID, actorName)
   245		if err != nil {
   246			respondError(w, err)
   247			return
   248		}
   249	
   250		respondProtoJSON(w, http.StatusOK, showToProto(created))
   251	}
   252	
   253	func (s *Server) handleDeclineBooking(w http.ResponseWriter, r *http.Request) {
   254		ctx := r.Context()
   255		user := s.userFromContext(ctx)
   256		if user == nil {
   257			respondError(w, fmt.Errorf("unauthenticated"))
   258			return
   259		}
   260	
   261		idStr := r.PathValue("id")
   262		id, err := strconv.Atoi(idStr)
   263		if err != nil {
   264			respondError(w, fmt.Errorf("invalid booking ID: %w", err))
   265			return
   266		}
   267	
   268		actorID := int(user.ID)
   269		actorName := user.DiscordUsername
   270	
   271		if err := s.submissionService.Decline(ctx, id, actorID, actorName); err != nil {
   272			respondError(w, err)
   273			return
   274		}
   275	
   276		respondProtoJSON(w, http.StatusOK, &pyxisv1.SuccessResponse{Success: true})
   277	}
   278	
   279	func (s *Server) handleListArtists(w http.ResponseWriter, r *http.Request) {
   280		ctx := r.Context()
   281	
   282		artists, err := s.artistService.List(ctx)
   283		if err != nil {
   284			respondError(w, err)
   285			return
   286		}
   287	
   288		pbArtists := make([]*pyxisv1.Artist, len(artists))
   289		for i, artist := range artists {
   290			pbArtists[i] = artistToProto(&artist)
   291		}
   292	
   293		respondProtoJSON(w, http.StatusOK, &pyxisv1.ArtistList{Artists: pbArtists})
   294	}
   295	
   296	func (s *Server) handleGetArtist(w http.ResponseWriter, r *http.Request) {
   297		ctx := r.Context()
   298		idStr := r.PathValue("id")
   299		id, err := strconv.Atoi(idStr)
   300		if err != nil {
   301			respondError(w, fmt.Errorf("invalid artist ID: %w", err))
   302			return
   303		}
   304	
   305		artist, err := s.artistService.GetByID(ctx, id)
   306		if err != nil {
   307			respondError(w, err)
   308			return
   309		}
   310	
   311		respondProtoJSON(w, http.StatusOK, artistToProto(artist))
   312	}
   313	
   314	func (s *Server) handleUpdateArtist(w http.ResponseWriter, r *http.Request) {
   315		ctx := r.Context()
   316		user := s.userFromContext(ctx)
   317		if user == nil {
   318			respondError(w, fmt.Errorf("unauthenticated"))
   319			return
   320		}
   321	
   322		idStr := r.PathValue("id")
   323		id, err := strconv.Atoi(idStr)
   324		if err != nil {
   325			respondError(w, fmt.Errorf("invalid artist ID: %w", err))
   326			return
   327		}
   328	
   329		body, err := io.ReadAll(r.Body)
   330		if err != nil {
   331			respondError(w, fmt.Errorf("read body: %w", err))
   332			return
   333		}
   334	
   335		var req struct {
   336			Name  string `json:"name"`
   337			Genre string `json:"genre"`
   338			Links string `json:"links"`
   339			Notes string `json:"notes"`
   340		}
   341		if err := json.Unmarshal(body, &req); err != nil {
   342			respondError(w, fmt.Errorf("invalid request body: %w", err))
   343			return
   344		}
   345	
   346		artist := &domain.Artist{
   347			ID:    id,
   348			Name:  req.Name,
   349			Genre: req.Genre,
   350			Links: req.Links,
   351			Notes: req.Notes,
   352		}
   353	
   354		updated, err := s.artistService.Update(ctx, artist)
   355		if err != nil {
   356			respondError(w, err)
   357			return
   358		}
   359	
   360		respondProtoJSON(w, http.StatusOK, artistToProto(updated))
   361	}
   362	
   363	func (s *Server) handleAnnounceShow(w http.ResponseWriter, r *http.Request) {
   364		ctx := r.Context()
   365		user := s.userFromContext(ctx)
   366		if user == nil {
   367			respondError(w, fmt.Errorf("unauthenticated"))
   368			return
   369		}
   370	
   371		idStr := r.PathValue("id")
   372		id, err := strconv.Atoi(idStr)
   373		if err != nil {
   374			respondError(w, fmt.Errorf("invalid show ID: %w", err))
   375			return
   376		}
   377	
   378		actorID := int(user.ID)
   379		actorName := user.DiscordUsername
   380	
   381		if err := s.showService.Announce(ctx, id, actorID, actorName); err != nil {
   382			respondError(w, err)
   383			return
   384		}
   385	
   386		respondProtoJSON(w, http.StatusOK, &pyxisv1.SuccessResponse{Success: true})
   387	}
   388	
   389	func (s *Server) handleUploadFlyer(w http.ResponseWriter, r *http.Request) {
   390		ctx := r.Context()
   391		user := s.userFromContext(ctx)
   392		if user == nil {
   393			respondError(w, fmt.Errorf("unauthenticated"))
   394			return
   395		}
   396	
   397		idStr := r.PathValue("id")
   398		showID, err := strconv.Atoi(idStr)
   399		if err != nil {
   400			respondError(w, fmt.Errorf("invalid show ID: %w", err))
   401			return
   402		}
   403	
   404		if err := r.ParseMultipartForm(10 << 20); err != nil {
   405			respondError(w, fmt.Errorf("parse form: %w", err))
   406			return
   407		}
   408	
   409		file, header, err := r.FormFile("flyer")
   410		if err != nil {
   411			respondError(w, fmt.Errorf("get file: %w", err))
   412			return
   413		}
   414		defer file.Close()
   415	
   416		url, err := s.flyerStore.Upload(ctx, showID, header.Filename, file)
   417		if err != nil {
   418			respondError(w, err)
   419			return
   420		}
   421	
   422		respondProtoJSON(w, http.StatusOK, &pyxisv1.FlyerUploadResponse{Url: url})
   423	}
   424	
   425	func (s *Server) handleDeleteFlyer(w http.ResponseWriter, r *http.Request) {
   426		ctx := r.Context()
   427		user := s.userFromContext(ctx)
   428		if user == nil {
   429			respondError(w, fmt.Errorf("unauthenticated"))
   430			return
   431		}
   432	
   433		idStr := r.PathValue("id")
   434		showID, err := strconv.Atoi(idStr)
   435		if err != nil {
   436			respondError(w, fmt.Errorf("invalid show ID: %w", err))
   437			return
   438		}
   439	
   440		filename := r.URL.Query().Get("filename")
   441		if filename == "" {
   442			respondError(w, fmt.Errorf("filename required"))
   443			return
   444		}
   445	
   446		if err := s.flyerStore.Delete(ctx, showID, filename); err != nil {
   447			respondError(w, err)
   448			return
   449		}
   450	
   451		w.WriteHeader(http.StatusNoContent)
   452	}
   453	
   454	func (s *Server) handleListCalendar(w http.ResponseWriter, r *http.Request) {
   455		ctx := r.Context()
   456	
   457		shows, err := s.showService.ListAll(ctx)
   458		if err != nil {
   459			respondError(w, err)
   460			return
   461		}
   462	
   463		holds, err := s.calendarService.ListHolds(ctx)
   464		if err != nil {
   465			respondError(w, err)
   466			return
   467		}
   468	
   469		blocked, err := s.calendarService.ListBlocked(ctx)
   470		if err != nil {
   471			respondError(w, err)
   472			return
   473		}
   474	
   475		events := make([]*pyxisv1.CalendarEvent, 0, len(shows)+len(holds)+len(blocked))
   476		for i := range shows {
   477			if shows[i].Status == domain.StatusConfirmed {
   478				events = append(events, showToCalendarEvent(&shows[i]))
   479			}
   480		}
   481		for i := range holds {
   482			events = append(events, calendarHoldToEvent(&holds[i]))
   483		}
   484		for i := range blocked {
   485			events = append(events, calendarBlockedToEvent(&blocked[i]))
   486		}
   487	
   488		respondProtoJSON(w, http.StatusOK, &pyxisv1.CalendarEventList{Events: events})
   489	}
   490	
   491	func (s *Server) handleCreateCalendarHold(w http.ResponseWriter, r *http.Request) {
   492		ctx := r.Context()
   493		user := s.userFromContext(ctx)
   494		if user == nil {
   495			respondError(w, fmt.Errorf("unauthenticated"))
   496			return
   497		}
   498	
   499		body, err := io.ReadAll(r.Body)
   500		if err != nil {
   501			respondError(w, fmt.Errorf("read body: %w", err))
   502			return
   503		}
   504	
   505		var req struct {
   506			Date  string `json:"date"`
   507			Label string `json:"label"`
   508		}
   509		if err := json.Unmarshal(body, &req); err != nil {
   510			respondError(w, fmt.Errorf("invalid request body: %w", err))
   511			return
   512		}
   513	
   514		t, err := time.Parse(time.DateOnly, req.Date)
   515		if err != nil {
   516			respondError(w, fmt.Errorf("invalid date: %w", err))
   517			return
   518		}
   519	
   520		actorID := int(user.ID)
   521		created, err := s.calendarService.CreateHold(ctx, &domain.CalendarHold{
   522			Date:      t,
   523			Label:     req.Label,
   524			CreatedBy: &actorID,
   525		})
   526		if err != nil {
   527			respondError(w, err)
   528			return
   529		}
   530	
   531		respondProtoJSON(w, http.StatusCreated, calendarHoldToProto(created))
   532	}
   533	
   534	func (s *Server) handleDeleteCalendarHold(w http.ResponseWriter, r *http.Request) {
   535		ctx := r.Context()
   536	
   537		idStr := r.PathValue("id")
   538		id, err := strconv.Atoi(idStr)
   539		if err != nil {
   540			respondError(w, fmt.Errorf("invalid hold ID: %w", err))
   541			return
   542		}
   543	
   544		if err := s.calendarService.DeleteHold(ctx, id); err != nil {
   545			respondError(w, err)
   546			return
   547		}
   548	
   549		w.WriteHeader(http.StatusNoContent)
   550	}
   551	
   552	func (s *Server) handleCreateCalendarBlocked(w http.ResponseWriter, r *http.Request) {
   553		ctx := r.Context()
   554		user := s.userFromContext(ctx)
   555		if user == nil {
   556			respondError(w, fmt.Errorf("unauthenticated"))
   557			return
   558		}
   559	
   560		body, err := io.ReadAll(r.Body)
   561		if err != nil {
   562			respondError(w, fmt.Errorf("read body: %w", err))
   563			return
   564		}
   565	
   566		var req struct {
   567			Date   string `json:"date"`
   568			Reason string `json:"reason"`
   569		}
   570		if err := json.Unmarshal(body, &req); err != nil {
   571			respondError(w, fmt.Errorf("invalid request body: %w", err))
   572			return
   573		}
   574	
   575		t, err := time.Parse(time.DateOnly, req.Date)
   576		if err != nil {
   577			respondError(w, fmt.Errorf("invalid date: %w", err))
   578			return
   579		}
   580	
   581		actorID := int(user.ID)
   582		created, err := s.calendarService.CreateBlocked(ctx, &domain.CalendarBlocked{
   583			Date:      t,
   584			Reason:    req.Reason,
   585			CreatedBy: &actorID,
   586		})
   587		if err != nil {
   588			respondError(w, err)
   589			return
   590		}
   591	
   592		respondProtoJSON(w, http.StatusCreated, calendarBlockedToProto(created))
   593	}
   594	
   595	func (s *Server) handleDeleteCalendarBlocked(w http.ResponseWriter, r *http.Request) {
   596		ctx := r.Context()
   597	
   598		idStr := r.PathValue("id")
   599		id, err := strconv.Atoi(idStr)
   600		if err != nil {
   601			respondError(w, fmt.Errorf("invalid blocked ID: %w", err))
   602			return
   603		}
   604	
   605		if err := s.calendarService.DeleteBlocked(ctx, id); err != nil {
   606			respondError(w, err)
   607			return
   608		}
   609	
   610		w.WriteHeader(http.StatusNoContent)
   611	}
   612	
   613	func (s *Server) handleListAttendance(w http.ResponseWriter, r *http.Request) {
   614		ctx := r.Context()
   615	
   616		limit := 50
   617		offset := 0
   618		if l := r.URL.Query().Get("limit"); l != "" {
   619			if v, err := strconv.Atoi(l); err == nil && v > 0 {
   620				limit = v
   621			}
   622		}
   623		if o := r.URL.Query().Get("offset"); o != "" {
   624			if v, err := strconv.Atoi(o); err == nil && v >= 0 {
   625				offset = v
   626			}
   627		}
   628	
   629		logs, err := s.attendanceService.List(ctx, limit, offset)
   630		if err != nil {
   631			respondError(w, err)
   632			return
   633		}
   634	
   635		pbLogs := make([]*pyxisv1.AttendanceLog, len(logs))
   636		for i, log := range logs {
   637			pbLogs[i] = attendanceLogToProto(&log)
   638		}
   639	
   640		respondProtoJSON(w, http.StatusOK, &pyxisv1.AttendanceLogList{Logs: pbLogs})
   641	}
   642	
   643	func (s *Server) handleGetAttendance(w http.ResponseWriter, r *http.Request) {
   644		ctx := r.Context()
   645		showIDStr := r.PathValue("showId")
   646		showID, err := strconv.Atoi(showIDStr)
   647		if err != nil {
   648			respondError(w, fmt.Errorf("invalid show ID: %w", err))
   649			return
   650		}
   651	
   652		log, err := s.attendanceService.GetByShowID(ctx, showID)
   653		if err != nil {
   654			respondError(w, err)
   655			return
   656		}
   657	
   658		respondProtoJSON(w, http.StatusOK, attendanceLogToProto(log))
   659	}
   660	
   661	func (s *Server) handleUpsertAttendance(w http.ResponseWriter, r *http.Request) {
   662		ctx := r.Context()
   663		user := s.userFromContext(ctx)
   664		if user == nil {
   665			respondError(w, fmt.Errorf("unauthenticated"))
   666			return
   667		}
   668	
   669		showIDStr := r.PathValue("showId")
   670		showID, err := strconv.Atoi(showIDStr)
   671		if err != nil {
   672			respondError(w, fmt.Errorf("invalid show ID: %w", err))
   673			return
   674		}
   675	
   676		body, err := io.ReadAll(r.Body)
   677		if err != nil {
   678			respondError(w, fmt.Errorf("read body: %w", err))
   679			return
   680		}
   681	
   682		var req struct {
   683			Draw          *int   `json:"draw"`
   684			Notes         string `json:"notes"`
   685			Incident      bool   `json:"incident"`
   686			IncidentNotes string `json:"incidentNotes"`
   687		}
   688		if err := json.Unmarshal(body, &req); err != nil {
   689			respondError(w, fmt.Errorf("invalid request body: %w", err))
   690			return
   691		}
   692	
   693		actorID := int(user.ID)
   694		updated, err := s.attendanceService.Upsert(ctx, &domain.AttendanceLog{
   695			ShowID:        showID,
   696			Draw:          req.Draw,
   697			Notes:         req.Notes,
   698			Incident:      req.Incident,
   699			IncidentNotes: req.IncidentNotes,
   700			LoggedBy:      &actorID,
   701		})
   702		if err != nil {
   703			respondError(w, err)
   704			return
   705		}
   706	
   707		respondProtoJSON(w, http.StatusOK, attendanceLogToProto(updated))
   708	}
   709	
   710	func (s *Server) handleGetSettings(w http.ResponseWriter, r *http.Request) {
   711		ctx := r.Context()
   712	
   713		settings, err := s.settingsService.Get(ctx)
   714		if err != nil {
   715			respondError(w, err)
   716			return
   717		}
   718	
   719		respondProtoJSON(w, http.StatusOK, settingsToProto(settings))
   720	}
   721	
   722	func (s *Server) handleUpdateSettings(w http.ResponseWriter, r *http.Request) {
   723		ctx := r.Context()
   724		user := s.userFromContext(ctx)
   725		if user == nil {
   726			respondError(w, fmt.Errorf("unauthenticated"))
   727			return
   728		}
   729	
   730		body, err := io.ReadAll(r.Body)
   731		if err != nil {
   732			respondError(w, fmt.Errorf("read body: %w", err))
   733			return
   734		}
   735	
   736		var req struct {
   737			SpaceName              string `json:"spaceName"`
   738			Tagline                string `json:"tagline"`
   739			Address                string `json:"address"`
   740			Capacity               *int   `json:"capacity"`
   741			ContactEmail           string `json:"contactEmail"`
   742			Website                string `json:"website"`
   743			DiscordGuildID         string `json:"discordGuildId"`
   744			DiscordChUpcoming      string `json:"discordChUpcoming"`
   745			DiscordChAnnouncements string `json:"discordChAnnouncements"`
   746			DiscordChStaff         string `json:"discordChStaff"`
   747			DiscordChBookings      string `json:"discordChBookings"`
   748			SetupComplete          bool   `json:"setupComplete"`
   749		}
   750		if err := json.Unmarshal(body, &req); err != nil {
   751			respondError(w, fmt.Errorf("invalid request body: %w", err))
   752			return
   753		}
   754	
   755		updated, err := s.settingsService.Update(ctx, &domain.Settings{
   756			SpaceName:              req.SpaceName,
   757			Tagline:                req.Tagline,
   758			Address:                req.Address,
   759			Capacity:               req.Capacity,
   760			ContactEmail:           req.ContactEmail,
   761			Website:                req.Website,
   762			DiscordGuildID:         req.DiscordGuildID,
   763			DiscordChUpcoming:      req.DiscordChUpcoming,
   764			DiscordChAnnouncements: req.DiscordChAnnouncements,
   765			DiscordChStaff:         req.DiscordChStaff,
   766			DiscordChBookings:      req.DiscordChBookings,
   767			SetupComplete:          req.SetupComplete,
   768		})
   769		if err != nil {
   770			respondError(w, err)
   771			return
   772		}
   773	
   774		respondProtoJSON(w, http.StatusOK, settingsToProto(updated))
   775	}
   776	
   777	func (s *Server) handleListAuditLog(w http.ResponseWriter, r *http.Request) {
   778		ctx := r.Context()
   779	
   780		limit := 50
   781		offset := 0
   782		if l := r.URL.Query().Get("limit"); l != "" {
   783			if v, err := strconv.Atoi(l); err == nil && v > 0 {
   784				limit = v
   785			}
   786		}
   787		if o := r.URL.Query().Get("offset"); o != "" {
   788			if v, err := strconv.Atoi(o); err == nil && v >= 0 {
   789				offset = v
   790			}
   791		}
   792	
   793		entries, err := s.auditService.List(ctx, limit, offset)
   794		if err != nil {
   795			respondError(w, err)
   796			return
   797		}
   798	
   799		pbEntries := make([]*pyxisv1.AuditLogEntry, len(entries))
   800		for i, entry := range entries {
   801			pbEntries[i] = auditLogEntryToProto(&entry)
   802		}
   803	
   804		respondProtoJSON(w, http.StatusOK, &pyxisv1.AuditLogEntryList{Entries: pbEntries})
   805	}
   806	
   807	func (s *Server) requireRole(roles ...string) func(http.Handler) http.Handler {
   808		return func(next http.Handler) http.Handler {
   809			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
   810				user := s.userFromContext(r.Context())
   811				if user == nil {
   812					respondError(w, fmt.Errorf("unauthenticated"))
   813					return
   814				}
   815				for _, role := range roles {
   816					if user.Role == role {
   817						next.ServeHTTP(w, r)
   818						return
   819					}
   820				}
```
## Submission repository evidence
```
     1	-- name: CreateSubmission :one
     2	INSERT INTO submissions (artist_name, preferred_date, genre, expected_draw, links, tech_rider, message, contact_discord, status)
     3	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
     4	RETURNING *;
     5	
     6	-- name: GetSubmission :one
     7	SELECT * FROM submissions WHERE id = $1;
     8	
     9	-- name: ListSubmissions :many
    10	SELECT * FROM submissions WHERE ($1 = '' OR status = $1) ORDER BY created_at DESC;
    11	
    12	-- name: ApproveSubmission :one
    13	UPDATE submissions
    14	SET status = 'approved', reviewed_by = $2, reviewed_at = NOW()
    15	WHERE id = $1
    16	RETURNING *;
    17	
    18	-- name: DeclineSubmission :one
    19	UPDATE submissions
    20	SET status = 'declined', reviewed_by = $2, reviewed_at = NOW()
    21	WHERE id = $1
    22	RETURNING *;
```
## Artist repository evidence
```
     1	-- name: ListArtists :many
     2	SELECT * FROM artists ORDER BY name ASC;
     3	
     4	-- name: GetArtist :one
     5	SELECT * FROM artists WHERE id = $1;
     6	
     7	-- name: GetArtistByName :one
     8	SELECT * FROM artists WHERE name = $1;
     9	
    10	-- name: CreateArtist :one
    11	INSERT INTO artists (name, genre, links, notes)
    12	VALUES ($1, $2, $3, $4)
    13	RETURNING *;
    14	
    15	-- name: UpdateArtist :one
    16	UPDATE artists
    17	SET name = $2, genre = $3, links = $4, notes = $5, updated_at = NOW()
    18	WHERE id = $1
    19	RETURNING *;
```
## Show repository evidence
```
     1	-- name: ListUpcomingShows :many
     2	SELECT id, artist, date, doors_time, start_time, age, price, genre,
     3	       description, notes, status, flyer_url, draw, capacity,
     4	       submission_id, artist_id, created_at, updated_at
     5	FROM shows
     6	WHERE status = 'confirmed' AND date >= CURRENT_DATE
     7	ORDER BY date ASC;
     8	
     9	-- name: GetShow :one
    10	SELECT * FROM shows WHERE id = $1;
    11	
    12	-- name: GetShowWithLineup :one
    13	SELECT
    14	    s.*,
    15	    COALESCE(
    16	        jsonb_agg(
    17	            jsonb_build_object(
    18	                'artist', sl.artist,
    19	                'role', sl.role,
    20	                'startTime', sl.start_time,
    21	                'endTime', sl.end_time
    22	            ) ORDER BY sl.sort_order
    23	        ) FILTER (WHERE sl.id IS NOT NULL),
    24	        '[]'::jsonb
    25	    ) as lineup
    26	FROM shows s
    27	LEFT JOIN show_lineup sl ON sl.show_id = s.id
    28	WHERE s.id = $1
    29	GROUP BY s.id;
    30	
    31	-- name: CreateShow :one
    32	INSERT INTO shows (artist, date, doors_time, start_time, age, price,
    33	                   genre, description, notes, status, draw, capacity,
    34	                   submission_id, artist_id, created_by)
    35	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    36	RETURNING *;
    37	
    38	-- name: UpdateShow :one
    39	UPDATE shows
    40	SET artist = $2, date = $3, doors_time = $4, start_time = $5,
    41	    age = $6, price = $7, genre = $8, description = $9, notes = $10,
    42	    status = $11, draw = $12, capacity = $13,
    43	    updated_at = NOW()
    44	WHERE id = $1
    45	RETURNING *;
    46	
    47	-- name: ArchiveShow :one
    48	UPDATE shows AS s SET status = 'archived', updated_at = NOW() WHERE s.id = $1 RETURNING s.*;
    49	
    50	-- name: SearchArchive :many
    51	SELECT s.id, s.artist, s.date, s.genre, COALESCE(al.draw, 0) as draw
    52	FROM shows s
    53	LEFT JOIN attendance_logs al ON al.show_id = s.id
    54	WHERE s.status = 'archived'
    55	  AND ($1::text = '' OR s.artist ILIKE '%' || $1 || '%' OR s.genre ILIKE '%' || $1 || '%')
    56	ORDER BY s.date DESC;
    57	
    58	-- name: GetArchiveStats :one
    59	SELECT
    60	    COUNT(*) as total_shows,
    61	    COALESCE(SUM(al.draw), 0) as total_attendance,
    62	    COUNT(DISTINCT date_part('year', date)) as years_running,
    63	    COUNT(DISTINCT artist_id) as unique_artists
    64	FROM shows s
    65	LEFT JOIN attendance_logs al ON al.show_id = s.id
    66	WHERE s.status = 'archived';
    67	
    68	-- name: ListAllShows :many
    69	SELECT * FROM shows ORDER BY date DESC;
```
