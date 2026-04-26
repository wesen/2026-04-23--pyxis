import { Button, Field, Input, PyxisMark } from 'pyxis-components';
import { useParams } from 'react-router-dom';
import { create, AppShowSchema, ShowStatus, SubmissionStatus } from 'pyxis-types';
import { useState, type ReactNode } from 'react';
import {
  useGetArtistsQuery,
  useGetAttendanceQuery,
  useGetAuditLogQuery,
  useGetBookingsQuery,
  useGetCalendarQuery,
  useGetSettingsQuery,
  useGetShowQuery,
  useGetShowsQuery,
  useAnnounceShowMutation,
  useApproveBookingMutation,
  useArchiveShowMutation,
  useCancelShowMutation,
  useCreateCalendarBlockedMutation,
  useCreateCalendarHoldMutation,
  useDeclineBookingMutation,
  useUpdateAttendanceMutation,
  useUpdateSettingsMutation,
} from '../api/appApi';
import { discordMappings as seedMappings } from '../api/mockData';
import { AppShell } from '../components/shell/AppShell';
import {
  ArtistRoster,
  AttendancePanel,
  AuditLogPanel,
  DashboardOverview,
  DiscordMappingPanel,
  NewShowModal,
  Panel,
  SettingsPanel,
} from '../components/organisms/Panels';
import {
  BookingReviewDatePanel,
  BookingReviewHero,
  BookingReviewNotePanel,
  BookingReviewRequestPanel,
  BookingsInboxPanel,
  BookingsInsightsPanel,
  BookingsProcessedPanel,
  CalendarBoard,
  ShowDetailDiscordPanel,
  ShowDetailHero,
  ShowDetailInfoPanel,
} from '../components/organisms/Phase8Sections';
import { ShowsArchivedPanel, ShowsConfirmedPanel, ShowsFilterBar } from '../components/organisms/ShowsSections';
import './pages.css';

type PageStateProps = {
  title: string;
  message?: string;
  action?: ReactNode;
};

function PageState({ title, message, action }: PageStateProps) {
  return (
    <Panel title={title} section="page-state">
      <div className="app-page-state">
        {message && <p>{message}</p>}
        {action}
      </div>
    </Panel>
  );
}

function LoadingState({ label = 'Loading real backend data…' }: { label?: string }) {
  return <PageState title="Loading" message={label} />;
}

function ErrorState({ label = 'The real backend request failed. Check your session and backend logs.' }: { label?: string }) {
  return <PageState title="Could not load data" message={label} />;
}

function EmptyState({ label = 'No records returned from the real backend yet.' }: { label?: string }) {
  return <PageState title="Nothing here yet" message={label} />;
}

function ActionMessages({ error, success }: { error?: string; success?: string }) {
  return <>{error && <div className="app-action-error" role="alert">{error}</div>}{success && <div className="app-action-success" role="status">{success}</div>}</>;
}

function parseRouteId(raw: string | undefined) {
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}

function appShowFromShow(show: NonNullable<ReturnType<typeof useGetShowQuery>['data']>) {
  return create(AppShowSchema, {
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
  });
}

