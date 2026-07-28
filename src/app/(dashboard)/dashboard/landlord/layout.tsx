"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user?.role !== "LANDLORD") {
        router.push("/auth/login");
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || user?.role !== "LANDLORD") {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
