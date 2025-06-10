"use client"

import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { subnets } from "../../../lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { ActionMenu } from "../../../components/action-menu"
import { ShadcnDataTable } from "../../../components/ui/shadcn-data-table"
import { RefreshCw } from "lucide-react"

export default function SubnetListPage() {
  const columns = [
    {
      key: "name",
      label: "Subnet Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "vpcName",
      label: "VPC",
      searchable: true,
    },
    {
      key: "type",
      label: "Type",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "status",
      label: "Status",
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
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <ActionMenu
          viewHref={`/networking/subnets/${row.id}`}
          editHref={`/networking/subnets/${row.id}/edit`}
          deleteHref={`/networking/subnets/${row.id}/delete`}
          resourceName={row.name}
          resourceType="Subnet"
        />
      ),
    },
  ]

  // Add actions property to each subnet row for DataTable
  const dataWithActions = subnets.map((subnet) => ({ ...subnet, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <PageShell
      title="Subnets"
      description="Organize your network by creating and managing subnets within your VPCs. Subnets help segment your resources for better security and performance."
      headerActions={
        <CreateButton href="/networking/subnets/create" label="Create Subnet" />
      }
    >

      <ShadcnDataTable
        columns={columns}
        data={dataWithActions}
        searchableColumns={["name", "vpcName"]}
        defaultSort={{ column: "name", direction: "asc" }}
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
    </PageShell>
  )
}
