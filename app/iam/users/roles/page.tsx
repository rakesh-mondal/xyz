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

export default function RolesPage() {
  return (
    <PageShell
      title="Roles"
      description="Manage user roles and their permissions"
      headerActions={
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search roles..." className="pl-8" />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Super Admin</TableCell>
                <TableCell>Full system access and control</TableCell>
                <TableCell>2 users</TableCell>
                <TableCell>All permissions</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Developer</TableCell>
                <TableCell>Development and testing access</TableCell>
                <TableCell>8 users</TableCell>
                <TableCell>Limited permissions</TableCell>
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