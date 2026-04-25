export type AppApiError = { status: number; message: string; details?: unknown };
export function appApiError(status: number, message: string, details?: unknown): AppApiError { return { status, message, details }; }
