import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, HardDrive } from "lucide-react"

export default function VolumesPage() {
  return (
    <PageLayout 
      title="Block Storage Volumes" 
      description="Manage your cloud storage volumes"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
                    <h1 className="text-2xl font-medium">Volumes</h1>
        <p className="text-gray-600">Create and manage your block storage volumes</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Volume
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Your Volumes
            </CardTitle>
            <CardDescription>
              You don't have any volumes yet. Create your first volume to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <HardDrive className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-semibold">No volumes found</h3>
          <p className="text-gray-500 mt-2">Get started by creating a new volume.</p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Volume
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
} 