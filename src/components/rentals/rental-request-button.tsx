"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMe } from "@/hooks/api/use-auth";
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering the role-specific parts until mounted
  if (!mounted) {
    return <Button className="w-full" size="lg" disabled>Loading...</Button>;
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
