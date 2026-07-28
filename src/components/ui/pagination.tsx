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