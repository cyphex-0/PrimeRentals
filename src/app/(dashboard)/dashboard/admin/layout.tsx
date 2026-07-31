"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMe } from "@/hooks/api/use-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { data, isLoading: meLoading } = useMe();
  const user = data?.data;
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !meLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user?.role !== "ADMIN") {
        router.push("/auth/login");
      }
    }
  }, [user, isAuthenticated, authLoading, meLoading, router]);

  // If we are still checking auth status and haven't found a session yet, wait.
  if (authLoading || (isAuthenticated && meLoading)) {
    return null;
  }
  
  // If we finished loading and are NOT authenticated, or wrong role, wait for redirect.
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
