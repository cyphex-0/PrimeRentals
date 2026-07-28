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
        const refreshRes = await refreshToken();
        if (refreshRes.data?.token) {
          useAuthStore.getState().setToken(refreshRes.data.token);
          const meRes = await getMe();
          if (meRes.data) {
            setAuth(meRes.data, refreshRes.data.token);
          } else {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        clearAuth();
      } finally {
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
