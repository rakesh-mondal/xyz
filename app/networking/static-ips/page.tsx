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
import { useToast } from "../../../hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"

export default function StaticIPListPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isVMAttachedModalOpen, setIsVMAttachedModalOpen] = useState(false)
  const [selectedStaticIP, setSelectedStaticIP] = useState<any>(null)

  const handleDeleteClick = (staticIP: any) => {
    setSelectedStaticIP(staticIP)
    
    // Check if IP is attached to a VM
    if (staticIP.assignedVMName && staticIP.assignedVMName !== null) {
      // Show VM attached modal
      setIsVMAttachedModalOpen(true)
    } else {
      // Show normal delete confirmation modal
      setIsDeleteModalOpen(true)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedStaticIP) return
    
    // In a real app, this would delete the static IP via API
    console.log("Unreserving Static IP:", selectedStaticIP.ipAddress)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success toast
    toast({
      title: "IP address unreserved successfully",
      description: `IP address "${selectedStaticIP.ipAddress}" has been unreserved successfully`,
    })
    
    // Close modal and clear selection
    setIsDeleteModalOpen(false)
    setSelectedStaticIP(null)
    
    // In a real app, you would refresh the data here
    // For now, we'll just reload the page
    window.location.reload()
  }

  const handleVMAttachedModalClose = () => {
    setIsVMAttachedModalOpen(false)
    setSelectedStaticIP(null)
  }

  const columns = [
    {
      key: "ipAddress",
      label: "IP Address",
      sortable: true,
      searchable: true,
    },
    {
      key: "subnetName",
      label: "Subnet Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === 'IPv4' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-purple-100 text-purple-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: "accessType",
      label: "Access Type",
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Public' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: "assignedVMName",
      label: "Assigned VM",
      searchable: true,
      render: (value: string) => value || <span className="italic text-muted-foreground">Not assigned</span>,
    },
    {
      key: "actions",
      label: "Action",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
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

  // VPC options for filtering
  const vpcOptions = [
    { value: "all", label: "All VPCs" },
    { value: "production-vpc", label: "production-vpc" },
    { value: "development-vpc", label: "development-vpc" },
    { value: "staging-vpc", label: "staging-vpc" },
    { value: "ml-vpc", label: "ml-vpc" },
    { value: "cdn-vpc", label: "cdn-vpc" },
    { value: "gaming-vpc", label: "gaming-vpc" },
    { value: "analytics-vpc", label: "analytics-vpc" },
    { value: "backup-vpc", label: "backup-vpc" },
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
        searchableColumns={["ipAddress", "subnetName", "assignedVMName"]}
        defaultSort={{ column: "ipAddress", direction: "asc" }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={false}
        enablePagination={true}
        onRefresh={handleRefresh}
        enableVpcFilter={true}
        vpcOptions={vpcOptions}
      />

      {/* Unreserve IP Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure you want to unreserve the IP address?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Please note once the IP address is deleted, it is not sure that you will get the same IP address again when you try to reserve a IP address
            </p>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false)
                setSelectedStaticIP(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Confirm deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VM Attached Alert Modal */}
      <Dialog open={isVMAttachedModalOpen} onOpenChange={setIsVMAttachedModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>IP address is associated with a VM</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              The <span className="font-medium text-foreground">{selectedStaticIP?.ipAddress}</span> is attached with a VM <span className="font-medium text-foreground">{selectedStaticIP?.assignedVMName}</span>. Please detach the IP address from the VM before deletion.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleVMAttachedModalClose}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
