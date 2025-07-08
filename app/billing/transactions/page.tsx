"use client"

import React, { useState, useCallback } from "react"
import { PageLayout } from "@/components/page-layout"
import { ShadcnDataTable, type Column } from "@/components/ui/shadcn-data-table"
import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, MoreVertical } from "lucide-react"
import { 
  Dialog,
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { useToast } from "@/hooks/use-toast"

// Mock transaction data
const mockTransactions = [
  {
    id: "txn_001",
    date: "2024-01-15T10:30:00Z",
    amount: 250.75,
    status: "completed",
    jobStatus: "completed",
    type: "Service Payment",
    description: "AI Model Training - Llama 3.1 70B Fine-tuning",
    paymentMethod: "Credit Card (**** 4567)",
    service: "AI Studio",
    referenceId: "REF_AI_001",
    currency: "INR",
    breakdown: {
      subtotal: 238.33,
      tax: 12.42,
      total: 250.75
    }
  },
  {
    id: "txn_002", 
    date: "2024-01-14T14:22:00Z",
    amount: 150.00,
    status: "completed",
    jobStatus: "completed",
    type: "Credit Purchase",
    description: "Account Credit Top-up",
    paymentMethod: "UPI (Google Pay)",
    service: "Billing",
    referenceId: "REF_CR_002",
    currency: "INR",
    breakdown: {
      subtotal: 150.00,
      tax: 0.00,
      total: 150.00
    }
  },
  {
    id: "txn_003",
    date: "2024-01-14T09:15:00Z", 
    amount: 89.50,
    status: "pending",
    jobStatus: "pending",
    type: "Service Payment",
    description: "Document Intelligence - Text Extraction (1000 pages)",
    paymentMethod: "Credit Card (**** 4567)",
    service: "DIS",
    referenceId: "REF_DIS_003",
    currency: "INR",
    breakdown: {
      subtotal: 84.91,
      tax: 4.59,
      total: 89.50
    }
  },
  {
    id: "txn_004",
    date: "2024-01-13T16:45:00Z",
    amount: 320.25,
    status: "failed",
    jobStatus: "failed",
    type: "Service Payment", 
    description: "VM Instance - GPU A100 (10 hours)",
    paymentMethod: "Credit Card (**** 4567)",
    service: "Compute",
    referenceId: "REF_VM_004",
    currency: "INR",
    breakdown: {
      subtotal: 304.05,
      tax: 16.20,
      total: 320.25
    }
  },
  {
    id: "txn_005",
    date: "2024-01-13T11:20:00Z",
    amount: 45.00,
    status: "completed",
    jobStatus: "completed",
    type: "Service Payment",
    description: "Object Storage - 100GB monthly",
    paymentMethod: "Auto-debit (Bank Account)",
    service: "Storage",
    referenceId: "REF_ST_005",
    currency: "INR",
    breakdown: {
      subtotal: 42.86,
      tax: 2.14,
      total: 45.00
    }
  },
  {
    id: "txn_006",
    date: "2024-01-12T13:10:00Z",
    amount: 500.00,
    status: "completed",
    jobStatus: "completed", 
    type: "Credit Purchase",
    description: "Business Plan Credit Package",
    paymentMethod: "Bank Transfer",
    service: "Billing",
    referenceId: "REF_BP_006",
    currency: "INR",
    breakdown: {
      subtotal: 500.00,
      tax: 0.00,
      total: 500.00
    }
  },
  {
    id: "txn_007",
    date: "2024-01-12T08:30:00Z",
    amount: 199.99,
    status: "completed",
    jobStatus: "completed",
    type: "Service Payment",
    description: "Bhashik TTS - 10M characters",
    paymentMethod: "Credit Card (**** 4567)",
    service: "Bhashik",
    referenceId: "REF_BH_007", 
    currency: "INR",
    breakdown: {
      subtotal: 190.46,
      tax: 9.53,
      total: 199.99
    }
  },
  {
    id: "txn_008",
    date: "2024-01-11T15:45:00Z",
    amount: 75.25,
    status: "refunded",
    jobStatus: "refunded",
    type: "Service Payment",
    description: "API Gateway - Premium tier (monthly)",
    paymentMethod: "Credit Card (**** 4567)",
    service: "APIs",
    referenceId: "REF_API_008",
    currency: "INR",
    breakdown: {
      subtotal: 71.67,
      tax: 3.58,
      total: 75.25
    }
  },
  {
    id: "txn_009",
    date: "2024-01-11T12:15:00Z",
    amount: 1250.00,
    status: "completed",
    jobStatus: "completed",
    type: "Service Payment",
    description: "Model Deployment - H100 Cluster (24 hours)",
    paymentMethod: "Enterprise Account",
    service: "AI Studio",
    referenceId: "REF_MD_009",
    currency: "INR",
    breakdown: {
      subtotal: 1190.48,
      tax: 59.52,
      total: 1250.00
    }
  },
  {
    id: "txn_010",
    date: "2024-01-10T10:00:00Z",
    amount: 25.50,
    status: "pending",
    jobStatus: "pending",
    type: "Service Payment",
    description: "Block Storage - 50GB SSD",
    paymentMethod: "Credit Card (**** 4567)",
    service: "Storage",
    referenceId: "REF_BS_010",
    currency: "INR",
    breakdown: {
      subtotal: 24.29,
      tax: 1.21,
      total: 25.50
    }
  },
  {
    id: "txn_011",
    date: "2024-01-09T17:30:00Z",
    amount: 300.00,
    status: "cancelled",
    jobStatus: "cancelled",
    type: "Credit Purchase",
    description: "Premium Credit Package",
    paymentMethod: "Credit Card (**** 4567)",
    service: "Billing",
    referenceId: "REF_PC_011",
    currency: "INR",
    breakdown: {
      subtotal: 300.00,
      tax: 0.00,
      total: 300.00
    }
  },
  {
    id: "txn_012",
    date: "2024-01-09T14:20:00Z",
    amount: 135.75,
    status: "completed",
    jobStatus: "completed",
    type: "Service Payment",
    description: "Load Balancer - Standard tier (monthly)",
    paymentMethod: "Auto-debit (Bank Account)",
    service: "Networking",
    referenceId: "REF_LB_012",
    currency: "INR",
    breakdown: {
      subtotal: 129.29,
      tax: 6.46,
      total: 135.75
    }
  }
]

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Simulate data refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({
      title: "Transactions refreshed",
      description: "Transaction data has been updated successfully.",
    })
  }, [toast])

  const handleViewDetails = (transaction: typeof mockTransactions[0]) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDownloadReceipt = (transactionId: string) => {
    toast({
      title: "Receipt download started",
      description: `Downloading receipt for transaction ${transactionId}`,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getServiceBadgeColor = (service: string) => {
    const colors: Record<string, string> = {
      'AI Studio': 'bg-purple-100 text-purple-800',
      'Billing': 'bg-green-100 text-green-800', 
      'DIS': 'bg-blue-100 text-blue-800',
      'Compute': 'bg-orange-100 text-orange-800',
      'Storage': 'bg-yellow-100 text-yellow-800',
      'Bhashik': 'bg-pink-100 text-pink-800',
      'APIs': 'bg-cyan-100 text-cyan-800',
      'Networking': 'bg-indigo-100 text-indigo-800'
    }
    return colors[service] || 'bg-gray-100 text-gray-800'
  }

  const columns: Column<typeof mockTransactions[0]>[] = [
    {
      key: "id",
      label: "Transaction ID",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="font-mono text-sm">{value}</div>
      )
    },
    {
      key: "date", 
      label: "Date & Time",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm leading-5">{formatDate(value)}</div>
      )
    },
    {
      key: "type",
      label: "Type", 
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="text-sm leading-5">{value}</div>
      )
    },
    {
      key: "description",
      label: "Description",
      searchable: true,
      render: (value: string) => (
        <div className="text-sm leading-5 max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: "service",
      label: "Service",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <Badge 
          variant="outline" 
          className={`text-xs font-medium ${getServiceBadgeColor(value)}`}
        >
          {value}
        </Badge>
      )
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      align: "right" as const,
      render: (value: number, row) => (
        <div className="text-sm leading-5 font-medium">
          {formatAmount(value, row.currency)}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <DropdownMenu>
          <TooltipWrapper content={`More actions for ${row.id}`}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipWrapper>
          <DropdownMenuContent align="end" className="border-border min-w-[180px]">
            <DropdownMenuItem 
              onClick={() => handleViewDetails(row)}
              className="flex items-center cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>
            {row.status === 'completed' && (
              <DropdownMenuItem 
                onClick={() => handleDownloadReceipt(row.id)}
                className="flex items-center cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Download Receipt</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
    { value: "cancelled", label: "Cancelled" }
  ]

  return (
    <PageLayout 
      title="Transactions" 
      description="View and manage your billing transactions and payment history"
    >
      <div className="space-y-6">
        {/* Transactions Table */}
        <ShadcnDataTable
          columns={columns}
          data={mockTransactions}
          searchableColumns={["id", "description", "type", "service"]}
          defaultSort={{ column: "date", direction: "desc" }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableStatusFilter={true}
          statusOptions={statusOptions}
          onStatusChange={(status) => {
            // Filter will be handled by the table component
            console.log("Status filter changed:", status)
          }}
        />

        {/* Transaction Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent 
            className="sm:max-w-2xl" 
            style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}
          >
            <DialogHeader className="space-y-3 pb-4">
              <DialogTitle className="text-lg font-semibold text-black pr-8">
                Transaction Details
              </DialogTitle>
              <hr className="border-border" />
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                Detailed information for transaction {selectedTransaction?.id}
              </DialogDescription>
            </DialogHeader>
            
            {selectedTransaction && (
              <div className="space-y-6 py-2">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                    <div className="font-mono text-sm">{selectedTransaction.id}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Reference ID</label>
                    <div className="font-mono text-sm">{selectedTransaction.referenceId}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                    <div className="text-sm">{formatDate(selectedTransaction.date)}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <StatusBadge status={selectedTransaction.status} />
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <div className="text-sm">{selectedTransaction.description}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Service</label>
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium ${getServiceBadgeColor(selectedTransaction.service)}`}
                      >
                        {selectedTransaction.service}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                      <div className="text-sm">{selectedTransaction.paymentMethod}</div>
                    </div>
                  </div>
                </div>

                {/* Amount Breakdown */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-3">Amount Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <span className="text-sm">{formatAmount(selectedTransaction.breakdown.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tax & Fees</span>
                      <span className="text-sm">{formatAmount(selectedTransaction.breakdown.tax)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatAmount(selectedTransaction.breakdown.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="min-w-20"
              >
                Close
              </Button>
              {selectedTransaction?.status === 'completed' && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => handleDownloadReceipt(selectedTransaction.id)}
                  className="min-w-32"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  )
}