export function DashboardPage() {
  const showsQuery = useGetShowsQuery();
  const bookingsQuery = useGetBookingsQuery();
  const logQuery = useGetAuditLogQuery();

  const isLoading = showsQuery.isLoading || bookingsQuery.isLoading || logQuery.isLoading;
  const isError = showsQuery.isError || bookingsQuery.isError || logQuery.isError;

  return (
    <AppShell
      page="dashboard"
      title="Welcome back, Ada"
      eyebrow="Home / Dashboard"
      subtitle="Wednesday, April 23 · live operations data"
    >
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

export function ShowsPage() {
  const { data: shows, isLoading, isError } = useGetShowsQuery();
  const confirmed = (shows ?? [])
    .filter((show) => show.status === ShowStatus.CONFIRMED)
    .sort((a, b) => a.date.localeCompare(b.date));
  const archived = (shows ?? []).filter((show) => show.status === ShowStatus.ARCHIVED);

  return (
    <AppShell
      page="shows"
      title="Shows"
      eyebrow="Home / Shows"
      action={
        <div className="app-topbar-actions">
          <Button variant="outline" size="sm" iconLeft="filter" aria-label="Filter shows" />
          <Button variant="outline" size="sm" iconLeft="search" aria-label="Search shows" />
          <Button size="sm" iconLeft="plus">New show</Button>
        </div>
      }
    >
      {isLoading ? (
        <LoadingState />
      ) : isError || !shows ? (
        <ErrorState />
      ) : shows.length === 0 ? (
        <EmptyState label="No shows returned from the real backend." />
      ) : (
        <>
          <ShowsFilterBar confirmedCount={confirmed.length} />
          <ShowsConfirmedPanel shows={confirmed} />
          <div style={{ height: 20 }} />
          <ShowsArchivedPanel shows={archived} />
        </>
      )}
    </AppShell>
  );
}

export function ShowDetailPage() {
  const id = parseRouteId(useParams().id);
  const { data: show, isLoading, isError } = useGetShowQuery(id ?? 0, { skip: id === undefined });
  const [cancelShow, cancelState] = useCancelShowMutation();
  const [archiveShow, archiveState] = useArchiveShowMutation();
  const [announceShow, announceState] = useAnnounceShowMutation();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const handleCancelShow = async () => {
    if (!id) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await cancelShow(id).unwrap();
      setActionSuccess('Show cancelled.');
    } catch {
      setActionError('Could not cancel this show. Check your session and backend logs.');
    }
  };

  const handleArchiveShow = async () => {
    if (!id) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await archiveShow(id).unwrap();
      setActionSuccess('Show archived.');
    } catch {
      setActionError('Could not archive this show. Check your session and backend logs.');
    }
  };

  const handleAnnounceShow = async () => {
    if (!id) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await announceShow(id).unwrap();
      setActionSuccess('Announcement requested.');
    } catch {
      setActionError('Could not announce this show. Check your session and backend logs.');
    }
  };

  return (
    <AppShell
      page="show-detail"
      title={show?.artist ?? 'Show detail'}
      eyebrow="Shows / Detail"
      action={<Button size="sm" iconLeft="edit" disabled={!show}>Edit</Button>}
    >
      {id === undefined ? (
        <ErrorState label="Invalid show id in the route." />
      ) : isLoading ? (
        <LoadingState label="Loading show detail from the backend…" />
      ) : isError || !show ? (
        <ErrorState label="Show not found or unavailable." />
      ) : (
        <>
          <ShowDetailHero show={appShowFromShow(show)} />
          <div className="app-detail-grid">
            <ShowDetailInfoPanel show={appShowFromShow(show)} />
            <ShowDetailDiscordPanel />
          </div>
          {actionError && <div className="app-action-error" role="alert">{actionError}</div>}
          {actionSuccess && <div className="app-action-success" role="status">{actionSuccess}</div>}
          <div className="app-detail-actions">
            <Button variant="outline">Duplicate</Button>
            <Button variant="outline" iconLeft="archive" onClick={handleArchiveShow} disabled={archiveState.isLoading}>Archive</Button>
            <Button variant="outline" iconLeft="external" onClick={handleAnnounceShow} disabled={announceState.isLoading}>Announce</Button>
            <Button variant="danger" iconLeft="trash" onClick={handleCancelShow} disabled={cancelState.isLoading}>Cancel show</Button>
          </div>
        </>
      )}
    </AppShell>
  );
}

