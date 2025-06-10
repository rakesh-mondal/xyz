import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { PlusCircle, MoreHorizontal } from "lucide-react"

// Mock data
const mockGroups = [
  {
    id: "1",
    name: "Administrators",
    description: "Full system access and control",
    members: "5 members",
    created: "Jan 1, 2024",
  },
  {
    id: "2",
    name: "Developers",
    description: "Development and testing access",
    members: "12 members",
    created: "Jan 15, 2024",
  },
]

export default function UserGroupsPage() {
  const columns = [
    {
      key: "name",
      label: "Group Name",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="font-medium text-sm">{value}</div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">{value}</div>
      ),
    },
    {
      key: "members",
      label: "Members",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">{value}</div>
      ),
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">{value}</div>
      ),
    },
    {
      key: "actions",
      label: "",
      align: "right" as const,
      render: () => (
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <PageShell
      title="User Groups"
      description="Manage user groups and their permissions"
      headerActions={
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      }
    >
      <ShadcnDataTable
        columns={columns}
        data={mockGroups}
        searchableColumns={["name", "description"]}
        defaultSort={{ column: "name", direction: "asc" }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={false}
        enablePagination={true}
      />
    </PageShell>
  )
} 