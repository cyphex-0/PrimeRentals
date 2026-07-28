import * as React from "react"
import { Badge } from "./badge"

type StatusType = "RentalStatus" | "PaymentStatus" | "PropertyStatus" | "UserRole"

interface StatusBadgeProps {
  type: StatusType;
  status: string;
  className?: string;
}

export function StatusBadge({ type, status, className }: StatusBadgeProps) {
  const s = status.toUpperCase();
  
  let colorClass = "bg-slate-100 text-slate-800"; // default
  
  if (type === "RentalStatus") {
    if (s === "PENDING") colorClass = "bg-amber-100 text-amber-800";
    if (s === "APPROVED") colorClass = "bg-blue-100 text-blue-800";
    if (s === "REJECTED") colorClass = "bg-red-100 text-red-800";
    if (s === "ACTIVE") colorClass = "bg-emerald-100 text-emerald-800";
    if (s === "COMPLETED") colorClass = "bg-slate-100 text-slate-800";
  } else if (type === "PaymentStatus") {
    if (s === "PENDING") colorClass = "bg-amber-100 text-amber-800";
    if (s === "COMPLETED") colorClass = "bg-emerald-100 text-emerald-800";
    if (s === "FAILED") colorClass = "bg-red-100 text-red-800";
  } else if (type === "PropertyStatus") {
    if (s === "AVAILABLE") colorClass = "bg-emerald-100 text-emerald-800";
    if (s === "RENTED") colorClass = "bg-blue-100 text-blue-800";
    if (s === "MAINTENANCE") colorClass = "bg-orange-100 text-orange-800";
  } else if (type === "UserRole") {
    if (s === "TENANT") colorClass = "bg-purple-100 text-purple-800";
    if (s === "LANDLORD") colorClass = "bg-teal-100 text-teal-800";
    if (s === "ADMIN") colorClass = "bg-indigo-100 text-indigo-800";
  }

  return (
    <Badge className={`border-transparent ${colorClass} ${className || ""}`}>
      {status}
    </Badge>
  )
}