export function CalendarPage() {
  const { data: events, isLoading, isError } = useGetCalendarQuery();
  const [createHold, holdState] = useCreateCalendarHoldMutation();
  const [createBlocked, blockedState] = useCreateCalendarBlockedMutation();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const handleCreateHold = async () => {
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await createHold({ date: '2026-06-01', label: 'Hold — TBD' }).unwrap();
      setActionSuccess('Hold created for 2026-06-01.');
    } catch {
      setActionError('Could not create hold. Check your session and backend logs.');
    }
  };

  const handleCreateBlocked = async () => {
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await createBlocked({ date: '2026-06-02', reason: 'Closed' }).unwrap();
      setActionSuccess('Blocked date created for 2026-06-02.');
    } catch {
      setActionError('Could not create blocked date. Check your session and backend logs.');
    }
  };

  return (
    <AppShell
      page="calendar"
      title="Calendar"
      eyebrow="Home / Calendar"
      subtitle="Plan the room · holds, confirms, and off-nights"
      action={<div className="app-topbar-actions"><Button variant="outline" size="sm" iconLeft="plus" onClick={handleCreateHold} disabled={holdState.isLoading}>Add hold</Button><Button size="sm" iconLeft="warning" onClick={handleCreateBlocked} disabled={blockedState.isLoading}>Block date</Button></div>}
    >
      {isLoading ? (
        <LoadingState />
      ) : isError || !events ? (
        <ErrorState />
      ) : events.length === 0 ? (
        <><ActionMessages error={actionError} success={actionSuccess} /><EmptyState label="No holds or blocked dates returned yet." /></>
      ) : (
        <><ActionMessages error={actionError} success={actionSuccess} /><CalendarBoard events={events} /></>
      )}
    </AppShell>
  );
}

export function BookingsPage() {
  const { data: bookings, isLoading, isError } = useGetBookingsQuery();
  const [approveBooking] = useApproveBookingMutation();
  const [declineBooking] = useDeclineBookingMutation();
  const [actionError, setActionError] = useState<string | undefined>();

  const handleApprove = async (booking: NonNullable<typeof bookings>[number]) => {
    setActionError(undefined);
    try {
      await approveBooking(booking.id).unwrap();
    } catch {
      setActionError('Could not approve this booking. Check your session and backend logs.');
    }
  };

  const handleDecline = async (booking: NonNullable<typeof bookings>[number]) => {
    setActionError(undefined);
    try {
      await declineBooking(booking.id).unwrap();
    } catch {
      setActionError('Could not decline this booking. Check your session and backend logs.');
    }
  };

  return (
    <AppShell
      page="bookings"
      title="Bookings"
      eyebrow="Home / Bookings"
      subtitle="Submissions from #booking-requests"
      action={
        <div className="app-topbar-actions">
          <Button variant="outline" size="sm" iconLeft="external">Open form</Button>
          <Button size="sm" iconLeft="sparkle">Auto-review</Button>
        </div>
      }
    >
      {isLoading ? (
        <LoadingState />
      ) : isError || !bookings ? (
        <ErrorState />
      ) : bookings.length === 0 ? (
        <EmptyState label="No booking submissions returned from the backend." />
      ) : (
        <div className="app-bookings-layout">
          <div>
            {actionError && <div className="app-action-error" role="alert">{actionError}</div>}
            <BookingsInboxPanel bookings={bookings} onApprove={handleApprove} onDecline={handleDecline} />
            <div style={{ height: 18 }} />
            <BookingsProcessedPanel bookings={bookings} />
          </div>
          <BookingsInsightsPanel />
        </div>
      )}
    </AppShell>
  );
}

export function BookingReviewPage() {
  const id = parseRouteId(useParams().id);
  const { data: bookings, isLoading, isError } = useGetBookingsQuery();
  const booking = bookings?.find((candidate) => candidate.id === id);
  const [approveBooking, approveState] = useApproveBookingMutation();
  const [declineBooking, declineState] = useDeclineBookingMutation();
  const [actionError, setActionError] = useState<string | undefined>();

  const handleApprove = async () => {
    if (!booking) return;
    setActionError(undefined);
    try {
      await approveBooking(booking.id).unwrap();
    } catch {
      setActionError('Could not approve this booking. Check your session and backend logs.');
    }
  };

  const handleDecline = async () => {
    if (!booking) return;
    setActionError(undefined);
    try {
      await declineBooking(booking.id).unwrap();
    } catch {
      setActionError('Could not decline this booking. Check your session and backend logs.');
    }
  };

  return (
    <AppShell
      page="booking-review"
      title={booking?.artistName ?? 'Booking review'}
      eyebrow="Bookings / Review"
      action={<Button variant="outline" size="sm" iconLeft="external" disabled={!booking}>Open link</Button>}
    >
      {id === undefined ? (
        <ErrorState label="Invalid booking id in the route." />
      ) : isLoading ? (
        <LoadingState label="Loading booking submission from the backend…" />
      ) : isError || !bookings ? (
        <ErrorState />
      ) : !booking ? (
        <EmptyState label="No booking submission with that id was returned." />
      ) : (
        <>
          <BookingReviewHero booking={booking} />
          <div className="app-detail-grid">
            <BookingReviewRequestPanel booking={booking} />
            <BookingReviewDatePanel />
          </div>
          <BookingReviewNotePanel booking={booking} />
          {actionError && <div className="app-action-error" role="alert">{actionError}</div>}
          <div className="app-detail-actions">
            <Button variant="danger" iconLeft="x" onClick={handleDecline} disabled={booking.status !== SubmissionStatus.PENDING || declineState.isLoading}>Decline</Button>
            <Button variant="success" iconLeft="check" onClick={handleApprove} disabled={booking.status !== SubmissionStatus.PENDING || approveState.isLoading}>Approve</Button>
          </div>
        </>
      )}
    </AppShell>
  );
}

