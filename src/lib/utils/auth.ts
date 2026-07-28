import { useAuthStore } from "@/lib/stores/auth-store";

export function logout() {
  // Clear Zustand store
  useAuthStore.getState().clearAuth();

  // Clear refreshToken cookie by setting it to expire in the past
  document.cookie = "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
}
