"use client"

import { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { VPCDeletionStatus } from "../../../components/vpc-deletion-status"
import { vpcs } from "../../../lib/data"
import { ActionMenu } from "../../../components/action-menu"
import { TooltipWrapper } from "../../../components/ui/tooltip-wrapper"
import { Button } from "../../../components/ui/button"
import { MoreVertical } from "lucide-react"
import { ShadcnDataTable } from "../../../components/ui/shadcn-data-table"
import { DeleteVPCResourceWarningModal, DeleteVPCConfirmationModal } from "../../../components/modals/delete-vpc-modals"
import { filterDataForUser, shouldShowEmptyState, getEmptyStateMessage } from "../../../lib/demo-data-filter"
import { EmptyState } from "../../../components/ui/empty-state"

export default function VPCListPage() {
  const [deleteStep, setDeleteStep] = useState<"warning" | "confirmation" | null>(null)
  const [selectedVPC, setSelectedVPC] = useState<any>(null)

  // Filter data based on user type for demo
  const filteredVPCs = filterDataForUser(vpcs)
  const showEmptyState = shouldShowEmptyState() && filteredVPCs.length === 0

  const handleDeleteClick = (vpc: any) => {
    setSelectedVPC(vpc)
    setDeleteStep("warning")
  }

  const handleWarningConfirm = () => {
    setDeleteStep("confirmation")
  }

  const handleFinalDelete = async () => {
    // Simulate delete API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("VPC deleted:", selectedVPC.name)
    
    // Close modals
    setDeleteStep(null)
    setSelectedVPC(null)
  }

  const handleCloseModals = () => {
    setDeleteStep(null)
    setSelectedVPC(null)
  }

  const columns = [
    {
      key: "name",
      label: "VPC Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/networking/vpc/${row.id}`}
          className="text-primary font-medium hover:underline leading-5"
        >
          {row.name}
        </a>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string, row: any) => {
        if (value === "deleting") {
          return <VPCDeletionStatus vpc={row} compact={true} />
        }
        return <StatusBadge status={value} />
      },
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "Free" 
            ? "bg-emerald-100 text-emerald-700" 
            : "bg-orange-100 text-orange-700"
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      searchable: true,
      render: (value: string) => (
        <div className="max-w-xs truncate leading-5" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="text-muted-foreground leading-5">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (value: any, row: any) => (
        <div className="flex justify-end">
          {row.status === "deleting" ? (
            <TooltipWrapper content="Actions are disabled while VPC is being deleted">
              <Button variant="ghost" size="icon" className="rounded-full opacity-50 cursor-not-allowed" disabled>
                <MoreVertical className="h-5 w-5" />
              </Button>
            </TooltipWrapper>
          ) : (
            <ActionMenu
              viewHref={`/networking/vpc/${row.id}`}
              editHref={`/networking/vpc/${row.id}/edit`}
              onCustomDelete={() => handleDeleteClick(row)}
              resourceName={row.name}
              resourceType="VPC"
            />
          )}
        </div>
      ),
    },
  ]

  const handleRefresh = () => {
    // Add your refresh logic here
    console.log("🔄 Refreshing VPC data at:", new Date().toLocaleTimeString())
    // In a real app, this would typically:
    // - Refetch data from API
    // - Update state
    // - Show loading indicator
    // For demo purposes, we'll just log instead of reloading
    // window.location.reload()
  }

  return (
    <PageShell
      title="Virtual Private Cloud"
      description="Create and manage your Virtual Private Clouds (VPCs) to logically isolate and organize your cloud resources."
      headerActions={
        <CreateButton href="/networking/vpc/create" label="Create VPC" />
      }
    >
      {showEmptyState ? (
        <EmptyState
          {...getEmptyStateMessage('vpc')}
          onAction={() => window.location.href = '/networking/vpc/create'}
        />
      ) : (
        <ShadcnDataTable 
          columns={columns} 
          data={filteredVPCs}
          searchableColumns={["name", "type", "description"]}
          pageSize={10}
          enableSearch={true}
          enableColumnVisibility={false}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableAutoRefresh={true}
          enableVpcFilter={false}
        />
      )}

      {/* Step 1: Resource Warning Modal */}
      {selectedVPC && (
        <DeleteVPCResourceWarningModal
          open={deleteStep === "warning"}
          onClose={handleCloseModals}
          vpc={selectedVPC}
          onConfirm={handleWarningConfirm}
        />
      )}

      {/* Step 2: Name Confirmation Modal */}
      {selectedVPC && (
        <DeleteVPCConfirmationModal
          open={deleteStep === "confirmation"}
          onClose={handleCloseModals}
          vpc={selectedVPC}
          onConfirm={handleFinalDelete}
        />
      )}
    </PageShell>
  )
}
