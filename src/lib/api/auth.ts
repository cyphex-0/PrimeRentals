import { apiPost, apiGet, apiPut } from "./client";
import { RegisterResponse, LoginResponse, User, RefreshTokenResponse } from "../types";

export const registerUser = (data: unknown) => apiPost<RegisterResponse>("/auth/register", data);
export const loginUser = (data: unknown) => apiPost<LoginResponse>("/auth/login", data);
export const getMe = () => apiGet<User>("/auth/me");
export const updateProfile = (data: unknown) => apiPut<User>("/auth/me", data);
export const refreshToken = () => apiPost<RefreshTokenResponse>("/auth/refresh-token");
export const googleLogin = (accessToken: string) => apiPost<LoginResponse>("/auth/google-login", { accessToken });
