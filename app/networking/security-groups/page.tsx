"use client"

import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { securityGroups } from "../../../lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { ActionMenu } from "../../../components/action-menu"
import { ChevronUp, ChevronDown, RefreshCw } from "lucide-react"
import { useState } from "react"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { Button } from "@/components/ui/button"

export default function SecurityGroupListPage() {
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
      label: "Actions",
      render: (_: any, row: any) => (
        <ActionMenu
          viewHref={`/networking/security-groups/${row.id}`}
          editHref={`/networking/security-groups/${row.id}/edit`}
          deleteHref={`/networking/security-groups/${row.id}/delete`}
          resourceName={row.name}
          resourceType="Security Group"
        />
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
        <CreateButton href="/networking/security-groups/create" label="Create Security Group" />
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
