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
            {columns.map((column) => {
              const isActive = column.sortable && sortBy === column.key;
              return (
                <th
                  key={column.key}
                  className={`text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm transition-colors duration-200 ${
                    column.sortable ? "cursor-pointer select-none group" : ""
                  } ${isActive ? "bg-muted font-bold" : ""}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <span className="truncate flex-1">{column.label}</span>
                  {/* Only show arrow if this is the active sort column */}
                  {column.sortable && isActive && (
                    <span className="ml-2 inline-block transition-transform duration-200" style={{ transform: sortDir === "desc" ? "rotate(0deg)" : "rotate(180deg)" }}>
                      {sortDir === "desc" ? (
                        <ChevronDown className="h-4 w-4 text-primary" />
                      ) : (
                        <ChevronUp className="h-4 w-4 text-primary" />
                      )}
                    </span>
                  )}
                  {/* Show faded arrow on hover for sortable but inactive columns */}
                  {column.sortable && !isActive && (
                    <span className="ml-2 opacity-0 group-hover:opacity-40 transition-opacity duration-200">
                      <ChevronUp className="h-4 w-4" />
                    </span>
                  )}
                </th>
              );
            })}
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