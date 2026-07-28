"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getMe, refreshToken } from "@/lib/api";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    async function initAuth() {
      try {
        // Check localStorage as a fallback in case Zustand hasn't hydrated yet
        let token = useAuthStore.getState().token;
        if (!token) {
          try {
            const stored = localStorage.getItem('auth-storage');
            if (stored) {
              const parsed = JSON.parse(stored);
              token = parsed.state?.token;
              if (token && parsed.state?.user) {
                // Manually hydrate the store to prevent race conditions with fetchWithRetry
                useAuthStore.getState().setAuth(parsed.state.user, token);
              }
            }
          } catch (e) {
            console.error("Failed to parse auth storage", e);
          }
        }

        // If we STILL don't have a token, we are definitively logged out.
        if (!token) {
          clearAuth();
        }
      } catch (error) {
        clearAuth();
      } finally {
        useAuthStore.getState().setLoading(false);
        setIsInitializing(false);
      }
    }
    
    initAuth();
  }, [setAuth, clearAuth]);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
