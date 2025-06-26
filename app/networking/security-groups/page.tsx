"use client"

import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { securityGroups } from "../../../lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { ActionMenu } from "../../../components/action-menu"
import { ChevronUp, ChevronDown, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationModal } from "../../../components/delete-confirmation-modal"
import { useToast } from "../../../hooks/use-toast"

export default function SecurityGroupListPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedSecurityGroup, setSelectedSecurityGroup] = useState<any>(null)

  const handleDeleteClick = (securityGroup: any) => {
    setSelectedSecurityGroup(securityGroup)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedSecurityGroup) return
    
    // In a real app, this would delete the security group via API
    console.log("Deleting Security Group:", selectedSecurityGroup.name)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success toast
    toast({
      title: "Security group deleted successfully",
      description: `Security Group "${selectedSecurityGroup.name}" deleted successfully`,
    })
    
    // Close modal and clear selection
    setIsDeleteModalOpen(false)
    setSelectedSecurityGroup(null)
    
    // In a real app, you would refresh the data here
    // For now, we'll just reload the page
    window.location.reload()
  }

  const columns = [
    {
      key: "name",
      label: "Security Group Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/networking/security-groups/${row.id}`}
          className="text-primary underline font-medium hover:no-underline"
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
      key: "createdOn",
      label: "Created On",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "actions",
      label: "Action",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/networking/security-groups/${row.id}`}
            editHref={`/networking/security-groups/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType="Security Group"
          />
        </div>
      ),
    },
  ]

  // Add actions property to each security group row for DataTable
  const dataWithActions = securityGroups.map((sg) => ({ ...sg, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <PageShell
      title="Security Groups"
      description="Define and manage security groups to control inbound and outbound traffic for your cloud resources."
      headerActions={
        <CreateButton href="/networking/security-groups/create" label="Create Security Group" />
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
        enableVpcFilter={true}
        vpcOptions={[
          { value: "all", label: "All VPCs" },
          { value: "production-vpc", label: "production-vpc" },
          { value: "development-vpc", label: "development-vpc" },
          { value: "staging-vpc", label: "staging-vpc" },
        ]}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedSecurityGroup(null)
        }}
        resourceName={selectedSecurityGroup?.name || ""}
        resourceType="Security Group"
        onConfirm={handleDeleteConfirm}
      />
    </PageShell>
  )
}