export function ArtistsPage() {
  const { data: artists, isLoading, isError } = useGetArtistsQuery();

  return (
    <AppShell page="artists" title="Artists" eyebrow="Home / Artists">
      {isLoading ? (
        <LoadingState />
      ) : isError || !artists ? (
        <ErrorState />
      ) : artists.length === 0 ? (
        <EmptyState label="No artists returned from the backend." />
      ) : (
        <Panel title="All artists" section="artists-roster"><ArtistRoster artists={artists} /></Panel>
      )}
    </AppShell>
  );
}

export function AttendancePage() {
  const { data: entries, isLoading, isError } = useGetAttendanceQuery();
  const [updateAttendance, updateState] = useUpdateAttendanceMutation();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const handleUpdateEntry = async (entry: NonNullable<typeof entries>[number]) => {
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await updateAttendance({
        showId: entry.showId,
        draw: entry.draw > 0 ? entry.draw : 1,
        notes: entry.notes || 'Logged from staff app.',
        incident: entry.incident,
        incidentNotes: entry.incidentNotes,
      }).unwrap();
      setActionSuccess(`Attendance updated for ${entry.artist}.`);
    } catch {
      setActionError('Could not update attendance. Check your session and backend logs.');
    }
  };

  return (
    <AppShell page="attendance" title="Post-show log" eyebrow="Home / Post-show log">
      {isLoading ? (
        <LoadingState />
      ) : isError || !entries ? (
        <ErrorState />
      ) : entries.length === 0 ? (
        <><ActionMessages error={actionError} success={actionSuccess} /><EmptyState label="No attendance logs returned from the backend." /></>
      ) : (
        <><ActionMessages error={actionError} success={actionSuccess} /><Panel title="Past shows" section="attendance-past-shows"><AttendancePanel entries={entries} onUpdateEntry={handleUpdateEntry} isUpdating={updateState.isLoading} /></Panel></>
      )}
    </AppShell>
  );
}

export function AuditLogPage() {
  const { data: log, isLoading, isError } = useGetAuditLogQuery();

  return (
    <AppShell page="audit-log" title="Audit log" eyebrow="Home / Audit log">
      {isLoading ? (
        <LoadingState />
      ) : isError || !log ? (
        <ErrorState />
      ) : log.length === 0 ? (
        <EmptyState label="No audit log entries returned from the backend." />
      ) : (
        <Panel title="Activity" section="audit-log-activity"><AuditLogPanel log={log} /></Panel>
      )}
    </AppShell>
  );
}

export function DiscordPage() {
  return (
    <AppShell page="discord" title="Discord" eyebrow="Home / Discord">
      <Panel title="Channel mapping" section="discord-channel-mapping">
        <DiscordMappingPanel mappings={seedMappings} />
      </Panel>
    </AppShell>
  );
}

