import { ApiResponse, ApiError } from "../types";
import { useAuthStore } from "../stores/auth-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
  let token = useAuthStore.getState().token;
  
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let response = await fetch(url, config);

  if (response.status === 401) {
    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!refreshRes.ok) throw new Error("Refresh failed");
      
      const refreshData = await refreshRes.json();
      token = refreshData.data.token;
      if (token) {
        useAuthStore.getState().setToken(token);
        
        headers.set("Authorization", `Bearer ${token}`);
        response = await fetch(url, { ...config, headers });
      } else {
        throw new Error("No token returned");
      }
    } catch (error) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return response;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json().catch(() => null);
  
  if (!response.ok) {
    const error: ApiError = {
      success: false,
      message: data?.message || "An unexpected error occurred",
      statusCode: response.status,
      errorDetails: data?.errorDetails || null,
    };
    throw error;
  }
  
  return data as ApiResponse<T>;
}

export async function apiGet<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetchWithRetry(`${API_BASE}${path}`, { ...options, method: "GET" });
  return handleResponse<T>(response);
}

export async function apiPost<T>(path: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetchWithRetry(`${API_BASE}${path}`, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function apiPut<T>(path: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetchWithRetry(`${API_BASE}${path}`, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function apiPatch<T>(path: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetchWithRetry(`${API_BASE}${path}`, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetchWithRetry(`${API_BASE}${path}`, { ...options, method: "DELETE" });
  return handleResponse<T>(response);
}
