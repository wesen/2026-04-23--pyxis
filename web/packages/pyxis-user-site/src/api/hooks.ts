import type { BookingFormData } from 'pyxis-types';
import {
  useGetArchiveQuery,
  useGetArchiveStatsQuery,
  useGetShowQuery,
  useGetUpcomingShowsQuery,
  useSubmitBookingMutation,
} from './publicApi';

/**
 * Compatibility hook names for the Pyxis public API.
 *
 * The app now uses RTK Query internally. These wrappers preserve the old
 * handwritten React Query hook names so page migration can remain small and
 * callers can move to generated RTK Query hook names later if desired.
 */

export function useUpcomingShows() {
  return useGetUpcomingShowsQuery();
}

export function useShow(id: number | undefined) {
  return useGetShowQuery(id as number, { skip: id === undefined });
}

export function useArchive(search?: string) {
  return useGetArchiveQuery(search);
}

export function useArchiveStats() {
  return useGetArchiveStatsQuery();
}

export function useSubmitBooking() {
  const [submitBooking, result] = useSubmitBookingMutation();

  return {
    ...result,
    isPending: result.isLoading,
    mutateAsync: (data: BookingFormData) => submitBooking(data).unwrap(),
  };
}

export {
  useGetArchiveQuery,
  useGetArchiveStatsQuery,
  useGetShowQuery,
  useGetUpcomingShowsQuery,
  useSubmitBookingMutation,
} from './publicApi';
