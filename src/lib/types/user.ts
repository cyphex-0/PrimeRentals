export type Role = "TENANT" | "LANDLORD" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  address: string | null;
  profileImage: string | null;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface RegisterResponse {
  user: AuthUser & { createdAt: string; updatedAt: string };
  token: string;
}

export interface RefreshTokenResponse {
  token: string;
}
