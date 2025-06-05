"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  defaultSort?: {
    column: string
    direction: "asc" | "desc"
  }
}

export function DataTable({ columns, data, defaultSort }: DataTableProps) {
  const [sortBy, setSortBy] = useState<string>(defaultSort?.column || columns[0].key)
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSort?.direction || "asc")

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDir("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    let aVal: any = a[sortBy]
    let bVal: any = b[sortBy]
    
    // Handle date sorting
    if (typeof aVal === "string" && aVal.match(/^\d{4}-\d{2}-\d{2}/)) {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1
    return 0
  })

  return (
    <div className="overflow-hidden bg-card text-card-foreground border-border border rounded-lg">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm ${
                  column.sortable ? "cursor-pointer select-none" : ""
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                {column.label}
                {column.sortable && sortBy === column.key && (
                  sortDir === "asc" 
                    ? <ChevronUp className="inline h-4 w-4 ml-1" />
                    : <ChevronDown className="inline h-4 w-4 ml-1" />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index} className="hover:bg-muted/50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-2.5 border-b border-border">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 