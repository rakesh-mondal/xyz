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
      label: "Actions",
      render: (value: any, row: any) => (
        <ActionMenu
          viewHref={`/networking/vpc/${row.id}`}
          editHref={`/networking/vpc/${row.id}/edit`}
          deleteHref={`/networking/vpc/${row.id}/delete`}
          resourceName={row.name}
          resourceType="VPC"
        />
      ),
    },
  ]

  return (
    <PageShell
      title="Virtual Private Cloud"
      description="Create and manage your Virtual Private Clouds (VPCs) to logically isolate and organize your cloud resources."
    >
      <div className="flex justify-end mb-4">
        <CreateButton href="/networking/vpc/create" label="Create VPC" />
      </div>
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
        enableColumnVisibility={true}
        enablePagination={true}
      />
    </PageShell>
  )
}
