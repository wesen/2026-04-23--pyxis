// API response types — shared between pyxis-components (for type-safe stories)
// and pyxis-user-site (for React Query / RTK Query hooks).
// These match the API surface defined in the backend analysis doc.

/* ─── Show types ──────────────────────────────────────── */

export interface Show {
  id: number;
  artist: string;
  date: string;           // "YYYY-MM-DD"
  doors_time: string;     // "8:00 PM"
  start_time?: string;    // "9:00 PM"
  age: AgeRestriction;
  price: string;         // "$12 adv / $15 door"
  genre: string;
  description?: string;  // Present on show detail endpoint
  lineup?: LineupEntry[]; // Present on show detail endpoint
  flyer_url?: string;     // Present on show detail endpoint
  status: ShowStatus;
  submission_id?: number;
  artist_id?: number;
  created_at: string;
  updated_at: string;
}

export interface ArchivedShow {
  id: number;
  artist: string;
  date: string;
  genre: string;
  draw: number;           // Attendance count
}

export interface LineupEntry {
  artist: string;
  role: 'headline' | 'support' | 'dj';
  start_time: string;
  end_time?: string;
}

export type ShowStatus = 'confirmed' | 'cancelled' | 'archived';

export type AgeRestriction = '21+' | '18+' | 'All Ages';

/* ─── Artist / submission types ───────────────────────── */

export interface Artist {
  id: number;
  name: string;
  genre?: string;
  links?: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: number;
  artist_id?: number;
  artist_name: string;
  genre?: string;
  preferred_date?: string;
  expected_draw?: number;
  links: string;
  tech_rider?: string;
  message?: string;
  status: SubmissionStatus;
  staff_notes?: string;
  created_at: string;
  updated_at: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'declined' | 'hold' | 'cancelled';

/* ─── Archive stats ───────────────────────────────────── */

export interface ArchiveStats {
  total_shows: number;
  total_attendance: number;
  years_running: number;
  unique_artists: number;
}

/* ─── Booking form ────────────────────────────────────── */

export interface BookingFormData {
  artist_name: string;
  genre?: string;
  preferred_date?: string;
  expected_draw?: number;
  links: string;
  tech_rider?: string;
  message?: string;
}

export interface BookingConfirmation {
  success: boolean;
  submission_id?: number;
}

/* ─── API error ────────────────────────────────────────── */

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
