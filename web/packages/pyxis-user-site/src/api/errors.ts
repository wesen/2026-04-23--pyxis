import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import type { ApiError } from 'pyxis-types';

function hasApiErrorShape(data: unknown): data is ApiError {
  if (!data || typeof data !== 'object') return false;
  const maybe = data as { error?: { message?: unknown } };
  return typeof maybe.error?.message === 'string';
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return Boolean(error && typeof error === 'object' && 'status' in error);
}

function isSerializedError(error: unknown): error is SerializedError {
  return Boolean(error && typeof error === 'object' && 'message' in error);
}

export function getApiErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  if (error instanceof Error) return error.message;

  if (isFetchBaseQueryError(error)) {
    if (hasApiErrorShape(error.data)) {
      return error.data.error.message;
    }

    if (typeof error.data === 'string' && error.data.length > 0) {
      return error.data;
    }

    return `Request failed: ${String(error.status)}`;
  }

  if (isSerializedError(error) && error.message) {
    return error.message;
  }

  return 'Unknown error';
}
