"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMe } from "@/hooks/api/use-auth";
import { Loader2 } from "lucide-react";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { data, isLoading: meLoading } = useMe();
  const user = data?.data;
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !meLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user?.role !== "TENANT") {
        router.push("/auth/login");
      }
    }
  }, [user, isAuthenticated, authLoading, meLoading, router]);

  if (authLoading || (isAuthenticated && meLoading)) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "TENANT") {
    return null;
  }

  return <>{children}</>;
}
