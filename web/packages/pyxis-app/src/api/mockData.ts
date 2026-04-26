import {
  create,
  AppShowSchema,
  ArtistSchema,
  AttendanceLogSchema,
  AuditLogEntrySchema,
  AuthSessionSchema,
  SubmissionSchema,
  UserSchema,
  SettingsSchema,
  ShowStatus,
  SubmissionStatus,
} from 'pyxis-types';
import type { CalendarEvent, DiscordChannelMapping } from 'pyxis-types';

export const shows = [
  create(AppShowSchema, { id: 42, artist: 'Burial Hex', date: '2025-05-02', doors: '8:00 PM', age: '21+', price: '$12 adv / $15 door', status: ShowStatus.CONFIRMED, genre: 'Darkwave', draw: 70, capacity: 150, pinned: true, notes: '' }),
  create(AppShowSchema, { id: 43, artist: 'Moor Mother', date: '2025-05-09', doors: '7:00 PM', age: 'All Ages', price: '$15', status: ShowStatus.CONFIRMED, genre: 'Experimental', draw: 120, capacity: 150, pinned: true, notes: '' }),
  create(AppShowSchema, { id: 44, artist: 'Cygnus + Guests', date: '2025-05-17', doors: '9:00 PM', age: '18+', price: '$8', status: ShowStatus.CONFIRMED, genre: 'Techno', draw: 90, capacity: 150, pinned: true, notes: '' }),
  create(AppShowSchema, { id: 45, artist: 'Open Mic Night', date: '2025-05-23', doors: '7:00 PM', age: 'All Ages', price: 'Free', status: ShowStatus.CONFIRMED, genre: 'Various', draw: 40, capacity: 150, notes: '' }),
  create(AppShowSchema, { id: 46, artist: 'Zola Jesus', date: '2025-06-06', doors: '8:00 PM', age: '21+', price: '$20', status: ShowStatus.CONFIRMED, genre: 'Darkwave', draw: 160, capacity: 150, notes: '' }),
  create(AppShowSchema, { id: 47, artist: 'Basement Frequencies', date: '2025-05-30', doors: '10:00 PM', age: '21+', price: '$10', status: ShowStatus.CONFIRMED, genre: 'Techno', draw: 85, capacity: 150, notes: '' }),
  create(AppShowSchema, { id: 40, artist: 'Planning for Burial', date: '2025-03-14', doors: '8:00 PM', age: '18+', price: '$10', status: ShowStatus.ARCHIVED, genre: 'Ambient', draw: 34, capacity: 150, notes: '' }),
  create(AppShowSchema, { id: 41, artist: 'Actress', date: '2025-02-28', doors: '9:00 PM', age: '21+', price: '$12', status: ShowStatus.ARCHIVED, genre: 'Electronic', draw: 61, capacity: 150, notes: '' }),
];

export const bookings = [
  create(SubmissionSchema, { id: 1, artistId: 0, artistName: 'Pharmakon', preferredDate: '2025-06-14', genre: 'Industrial', expectedDraw: 80, links: 'pharmakon.bandcamp.com', techRider: '', message: '', contactDiscord: '', status: SubmissionStatus.PENDING, reviewedBy: 0, reviewedAt: '', createdAt: 'Apr 19' }),
  create(SubmissionSchema, { id: 2, artistId: 0, artistName: 'Lust for Youth', preferredDate: '2025-06-21', genre: 'Darkwave', expectedDraw: 120, links: 'instagram.com/lustyouth', techRider: '', message: '', contactDiscord: '', status: SubmissionStatus.PENDING, reviewedBy: 0, reviewedAt: '', createdAt: 'Apr 20' }),
  create(SubmissionSchema, { id: 5, artistId: 0, artistName: 'Container', preferredDate: '2025-07-19', genre: 'Noise', expectedDraw: 55, links: 'container.bandcamp.com', techRider: '', message: '', contactDiscord: '', status: SubmissionStatus.PENDING, reviewedBy: 0, reviewedAt: '', createdAt: 'Apr 22' }),
  create(SubmissionSchema, { id: 3, artistId: 0, artistName: 'Orphx', preferredDate: '2025-07-04', genre: 'EBM', expectedDraw: 60, links: 'orphx.com', techRider: '', message: '', contactDiscord: '', status: SubmissionStatus.APPROVED, reviewedBy: 0, reviewedAt: '', createdAt: 'Apr 18' }),
  create(SubmissionSchema, { id: 4, artistId: 0, artistName: 'Arca', preferredDate: '2025-07-12', genre: 'Experimental', expectedDraw: 200, links: 'arca1000.com', techRider: '', message: '', contactDiscord: '', status: SubmissionStatus.DECLINED, reviewedBy: 0, reviewedAt: '', createdAt: 'Apr 15' }),
];

export const artists = [
  create(ArtistSchema, { id: 1, name: 'Burial Hex', genre: 'Darkwave', links: 'burialvault.com', notes: 'Great draw, always professional. Prefers no opener.', createdAt: '', updatedAt: '' }),
  create(ArtistSchema, { id: 2, name: 'Moor Mother', genre: 'Experimental', links: 'moormotherpoet.com', notes: '', createdAt: '', updatedAt: '' }),
  create(ArtistSchema, { id: 3, name: 'Planning for Burial', genre: 'Ambient', links: 'planningforburial.com', notes: 'Headliner material.', createdAt: '', updatedAt: '' }),
  create(ArtistSchema, { id: 4, name: 'Actress', genre: 'Electronic', links: 'theactrss.com', notes: '', createdAt: '', updatedAt: '' }),
  create(ArtistSchema, { id: 5, name: 'Container', genre: 'Noise', links: 'container.bandcamp.com', notes: 'Very loud — warn neighbours about 10pm curfew.', createdAt: '', updatedAt: '' }),
  create(ArtistSchema, { id: 6, name: 'Pharmakon', genre: 'Industrial', links: 'pharmakon.bandcamp.com', notes: 'Pending booking Jun 14.', createdAt: '', updatedAt: '' }),
  create(ArtistSchema, { id: 7, name: 'Cygnus', genre: 'Techno', links: 'cygnus.bandcamp.com', notes: '', createdAt: '', updatedAt: '' }),
  create(ArtistSchema, { id: 8, name: 'Orphx', genre: 'EBM', links: 'orphx.com', notes: '', createdAt: '', updatedAt: '' }),
];

