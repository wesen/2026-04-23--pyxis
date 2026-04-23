/**
 * React Query hooks for the Pyxis public API.
 * All data fetching goes through these hooks.
 *
 * In Storybook and tests, MSW intercepts the /api/* requests and returns
 * mock data from pyxis-components/src/mocks/handlers.ts.
 *
 * Usage:
 * ```tsx
 * const { data: shows } = useUpcomingShows();
 * ```
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFetch } from './client';
import { endpoints } from './endpoints';
import type { Show, ArchivedShow, ArchiveStats, BookingFormData, BookingConfirmation } from './types';

/* ─── Queries ──────────────────────────────────────────── */

const defaultQueryOptions = {
  staleTime: 1000 * 60 * 5,      // 5 minutes
  gcTime:    1000 * 60 * 30,    // 30 minutes
  retry: 2,
  refetchOnWindowFocus: false,
} as const;

/**
 * Fetch all upcoming (confirmed) shows.
 * GET /api/public/shows
 */
export function useUpcomingShows() {
  return useQuery({
    queryKey: ['shows', 'upcoming'],
    queryFn: () => apiFetch<Show[]>(endpoints.shows),
    ...defaultQueryOptions,
  });
}

/**
 * Fetch a single show by ID with full detail (description, lineup, flyer_url).
 * GET /api/public/shows/:id
 */
export function useShow(id: number | undefined) {
  return useQuery({
    queryKey: ['shows', id],
    queryFn: () => apiFetch<Show>(endpoints.show(id!)),
    enabled: id !== undefined,
    ...defaultQueryOptions,
  });
}

/**
 * Fetch all archived shows, optionally filtered by search query.
 * GET /api/public/archive?search=...
 */
export function useArchive(search?: string) {
  const url = search ? `${endpoints.archive}?search=${encodeURIComponent(search)}` : endpoints.archive;
  return useQuery({
    queryKey: ['archive', search],
    queryFn: () => apiFetch<ArchivedShow[]>(url),
    ...defaultQueryOptions,
  });
}

/**
 * Fetch aggregate archive statistics.
 * GET /api/public/archive/stats
 * Stale for the session — stats don't change often.
 */
export function useArchiveStats() {
  return useQuery({
    queryKey: ['archive', 'stats'],
    queryFn: () => apiFetch<ArchiveStats>(endpoints.archiveStats),
    staleTime: Infinity,  // Stats rarely change
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
}

/* ─── Mutations ─────────────────────────────────────────── */

/**
 * Submit a booking inquiry form.
 * POST /api/public/submissions
 *
 * Usage:
 * ```tsx
 * const submit = useSubmitBooking();
 * await submit.mutateAsync({ artist_name: '...', links: '...' });
 * ```
 */
export function useSubmitBooking() {
  return useMutation({
    mutationFn: (data: BookingFormData) =>
      apiFetch<BookingConfirmation>(endpoints.submissions, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}
