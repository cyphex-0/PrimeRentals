"use client";

import { useState } from "react";
import { useAllRentals } from "@/hooks/api/use-admin";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RentalRequest } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/avatar";

const ITEMS_PER_PAGE = 10;

export default function AdminRentalsPage() {
  const { data, isLoading } = useAllRentals();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  
  const rentals = data?.data || [];

  const filteredRentals = rentals.filter((r) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      r.property?.title.toLowerCase().includes(searchLower) ||
      r.tenant?.name.toLowerCase().includes(searchLower) ||
      r.property?.landlord?.name?.toLowerCase().includes(searchLower);
      
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);
  const paginatedRentals = filteredRentals.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const columns = [
    {
      header: "Property",
      accessorKey: "property",
      cell: (item: RentalRequest) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate" title={item.property?.title}>
            {item.property?.title || "Unknown"}
          </div>
          <div className="text-xs text-muted-foreground">
            Owner: {item.property?.landlord?.name || "Unknown"}
          </div>
        </div>
      )
    },
    {
      header: "Tenant",
      accessorKey: "tenant",
      cell: (item: RentalRequest) => (
        <div className="flex items-center gap-2">
          <Avatar 
            src={item.tenant?.profileImage || ""}
            fallback={item.tenant?.name?.charAt(0) || "U"}
            className="h-8 w-8 bg-primary/10 text-primary border border-primary/20 hidden sm:flex"
          />
          <div className="max-w-[150px]">
            <div className="font-medium truncate text-sm">{item.tenant?.name || "Unknown"}</div>
            <div className="text-xs text-muted-foreground truncate">{item.tenant?.email || "-"}</div>
          </div>
        </div>
      )
    },
    {
      header: "Dates",
      accessorKey: "dates",
      cell: (item: RentalRequest) => (
        <div className="text-sm whitespace-nowrap">
          <div>{formatDate(item.moveInDate)}</div>
          <div className="text-xs text-muted-foreground">to {formatDate(item.moveOutDate)}</div>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: RentalRequest) => <StatusBadge status={item.status} type="RentalStatus" />
    },
    {
      header: "Created On",
      accessorKey: "createdAt",
      cell: (item: RentalRequest) => <span className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</span>
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Rentals</h1>
          <p className="text-muted-foreground mt-1">Read-only overview of all rental transactions across the platform.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-[350px] relative">
          <Search className="w-4 h-4 text-muted-foreground absolute ml-3" />
          <Input
            placeholder="Search property, tenant, or landlord..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <select 
            className="flex h-10 w-full sm:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-12 bg-muted/50 rounded-lg animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4 bg-card rounded-xl border overflow-hidden shadow-sm">
          <DataTable 
            data={paginatedRentals} 
            columns={columns} 
            keyExtractor={(item) => item.id}
            className="border-0 shadow-none rounded-none"
          />
          {totalPages > 1 && (
            <Pagination 
              page={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
              className="py-4 border-t"
            />
          )}
        </div>
      )}
    </div>
  );
}
