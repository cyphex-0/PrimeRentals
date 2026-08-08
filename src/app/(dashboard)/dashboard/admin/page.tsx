"use client";

import { useAllUsers, useAdminProperties, useAllRentals } from "@/hooks/api/use-admin";
import { useAdminStats } from "@/hooks/api/use-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Key, CheckCircle, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const { data: usersData, isLoading: usersLoading } = useAllUsers();
  const { data: propertiesData, isLoading: propertiesLoading } = useAdminProperties();
  const { data: rentalsData, isLoading: rentalsLoading } = useAllRentals();
  const { data: statsResponse, isLoading: statsLoading } = useAdminStats();
  
  const stats = statsResponse?.data;

  const users = usersData?.data || [];
  const properties = propertiesData?.data || [];
  const rentals = rentalsData?.data || [];

  const totalUsers = users.length;
  const tenantsCount = users.filter((u) => u.role === "TENANT").length;
  const landlordsCount = users.filter((u) => u.role === "LANDLORD").length;

  const totalProperties = properties.length;
  const availableProperties = properties.filter((p) => p.status === "AVAILABLE").length;
  const rentedProperties = properties.filter((p) => p.status === "RENTED").length;

  const totalRentals = rentals.length;
  const activeRentals = rentals.filter((r) => r.status === "ACTIVE").length;
  const pendingRentals = rentals.filter((r) => r.status === "PENDING").length;

  const isLoading = usersLoading || propertiesLoading || rentalsLoading;

  const rentalsStatusData = stats ? [
    { name: "Pending", value: stats.rentalsByStatus.PENDING, color: "#F59E0B" },
    { name: "Approved", value: stats.rentalsByStatus.APPROVED, color: "#3B82F6" },
    { name: "Rejected", value: stats.rentalsByStatus.REJECTED, color: "#EF4444" },
    { name: "Active", value: stats.rentalsByStatus.ACTIVE, color: "#10B981" },
    { name: "Completed", value: stats.rentalsByStatus.COMPLETED, color: "#6B7280" },
  ].filter(d => d.value > 0) : [];

  const usersRoleData = stats ? [
    { name: "Tenants", count: stats.usersByRole.TENANT },
    { name: "Landlords", count: stats.usersByRole.LANDLORD },
    { name: "Admins", count: stats.usersByRole.ADMIN },
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || statsLoading ? <Skeleton className="h-8 w-16 mb-1" /> : <div className="text-3xl font-bold mb-1">{stats?.totalUsers || totalUsers}</div>}
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.usersByRole.TENANT} Tenants, ${stats.usersByRole.LANDLORD} Landlords` : `${tenantsCount} Tenants, ${landlordsCount} Landlords`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <Building2 className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || statsLoading ? <Skeleton className="h-8 w-16 mb-1" /> : <div className="text-3xl font-bold mb-1">{stats?.totalProperties || totalProperties}</div>}
            <p className="text-xs text-muted-foreground">
              {availableProperties} Available, {rentedProperties} Rented
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rentals</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Key className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || statsLoading ? <Skeleton className="h-8 w-16 mb-1" /> : <div className="text-3xl font-bold mb-1">{stats?.totalRentals || totalRentals}</div>}
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.rentalsByStatus.PENDING} Pending Requests` : `${pendingRentals} Pending Requests`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rentals</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-full">
              <CheckCircle className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || statsLoading ? <Skeleton className="h-8 w-16 mb-1" /> : <div className="text-3xl font-bold mb-1">{stats?.rentalsByStatus.ACTIVE || activeRentals}</div>}
            <p className="text-xs text-muted-foreground">
              Currently generating revenue
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Rentals by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rentalsStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {rentalsStatusData.map((entry, index) => (
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

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usersRoleData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0F766E" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Platform Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Manage users, properties, and system settings.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-between h-12 text-base" variant="outline">
              <Link href="/dashboard/admin/users">
                <div className="flex items-center">
                  <Users className="mr-3 h-5 w-5 text-primary" />
                  Manage Users
                </div>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
            </Button>
            <Button asChild className="w-full justify-between h-12 text-base" variant="outline">
              <Link href="/dashboard/admin/properties">
                <div className="flex items-center">
                  <Building2 className="mr-3 h-5 w-5 text-emerald-600" />
                  Manage Properties
                </div>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
            </Button>
            <Button asChild className="w-full justify-between h-12 text-base" variant="outline">
              <Link href="/dashboard/admin/rentals">
                <div className="flex items-center">
                  <Key className="mr-3 h-5 w-5 text-blue-600" />
                  View All Rentals
                </div>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
            </Button>
            <Button asChild className="w-full justify-between h-12 text-base" variant="outline">
              <Link href="/dashboard/admin/categories">
                <div className="flex items-center">
                  <div className="mr-3 h-5 w-5 bg-amber-100 rounded-sm flex items-center justify-center">
                    <div className="h-2 w-2 bg-amber-600 rounded-full" />
                  </div>
                  Manage Categories
                </div>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
