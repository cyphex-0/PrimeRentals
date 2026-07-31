"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { clearAuth } = useAuthStore();

  useEffect(() => {
    // Zustand persist hydrates synchronously from localStorage before the first render.
    // If there is no token, ensure the auth state is fully cleared.
    const token = useAuthStore.getState().token;
    if (!token) {
      clearAuth();
    }
    
    useAuthStore.getState().setLoading(false);
    setIsInitializing(false);
  }, [clearAuth]);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
