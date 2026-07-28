"use client";

import { useTenantRentals } from "@/hooks/api/use-rentals";
import { usePaymentHistory } from "@/hooks/api/use-payments";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, Clock, CheckCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

export default function TenantDashboard() {
  const { user } = useAuthStore();
  const { data: rentalsData, isLoading: rentalsLoading } = useTenantRentals();
  const { data: paymentsData, isLoading: paymentsLoading } = usePaymentHistory();

  const rentals = rentalsData?.data || [];
  const payments = paymentsData?.data || [];

  const totalRequests = rentals.length;
  const activeRentals = rentals.filter((r) => r.status === "ACTIVE").length;
  const pendingRequests = rentals.filter((r) => r.status === "PENDING").length;
  
  const totalPaid = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((acc, p) => acc + parseFloat(p.amount.toString()), 0);

  const recentRentals = [...rentals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your rental journey today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {rentalsLoading ? <Skeleton className="h-7 w-20" /> : <div className="text-2xl font-bold">{totalRequests}</div>}
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {rentalsLoading ? <Skeleton className="h-7 w-20" /> : <div className="text-2xl font-bold">{activeRentals}</div>}
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {rentalsLoading ? <Skeleton className="h-7 w-20" /> : <div className="text-2xl font-bold">{pendingRequests}</div>}
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {paymentsLoading ? <Skeleton className="h-7 w-20" /> : <div className="text-2xl font-bold">{formatPrice(totalPaid.toString())}</div>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card shadow-sm border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Rental Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {rentalsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : recentRentals.length > 0 ? (
              <div className="space-y-4">
                {recentRentals.map((rental) => (
                  <div key={rental.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                    <div>
                      <h4 className="font-semibold line-clamp-1">{rental.property?.title || "Unknown Property"}</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(rental.createdAt)}</p>
                    </div>
                    <StatusBadge status={rental.status} type="RentalStatus" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-xl border border-border/50">
                <p className="text-muted-foreground">No rental requests found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
