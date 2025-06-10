"use client"

import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { vpcs } from "../../../lib/data"
import { ActionMenu } from "../../../components/action-menu"
import { ShadcnDataTable } from "../../../components/ui/shadcn-data-table"

export default function VPCListPage() {
  const columns = [
    {
      key: "name",
      label: "VPC Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/networking/vpc/${row.id}`}
          className="text-primary underline font-medium hover:no-underline"
        >
          {row.name}
        </a>
      ),
    },
    {
      key: "region",
      label: "Region",
      sortable: true,
      searchable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "networkName",
      label: "Network Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
    },
    {
      key: "actions",
      label: "Action",
      align: "right" as const,
      render: (value: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/networking/vpc/${row.id}`}
            editHref={`/networking/vpc/${row.id}/edit`}
            deleteHref={`/networking/vpc/${row.id}/delete`}
            resourceName={row.name}
            resourceType="VPC"
          />
        </div>
      ),
    },
  ]

  // VPC filter options
  const vpcOptions = [
    { value: "all", label: "All VPCs" },
    { value: "production-vpc", label: "production-vpc" },
    { value: "development-vpc", label: "development-vpc" },
    { value: "staging-vpc", label: "staging-vpc" },
    { value: "testing-vpc", label: "testing-vpc" },
    { value: "backup-vpc", label: "backup-vpc" },
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
      <ShadcnDataTable 
        columns={columns} 
        data={vpcs}
        searchableColumns={["name", "region", "networkName"]}
        defaultSort={{
          column: "name",
          direction: "asc"
        }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={false}
        enablePagination={true}
        onRefresh={handleRefresh}
        enableAutoRefresh={true}
        enableVpcFilter={true}
        vpcOptions={vpcOptions}
      />
    </PageShell>
  )
}
