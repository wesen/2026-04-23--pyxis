export const endpoints = {
  session: '/api/app/session',
  shows: '/api/app/shows',
  show: (id: number) => `/api/app/shows/${id}`,
  bookings: '/api/app/bookings',
  booking: (id: number) => `/api/app/bookings/${id}`,
  artists: '/api/app/artists',
  artist: (id: number) => `/api/app/artists/${id}`,
  calendar: '/api/app/calendar',
  attendance: '/api/app/attendance',
  auditLog: '/api/app/audit-log',
  discord: '/api/app/discord',
  settings: '/api/app/settings',
} as const;
