import type { ReactElement } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useGetSessionQuery } from './api/appApi';
import { ArtistsPage, AttendancePage, AuditLogPage, BookingReviewPage, BookingsPage, CalendarPage, DashboardPage, DiscordPage, LoginPage, ModalShowcasePage, SettingsPage, SetupPage, ShowDetailPage, ShowsPage } from './pages/Pages';

function RequireSession({ children }: { children: ReactElement }) {
  const location = useLocation();
  const { data: session, isLoading, isFetching } = useGetSessionQuery();

  if (isLoading || isFetching) {
    return <main className="app-login"><section><b>pyxis</b><h1>Checking session…</h1><p>Verifying your staff login.</p></section></main>;
  }

  if (!session?.authenticated) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?return_to=${encodeURIComponent(returnTo)}`} replace />;
  }

  return children;
}

function PublicOnlyLogin() {
  const { data: session, isLoading } = useGetSessionQuery();
  if (!isLoading && session?.authenticated) {
    return <Navigate to="/" replace />;
  }
  return <LoginPage />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnlyLogin />} />
      <Route path="/setup" element={<RequireSession><SetupPage /></RequireSession>} />
      <Route path="/" element={<RequireSession><DashboardPage /></RequireSession>} />
      <Route path="/shows" element={<RequireSession><ShowsPage /></RequireSession>} />
      <Route path="/shows/:id" element={<RequireSession><ShowDetailPage /></RequireSession>} />
      <Route path="/calendar" element={<RequireSession><CalendarPage /></RequireSession>} />
      <Route path="/bookings" element={<RequireSession><BookingsPage /></RequireSession>} />
      <Route path="/bookings/review/:id" element={<RequireSession><BookingReviewPage /></RequireSession>} />
      <Route path="/artists" element={<RequireSession><ArtistsPage /></RequireSession>} />
      <Route path="/attendance" element={<RequireSession><AttendancePage /></RequireSession>} />
      <Route path="/log" element={<RequireSession><AuditLogPage /></RequireSession>} />
      <Route path="/discord" element={<RequireSession><DiscordPage /></RequireSession>} />
      <Route path="/settings" element={<RequireSession><SettingsPage /></RequireSession>} />
      <Route path="/modal" element={<RequireSession><ModalShowcasePage /></RequireSession>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
