/**
 * Base API client for the Pyxis user site.
 * All API calls go through here. In production, VITE_API_URL is set.
 * In Storybook/tests, MSW intercepts the requests.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export class ApiException extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.status = status;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorBody: ApiError;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = {
        error: {
          code: 'UNKNOWN_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      };
    }
    throw new ApiException(
      errorBody.error.code,
      errorBody.error.message,
      response.status
    );
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