export const auditLog = [
  create(AuditLogEntrySchema, { id: 1, actor: 'jamie', actorId: 0, action: 'approved show #47 · Orphx · Jul 4', entityType: 'show', entityId: 47, metadata: '{}', createdAt: 'Today · 11:42' }),
  create(AuditLogEntrySchema, { id: 2, actor: 'bot', actorId: 0, action: 'posted + pinned #47 in #upcoming-shows', entityType: 'show', entityId: 47, metadata: '{}', createdAt: 'Today · 11:39' }),
  create(AuditLogEntrySchema, { id: 3, actor: 'sam', actorId: 0, action: 'declined submission · Arca · Jul 12', entityType: 'submission', entityId: 4, metadata: '{}', createdAt: 'Today · 09:14' }),
  create(AuditLogEntrySchema, { id: 4, actor: 'bot', actorId: 0, action: 'auto-archived 2 past shows (Planning for Burial, Actress)', entityType: 'show', entityId: 0, metadata: '{}', createdAt: 'Apr 22 · 23:00' }),
  create(AuditLogEntrySchema, { id: 5, actor: 'jamie', actorId: 0, action: 'edited show #42 · updated doors to 8:00 PM', entityType: 'show', entityId: 42, metadata: '{}', createdAt: 'Apr 21 · 16:30' }),
  create(AuditLogEntrySchema, { id: 6, actor: 'bot', actorId: 0, action: 'received new submission · Lust for Youth · Jun 21', entityType: 'submission', entityId: 2, metadata: '{}', createdAt: 'Apr 20 · 10:05' }),
];

export const calendarEvents: CalendarEvent[] = [
  { date: '2025-05-02', label: 'Burial Hex', status: 'confirmed' },
  { date: '2025-05-09', label: 'Moor Mother', status: 'confirmed' },
  { date: '2025-05-14', label: 'Hold — TBD', status: 'hold' },
  { date: '2025-05-17', label: 'Cygnus + Guests', status: 'confirmed' },
  { date: '2025-05-23', label: 'Open Mic', status: 'confirmed' },
  { date: '2025-05-26', label: 'Closed', status: 'blocked' },
  { date: '2025-05-30', label: 'Basement Freq.', status: 'confirmed' },
];

export const attendance = [
  create(AttendanceLogSchema, { id: 40, showId: 40, artist: 'Planning for Burial', date: '2025-03-14', draw: 0, notes: '', incident: false, incidentNotes: '', loggedBy: 0, createdAt: '', updatedAt: '' }),
  create(AttendanceLogSchema, { id: 41, showId: 41, artist: 'Actress', date: '2025-02-28', draw: 61, notes: 'Good energy, no issues.', incident: false, incidentNotes: '', loggedBy: 0, createdAt: '', updatedAt: '' }),
  create(AttendanceLogSchema, { id: 38, showId: 38, artist: 'Burial Hex', date: '2024-11-15', draw: 55, notes: '', incident: false, incidentNotes: '', loggedBy: 0, createdAt: '', updatedAt: '' }),
  create(AttendanceLogSchema, { id: 39, showId: 39, artist: 'Cygnus', date: '2024-08-01', draw: 74, notes: '', incident: false, incidentNotes: '', loggedBy: 0, createdAt: '', updatedAt: '' }),
];

export const discordMappings: DiscordChannelMapping[] = [
  { kind: 'bookingRequests', label: 'Booking requests', channelName: '#booking-requests', channelId: '847392017483620358', enabled: true },
  { kind: 'upcomingShows', label: 'Upcoming shows', channelName: '#upcoming-shows', channelId: '847392017483620359', enabled: true },
  { kind: 'staffLog', label: 'Staff log', channelName: '#staff-log', channelId: '847392017483620360', enabled: true },
  { kind: 'postShowLog', label: 'Post-show log', channelName: '#post-show-log', channelId: '847392017483620361', enabled: false },
];

export const settings = create(SettingsSchema, {
  id: 1,
  spaceName: 'Pyxis',
  tagline: '',
  address: '319 N 11th St, Philadelphia, PA',
  capacity: 150,
  contactEmail: 'booking@pyxis.xyz',
  bookingEmail: 'booking@pyxis.xyz',
  website: '',
  discordGuildId: '',
  discordChUpcoming: '',
  discordChAnnouncements: '',
  discordChStaff: '',
  discordChBookings: '',
  setupComplete: true,
  timezone: 'America/New_York',
  autoArchive: true,
  discordPosting: true,
  safeSpaceRequired: true,
  updatedAt: '',
});

export const mockUser = create(UserSchema, {
  id: 1,
  discordId: 'ada',
  discordUsername: 'Ada Dove',
  avatarUrl: '',
  role: 'Admin',
  createdAt: '',
  lastLoginAt: '',
});

export const session = create(AuthSessionSchema, { user: mockUser, spaceName: 'Pyxis', authenticated: true });
