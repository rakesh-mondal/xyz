"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NodePoolManagement } from "@/components/mks/node-pool-management"
import { getClusterById, type MKSCluster } from "@/lib/mks-data"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"

export default function EditClusterPage() {
  const params = useParams()
  const router = useRouter()
  const clusterId = params.id as string
  const [cluster, setCluster] = useState<MKSCluster | undefined>(getClusterById(clusterId))
  const [hasChanges, setHasChanges] = useState(false)

  if (!cluster) {
    return (
      <PageShell title="Cluster Not Found">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cluster not found</h3>
              <p className="text-sm text-gray-600 mb-6">The requested cluster could not be found.</p>
              <Button asChild>
                <Link href="/kubernetes">Back to Clusters</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  const handleClusterUpdate = (updatedCluster: MKSCluster) => {
    setCluster(updatedCluster)
    setHasChanges(true)
  }

  const handleSaveChanges = () => {
    // In a real implementation, this would save changes to the backend
    console.log('Saving cluster changes:', cluster)
    setHasChanges(false)
    // Show success message or redirect
  }

  const handleCancel = () => {
    if (hasChanges) {
      // Show confirmation dialog
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        router.push(`/kubernetes/clusters/${cluster.id}`)
      }
    } else {
      router.push(`/kubernetes/clusters/${cluster.id}`)
    }
  }

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleCancel}>
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button 
        onClick={handleSaveChanges}
        disabled={!hasChanges}
        className="bg-black text-white hover:bg-black/90"
      >
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  )

  return (
    <PageShell
      title={`Edit Cluster: ${cluster.name}`}
      description="Modify node pools and cluster configuration"
      headerActions={headerActions}
      customBreadcrumbs={[
        { title: 'Kubernetes', href: '/kubernetes' },
        { title: 'Clusters', href: '/kubernetes' },
        { title: cluster.name, href: `/kubernetes/clusters/${cluster.id}` },
        { title: 'Edit', href: `/kubernetes/clusters/${cluster.id}/edit` }
      ]}
    >
      <div className="space-y-6">
        {/* Cluster Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Cluster Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Cluster Name</h4>
                <span className="font-medium">{cluster.name}</span>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Region</h4>
                <Badge variant="outline" className="font-mono">
                  {cluster.region}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Kubernetes Version</h4>
                <Badge variant="secondary" className="font-mono">
                  {cluster.k8sVersion}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Node Pool Management */}
        <NodePoolManagement 
          cluster={cluster} 
          onUpdate={handleClusterUpdate}
        />

        {/* Read-only Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Add-ons Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Add-ons cannot be modified after cluster creation. To change add-ons, you would need to recreate the cluster 
                or use the CLI tools for advanced configuration.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Networking Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Network configuration (VPC, subnets, security groups) cannot be modified after cluster creation. 
                To change networking, you would need to recreate the cluster.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Changes Summary */}
        {hasChanges && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-blue-800">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="font-medium">You have unsaved changes</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Review your changes and click "Save Changes" to apply them to the cluster.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  )
}

