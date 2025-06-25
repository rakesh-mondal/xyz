"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { subnets, getVMAttachedToSubnet } from "../../../lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { ActionMenu } from "../../../components/action-menu"
import { ShadcnDataTable } from "../../../components/ui/shadcn-data-table"
import { RefreshCw } from "lucide-react"
import { 
  DeleteSubnetVMWarningModal, 
  DeleteSubnetConfirmationModal, 
  DeleteSubnetNameConfirmationModal 
} from "../../../components/modals/delete-subnet-modals"
import { SubnetConnectionModal } from "../../../components/modals/subnet-connection-modal"

export default function SubnetListPage() {
  const router = useRouter()
  const [deleteStep, setDeleteStep] = useState<"vm-warning" | "confirmation" | "name-confirmation" | null>(null)
  const [selectedSubnet, setSelectedSubnet] = useState<any>(null)
  const [attachedVM, setAttachedVM] = useState<string | null>(null)
  const [connectionModalOpen, setConnectionModalOpen] = useState(false)
  const [connectionSubnet, setConnectionSubnet] = useState<any>(null)

  const handleDeleteClick = (subnet: any) => {
    const vmName = getVMAttachedToSubnet(subnet.id)
    setSelectedSubnet(subnet)
    
    if (vmName) {
      // Subnet is attached to a VM - show warning
      setAttachedVM(vmName)
      setDeleteStep("vm-warning")
    } else {
      // Subnet is not attached - show confirmation
      setDeleteStep("confirmation")
    }
  }

  const handleConfirmationProceed = () => {
    setDeleteStep("name-confirmation")
  }

  const handleFinalDelete = async () => {
    // Simulate delete API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Subnet deleted:", selectedSubnet.name)
    
    // Close modals
    setDeleteStep(null)
    setSelectedSubnet(null)
    setAttachedVM(null)
  }

  const handleCloseModals = () => {
    setDeleteStep(null)
    setSelectedSubnet(null)
    setAttachedVM(null)
  }

  const handleConnectSubnet = (subnet: any) => {
    setConnectionSubnet(subnet)
    setConnectionModalOpen(true)
  }

  const columns = [
    {
      key: "name",
      label: "Subnet Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/networking/subnets/${row.id}`}
          className="text-primary font-medium hover:underline"
        >
          {value}
        </a>
      ),
    },
    {
      key: "vpcName",
      label: "VPC",
      searchable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "cidr",
      label: "CIDR",
    },
    {
      key: "gatewayIp",
      label: "Gateway IP",
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <span className="text-muted-foreground">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Action",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            onCustomDelete={() => handleDeleteClick(row)}
            onConnectSubnet={() => handleConnectSubnet(row)}
            resourceName={row.name}
            resourceType="Subnet"
          />
        </div>
      ),
    },
  ]

  // Add actions property to each subnet row for DataTable
  const dataWithActions = subnets.map((subnet) => ({ ...subnet, actions: null }))

  const handleRefresh = () => {
    // Add your refresh logic here
    console.log("🔄 Refreshing Subnet data at:", new Date().toLocaleTimeString())
    // In a real app, this would typically:
    // - Refetch data from API
    // - Update state
    // - Show loading indicator
    // For demo purposes, we'll just log instead of reloading
    // window.location.reload()
  }

  return (
    <PageShell
      title="Subnets"
      description="Create subnets inside your VPC to neatly separate resources—keeping them secure and helping your network run faster."
      headerActions={
        <CreateButton href="/networking/subnets/create" label="Create Subnet" />
      }
    >

      <ShadcnDataTable
        columns={columns}
        data={dataWithActions}
        searchableColumns={["name", "vpcName"]}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={false}
        enablePagination={true}
        onRefresh={handleRefresh}
        enableAutoRefresh={true}
        enableVpcFilter={true}
        vpcOptions={[
          { value: "all", label: "All VPCs" },
          { value: "production-vpc", label: "production-vpc" },
          { value: "development-vpc", label: "development-vpc" },
          { value: "staging-vpc", label: "staging-vpc" },
          { value: "testing-vpc", label: "testing-vpc" },
          { value: "backup-vpc", label: "backup-vpc" },
          { value: "analytics-vpc", label: "analytics-vpc" },
          { value: "security-vpc", label: "security-vpc" },
          { value: "ml-vpc", label: "ml-vpc" },
          { value: "cdn-vpc", label: "cdn-vpc" },
          { value: "iot-vpc", label: "iot-vpc" },
          { value: "gaming-vpc", label: "gaming-vpc" },
          { value: "blockchain-vpc", label: "blockchain-vpc" },
          { value: "research-vpc", label: "research-vpc" },
        ]}
      />

      {/* Step 1: VM Attachment Warning Modal */}
      {selectedSubnet && attachedVM && (
        <DeleteSubnetVMWarningModal
          open={deleteStep === "vm-warning"}
          onClose={handleCloseModals}
          subnet={selectedSubnet}
          vmName={attachedVM}
        />
      )}

      {/* Step 2: Initial Confirmation Modal */}
      {selectedSubnet && (
        <DeleteSubnetConfirmationModal
          open={deleteStep === "confirmation"}
          onClose={handleCloseModals}
          subnet={selectedSubnet}
          onConfirm={handleConfirmationProceed}
        />
      )}

      {/* Step 3: Name Confirmation Modal */}
      {selectedSubnet && (
        <DeleteSubnetNameConfirmationModal
          open={deleteStep === "name-confirmation"}
          onClose={handleCloseModals}
          subnet={selectedSubnet}
          onConfirm={handleFinalDelete}
        />
      )}

      {/* Subnet Connection Modal */}
      <SubnetConnectionModal
        isOpen={connectionModalOpen}
        onClose={() => {
          setConnectionModalOpen(false)
          setConnectionSubnet(null)
        }}
        subnet={connectionSubnet}
      />
    </PageShell>
  )
}