export function SettingsPage() {
  const { data: settings, isLoading, isError } = useGetSettingsQuery();
  const [updateSettings, updateState] = useUpdateSettingsMutation();
  const [actionError, setActionError] = useState<string | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | undefined>();

  const toggleSetting = async (key: 'autoArchive' | 'discordPosting' | 'safeSpaceRequired') => {
    if (!settings) return;
    setActionError(undefined);
    setActionSuccess(undefined);
    try {
      await updateSettings({ ...settings, [key]: !settings[key] }).unwrap();
      setActionSuccess('Settings updated.');
    } catch {
      setActionError('Could not update settings. Check your session and backend logs.');
    }
  };

  return (
    <AppShell page="settings" title="Settings" eyebrow="Home / Settings">
      {isLoading ? (
        <LoadingState />
      ) : isError || !settings ? (
        <ErrorState />
      ) : (
        <><ActionMessages error={actionError} success={actionSuccess} /><Panel title="Space info" section="settings-space-info"><SettingsPanel settings={settings} isUpdating={updateState.isLoading} onToggleAutoArchive={() => toggleSetting('autoArchive')} onToggleDiscordPosting={() => toggleSetting('discordPosting')} onToggleSafeSpaceRequired={() => toggleSetting('safeSpaceRequired')} /></Panel></>
      )}
    </AppShell>
  );
}

export function LoginPage() {
  return <main className="app-auth-page" data-page="login"><section className="app-auth-marquee" data-section="login-marquee"><header><PyxisMark size={30}/><b>pyxis</b></header><div><h1><span className="app-auth-desktop-copy">The operations desk for a small-venue community.</span><span className="app-auth-mobile-copy">Run the room from your pocket.</span></h1><p><span className="app-auth-desktop-copy">Confirm shows, review booking requests, and let a friendly bot handle the Discord posts, pins and archives — so the humans can focus on the music.</span><span className="app-auth-mobile-copy">Confirm shows, review bookings, and keep the Discord humming — wherever you are.</span></p><Button className="app-auth-mobile-cta" variant="discord" size="lg" iconLeft="discord" fullWidth>Continue with Discord</Button></div><footer><span><strong>v1.2.0</strong> · est. 2025</span><span>25 Manton Ave · Providence RI</span></footer></section><section className="app-auth-panel" data-section="login-panel"><span className="app-eyebrow">Staff portal</span><h2>Welcome back</h2><p>Access is invite-only. Sign in with the Discord account your admin has authorised.</p><Button variant="discord" size="lg" iconLeft="discord" fullWidth>Continue with Discord</Button><div className="app-auth-divider"><i/>OR<i/></div><Field label="Email"><Input placeholder="you@venue.xyz" icon="mail" /></Field><Field label="Magic link" hint="We'll email you a one-tap sign-in link."><Input placeholder="We'll send a link…" /></Field><Button variant="outline" size="lg" fullWidth>Email me a link</Button><footer><span>Not on the list? <b>Ask an admin →</b></span><span>Privacy</span></footer></section></main>;
}

export function SetupPage() {
  const mappings = [['#upcoming-shows','847392017483620355','Public · bot posts + pins confirmed show announcements'],['#announcements','847392017483620356','Public · broader space announcements and cancellations'],['#staff','847392017483620357','Private · auto-archive notices, reminders, bot status'],['#booking-requests','847392017483620358','Private · incoming artist submissions land here']] as const;
  return <main className="app-setup-page" data-page="setup"><div className="app-setup-heading" data-section="setup-header"><div><PyxisMark size={28}/><b>pyxis</b></div><span className="app-eyebrow">Setup · 3 of 4</span><h1>Map your Discord channels</h1><p>Tell the bot where to post. Right-click any channel in Discord and choose <b>Copy Channel ID</b> (requires Developer Mode).</p></div><div className="app-setup-progress" data-section="setup-progress">{['Space','Server','Channels','Ready'].map((label,index)=><div key={label} data-active={index===2} data-done={index<2}><b>{index<2 ? '✓' : index+1}</b><span>{label}</span></div>)}</div><section className="app-setup-card" data-section="setup-channels">{mappings.map(([name,id,hint])=><Field key={name} label={name} hint={hint}><Input value={id} icon="compass" readOnly /></Field>)}<footer><Button variant="ghost">Back</Button><div><Button variant="outline">Skip for now</Button><Button iconRight="chevron-right">Continue</Button></div></footer></section><p className="app-setup-footnote">You can change any of this later under Settings → Discord.</p></main>;
}

export function ModalShowcasePage() {
  return <><ShowsPage/><NewShowModal/></>;
}
