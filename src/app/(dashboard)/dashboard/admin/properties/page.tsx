"use client";

import { useState } from "react";
import { useAdminProperties, useAdminUpdateProperty, useAdminDeleteProperty } from "@/hooks/api/use-admin";
import { Search, Edit, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatPrice } from "@/lib/utils/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ITEMS_PER_PAGE = 10;

export default function AdminPropertiesPage() {
  const { data, isLoading } = useAdminProperties();
  const { mutate: updateProperty, isPending: isUpdating } = useAdminUpdateProperty();
  const { mutate: deleteProperty, isPending: isDeleting } = useAdminDeleteProperty();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState<{ id: string; status: string; title: string } | null>(null);

  const properties = data?.data || [];

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.landlord?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = () => {
    if (!deleteDialog) return;
    deleteProperty(deleteDialog, {
      onSuccess: () => setDeleteDialog(null)
    });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDialog) return;
    updateProperty(
      { id: editDialog.id, data: { status: editDialog.status } },
      { onSuccess: () => setEditDialog(null) }
    );
  };

  const columns = [
    {
      header: "Property",
      accessorKey: "title",
      cell: (item: Property) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate" title={item.title}>{item.title}</div>
          <div className="text-xs text-muted-foreground truncate" title={item.location}>{item.location}</div>
        </div>
      )
    },
    {
      header: "Landlord",
      accessorKey: "landlord",
      cell: (item: Property) => (
        <div className="max-w-[150px]">
          <div className="font-medium truncate">{item.landlord?.name || "Unknown"}</div>
          <div className="text-xs text-muted-foreground truncate">{item.landlord?.email || "-"}</div>
        </div>
      )
    },
    {
      header: "Rent",
      accessorKey: "rent",
      cell: (item: Property) => <span className="font-medium">{formatPrice(item.rent)}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: Property) => <StatusBadge status={item.status} type="PropertyStatus" />
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (item: Property) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0"
            onClick={() => setEditDialog({ id: item.id, status: item.status, title: item.title })}
            title="Edit Status"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 border-destructive/20"
            onClick={() => setDeleteDialog(item.id)}
            title="Delete Property"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Management</h1>
          <p className="text-muted-foreground mt-1">Oversee all properties listed on the platform.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-[300px] relative">
          <Search className="w-4 h-4 text-muted-foreground absolute ml-3" />
          <Input
            placeholder="Search properties or landlords..."
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
            <option value="AVAILABLE">Available</option>
            <option value="RENTED">Rented</option>
            <option value="MAINTENANCE">Maintenance</option>
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
            data={paginatedProperties} 
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

      {/* Edit Status Dialog */}
      <Dialog open={!!editDialog} onOpenChange={(open) => !open && setEditDialog(null)}>
        <DialogContent>
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Property Status</DialogTitle>
              <DialogDescription>
                Update the status for {editDialog?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editDialog?.status || ""}
                  onChange={(e) => setEditDialog(prev => prev ? { ...prev, status: e.target.value } : null)}
                  required
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RENTED">RENTED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialog(null)} disabled={isUpdating}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this property? This action cannot be undone. Properties with active rentals cannot be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialog(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
