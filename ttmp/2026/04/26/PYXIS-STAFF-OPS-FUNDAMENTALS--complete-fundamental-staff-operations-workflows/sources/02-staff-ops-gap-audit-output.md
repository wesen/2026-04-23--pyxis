---
title: Staff operations gap audit output
docType: reference
ticket: PYXIS-STAFF-OPS-FUNDAMENTALS
topics: [pyxis, react, frontend, backend, protobuf, postgresql, staff-app]
status: active
intent: short-term
---

# Staff operations gap audit

## Frontend RTK endpoints
89:    createShow: builder.mutation<Show, Show>({
95:    updateShow: builder.mutation<Show, Show>({
119:    uploadShowFlyer: builder.mutation<FlyerUploadResponse, FlyerUploadInput>({
129:    deleteShowFlyer: builder.mutation<void, { showId: number; filename: string }>({
134:    getBookings: builder.query<Submission[], void>({
143:    approveBooking: builder.mutation<Show, number>({
149:    declineBooking: builder.mutation<SuccessResponse, number>({
170:    updateArtist: builder.mutation<Artist, Artist>({
216:    updateAttendance: builder.mutation<AttendanceLog, AttendanceUpdateInput>({
237:    updateSettings: builder.mutation<Settings, Settings>({

## Current page affordances
14:  useAnnounceShowMutation,
16:  useArchiveShowMutation,
27:  ArtistRoster,
28:  AttendancePanel,
34:  SettingsPanel,
39:  BookingReviewNotePanel,
49:import { ShowsArchivedPanel, ShowsConfirmedPanel, ShowsFilterBar } from '../components/organisms/ShowsSections';
152:          <Button size="sm" iconLeft="plus">New show</Button>
167:          <ShowsArchivedPanel shows={archived} />
178:  const [archiveShow, archiveState] = useArchiveShowMutation();
179:  const [announceShow, announceState] = useAnnounceShowMutation();
195:  const handleArchiveShow = async () => {
207:  const handleAnnounceShow = async () => {
213:      setActionSuccess('Announcement requested.');
242:            <Button variant="outline">Duplicate</Button>
243:            <Button variant="outline" iconLeft="archive" onClick={handleArchiveShow} disabled={archiveState.isLoading}>Archive</Button>
244:            <Button variant="outline" iconLeft="external" onClick={handleAnnounceShow} disabled={announceState.isLoading}>Announce</Button>
411:          <BookingReviewNotePanel booking={booking} />
435:        <Panel title="All artists" section="artists-roster"><ArtistRoster artists={artists} /></Panel>
473:        <><ActionMessages error={actionError} success={actionSuccess} /><Panel title="Past shows" section="attendance-past-shows"><AttendancePanel entries={entries} onUpdateEntry={handleUpdateEntry} isUpdating={updateState.isLoading} /></Panel></>
513:  const toggleSetting = async (key: 'autoArchive' | 'discordPosting' | 'safeSpaceRequired') => {
532:        <><ActionMessages error={actionError} success={actionSuccess} /><Panel title="Space info" section="settings-space-info"><SettingsPanel settings={settings} isUpdating={updateState.isLoading} onToggleAutoArchive={() => toggleSetting('autoArchive')} onToggleDiscordPosting={() => toggleSetting('discordPosting')} onToggleSafeSpaceRequired={() => toggleSetting('safeSpaceRequired')} /></Panel></>

## Backend handlers
38:func (s *Server) handleCreateShow(w http.ResponseWriter, r *http.Request) {
71:func (s *Server) handleUpdateShow(w http.ResponseWriter, r *http.Request) {
226:func (s *Server) handleApproveBooking(w http.ResponseWriter, r *http.Request) {
253:func (s *Server) handleDeclineBooking(w http.ResponseWriter, r *http.Request) {
314:func (s *Server) handleUpdateArtist(w http.ResponseWriter, r *http.Request) {
389:func (s *Server) handleUploadFlyer(w http.ResponseWriter, r *http.Request) {
425:func (s *Server) handleDeleteFlyer(w http.ResponseWriter, r *http.Request) {
661:func (s *Server) handleUpsertAttendance(w http.ResponseWriter, r *http.Request) {
722:func (s *Server) handleUpdateSettings(w http.ResponseWriter, r *http.Request) {

## SQL query coverage
### pkg/db/queries/shows.sql
1:-- name: ListUpcomingShows :many
9:-- name: GetShow :one
12:-- name: GetShowWithLineup :one
31:-- name: CreateShow :one
38:-- name: UpdateShow :one
47:-- name: ArchiveShow :one
50:-- name: SearchArchive :many
58:-- name: GetArchiveStats :one
68:-- name: ListAllShows :many

### pkg/db/queries/submissions.sql
1:-- name: CreateSubmission :one
6:-- name: GetSubmission :one
9:-- name: ListSubmissions :many
12:-- name: ApproveSubmission :one
18:-- name: DeclineSubmission :one

### pkg/db/queries/artists.sql
1:-- name: ListArtists :many
4:-- name: GetArtist :one
7:-- name: GetArtistByName :one
10:-- name: CreateArtist :one
15:-- name: UpdateArtist :one

### pkg/db/queries/attendance.sql
1:-- name: GetAttendanceLog :one
4:-- name: UpsertAttendanceLog :one
16:-- name: ListAttendanceLogs :many

### pkg/db/queries/settings.sql
1:-- name: GetSettings :one
4:-- name: UpdateSettings :one

## Missing markers to investigate
- No booking review note table/query should exist before this ticket.
- No show lineup replace query should exist before this ticket.
- No settings/core endpoint should exist before this ticket.
