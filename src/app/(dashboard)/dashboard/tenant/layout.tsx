"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "TENANT") {
      if (user?.role === "LANDLORD") router.push("/dashboard/landlord");
      else if (user?.role === "ADMIN") router.push("/dashboard/admin");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsChecking(false);
    }
  }, [user, isAuthenticated, router]);

  if (isChecking) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
