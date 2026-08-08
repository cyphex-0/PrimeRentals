"use client";

import { useLandlordProperties, useLandlordRequests } from "@/hooks/api/use-landlord";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMe } from "@/hooks/api/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Key, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLandlordStats } from "@/hooks/api/use-stats";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function LandlordDashboard() {
  const { data: userData } = useMe();
  const user = userData?.data;
  const { data: propertiesData, isLoading: propertiesLoading } = useLandlordProperties();
  const { data: requestsData, isLoading: requestsLoading } = useLandlordRequests();

  const properties = propertiesData?.data || [];
  const requests = requestsData?.data || [];

  const totalProperties = properties.length;
  const availableProperties = properties.filter((p) => p.status === "AVAILABLE").length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const activeRentals = requests.filter((r) => r.status === "ACTIVE").length;

  const { data: statsResponse, isLoading: statsLoading } = useLandlordStats();
  const stats = statsResponse?.data;

  const requestsStatusData = stats ? [
    { name: "Pending", value: stats.requestsByStatus.PENDING, color: "#F59E0B" },
    { name: "Approved", value: stats.requestsByStatus.APPROVED, color: "#3B82F6" },
    { name: "Rejected", value: stats.requestsByStatus.REJECTED, color: "#EF4444" },
    { name: "Active", value: stats.requestsByStatus.ACTIVE, color: "#10B981" },
    { name: "Completed", value: stats.requestsByStatus.COMPLETED, color: "#6B7280" },
  ].filter(d => d.value > 0) : [];

  const recentRequests = [...requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s an overview of your properties and requests.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {propertiesLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{totalProperties}</div>}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Properties</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <Key className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            {propertiesLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{availableProperties}</div>}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-full">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {requestsLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{pendingRequests}</div>}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rentals</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {requestsLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{activeRentals}</div>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Requests</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Latest rental requests for your properties.</p>
            </div>
            <Link href="/dashboard/landlord/requests" className="text-sm text-primary hover:underline flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : recentRequests.length > 0 ? (
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-medium text-sm">{request.property?.title || "Unknown Property"}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        By {request.tenant?.name || "Unknown"} on {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={request.status} type="RentalStatus" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent requests</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Manage your business operations.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start h-12 text-base" variant="outline">
              <Link href="/dashboard/landlord/properties/new">
                <Building2 className="mr-3 h-5 w-5 text-primary" />
                Add New Property
              </Link>
            </Button>
            <Button asChild className="w-full justify-start h-12 text-base" variant="outline">
              <Link href="/dashboard/landlord/requests">
                <Clock className="mr-3 h-5 w-5 text-amber-600" />
                Review Pending Requests
              </Link>
            </Button>
            <Button asChild className="w-full justify-start h-12 text-base" variant="outline">
              <Link href="/dashboard/landlord/properties">
                <Key className="mr-3 h-5 w-5 text-emerald-600" />
                Manage Properties
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={requestsStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      label
                    >
                      {requestsStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
