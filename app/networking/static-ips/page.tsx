"use client"

import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { staticIPs } from "../../../lib/data"
import { ActionMenu } from "../../../components/action-menu"
import { ChevronUp, ChevronDown, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationModal } from "../../../components/delete-confirmation-modal"
import { useToast } from "../../../hooks/use-toast"

export default function StaticIPListPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedStaticIP, setSelectedStaticIP] = useState<any>(null)

  const handleDeleteClick = (staticIP: any) => {
    setSelectedStaticIP(staticIP)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedStaticIP) return
    
    // In a real app, this would delete the static IP via API
    console.log("Deleting Static IP:", selectedStaticIP.ipAddress)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success toast
    toast({
      title: "Static IP deleted successfully",
      description: `Static IP "${selectedStaticIP.ipAddress}" deleted successfully`,
    })
    
    // Close modal and clear selection
    setIsDeleteModalOpen(false)
    setSelectedStaticIP(null)
    
    // In a real app, you would refresh the data here
    // For now, we'll just reload the page
    window.location.reload()
  }

  const columns = [
    {
      key: "ipAddress",
      label: "IP Address",
      sortable: true,
      searchable: true,
    },
    {
      key: "vpcName",
      label: "VPC Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "associatedResource",
      label: "Associated Resource",
      render: (value: string) => value || <span className="italic text-muted-foreground">Not assigned</span>,
    },
    {
      key: "description",
      label: "Description",
      searchable: true,
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || <span className="italic text-muted-foreground">No description</span>}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Action",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/networking/static-ips/${row.id}`}
            editHref={`/networking/static-ips/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.ipAddress}
            resourceType="Static IP"
          />
        </div>
      ),
    },
  ]

  // Add actions property to each static IP row for DataTable
  const dataWithActions = staticIPs.map((ip) => ({ ...ip, actions: null }))

  // Example VPC options (replace with real data if available)
  const vpcOptions = [
    { value: "all", label: "All VPCs" },
    { value: "production-vpc", label: "production-vpc" },
    { value: "development-vpc", label: "development-vpc" },
    { value: "staging-vpc", label: "staging-vpc" },
  ]

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <PageShell
      title="Static IP Addresses"
      description="Reserve and manage static IP addresses for your cloud resources. Assign IPs to VMs and other services as needed."
      headerActions={
        <CreateButton href="/networking/static-ips/create" label="Reserve IP Address" />
      }
    >

      <ShadcnDataTable
        columns={columns}
        data={dataWithActions}
        searchableColumns={["ipAddress", "vpcName", "description"]}
        defaultSort={{ column: "ipAddress", direction: "asc" }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={false}
        enablePagination={true}
        onRefresh={handleRefresh}
        enableVpcFilter={true}
        vpcOptions={vpcOptions}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedStaticIP(null)
        }}
        resourceName={selectedStaticIP?.ipAddress || ""}
        resourceType="Static IP"
        onConfirm={handleDeleteConfirm}
      />
    </PageShell>
  )
}
