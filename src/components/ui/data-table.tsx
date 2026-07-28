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