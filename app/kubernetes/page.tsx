"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/ui/empty-state"
import { ClusterDeleteModal } from "@/components/mks/cluster-delete-modal"
import { mockMKSClusters, type MKSCluster } from "@/lib/mks-data"
import { MoreHorizontal, Plus, ExternalLink, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function MKSDashboardPage() {
  const router = useRouter()
  const [clusters, setClusters] = useState<MKSCluster[]>(mockMKSClusters)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [clusterToDelete, setClusterToDelete] = useState<MKSCluster | null>(null)

  const getStatusIcon = (status: MKSCluster['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'creating':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'updating':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'deleting':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: MKSCluster['status']) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'creating':
        return 'secondary'
      case 'updating':
        return 'secondary'
      case 'deleting':
        return 'destructive'
      case 'error':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatAge = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  const handleCreateCluster = () => {
    // Navigate to cluster creation flow
    router.push('/kubernetes/clusters/create')
  }

  const handleEditCluster = (cluster: MKSCluster) => {
    // This would navigate to edit cluster page
    console.log('Edit cluster:', cluster.name)
  }

  const handleDeleteCluster = (cluster: MKSCluster) => {
    setClusterToDelete(cluster)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async (clusterId: string) => {
    // In a real implementation, this would call the API to delete the cluster
    console.log('Deleting cluster:', clusterId)
    setClusters(prev => prev.filter(c => c.id !== clusterId))
  }

  const headerActions = clusters.length > 0 ? (
    <Button onClick={handleCreateCluster} className="bg-black text-white hover:bg-black/90">
      <Plus className="h-4 w-4" />
      Create Cluster
    </Button>
  ) : undefined

  return (
    <PageShell
      title="Managed Kubernetes Service"
      description="Deploy, manage, and scale Kubernetes clusters with enterprise-grade reliability"
      headerActions={headerActions}
    >
      {clusters.length === 0 ? (
        <EmptyState
          title="No Kubernetes clusters yet"
          description="Get started by creating your first Kubernetes cluster. Deploy applications with ease and scale as needed."
          actionText="Create Cluster"
          onAction={handleCreateCluster}
          icon={
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Kubernetes Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cluster Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>K8s Version</TableHead>
                  <TableHead>Node Count</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clusters.map((cluster) => (
                  <TableRow key={cluster.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Link 
                        href={`/kubernetes/clusters/${cluster.id}`}
                        className="font-medium text-primary hover:underline flex items-center gap-2"
                      >
                        {cluster.name}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {cluster.region}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(cluster.status)}
                        <Badge variant={getStatusBadgeVariant(cluster.status)}>
                          {cluster.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {cluster.k8sVersion}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{cluster.nodeCount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {formatAge(cluster.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {cluster.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {cluster.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{cluster.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCluster(cluster)}>
                            Edit Cluster
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCluster(cluster)}
                            className="text-red-600 focus:text-red-600"
                          >
                            Delete Cluster
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <ClusterDeleteModal
        cluster={clusterToDelete}
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setClusterToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </PageShell>
  )
}
