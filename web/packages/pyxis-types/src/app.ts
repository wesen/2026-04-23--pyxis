export type AppShowStatus = 'confirmed' | 'hold' | 'blocked' | 'archived' | 'draft';
export type BookingStatus = 'pending' | 'approved' | 'declined';
export type ActivityType = 'approve' | 'bot' | 'decline' | 'archive' | 'edit' | 'add';
export type DiscordChannelKind = 'bookingRequests' | 'upcomingShows' | 'staffLog' | 'postShowLog' | 'announcements';
export type UserRole = 'Admin' | 'Booker' | 'Door' | 'Bot';

export interface AppShow {
  id: number;
  artist: string;
  date: string;
  doors: string;
  age: string;
  price: string;
  status: AppShowStatus;
  genre: string;
  draw: number;
  capacity: number;
  pinned?: boolean;
  notes?: string;
}

export interface BookingRequest {
  id: number;
  artist: string;
  date: string;
  genre: string;
  draw: number;
  links: string;
  status: BookingStatus;
  submitted: string;
  notes?: string;
}

export interface ArtistProfile {
  id: number;
  name: string;
  genre: string;
  shows: number;
  lastShow: string | null;
  links: string;
  avgDraw: number | null;
  notes: string;
}

export interface CalendarEvent {
  date: string;
  label: string;
  status: AppShowStatus;
}

export interface AttendanceEntry {
  id: number;
  artist: string;
  date: string;
  logged: boolean;
  draw?: number;
  notes?: string;
}

export interface AuditLogEntry {
  id: number;
  time: string;
  user: string;
  action: string;
  type: ActivityType;
}

export interface DiscordChannelMapping {
  kind: DiscordChannelKind;
  label: string;
  channelName: string;
  channelId: string;
  enabled: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastSeen: string;
  status: 'Live' | 'Invited' | 'Paused';
}

export interface SpaceSettings {
  name: string;
  address: string;
  capacity: number;
  timezone: string;
  bookingEmail: string;
  autoArchive: boolean;
  discordPosting: boolean;
  safeSpaceRequired: boolean;
  staff: StaffMember[];
}

export interface AuthSession {
  user: StaffMember;
  spaceName: string;
  authenticated: boolean;
}

export interface AppDashboardSummary {
  upcomingCount: number;
  pendingBookings: number;
  capacityAverage: number;
  unloggedShows: number;
}
