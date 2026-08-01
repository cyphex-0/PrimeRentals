"use client";

import { useState } from "react";
import { useAllUsers, useUpdateUserStatus } from "@/hooks/api/use-admin";
import { useMe } from "@/hooks/api/use-auth";
import { Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ITEMS_PER_PAGE = 10;

export default function AdminUsersPage() {
  const { data: meData } = useMe();
  const currentUser = meData?.data;
  const { data, isLoading } = useAllUsers();
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BANNED">("ALL");
  const [page, setPage] = useState(1);
  const [actionDialog, setActionDialog] = useState<{ id: string; name: string; isBanned: boolean } | null>(null);

  const users = data?.data || [];

  const totalCount = users.length;
  const activeCount = users.filter((u) => !u.isBanned).length;
  const bannedCount = users.filter((u) => u.isBanned).length;

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" ||
                          (statusFilter === "ACTIVE" && !u.isBanned) ||
                          (statusFilter === "BANNED" && u.isBanned);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAction = () => {
    if (!actionDialog) return;
    
    updateStatus(
      { id: actionDialog.id, data: { isBanned: actionDialog.isBanned } },
      {
        onSettled: () => setActionDialog(null)
      }
    );
  };

  const columns = [
    {
      header: "User",
      accessorKey: "name",
      cell: (item: User) => (
        <div className="flex items-center gap-3">
          <Avatar 
            src={item.profileImage || ""}
            fallback={item.name?.charAt(0) || "U"}
            className="h-9 w-9 bg-primary/10 text-primary border border-primary/20"
          />
          <div>
            <div className="font-medium text-foreground">{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.email}</div>
          </div>
        </div>
      )
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (item: User) => <StatusBadge status={item.role} type="UserRole" />
    },
    {
      header: "Status",
      accessorKey: "isBanned",
      cell: (item: User) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          item.isBanned ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {item.isBanned ? "Banned" : "Active"}
        </span>
      )
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (item: User) => <span className="text-muted-foreground">{formatDate(item.createdAt)}</span>
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (item: User) => {
        // Cannot ban self or other admins
        const isSelf = currentUser?.id === item.id;
        const isAdmin = item.role === "ADMIN";
        const canManage = !isSelf && !isAdmin;

        if (!canManage) {
          return <span className="text-xs text-muted-foreground italic px-2">Protected</span>;
        }

        return item.isBanned ? (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
            onClick={() => setActionDialog({ id: item.id, name: item.name, isBanned: false })}
          >
            <ShieldCheck className="h-4 w-4 mr-1.5" /> Unban
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => setActionDialog({ id: item.id, name: item.name, isBanned: true })}
          >
            <ShieldAlert className="h-4 w-4 mr-1.5" /> Ban
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage platform users, roles, and access.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-card p-4 rounded-xl border border-border/60 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={statusFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => { setStatusFilter("ALL"); setPage(1); }}
            className="rounded-full px-4 h-9 font-medium shadow-sm transition-all"
          >
            All Users <span className={`ml-1.5 text-xs px-2 py-0.5 rounded-full font-semibold ${statusFilter === "ALL" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{totalCount}</span>
          </Button>
          <Button
            variant={statusFilter === "ACTIVE" ? "default" : "outline"}
            size="sm"
            onClick={() => { setStatusFilter("ACTIVE"); setPage(1); }}
            className={`rounded-full px-4 h-9 font-medium shadow-sm transition-all ${statusFilter === "ACTIVE" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "hover:text-emerald-600 border-border"}`}
          >
            Active <span className={`ml-1.5 text-xs px-2 py-0.5 rounded-full font-semibold ${statusFilter === "ACTIVE" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"}`}>{activeCount}</span>
          </Button>
          <Button
            variant={statusFilter === "BANNED" ? "default" : "outline"}
            size="sm"
            onClick={() => { setStatusFilter("BANNED"); setPage(1); }}
            className={`rounded-full px-4 h-9 font-medium shadow-sm transition-all ${statusFilter === "BANNED" ? "bg-red-600 hover:bg-red-700 text-white" : "hover:text-red-600 border-border"}`}
          >
            Banned <span className={`ml-1.5 text-xs px-2 py-0.5 rounded-full font-semibold ${statusFilter === "BANNED" ? "bg-white/20 text-white" : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"}`}>{bannedCount}</span>
          </Button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Reset to page 1 on search
            }}
            className="pl-9 w-full rounded-lg bg-background"
          />
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
        <div className="space-y-4">
          <DataTable 
            data={paginatedUsers} 
            columns={columns} 
            keyExtractor={(item) => item.id}
          />
          {totalPages > 1 && (
            <Pagination 
              page={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
              className="pt-4"
            />
          )}
        </div>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.isBanned ? "Ban User" : "Unban User"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog?.isBanned 
                ? `Are you sure you want to ban ${actionDialog?.name}? They will no longer be able to log in to the platform.`
                : `Are you sure you want to restore access for ${actionDialog?.name}? They will be able to log in again.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setActionDialog(null)} disabled={isPending}>
              Cancel
            </Button>
            <Button 
              variant={actionDialog?.isBanned ? "destructive" : "default"} 
              onClick={handleAction} 
              disabled={isPending}
              className={!actionDialog?.isBanned ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
            >
              {isPending ? "Processing..." : "Confirm Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
