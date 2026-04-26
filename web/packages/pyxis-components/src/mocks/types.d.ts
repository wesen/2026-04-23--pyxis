export interface Show {
    id: number;
    artist: string;
    date: string;
    doorsTime: string;
    startTime?: string;
    age: AgeRestriction;
    price: string;
    genre: string;
    description?: string;
    lineup?: LineupEntry[];
    flyerUrl?: string;
    status: ShowStatus;
    submissionId?: number;
    artistId?: number;
    createdAt: string;
    updatedAt: string;
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
    startTime: string;
    end_time?: string;
}
export type ShowStatus = 'confirmed' | 'cancelled' | 'archived';
export type AgeRestriction = '21+' | '18+' | 'All Ages';
export interface Artist {
    id: number;
    name: string;
    genre?: string;
    links?: string;
    createdAt: string;
    updatedAt: string;
}
export interface Submission {
    id: number;
    artistId?: number;
    artistName: string;
    genre?: string;
    preferred_date?: string;
    expected_draw?: number;
    links: string;
    tech_rider?: string;
    message?: string;
    status: SubmissionStatus;
    staff_notes?: string;
    createdAt: string;
    updatedAt: string;
}
export type SubmissionStatus = 'pending' | 'approved' | 'declined' | 'hold' | 'cancelled';
export interface ArchiveStats {
    totalShows: number;
    totalAttendance: number;
    yearsRunning: number;
    uniqueArtists: number;
}
export interface BookingFormData {
    artistName: string;
    genre?: string;
    preferred_date?: string;
    expected_draw?: number;
    links: string;
    tech_rider?: string;
    message?: string;
}
export interface BookingConfirmation {
    success: boolean;
    submissionId?: number;
}
export interface ApiError {
    error: {
        code: string;
        message: string;
    };
}
