"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowUpRight, 
  Trash2, 
  Server, 
  Settings, 
  DollarSign, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Shield,
  Database,
  HardDrive,
  Network,
  Monitor,
  Package,
  GitBranch,
  Download,
  Key
} from "lucide-react"
import { getClusterById, type MKSCluster, isK8sVersionDeprecated, getNextK8sVersion, getRegionDisplayName } from "@/lib/mks-data"
import { ClusterOverview } from "@/components/mks/cluster-overview"
import { NodePoolsSection } from "@/components/mks/node-pools-section"
import { AddOnsSection } from "@/components/mks/add-ons-section"
import { CostEstimation } from "@/components/mks/cost-estimation"

export default function ClusterDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const clusterId = params.id as string
  const [cluster, setCluster] = useState<MKSCluster | undefined>(getClusterById(clusterId))
  
  // Modal states
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isKubeconfigModalOpen, setIsKubeconfigModalOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  if (!cluster) {
    return (
      <PageShell title="Cluster Not Found">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cluster not found</h3>
              <p className="text-sm text-gray-600 mb-6">The requested cluster could not be found.</p>
              <Button asChild>
                <a href="/kubernetes">Back to Clusters</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  const nextVersion = getNextK8sVersion(cluster.k8sVersion)
  const isUpgradeAvailable = nextVersion !== null
  const isDeprecated = isK8sVersionDeprecated(cluster.k8sVersion)

  const handleUpgradeCluster = () => {
    // In a real implementation, this would trigger the upgrade process
    console.log('Upgrading cluster to version:', nextVersion)
    setIsUpgradeModalOpen(false)
    // Show success message
  }

  const handleDeleteCluster = async () => {
    if (deleteConfirmation !== cluster.name) return

    setIsDeleteLoading(true)
    try {
      // In a real implementation, this would delete the cluster
      console.log('Deleting cluster:', cluster.id)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      router.push('/kubernetes')
    } catch (error) {
      console.error('Failed to delete cluster:', error)
    } finally {
      setIsDeleteLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  const handleDownloadKubeconfig = () => {
    // In a real implementation, this would generate and download the kubeconfig file
    console.log('Downloading kubeconfig for cluster:', cluster.id)
    setIsKubeconfigModalOpen(false)
    // Show success message
  }

  const headerActions = (
    <div className="flex items-center gap-2">
      {isUpgradeAvailable && (
        <Button 
          onClick={() => setIsUpgradeModalOpen(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Upgrade Cluster
        </Button>
      )}
      <Button 
        variant="outline"
        onClick={() => setIsKubeconfigModalOpen(true)}
      >
        <Download className="h-4 w-4 mr-2" />
        Download Kubeconfig
      </Button>
      <Button 
        variant="destructive"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Cluster
      </Button>
    </div>
  )

  return (
    <PageShell
      title={cluster.name}
      description={`Kubernetes cluster in ${getRegionDisplayName(cluster.region)}`}
      headerActions={headerActions}
      customBreadcrumbs={[
        { title: 'Kubernetes', href: '/kubernetes' },
        { title: 'Clusters', href: '/kubernetes' },
        { title: cluster.name, href: `/kubernetes/clusters/${cluster.id}` }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cluster Overview */}
          <ClusterOverview cluster={cluster} />

          {/* Node Pools Section */}
          <NodePoolsSection 
            cluster={cluster} 
            onUpdate={setCluster}
          />

          {/* Add-ons Section */}
          <AddOnsSection 
            cluster={cluster} 
            onUpdate={setCluster}
          />
        </div>

        {/* Right Sidebar - Only Cost Estimation */}
        <div className="space-y-6">
          <CostEstimation cluster={cluster} />
        </div>
      </div>

      {/* Download Kubeconfig Modal */}
      <Dialog open={isKubeconfigModalOpen} onOpenChange={setIsKubeconfigModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Download Kubeconfig
            </DialogTitle>
            <DialogDescription>
              Download the kubeconfig file to connect to your cluster using kubectl or other Kubernetes tools.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> This kubeconfig file uses token-based authentication. 
                The authentication token will expire in <strong>15 minutes</strong> for security reasons.
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What you'll get:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Cluster API endpoint configuration</li>
                <li>• Authentication token (valid for 15 minutes)</li>
                <li>• Cluster CA certificate</li>
                <li>• Context configuration for kubectl</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Usage Instructions:</h4>
              <ol className="text-sm space-y-1 text-blue-800">
                <li>1. Download the kubeconfig file</li>
                <li>2. Set KUBECONFIG environment variable or use --kubeconfig flag</li>
                <li>3. Run kubectl commands within 15 minutes</li>
                <li>4. Re-download if token expires</li>
              </ol>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsKubeconfigModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDownloadKubeconfig}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Kubeconfig
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Cluster Modal */}
      <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade Kubernetes Version</DialogTitle>
            <DialogDescription>
              Upgrade your cluster from version {cluster.k8sVersion} to {nextVersion}. 
              This process will be performed with zero downtime.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Supported upgrade path:</strong> {cluster.k8sVersion} → {nextVersion}
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What happens during upgrade:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Control plane components will be upgraded</li>
                <li>• Node pools will be upgraded one at a time</li>
                <li>• Applications will continue running without interruption</li>
                <li>• Estimated time: 15-30 minutes</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpgradeModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpgradeCluster}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Start Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Cluster Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Cluster</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All data, applications, and persistent volumes 
              associated with this cluster will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          {cluster.nodePools.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Cannot delete cluster:</strong> This cluster has {cluster.nodePools.length} node pool(s) 
                with {cluster.nodeCount} total nodes. You must delete all node pools before deleting the cluster.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Cluster Details:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{cluster.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Region:</span>
                <span className="font-medium">{getRegionDisplayName(cluster.region)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Node Pools:</span>
                <span className="font-medium">{cluster.nodePools.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Nodes:</span>
                <span className="font-medium">{cluster.nodeCount}</span>
              </div>
            </div>
          </div>

          {cluster.nodePools.length === 0 ? (
            <div className="space-y-2">
              <Label htmlFor="delete-confirmation">
                Type <strong>{cluster.name}</strong> to confirm deletion:
              </Label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={cluster.name}
              />
            </div>
          ) : (
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-800">
                Delete all node pools first to proceed with cluster deletion.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteCluster}
              disabled={cluster.nodePools.length > 0 || deleteConfirmation !== cluster.name || isDeleteLoading}
            >
              {isDeleteLoading ? 'Deleting...' : 'Delete Cluster'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
