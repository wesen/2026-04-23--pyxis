import { useGetAuditLogQuery, useGetBookingsQuery, useGetShowsQuery } from '../../api/appApi';
import { AppShell } from '../../components/shell/AppShell';
import { DashboardOverview } from '../../components/organisms/Panels';
import { ErrorState, LoadingState } from '../shared';
import './Page.css';

export function DashboardPage() {
  const showsQuery = useGetShowsQuery();
  const bookingsQuery = useGetBookingsQuery();
  const logQuery = useGetAuditLogQuery();

  const isLoading = showsQuery.isLoading || bookingsQuery.isLoading || logQuery.isLoading;
  const isError = showsQuery.isError || bookingsQuery.isError || logQuery.isError;

  return (
    <AppShell page="dashboard" title="Welcome back, Ada" eyebrow="Home / Dashboard" subtitle="Wednesday, April 23 · live operations data">
      {isLoading ? (
        <LoadingState />
      ) : isError || !showsQuery.data || !bookingsQuery.data || !logQuery.data ? (
        <ErrorState />
      ) : (
        <div data-section="dashboard-summary">
          <DashboardOverview shows={showsQuery.data} bookings={bookingsQuery.data} log={logQuery.data} />
        </div>
      )}
    </AppShell>
  );
}
