import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, MoreHorizontal, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function PermissionsPage() {
  return (
    <PageShell
      title="Permissions"
      description="Manage system permissions and access controls"
      headerActions={
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Permission
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search permissions..." className="pl-8" />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">manage_users</TableCell>
                <TableCell>Create, edit, and delete users</TableCell>
                <TableCell>User Management</TableCell>
                <TableCell>Admin Role</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">view_analytics</TableCell>
                <TableCell>Access to system analytics and reports</TableCell>
                <TableCell>Analytics</TableCell>
                <TableCell>All Roles</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </PageShell>
  )
} 