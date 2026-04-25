import type { AppShow, ArtistProfile, AttendanceEntry, AuditLogEntry, AuthSession, BookingRequest, CalendarEvent, DiscordChannelMapping, SpaceSettings } from 'pyxis-types';

export const shows: AppShow[] = [
  { id: 42, artist: 'Burial Hex', date: '2025-05-02', doors: '8:00 PM', age: '21+', price: '$12 adv / $15 door', status: 'confirmed', genre: 'Darkwave', draw: 70, capacity: 150, pinned: true },
  { id: 43, artist: 'Moor Mother', date: '2025-05-09', doors: '7:00 PM', age: 'All Ages', price: '$15', status: 'confirmed', genre: 'Experimental', draw: 120, capacity: 150, pinned: true },
  { id: 44, artist: 'Cygnus + Guests', date: '2025-05-17', doors: '9:00 PM', age: '18+', price: '$8', status: 'confirmed', genre: 'Techno', draw: 90, capacity: 150, pinned: true },
  { id: 45, artist: 'Open Mic Night', date: '2025-05-23', doors: '7:00 PM', age: 'All Ages', price: 'Free', status: 'confirmed', genre: 'Various', draw: 40, capacity: 150 },
  { id: 46, artist: 'Zola Jesus', date: '2025-06-06', doors: '8:00 PM', age: '21+', price: '$20', status: 'confirmed', genre: 'Darkwave', draw: 160, capacity: 150 },
  { id: 47, artist: 'Basement Frequencies', date: '2025-05-30', doors: '10:00 PM', age: '21+', price: '$10', status: 'confirmed', genre: 'Techno', draw: 85, capacity: 150 },
  { id: 40, artist: 'Planning for Burial', date: '2025-03-14', doors: '8:00 PM', age: '18+', price: '$10', status: 'archived', genre: 'Ambient', draw: 34, capacity: 150 },
  { id: 41, artist: 'Actress', date: '2025-02-28', doors: '9:00 PM', age: '21+', price: '$12', status: 'archived', genre: 'Electronic', draw: 61, capacity: 150 },
];
export const bookings: BookingRequest[] = [
  { id: 1, artist: 'Pharmakon', date: '2025-06-14', genre: 'Industrial', draw: 80, links: 'pharmakon.bandcamp.com', status: 'pending', submitted: 'Apr 19' },
  { id: 2, artist: 'Lust for Youth', date: '2025-06-21', genre: 'Darkwave', draw: 120, links: 'instagram.com/lustyouth', status: 'pending', submitted: 'Apr 20' },
  { id: 5, artist: 'Container', date: '2025-07-19', genre: 'Noise', draw: 55, links: 'container.bandcamp.com', status: 'pending', submitted: 'Apr 22' },
  { id: 3, artist: 'Orphx', date: '2025-07-04', genre: 'EBM', draw: 60, links: 'orphx.com', status: 'approved', submitted: 'Apr 18' },
  { id: 4, artist: 'Arca', date: '2025-07-12', genre: 'Experimental', draw: 200, links: 'arca1000.com', status: 'declined', submitted: 'Apr 15' },
];
export const artists: ArtistProfile[] = [
  { id: 1, name: 'Burial Hex', genre: 'Darkwave', shows: 3, lastShow: '2025-05-02', links: 'burialvault.com', avgDraw: 58, notes: 'Great draw, always professional. Prefers no opener.' },
  { id: 2, name: 'Moor Mother', genre: 'Experimental', shows: 2, lastShow: '2025-05-09', links: 'moormotherpoet.com', avgDraw: 106, notes: '' },
  { id: 3, name: 'Planning for Burial', genre: 'Ambient', shows: 4, lastShow: '2025-03-14', links: 'planningforburial.com', avgDraw: 36, notes: 'Headliner material.' },
  { id: 4, name: 'Actress', genre: 'Electronic', shows: 1, lastShow: '2025-02-28', links: 'theactrss.com', avgDraw: 61, notes: '' },
  { id: 5, name: 'Container', genre: 'Noise', shows: 2, lastShow: '2025-01-18', links: 'container.bandcamp.com', avgDraw: 52, notes: 'Very loud — warn neighbours about 10pm curfew.' },
  { id: 6, name: 'Pharmakon', genre: 'Industrial', shows: 0, lastShow: null, links: 'pharmakon.bandcamp.com', avgDraw: null, notes: 'Pending booking Jun 14.' },
  { id: 7, name: 'Cygnus', genre: 'Techno', shows: 3, lastShow: '2025-05-17', links: 'cygnus.bandcamp.com', avgDraw: 75, notes: '' },
  { id: 8, name: 'Orphx', genre: 'EBM', shows: 1, lastShow: '2025-07-04', links: 'orphx.com', avgDraw: null, notes: '' },
];
export const auditLog: AuditLogEntry[] = [
  { id: 1, time: 'Today · 11:42', user: 'jamie', action: 'approved show #47 · Orphx · Jul 4', type: 'approve' },
  { id: 2, time: 'Today · 11:39', user: 'bot', action: 'posted + pinned #47 in #upcoming-shows', type: 'bot' },
  { id: 3, time: 'Today · 09:14', user: 'sam', action: 'declined submission · Arca · Jul 12', type: 'decline' },
  { id: 4, time: 'Apr 22 · 23:00', user: 'bot', action: 'auto-archived 2 past shows (Planning for Burial, Actress)', type: 'archive' },
  { id: 5, time: 'Apr 21 · 16:30', user: 'jamie', action: 'edited show #42 · updated doors to 8:00 PM', type: 'edit' },
  { id: 6, time: 'Apr 20 · 10:05', user: 'bot', action: 'received new submission · Lust for Youth · Jun 21', type: 'bot' },
];
export const calendarEvents: CalendarEvent[] = [
  { date: '2025-05-02', label: 'Burial Hex', status: 'confirmed' }, { date: '2025-05-09', label: 'Moor Mother', status: 'confirmed' }, { date: '2025-05-14', label: 'Hold — TBD', status: 'hold' }, { date: '2025-05-17', label: 'Cygnus + Guests', status: 'confirmed' }, { date: '2025-05-23', label: 'Open Mic', status: 'confirmed' }, { date: '2025-05-26', label: 'Closed', status: 'blocked' }, { date: '2025-05-30', label: 'Basement Freq.', status: 'confirmed' },
];
export const attendance: AttendanceEntry[] = [
  { id: 40, artist: 'Planning for Burial', date: '2025-03-14', logged: false }, { id: 41, artist: 'Actress', date: '2025-02-28', logged: true, draw: 61, notes: 'Good energy, no issues.' }, { id: 38, artist: 'Burial Hex', date: '2024-11-15', logged: true, draw: 55, notes: '' }, { id: 39, artist: 'Cygnus', date: '2024-08-01', logged: true, draw: 74, notes: '' },
];
export const discordMappings: DiscordChannelMapping[] = [
  { kind: 'bookingRequests', label: 'Booking requests', channelName: '#booking-requests', channelId: '847392017483620358', enabled: true },
  { kind: 'upcomingShows', label: 'Upcoming shows', channelName: '#upcoming-shows', channelId: '847392017483620359', enabled: true },
  { kind: 'staffLog', label: 'Staff log', channelName: '#staff-log', channelId: '847392017483620360', enabled: true },
  { kind: 'postShowLog', label: 'Post-show log', channelName: '#post-show-log', channelId: '847392017483620361', enabled: false },
];
export const settings: SpaceSettings = { name: 'Pyxis', address: '319 N 11th St, Philadelphia, PA', capacity: 150, timezone: 'America/New_York', bookingEmail: 'booking@pyxis.xyz', autoArchive: true, discordPosting: true, safeSpaceRequired: true, staff: [ { id: 'ada', name: 'Ada Dove', email: 'ada@pyxis.xyz', role: 'Admin', lastSeen: 'now', status: 'Live' }, { id: 'jamie', name: 'Jamie Vale', email: 'jamie@pyxis.xyz', role: 'Booker', lastSeen: '11:42', status: 'Live' }, { id: 'bot', name: 'Pyxis Bot', email: 'bot@pyxis.xyz', role: 'Bot', lastSeen: 'always', status: 'Live' } ] };
export const session: AuthSession = { user: settings.staff[0], spaceName: 'Pyxis', authenticated: true };
