import { browser } from '$app/environment';
import { invalidateAll, invalidate } from '$app/navigation';
import type { AuthStatusData, HashesResponse, HttpResp, Provider } from './types';

// The base URL of your backend API
const API_BASE_URL = 'http://127.0.0.1:8808';

// List of protected endpoints. If these return 401, we attempt refresh.
const protectedEndpoints: string[] = [
  '/api/hashes',
  '/auth/status',
  '/auth/logout'
];

let isRefreshing = false;
let refreshInProgress: Promise<boolean> | null = null;

/**
 * Attempts to refresh the authentication tokens by calling `/auth/refresh`.
 * If successful, resolves. If not, rejects.
 */
async function refreshToken(fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,): Promise<boolean> {
  isRefreshing = true;
  let result = false;
  try {
    const resp = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    const data: HttpResp<null> = await resp.json();
    if (data.status === 'success') {
      // Tokens refreshed
      result = true;
    } else {
      // Refresh failed
      console.log('Failed to refresh token:', data.message);
    }
  } finally {
    isRefreshing = false;
  }
  return result;
}

/**
 * A helper function to perform fetch requests and handle:
 * - Protected endpoints 401 errors
 * - Token refresh and request retry
 */
export async function apiFetch(
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  input: string,
  init?: RequestInit & { _retry?: boolean }
): Promise<Response> {
  const url = input.startsWith('http') ? input : `${API_BASE_URL}${input}`;
  const response = await fetch(url, {
    ...init,
    credentials: 'include', // Include cookies in requests
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });

  if (response.status === 401 && !init?._retry) {
    // Check if endpoint is protected
    const endpoint = input.replace(API_BASE_URL, '');
    const isProtected = protectedEndpoints.some((p) => endpoint.startsWith(p));
    let refreshStatus = false;

    if (isProtected) {
      // If a refresh is already in progress, wait for it
      if (isRefreshing && refreshInProgress) {
        refreshStatus = await refreshInProgress;
      } else {
        // Start refresh
        try {
          refreshInProgress = refreshToken(fetch);
          refreshStatus = await refreshInProgress;
          refreshInProgress = null;
        } catch (e) {
          console.log('Failed to refresh token:', e);
        }
      }

      // After refresh, retry the request once
      console.log('Refresh status2:', refreshStatus);
      if (refreshStatus) {
        return apiFetch(fetch, input, { ...init, _retry: true });
      }

      if (endpoint !== '/auth/status') {
        if (browser) {
          invalidate(url);
        }
      }
    }
  }

  return response;
}


export async function getAuthStatus(fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,): Promise<AuthStatusData> {
  const resp = await apiFetch(fetch, '/auth/status', { method: 'GET' });
  const data: HttpResp<AuthStatusData> = await resp.json();
  if (data.status === 'success' && data.data) {
    return data.data;
  }
  throw new Error(data.message || 'User not authenticated.');
}

export async function getAllHashes(fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,): Promise<HashesResponse> {
  const resp = await apiFetch(fetch, '/api/hashes', { method: 'GET' });
  const data: HttpResp<HashesResponse> = await resp.json();
  if (data.status === 'success' && data.data) {
    return data.data;
  }
  throw new Error(data.message || 'User not authenticated.');
}

