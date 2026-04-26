// Re-export fromJson so consumers don't need a direct @bufbuild/protobuf dependency
export { fromJson } from '@bufbuild/protobuf';

// Re-export generated protobuf types
export {
  type Show,
  type Show_LineupEntry,
  ShowSchema,
  type AppShow,
  AppShowSchema,
  type ArchivedShow,
  ArchivedShowSchema,
  type ArchiveStats,
  ArchiveStatsSchema,
  type BookingFormData,
  BookingFormDataSchema,
  type ShowList,
  ShowListSchema,
  type ArchivedShowList,
  ArchivedShowListSchema,
  type BookingConfirmation,
  BookingConfirmationSchema,
  type Submission,
  SubmissionSchema,
  type User,
  UserSchema,
  type AuthSession,
  AuthSessionSchema,
} from './generated/proto/pyxis/v1/show_pb';

// Re-export frontend-specific types (not from protobuf)
export type {
  ActivityType,
  AppDashboardSummary,
  AppShowStatus,
  ArtistProfile,
  AttendanceEntry,
  AuditLogEntry,
  BookingRequest,
  BookingStatus,
  CalendarEvent,
  DiscordChannelKind,
  DiscordChannelMapping,
  SpaceSettings,
  StaffMember,
  UserRole,
} from './app';
