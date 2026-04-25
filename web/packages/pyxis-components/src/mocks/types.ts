// Compatibility re-exports for public API/domain and mock data types.
//
// Canonical definitions live in the `pyxis-types` workspace package. New code
// should import from `pyxis-types`; this file remains temporarily for older
// stories and mocks that still import `pyxis-components/mocks/types`.

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
} from 'pyxis-types';
