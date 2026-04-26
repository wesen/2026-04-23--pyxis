// Re-export fromJson / create so consumers don't need a direct @bufbuild/protobuf dependency
export { fromJson, toJson, create } from '@bufbuild/protobuf';

// Generated protobuf types — single source of truth for all API shapes
export {
  type Show,
  ShowSchema,
  type Show_LineupEntry,
  Show_LineupEntrySchema,
  type AppShow,
  AppShowSchema,
  type ArchivedShow,
  ArchivedShowSchema,
  type ArchiveStats,
  ArchiveStatsSchema,
  type ShowList,
  ShowListSchema,
  type ArchivedShowList,
  ArchivedShowListSchema,
  type BookingFormData,
  BookingFormDataSchema,
  type BookingConfirmation,
  BookingConfirmationSchema,
  type Submission,
  SubmissionSchema,
  type SubmissionList,
  SubmissionListSchema,
  type User,
  UserSchema,
  type AuthSession,
  AuthSessionSchema,
  type Artist,
  ArtistSchema,
  type ArtistList,
  ArtistListSchema,
  type CalendarHold,
  CalendarHoldSchema,
  type CalendarBlocked,
  CalendarBlockedSchema,
  type CalendarResponse,
  CalendarResponseSchema,
  type AttendanceLog,
  AttendanceLogSchema,
  type AttendanceLogList,
  AttendanceLogListSchema,
  type AuditLogEntry,
  AuditLogEntrySchema,
  type AuditLogEntryList,
  AuditLogEntryListSchema,
  type Settings,
  SettingsSchema,
  type SuccessResponse,
  SuccessResponseSchema,
  type ErrorResponse,
  ErrorResponseSchema,
  type FlyerUploadResponse,
  FlyerUploadResponseSchema,
} from './generated/proto/pyxis/v1/show_pb';

// Frontend-only types (not backed by protobuf — view models / UI concerns)
export type {
  AppDashboardSummary,
  CalendarEvent,
  DiscordChannelMapping,
  StaffMember,
} from './app';

export type {
  AgeRestriction,
  ShowStatus,
  SubmissionStatus,
  ApiError,
  LineupEntry,
} from './public';

export type {
  BookingStatus,
  AppShowStatus,
  ActivityType,
  UserRole,
  DiscordChannelKind,
} from './app';
