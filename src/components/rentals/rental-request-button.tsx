"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, CheckCircle, ShieldCheck, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMe } from "@/hooks/api/use-auth";
import { useTenantRentals } from "@/hooks/api/use-rentals";
import { Button } from "@/components/ui/button";
import { RentalRequestModal } from "./rental-request-modal";

interface RentalRequestButtonProps {
  propertyId: string;
  status: string;
}

export function RentalRequestButton({ propertyId, status }: RentalRequestButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const { data: userData } = useMe();
  const user = userData?.data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: rentalsResponse, isLoading: isRentalsLoading } = useTenantRentals({
    enabled: !!isAuthenticated && user?.role === "TENANT",
  });
  const rentals = (rentalsResponse?.data || []) as Array<any>;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering the role-specific parts until mounted
  if (!mounted || (isAuthenticated && user?.role === "TENANT" && isRentalsLoading)) {
    return (
      <Button className="w-full" size="lg" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking status...
      </Button>
    );
  }

  // Check if the tenant already has an active, pending, or approved request for this property
  const existingRequest = isAuthenticated && user?.role === "TENANT"
    ? rentals.find((r) => r.propertyId === propertyId && ["PENDING", "APPROVED", "ACTIVE"].includes(r.status))
    : undefined;

  if (existingRequest) {
    if (existingRequest.status === "PENDING") {
      return (
        <div className="space-y-3">
          <Button className="w-full font-semibold cursor-not-allowed border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10" size="lg" disabled variant="outline">
            <Clock className="mr-2 h-4 w-4 text-amber-500 shrink-0" />
            Request Pending
          </Button>
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            You have already requested to rent this property. Awaiting landlord review.
          </p>
          <Button variant="link" size="sm" className="w-full text-xs text-primary" asChild>
            <Link href="/dashboard/tenant">View in Tenant Dashboard →</Link>
          </Button>
        </div>
      );
    }
    if (existingRequest.status === "APPROVED") {
      return (
        <div className="space-y-3">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition-all" size="lg" asChild>
            <Link href={`/dashboard/tenant/rentals/${existingRequest.id}/pay`}>
              <CheckCircle className="mr-2 h-5 w-5 shrink-0" />
              Approved - Proceed to Pay
            </Link>
          </Button>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 text-center font-medium leading-relaxed">
            Congratulations! Your application was approved. Complete payment to secure your lease.
          </p>
          <Button variant="link" size="sm" className="w-full text-xs text-primary" asChild>
            <Link href="/dashboard/tenant">View in Tenant Dashboard →</Link>
          </Button>
        </div>
      );
    }
    if (existingRequest.status === "ACTIVE") {
      return (
        <div className="space-y-3">
          <Button className="w-full font-semibold border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 cursor-default" size="lg" disabled variant="outline">
            <ShieldCheck className="mr-2 h-5 w-5 text-emerald-600 shrink-0" />
            Rented by You
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            You currently hold an active lease for this property.
          </p>
          <Button variant="link" size="sm" className="w-full text-xs text-primary" asChild>
            <Link href="/dashboard/tenant">Go to Tenant Dashboard →</Link>
          </Button>
        </div>
      );
    }
  }

  if (status !== "AVAILABLE") {
    return (
      <Button className="w-full" size="lg" disabled variant="secondary">
        Currently {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center">
        <Button className="w-full" size="lg" disabled>Request to Rent</Button>
        <p className="text-xs text-muted-foreground mt-2">Please login to request this property.</p>
      </div>
    );
  }

  if (user?.role !== "TENANT") {
    return (
      <div className="text-center">
        <Button className="w-full" size="lg" disabled>Request to Rent</Button>
        <p className="text-xs text-muted-foreground mt-2">Only tenants can request to rent.</p>
      </div>
    );
  }

  return (
    <>
      <Button className="w-full shadow-md shadow-primary/20 hover:shadow-lg transition-all" size="lg" onClick={() => setIsModalOpen(true)}>
        Request to Rent
      </Button>
      <RentalRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        propertyId={propertyId} 
      />
    </>
  );
}
