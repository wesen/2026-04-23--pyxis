/**
 * Shared public API and domain contracts for the Pyxis frontend workspace.
 *
 * Keep this package dependency-free: it is imported by both pyxis-components
 * and pyxis-user-site, so it must not import either UI package.
 */
export interface LineupEntry {
    artist: string;
    role: 'headline' | 'support' | 'dj';
    start_time: string;
    end_time?: string;
}
export type AgeRestriction = '21+' | '18+' | 'All Ages';
export interface ApiError {
    error: {
        code: string;
        message: string;
    };
}
