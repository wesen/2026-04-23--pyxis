// Re-export fromJson so consumers don't need a direct @bufbuild/protobuf dependency
export { fromJson } from '@bufbuild/protobuf';

// Re-export generated protobuf types
export {
  type Show as ProtoShow,
  type Show_LineupEntry,
  ShowSchema,
  type AppShow as ProtoAppShow,
  AppShowSchema,
  type ArchivedShow as ProtoArchivedShow,
  ArchivedShowSchema,
  type ArchiveStats as ProtoArchiveStats,
  ArchiveStatsSchema,
  type BookingFormData as ProtoBookingFormData,
  BookingFormDataSchema,
  type ShowList,
  ShowListSchema,
  type ArchivedShowList,
  ArchivedShowListSchema,
  type BookingConfirmation as ProtoBookingConfirmation,
  BookingConfirmationSchema,
  type Submission as ProtoSubmission,
  SubmissionSchema,
  type User as ProtoUser,
  UserSchema,
  type AuthSession as ProtoAuthSession,
  AuthSessionSchema,
} from './generated/proto/pyxis/v1/show_pb';

// Legacy hand-written types (kept during migration; components should migrate to Proto* types)
export type {
  AgeRestriction,
  ApiError,
  ArchiveStats,
  ArchivedShow,
  Artist,
  BookingConfirmation,
  BookingFormData,
  LineupEntry,
  Show,
  ShowStatus,
  Submission,
  SubmissionStatus,
} from './public';

export type {
  ActivityType,
  AppDashboardSummary,
  AppShow,
  AppShowStatus,
  ArtistProfile,
  AttendanceEntry,
  AuditLogEntry,
  AuthSession,
  BookingRequest,
  BookingStatus,
  CalendarEvent,
  DiscordChannelKind,
  DiscordChannelMapping,
  SpaceSettings,
  StaffMember,
  UserRole,
} from './app';
