import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"

export default function IAMUsersPage() {
  return (
    <PageLayout 
      title="Identity & Access Management - Users" 
      description="Manage user access and permissions"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-gray-600">Manage user accounts and their access permissions</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
            <CardDescription>
              Manage users who have access to your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No users found</h3>
              <p className="text-gray-500 mt-2">Start by inviting team members to your organization.</p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Invite Your First User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
} 