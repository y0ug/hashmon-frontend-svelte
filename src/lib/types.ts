export interface HttpResp<T> {
  status: string; // "success" or "error"
  data: T;
  // data: T | null;
  message: string;
}
export interface User {
  name: string;
  email: string;
  sub: string;
  picture?: string | null;
}

export interface AuthStatusData {
  authenticated: boolean;
  user: User;
  // user: User | null; // We only used if authenticated so we can remove null
}

export interface Provider {
  id: string;
  name: string;
  type: string;
}

export interface RefreshTokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface HashStatus {
  hash: string;
  comment: string;
  last_check_at: string; // ISO string
  providers: {
    [providerName: string]: boolean;
  };
  alerted_by?: string[];
}

export interface HashesResponse {
  hashes: HashStatus[];
  per_page: number;
  page: number;
  total: number;
  total_pages: number;
}

export interface HashDetailResponse {
  hash: HashStatus;
}

export interface NewHash {
  hash: string;
  comment: string;
}

export interface StatsResponse {
  total_hashes: number;
  global_last_check_at: string; // ISO string
  total_hashes_found: number;
  hashes_found_today: number;
}
