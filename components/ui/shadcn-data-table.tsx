"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Search, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Column<T = any> {
  key: string
  label: string
  sortable?: boolean
  searchable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

interface ShadcnDataTableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  searchableColumns?: string[]
  defaultSort?: {
    column: string
    direction: "asc" | "desc"
  }
  pageSize?: number
  enableSearch?: boolean
  enableColumnVisibility?: boolean
  enablePagination?: boolean
  onRefresh?: () => void
}

export function ShadcnDataTable<T = any>({ 
  columns, 
  data, 
  searchableColumns = [],
  defaultSort,
  pageSize = 10,
  enableSearch = true,
  enableColumnVisibility = true,
  enablePagination = true,
  onRefresh
}: ShadcnDataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    defaultSort ? [{ id: defaultSort.column, desc: defaultSort.direction === "desc" }] : []
  )
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  
  // Convert our column format to TanStack column format
  const tanstackColumns: ColumnDef<T>[] = React.useMemo(() => {
    return columns.map((col) => ({
      accessorKey: col.key,
      id: col.key,
      header: ({ column }) => {
        if (!col.sortable) {
          return <div className="text-left font-medium">{col.label}</div>
        }
        
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium hover:bg-transparent"
          >
            {col.label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row, getValue }) => {
        const value = getValue()
        if (col.render) {
          return col.render(value, row.original)
        }
        return <div className="text-left">{String(value ?? '')}</div>
      },
      enableSorting: col.sortable,
      enableHiding: true,
    }))
  }, [columns])

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  })

  // Get the primary searchable column for the search input
  const primarySearchColumn = searchableColumns[0] || columns.find(col => col.searchable)?.key

  return (
    <div className="w-full space-y-4">
      {/* Search and Filter Controls */}
      {(enableSearch || enableColumnVisibility) && (
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            {enableSearch && (
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${primarySearchColumn ? columns.find(c => c.key === primarySearchColumn)?.label?.toLowerCase() || 'items' : 'items'}...`}
                  value={globalFilter}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pl-8"
                />
              </div>
            )}
            
            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Columns
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      const columnDef = columns.find(col => col.key === column.id)
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {columnDef?.label || column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {onRefresh && (
            <Button 
              variant="outline" 
              onClick={onRefresh}
              className="ml-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
      )}

      {/* Data Table */}
      <div className="rounded-md border">
        <div className="relative w-full">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b transition-colors hover:bg-gray-50/50 text-sm">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b transition-colors bg-white hover:bg-gray-50/30 data-[state=selected]:bg-blue-50/50 text-sm"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr className="bg-white">
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        No results found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {enablePagination && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length > 0 ? (
                <>
                  Showing{" "}
                  <strong>
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}
                  </strong>{" "}
                  of <strong>{table.getFilteredRowModel().rows.length}</strong> results
                </>
              ) : (
                "No results to display"
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center justify-center min-w-[120px] text-sm font-medium px-4">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 