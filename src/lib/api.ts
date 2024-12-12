import { error } from "@sveltejs/kit";
import type { AuthStatusData, HashDetailResponse, HashesResponse, HttpResp, Provider, StatsResponse } from "./types";
import type Stats from "./components/Stats.svelte";
type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const API_BASE_URL = 'http://127.0.0.1:8808';

export async function apiFetch<T>(fetch: Fetch, input: RequestInfo | URL, init?: RequestInit): Promise<T> {


  const url = input.startsWith('http') ? input : `${API_BASE_URL}${input}`;
  return fetch(url, {
    ...init,
    credentials: 'include', // Include cookies in requests
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  }).then((res) => {
    if (!res.ok) {
      throw error(res.status, res.statusText);
    }
    return res.json() as Promise<HttpResp<T>>;
  }).then((data) => {
    if (data.status === 'success') {
      return data.data;
    }
    throw error(500, data.message);
  }).catch((res: Response) => {
    console.error('apiFetch error:', res);
    error(res.status, res.body?.message);
  });
}

export function getLoginUrl(provider: string) {
  return `${API_BASE_URL}/auth/login/${provider}`;
}
export async function getAuthStatus(fetch: Fetch): Promise<AuthStatusData> {
  return apiFetch<AuthStatusData>(fetch,
    '/auth/status', { method: 'GET' });
}

export async function getLogout(fetch: Fetch): Promise<AuthStatusData> {
  return apiFetch<AuthStatusData>(fetch,
    '/auth/logout', { method: 'GET' });
}


export async function getAllHashesPagination(fetch: Fetch, page: number, per_page: number, filter: string): Promise<HashesResponse> {
  return apiFetch<HashesResponse>(fetch,
    `/api/hashes?page=${page}&per_page=${per_page}&found=${filter}`, { method: 'GET' });
}

export async function getAllHashes(fetch: Fetch): Promise<HashesResponse> {
  return apiFetch<HashesResponse>(fetch,
    '/api/hashes', { method: 'GET' });
}

export async function getStats(fetch: Fetch): Promise<StatsResponse> {
  return apiFetch<StatsResponse>(fetch,
    '/api/stats', { method: 'GET' });
}




export async function getHashDetail(fetch: Fetch, sha256: string): Promise<HashDetailResponse> {
  return apiFetch<HashDetailResponse>(fetch,
    `/api/hashes/${sha256}`, { method: 'GET' });
}

export async function deleteHash(fetch: Fetch, sha256: string): Promise<null> {
  return apiFetch<null>(fetch,
    `/api/hashes/${sha256}`, { method: 'DELETE' });
}

export async function getLoginProvider(fetch: Fetch): Promise<Provider[]> {
  return apiFetch<Provider[]>(fetch,
    `/auth/providers`, { method: 'GET' });
}

