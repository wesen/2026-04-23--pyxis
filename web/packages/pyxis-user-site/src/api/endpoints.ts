/**
 * API endpoint constants — single source of truth for all endpoint paths.
 */

export const endpoints = {
  // Public endpoints
  shows:        '/api/public/shows',
  show:         (id: number) => `/api/public/shows/${id}`,
  showFlyer:    (id: number) => `/api/public/shows/${id}/flyer`,
  archive:      '/api/public/archive',
  archiveStats: '/api/public/archive/stats',
  submissions:  '/api/public/submissions',
} as const;

export type Endpoint = typeof endpoints[keyof typeof endpoints];
