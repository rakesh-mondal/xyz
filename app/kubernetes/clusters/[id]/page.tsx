"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { DetailGrid } from "@/components/detail-grid"
import { StatusBadge } from "@/components/status-badge"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
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
  Key,
  Edit
} from "lucide-react"
import { getClusterById, type MKSCluster, isK8sVersionDeprecated, getNextK8sVersion, getRegionDisplayName } from "@/lib/mks-data"
import { NodePoolsSection } from "@/components/mks/node-pools-section"
import { AddOnsSection } from "@/components/mks/add-ons-section"
import { ClusterUpgradeModal } from "@/components/mks/cluster-upgrade-modal"


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
      <PageLayout title="Cluster Not Found">
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
      </PageLayout>
    )
  }

  const nextVersion = getNextK8sVersion(cluster.k8sVersion)
  const isUpgradeAvailable = nextVersion !== null
  const isDeprecated = isK8sVersionDeprecated(cluster.k8sVersion)

  const handleEdit = () => {
    router.push(`/kubernetes/clusters/${cluster.id}/edit`)
  }

  const handleDelete = () => {
    // In a real app, this would delete the cluster
    console.log("Deleting cluster:", cluster.name)
    router.push("/kubernetes")
  }

  const handleConfirmUpgrade = async (clusterId: string, newVersion: string) => {
    // In a real implementation, this would call the API to upgrade the cluster
    console.log('Upgrading cluster:', clusterId, 'to version:', newVersion)
    
    // Update the cluster state to show it's updating
    setCluster(prev => prev ? { ...prev, k8sVersion: newVersion, status: 'updating' as const } : prev)
    setIsUpgradeModalOpen(false)
    // Show success message
  }

  const handleDownloadKubeconfig = () => {
    // In a real implementation, this would generate and download the kubeconfig file
    console.log('Downloading kubeconfig for cluster:', cluster.id)
    setIsKubeconfigModalOpen(false)
    // Show success message
  }

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  const customBreadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/kubernetes", title: "Kubernetes" },
    { href: "/kubernetes", title: "Clusters" },
    { href: `/kubernetes/clusters/${cluster.id}`, title: cluster.name }
  ]

  const headerActions = (
    <Button 
      variant="outline"
      onClick={() => setIsKubeconfigModalOpen(true)}
      size="sm"
    >
      <Download className="h-4 w-4 mr-2" />
      Download Kubeconfig
    </Button>
  )

  return (
    <PageLayout 
      title={cluster.name} 
      customBreadcrumbs={customBreadcrumbs} 
      headerActions={headerActions}
      hideViewDocs={true}
    >
      {/* Cluster Basic Information */}
      <div className="mb-6 group relative" style={{
        borderRadius: '16px',
        border: '4px solid #FFF',
        background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
        boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
        padding: '1.5rem'
      }}>
        {/* Overlay Edit/Delete Buttons */}
        {cluster.status !== "deleting" && (
          <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <DetailGrid>
          {/* Cluster ID, Region, Status, Created On in first row */}
          <div className="col-span-full grid grid-cols-4 gap-4 mt-2">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Cluster ID</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{cluster.id}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Region</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{getRegionDisplayName(cluster.region)}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Status</label>
              <div>
                <StatusBadge status={cluster.status} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Created On</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{formatDate(cluster.createdAt)}</div>
            </div>
          </div>

          {/* Total Nodes, VPC, Subnets, Node Pools in second row */}
          <div className="col-span-full grid grid-cols-4 gap-4 mt-4">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Total Nodes</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{cluster.nodeCount}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>VPC</label>
              <div className="font-medium font-mono" style={{ fontSize: '14px' }}>{cluster.vpcId}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Subnets</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{cluster.subnetIds.length}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Node Pools</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{cluster.nodePools.length}</div>
            </div>
          </div>
          
          {/* Kubernetes Version and API Endpoint on same row */}
          <div className="col-span-full grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Kubernetes Version</label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {cluster.k8sVersion}
                </Badge>
                {isDeprecated && (
                  <Badge variant="destructive" className="text-xs">
                    Deprecated
                  </Badge>
                )}
              </div>
              {isUpgradeAvailable && (
                <div className="text-sm text-gray-700 mt-2">
                  <strong>Upgrade Available:</strong> A newer Kubernetes version ({nextVersion}) is available for your cluster. 
                  Upgrading will provide security patches and new features.
                  <Button 
                    onClick={() => setIsUpgradeModalOpen(true)}
                    variant="link"
                    className="ml-1 p-0 h-auto text-blue-600 hover:text-blue-700 font-medium"
                    size="sm"
                  >
                    Upgrade Now
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>API Endpoint</label>
              <div className="bg-muted/50 p-3 rounded-lg">
                <code className="text-sm font-mono break-all">
                  {cluster.kubeApiEndpoint}
                </code>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Public Access</span>
              </div>
            </div>
          </div>
        </DetailGrid>
      </div>



      {/* Node Pools Section */}
      <div className="mb-8">
        <NodePoolsSection 
          cluster={cluster} 
        />
      </div>

      {/* Add-ons Section */}
      <div className="mb-8">
        <AddOnsSection 
          cluster={cluster} 
        />
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
      <ClusterUpgradeModal
        cluster={cluster}
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onConfirm={handleConfirmUpgrade}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={cluster.name}
        resourceType="Cluster"
        onConfirm={handleDelete}
      />
    </PageLayout>
  )
}
