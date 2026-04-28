import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  fromJson,
  toJson,
  ShowListSchema,
  Show,
  ShowSchema,
  ArchivedShowList,
  ArchivedShowListSchema,
  ArchiveStats,
  ArchiveStatsSchema,
  BookingConfirmation,
  BookingConfirmationSchema,
  BookingFormData,
  BookingFormDataSchema,
  Settings,
  SettingsSchema,
} from 'pyxis-types';
import { endpoints } from './endpoints';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Archive', 'Show', 'Settings', 'Submission'],
  endpoints: (builder) => ({
    getUpcomingShows: builder.query<Show[], void>({
      query: () => endpoints.shows,
      transformResponse: (response: unknown) => {
        const list = fromJson(ShowListSchema, response as any);
        return list.shows;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((show) => ({ type: 'Show' as const, id: show.id })),
              { type: 'Show' as const, id: 'LIST' },
            ]
          : [{ type: 'Show' as const, id: 'LIST' }],
    }),

    getShow: builder.query<Show, number>({
      query: (id) => endpoints.show(id),
      transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
      providesTags: (_result, _error, id) => [{ type: 'Show', id }],
    }),

    getArchive: builder.query<ArchivedShowList, string | void>({
      query: (search) => ({
        url: endpoints.archive,
        params: search ? { search } : undefined,
      }),
      transformResponse: (response: unknown) => fromJson(ArchivedShowListSchema, response as any),
      providesTags: [{ type: 'Archive', id: 'LIST' }],
    }),

    getArchiveStats: builder.query<ArchiveStats, void>({
      query: () => endpoints.archiveStats,
      transformResponse: (response: unknown) => fromJson(ArchiveStatsSchema, response as any),
      keepUnusedDataFor: 60 * 60,
      providesTags: [{ type: 'Archive', id: 'STATS' }],
    }),

    getPublicSettings: builder.query<Settings, void>({
      query: () => endpoints.settings,
      transformResponse: (response: unknown) => fromJson(SettingsSchema, response as any),
      keepUnusedDataFor: 60 * 10,
      providesTags: ['Settings'],
    }),

    submitBooking: builder.mutation<BookingConfirmation, BookingFormData>({
      query: (body) => ({
        url: endpoints.submissions,
        method: 'POST',
        body: toJson(BookingFormDataSchema, body),
      }),
      transformResponse: (response: unknown) => fromJson(BookingConfirmationSchema, response as any),
      invalidatesTags: [{ type: 'Submission', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetArchiveQuery,
  useGetArchiveStatsQuery,
  useGetShowQuery,
  useGetPublicSettingsQuery,
  useGetUpcomingShowsQuery,
  useSubmitBookingMutation,
} = publicApi;
