"use client";

import { useState } from "react";
import { useLandlordRequests, useUpdateRequestStatus, useCompleteRental } from "@/hooks/api/use-landlord";
import { Check, X, CheckCircle, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ManageRequestsPage() {
  const { data, isLoading } = useLandlordRequests();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateRequestStatus();
  const { mutate: completeRental, isPending: isCompleting } = useCompleteRental();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [actionDialog, setActionDialog] = useState<{ id: string; action: "approve" | "reject" | "complete" } | null>(null);
  
  // Optimistic UI state
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, string>>({});

  const requests = data?.data || [];

  const handleAction = () => {
    if (!actionDialog) return;
    const { id, action } = actionDialog;

    if (action === "approve") {
      setOptimisticStatuses(prev => ({ ...prev, [id]: "APPROVED" }));
      updateStatus({ id, data: { status: "APPROVED" } }, {
        onSettled: () => setActionDialog(null)
      });
    } else if (action === "reject") {
      setOptimisticStatuses(prev => ({ ...prev, [id]: "REJECTED" }));
      updateStatus({ id, data: { status: "REJECTED" } }, {
        onSettled: () => setActionDialog(null)
      });
    } else if (action === "complete") {
      setOptimisticStatuses(prev => ({ ...prev, [id]: "COMPLETED" }));
      completeRental(id, {
        onSettled: () => setActionDialog(null)
      });
    }
  };

  const filteredRequests = requests.filter((r) => {
    const status = optimisticStatuses[r.id] || r.status;
    
    // Search filter
    const matchesSearch = 
      r.property?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tenant?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Tab filter
    if (!matchesSearch) return false;
    if (activeTab === "all") return true;
    if (activeTab === "pending") return status === "PENDING";
    if (activeTab === "approved") return status === "APPROVED";
    if (activeTab === "active") return status === "ACTIVE";
    if (activeTab === "past") return status === "COMPLETED" || status === "REJECTED";
    
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Requests</h1>
        <p className="text-muted-foreground mt-1">Review and manage incoming rental requests for your properties.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Tabs */}
        <div className="flex bg-muted p-1 rounded-lg">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
            onClick={() => setActiveTab("all")}
          >
            All Requests
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "pending" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "approved" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "active" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "past" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/80"}`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-muted-foreground absolute ml-3" />
          <Input
            placeholder="Search tenant or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-[250px]"
          />
        </div>
      </div>

      <div className="border border-border/50 rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Tenant</th>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-6 py-4"><Skeleton className="h-10 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No requests found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const status = optimisticStatuses[request.id] || request.status;
                  
                  return (
                    <tr key={request.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            src={request.tenant?.profileImage || ""}
                            fallback={request.tenant?.name?.charAt(0) || "U"}
                            className="h-9 w-9 bg-primary/10 text-primary border border-primary/20"
                          />
                          <div>
                            <div className="font-medium text-foreground">{request.tenant?.name}</div>
                            <div className="text-xs text-muted-foreground">{request.tenant?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium line-clamp-1 max-w-[200px]" title={request.property?.title}>
                          {request.property?.title || "Unknown Property"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        <div>{formatDate(request.moveInDate)}</div>
                        <div className="text-xs">to {formatDate(request.moveOutDate)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={status} type="RentalStatus" />
                      </td>
                      <td className="px-6 py-4 max-w-[200px]">
                        {request.message ? (
                          <div className="text-xs text-muted-foreground line-clamp-2" title={request.message}>
                            {request.message}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {status === "PENDING" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                                onClick={() => setActionDialog({ id: request.id, action: "approve" })}
                                title="Approve Request"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                onClick={() => setActionDialog({ id: request.id, action: "reject" })}
                                title="Reject Request"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {status === "ACTIVE" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setActionDialog({ id: request.id, action: "complete" })}
                            >
                              <CheckCircle className="h-4 w-4 mr-1.5" /> Complete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.action === "approve" && "Approve Request"}
              {actionDialog?.action === "reject" && "Reject Request"}
              {actionDialog?.action === "complete" && "Mark Rental Complete"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog?.action === "approve" && "Are you sure you want to approve this rental request? The tenant will be notified to proceed with payment."}
              {actionDialog?.action === "reject" && "Are you sure you want to reject this rental request? This action cannot be undone."}
              {actionDialog?.action === "complete" && "Are you sure you want to mark this rental as completed? The property will become AVAILABLE again."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setActionDialog(null)} disabled={isUpdatingStatus || isCompleting}>
              Cancel
            </Button>
            <Button 
              variant={actionDialog?.action === "reject" ? "destructive" : "default"} 
              onClick={handleAction} 
              disabled={isUpdatingStatus || isCompleting}
              className={actionDialog?.action === "approve" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
            >
              {(isUpdatingStatus || isCompleting) ? "Processing..." : "Confirm Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
