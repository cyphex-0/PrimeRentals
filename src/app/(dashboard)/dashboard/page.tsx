"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/api/use-auth";
import { Loader2 } from "lucide-react";

export default function DashboardRootPage() {
  const router = useRouter();
  const { data: userData, isLoading } = useMe();

  useEffect(() => {
    if (!isLoading) {
      const role = userData?.data?.role;
      if (role === "LANDLORD") {
        router.replace("/dashboard/landlord");
      } else if (role === "ADMIN") {
        router.replace("/dashboard/admin");
      } else {
        router.replace("/dashboard/tenant");
      }
    }
  }, [userData, isLoading, router]);

  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
