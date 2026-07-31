"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMe } from "@/hooks/api/use-auth";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { data, isLoading: meLoading } = useMe();
  const user = data?.data;
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !meLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user?.role !== "LANDLORD") {
        router.push("/auth/login");
      }
    }
  }, [user, isAuthenticated, authLoading, meLoading, router]);

  if (authLoading || (isAuthenticated && meLoading)) {
    return null; // Don't render anything while redirecting or loading
  }

  if (!isAuthenticated || user?.role !== "LANDLORD") {
    return null;
  }

  return <>{children}</>;
}
