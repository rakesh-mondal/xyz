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
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">VPC:</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px] border-input">
              <SelectValue placeholder="All VPCs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All VPCs</SelectItem>
              <SelectItem value="production-vpc">production-vpc</SelectItem>
              <SelectItem value="development-vpc">development-vpc</SelectItem>
              <SelectItem value="staging-vpc">staging-vpc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CreateButton href="/networking/subnets/create" label="Create Subnet" />
      </div>
      <ShadcnDataTable
        columns={columns}
        data={dataWithActions}
        searchableColumns={["name", "vpcName"]}
        defaultSort={{ column: "name", direction: "asc" }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={true}
        enablePagination={true}
        onRefresh={handleRefresh}
      />
    </PageShell>
  )
}
