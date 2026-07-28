"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTenantRentals } from "@/hooks/api/use-rentals";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { LeaveReviewModal } from "@/components/reviews/leave-review-modal";

export default function MyRentalsPage() {
  const router = useRouter();
  const { data: rentalsData, isLoading } = useTenantRentals();
  const rentals = rentalsData?.data || [];
  const [activeTab, setActiveTab] = useState("all");
  const [reviewModalRentalId, setReviewModalRentalId] = useState<string | null>(null);
  const [reviewModalPropertyId, setReviewModalPropertyId] = useState<string | null>(null);

  const filteredRentals = rentals.filter((rental) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return rental.status === "ACTIVE";
    if (activeTab === "pending") return rental.status === "PENDING";
    if (activeTab === "past") return rental.status === "COMPLETED" || rental.status === "REJECTED";
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Rentals</h1>
        <p className="text-muted-foreground mt-1">Manage your rental requests and active leases.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-sm mb-6" />
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="w-full">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
            {["all", "active", "pending", "past"].map((tab) => (
              <Button 
                key={tab} 
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize rounded-full px-6 shadow-sm"
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="space-y-4 m-0">
            {filteredRentals.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border/50 rounded-xl shadow-sm">
                <p className="text-muted-foreground mb-4">No rentals found in this category.</p>
                <Button onClick={() => router.push("/properties")} className="shadow-md shadow-primary/20 hover:shadow-primary/40">
                  Browse Properties
                </Button>
              </div>
            ) : (
              filteredRentals.map((rental) => (
                <div key={rental.id} className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6 bg-card rounded-2xl border border-border/50 shadow-sm transition-all hover:shadow-md">
                  <div className="relative w-full sm:w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-muted">
                    {rental.property?.images[0] ? (
                      <Image 
                        src={rental.property.images[0]} 
                        alt={rental.property.title} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No image</div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{rental.property?.title || "Unknown Property"}</h3>
                        <StatusBadge status={rental.status} type="RentalStatus" />
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Move in: <span className="font-medium text-foreground">{formatDate(rental.moveInDate)}</span></p>
                        <p>Move out: <span className="font-medium text-foreground">{formatDate(rental.moveOutDate)}</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-border/50">
                      <div className="font-bold text-lg">{formatPrice(rental.property?.rent || "0")} <span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                      
                      {rental.status === "APPROVED" && (
                        <Button 
                          onClick={() => router.push(`/dashboard/tenant/rentals/${rental.id}/pay`)}
                          className="bg-primary text-primary-foreground shadow-sm hover:shadow-md transition-all px-6"
                        >
                          Pay Now
                        </Button>
                      )}
                      
                      {(rental.status === "ACTIVE" || rental.status === "COMPLETED") && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setReviewModalRentalId(rental.id);
                            setReviewModalPropertyId(rental.propertyId);
                          }}
                          className="px-6"
                        >
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {reviewModalRentalId && reviewModalPropertyId && (
        <LeaveReviewModal 
          isOpen={!!reviewModalRentalId} 
          onClose={() => {
            setReviewModalRentalId(null);
            setReviewModalPropertyId(null);
          }}
          rentalId={reviewModalRentalId}
          propertyId={reviewModalPropertyId}
        />
      )}
    </div>
  );
}
