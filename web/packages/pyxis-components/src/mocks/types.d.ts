export interface Show {
    id: number;
    artist: string;
    date: string;
    doors_time: string;
    start_time?: string;
    age: AgeRestriction;
    price: string;
    genre: string;
    description?: string;
    lineup?: LineupEntry[];
    flyer_url?: string;
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
    draw: number;
}
export interface LineupEntry {
    artist: string;
    role: 'headline' | 'support' | 'dj';
    start_time: string;
    end_time?: string;
}
export type ShowStatus = 'confirmed' | 'cancelled' | 'archived';
export type AgeRestriction = '21+' | '18+' | 'All Ages';
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
export interface ArchiveStats {
    total_shows: number;
    total_attendance: number;
    years_running: number;
    unique_artists: number;
}
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
export interface ApiError {
    error: {
        code: string;
        message: string;
    };
}
