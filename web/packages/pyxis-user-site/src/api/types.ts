/**
 * Compatibility re-exports for public API/domain types.
 *
 * Canonical definitions live in the `pyxis-types` workspace package. New code
 * should import from `pyxis-types`; this file remains temporarily so existing
 * user-site imports can migrate incrementally.
 */

export type {
  AgeRestriction,
  ApiError,
  ArchiveStats,
  ArchivedShow,
  BookingConfirmation,
  BookingFormData,
  LineupEntry,
  Show,
  ShowStatus,
} from 'pyxis-types';
