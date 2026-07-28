"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user?.role !== "ADMIN") {
        router.push("/auth/login");
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  // If we are still checking auth status and haven't found a session yet, wait.
  if (isLoading && !isAuthenticated) {
    return null;
  }
  
  // If we finished loading and are NOT authenticated, or wrong role, wait for redirect.
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
