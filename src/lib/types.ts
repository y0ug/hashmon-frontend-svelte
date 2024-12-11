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
  sha256: string;
  filename: string;
  build_id: string;
  last_check_at: string; // ISO string
  providers: {
    [providerName: string]: boolean;
  };
  alerted_by?: string[];
}

export interface HashesResponse {
  hashes: HashStatus[];
}

export interface HashDetailResponse {
  hash: HashStatus;
}

export interface NewHash {
  sha256: string;
  filename: string;
  build_id: string;
}
