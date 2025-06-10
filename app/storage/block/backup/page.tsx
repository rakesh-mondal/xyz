"use client"

import { PageShell } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { ActionMenu } from "@/components/action-menu"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

const tabs = [
  { title: "Volumes", href: "/storage/block/volumes" },
  { title: "Snapshots", href: "/storage/block/snapshots" },
  { title: "Backup", href: "/storage/block/backup" },
]

const mockBackups = [
  {
    id: "backup-1",
    name: "Backup 1",
    volume: "Dev Volume",
    type: "incremental",
    size: "200 GB",
    createdOn: "2023-02-20",
  },
  {
    id: "backup-2",
    name: "Production Backup",
    volume: "Production Volume",
    type: "full",
    size: "500 GB",
    createdOn: "2023-02-18",
  },
  {
    id: "backup-3",
    name: "Weekly Backup",
    volume: "Analytics Volume",
    type: "incremental",
    size: "300 GB",
    createdOn: "2023-02-15",
  },
]

export default function BlockStorageBackupPage() {
  const columns = [
    {
      key: "name",
      label: "Backup Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "volume",
      label: "Source Volume",
      sortable: true,
      searchable: true,
    },
    {
      key: "type",
      label: "Type",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "size",
      label: "Size",
      sortable: true,
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
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref="#"
            editHref="#"
            deleteHref="#"
            resourceName={row.name}
            resourceType="Backup"
          />
        </div>
      ),
    },
  ]

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
      title="Block Storage"
      description="Provision, manage, and attach block storage volumes to your cloud resources."
      tabs={tabs}
      headerActions={
        <Button variant="default">Create Backup</Button>
      }
    >

      <ShadcnDataTable
        columns={columns}
        data={mockBackups}
        searchableColumns={["name", "volume"]}
        defaultSort={{ column: "createdOn", direction: "desc" }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={false}
        enablePagination={true}
        onRefresh={handleRefresh}
        enableVpcFilter={true}
        vpcOptions={vpcOptions}
      />
    </PageShell>
  )
} 