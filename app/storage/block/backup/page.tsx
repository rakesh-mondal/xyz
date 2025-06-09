"use client"

import { PageShell } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
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
    status: "available",
    size: "200 GB",
    createdOn: "2023-02-20",
  },
]

export default function BlockStorageBackupPage() {
  const columns = [
    {
      key: "name",
      label: "Backup Name",
      searchable: true,
    },
    {
      key: "volume",
      label: "Volume",
      searchable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "size",
      label: "Size",
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
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
        <Button variant="default">Create Backup</Button>
      </div>
      <ShadcnDataTable
        columns={columns}
        data={mockBackups}
        searchableColumns={["name", "volume"]}
        defaultSort={{ column: "createdOn", direction: "desc" }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={true}
        enablePagination={true}
        onRefresh={handleRefresh}
      />
    </PageShell>
  )
} 