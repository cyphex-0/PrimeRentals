"use client";

import { usePaymentHistory } from "@/hooks/api/use-payments";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { StatusBadge } from "@/components/ui/status-badge";
import { Payment } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";

export default function TenantPaymentsPage() {
  const { data: paymentsData, isLoading } = usePaymentHistory();
  const payments = paymentsData?.data || [];

  const columns = [
    {
      header: "Transaction ID",
      accessorKey: "transactionId",
      cell: (item: Payment) => <span className="font-mono text-xs text-muted-foreground">{item.transactionId}</span>
    },
    {
      header: "Property",
      accessorKey: "property",
      cell: (item: Payment) => <span className="font-medium line-clamp-1">{item.rentalRequest?.property?.title || "Unknown Property"}</span>
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (item: Payment) => <span className="text-muted-foreground whitespace-nowrap">{formatDate(item.createdAt)}</span>
    },
    {
      header: "Provider",
      accessorKey: "paymentProvider",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (item: Payment) => <span className="font-semibold">{formatPrice(item.amount.toString())}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: Payment) => <StatusBadge status={item.status} type="PaymentStatus" />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground mt-1">View your past transactions and receipts.</p>
      </div>

      <div className="bg-card shadow-sm border border-border/50 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <DataTable 
            data={payments} 
            columns={columns} 
            keyExtractor={(item: Payment) => item.id}
          />
        )}
      </div>
    </div>
  );
}
