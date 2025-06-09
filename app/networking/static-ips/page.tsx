"use client"

import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { staticIPs } from "../../../lib/data"
import { ActionMenu } from "../../../components/action-menu"
import { ChevronUp, ChevronDown, RefreshCw } from "lucide-react"
import { useState } from "react"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Button } from "@/components/ui/button"

export default function StaticIPListPage() {
  const columns = [
    {
      key: "address",
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
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "accessType",
      label: "Access Type",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "assignedVM",
      label: "Assigned VM",
      render: (value: string) => value || <span className="italic text-muted-foreground">Not assigned</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <ActionMenu
          viewHref={`/networking/static-ips/${row.id}`}
          editHref={`/networking/static-ips/${row.id}/edit`}
          deleteHref={`/networking/static-ips/${row.id}/delete`}
          resourceName={row.address}
          resourceType="Static IP"
        />
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
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">VPC:</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px] border-input">
              <SelectValue placeholder="All VPCs" />
            </SelectTrigger>
            <SelectContent>
              {vpcOptions.map((vpc) => (
                <SelectItem key={vpc.value} value={vpc.value}>{vpc.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CreateButton href="/networking/static-ips/create" label="Reserve IP Address" />
      </div>
      <ShadcnDataTable
        columns={columns}
        data={dataWithActions}
        searchableColumns={["address", "subnetName"]}
        defaultSort={{ column: "address", direction: "asc" }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={true}
        enablePagination={true}
        onRefresh={handleRefresh}
      />
    </PageShell>
  )
}
