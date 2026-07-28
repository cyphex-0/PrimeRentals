const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, '../src/components/ui');

const files = {
  'dialog.tsx': `
"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left mb-6", className)} {...props} />
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-xl font-heading font-semibold leading-none tracking-tight", className)} {...props} />
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative", className)} {...props} />
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)} {...props} />
}
`,
  'dropdown-menu.tsx': `
"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === DropdownMenuTrigger) {
          return React.cloneElement(child as React.ReactElement, {
            onClick: () => setIsOpen(!isOpen),
          });
        }
        if (React.isValidElement(child) && child.type === DropdownMenuContent) {
          return isOpen ? child : null;
        }
        return child;
      })}
    </div>
  )
}

export function DropdownMenuTrigger({ children, onClick, className }: any) {
  return (
    <div onClick={onClick} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  )
}

export function DropdownMenuContent({ children, className, align = "right" }: any) {
  return (
    <div 
      className={cn(
        "absolute z-50 mt-2 w-56 rounded-xl border bg-card p-1 shadow-lg dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-200",
        align === "right" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onClick, className, destructive }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted",
        destructive && "text-destructive hover:bg-destructive/10 hover:text-destructive",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({ className }: any) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} />
}
`,
  'data-table.tsx': `
import * as React from "react"
import { cn } from "@/lib/utils"

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  keyExtractor?: (item: T) => string;
}

export function DataTable<T>({ data, columns, className, keyExtractor }: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto rounded-xl border bg-white shadow-sm dark:bg-slate-900", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {columns.map((col, i) => (
              <th key={i} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No results found.
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr 
                key={keyExtractor ? keyExtractor(item) : rowIndex} 
                className="border-b transition-colors hover:bg-muted/50"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4 align-middle">
                    {col.cell ? col.cell(item) : String(item[col.accessorKey as keyof T] || "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
`,
  'pagination.tsx': `
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className={cn("mx-auto flex w-full justify-center", className)}>
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 p-0"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <span className="sr-only">Previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        <li className="text-sm font-medium">
          Page {page} of {totalPages}
        </li>
        <li>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 p-0"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <span className="sr-only">Next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}
`,
  'empty-state.tsx': `
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div 
      className={cn("flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in duration-500", className)}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-xl font-heading font-semibold text-foreground">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
`,
  'star-rating.tsx': `
import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  onRatingChange, 
  interactive = false,
  className 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const active = (hoverRating || rating) >= starValue;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            className={cn(
              "focus:outline-none transition-transform duration-200",
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            )}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRatingChange?.(starValue)}
          >
            <Star 
              className={cn(
                "h-5 w-5",
                active ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground"
              )} 
            />
          </button>
        )
      })}
    </div>
  )
}
`,
  'status-badge.tsx': `
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
    <Badge className={\`border-transparent \${colorClass} \${className || ""}\`}>
      {status}
    </Badge>
  )
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(uiDir, filename), content.trim());
}
console.log("Complex UI components generated successfully.");
