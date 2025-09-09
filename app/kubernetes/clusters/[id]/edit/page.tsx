"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getClusterById, type MKSCluster, type MKSAddOn, type MKSNodePool, availableNodeFlavors, isK8sVersionDeprecated, getNextK8sVersion, getRegionDisplayName } from "@/lib/mks-data"
import { ArrowLeft, Save, X, Edit, Plus, Trash2, AlertTriangle, Server, ArrowUpRight, Info } from "lucide-react"
import Link from "next/link"

export default function EditClusterPage() {
  const params = useParams()
  const router = useRouter()
  const clusterId = params.id as string
  const [cluster, setCluster] = useState<MKSCluster | undefined>(getClusterById(clusterId))
  
  // Node Pools editing state
  const [isNodePoolsEditing, setIsNodePoolsEditing] = useState(false)
  const [nodePoolsChanges, setNodePoolsChanges] = useState<Record<string, { name: string; desiredCount: number; minCount: number; maxCount: number }>>({})
  const [hasNodePoolsChanges, setHasNodePoolsChanges] = useState(false)
  
  // Add-ons editing state
  const [isAddOnsEditing, setIsAddOnsEditing] = useState(false)
  const [addOnsChanges, setAddOnsChanges] = useState<Record<string, boolean>>({})
  const [hasAddOnsChanges, setHasAddOnsChanges] = useState(false)
  
  // Node Pool management state
  const [isDeletePoolOpen, setIsDeletePoolOpen] = useState(false)
  const [poolToDelete, setPoolToDelete] = useState<MKSNodePool | null>(null)
  const [showAddPoolForm, setShowAddPoolForm] = useState(false)
  const [newPool, setNewPool] = useState({
    name: '',
    flavor: '',
    desiredCount: 1,
    minCount: 1,
    maxCount: 3,
    diskSize: 100,
    labels: {} as Record<string, string>
  })

  // Add-ons confirmation modal state
  const [isAddOnsConfirmOpen, setIsAddOnsConfirmOpen] = useState(false)
  const [pendingAddOnsChanges, setPendingAddOnsChanges] = useState<Record<string, boolean>>({})

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

  // Initialize node pools changes when editing starts
  const startNodePoolsEditing = () => {
    const initialChanges: Record<string, { name: string; desiredCount: number; minCount: number; maxCount: number }> = {}
    cluster.nodePools.forEach(pool => {
      initialChanges[pool.id] = {
        name: pool.name,
        desiredCount: pool.desiredCount,
        minCount: pool.minCount,
        maxCount: pool.maxCount
      }
    })
    setNodePoolsChanges(initialChanges)
    setIsNodePoolsEditing(true)
  }

  // Handle node pool changes
  const handleNodePoolChange = (poolId: string, field: 'name' | 'desiredCount' | 'minCount' | 'maxCount', value: string | number) => {
    setNodePoolsChanges(prev => ({
      ...prev,
      [poolId]: {
        ...prev[poolId],
        [field]: value
      }
    }))
    setHasNodePoolsChanges(true)
  }

  // Save node pools changes
  const saveNodePoolsChanges = () => {
    const updatedPools = cluster.nodePools.map(pool => {
      const changes = nodePoolsChanges[pool.id]
      if (changes) {
        return {
          ...pool,
          name: changes.name,
          desiredCount: changes.desiredCount,
          minCount: changes.minCount,
          maxCount: changes.maxCount
        }
      }
      return pool
    })

    const updatedCluster = {
      ...cluster,
      nodePools: updatedPools,
      nodeCount: updatedPools.reduce((total, pool) => total + pool.desiredCount, 0)
    }

    setCluster(updatedCluster)
    setHasNodePoolsChanges(false)
    setIsNodePoolsEditing(false)
  }

  // Cancel node pools changes
  const cancelNodePoolsChanges = () => {
    setNodePoolsChanges({})
    setHasNodePoolsChanges(false)
    setIsNodePoolsEditing(false)
  }

  // Start add-ons editing
  const startAddOnsEditing = () => {
    const initialChanges: Record<string, boolean> = {}
    cluster.addOns.forEach(addon => {
      initialChanges[addon.id] = addon.isEnabled
    })
    setAddOnsChanges(initialChanges)
    setIsAddOnsEditing(true)
  }



  // Save add-ons changes
  const saveAddOnsChanges = () => {
    // Show confirmation modal for add-ons changes
    const removedAddOns = cluster.addOns.filter(addon => 
      addon.isEnabled && !addOnsChanges[addon.id]
    )
    const addedDefaultAddOns = cluster.addOns.filter(addon => 
      !addon.isEnabled && addOnsChanges[addon.id] && addon.isDefault
    )

    if (removedAddOns.length > 0 || addedDefaultAddOns.length > 0) {
      setPendingAddOnsChanges(addOnsChanges)
      setIsAddOnsConfirmOpen(true)
    } else {
      // No conflicts, save directly
      applyAddOnsChanges(addOnsChanges)
    }
  }

  // Apply add-ons changes after confirmation
  const applyAddOnsChanges = (changes: Record<string, boolean>) => {
    const updatedAddOns = cluster.addOns.map(addon => ({
      ...addon,
      isEnabled: changes[addon.id] ?? addon.isEnabled
    }))

    const updatedCluster = {
      ...cluster,
      addOns: updatedAddOns
    }

    setCluster(updatedCluster)
    setHasAddOnsChanges(false)
    setIsAddOnsEditing(false)
    setIsAddOnsConfirmOpen(false)
  }

  // Cancel add-ons changes
  const cancelAddOnsChanges = () => {
    setAddOnsChanges({})
    setHasAddOnsChanges(false)
    setIsAddOnsEditing(false)
  }

  // Handle add-on toggle
  const handleAddOnToggle = (addonId: string, enabled: boolean) => {
    setAddOnsChanges(prev => ({
      ...prev,
      [addonId]: enabled
    }))
    setHasAddOnsChanges(true)
  }

  // Add new node pool
  const handleAddPool = () => {
    if (!newPool.name || !newPool.flavor) return

    const pool: MKSNodePool = {
      id: `np-${Date.now()}`,
      name: newPool.name,
      flavor: newPool.flavor,
      desiredCount: newPool.desiredCount,
      minCount: newPool.minCount,
      maxCount: newPool.maxCount,
      diskSize: newPool.diskSize,
      taints: [],
      labels: newPool.labels,
      status: 'creating',
      createdAt: new Date().toISOString()
    }

    const updatedCluster = {
      ...cluster,
      nodePools: [...cluster.nodePools, pool],
      nodeCount: cluster.nodeCount + pool.desiredCount
    }

    setCluster(updatedCluster)
    setShowAddPoolForm(false)
    setNewPool({
      name: '',
      flavor: '',
      desiredCount: 1,
      minCount: 1,
      maxCount: 3,
      diskSize: 100,
      labels: {}
    })
  }

  // Delete node pool
  const handleDeletePool = () => {
    if (!poolToDelete) return

    const updatedPools = cluster.nodePools.filter(pool => pool.id !== poolToDelete.id)
    const updatedCluster = {
      ...cluster,
      nodePools: updatedPools,
      nodeCount: updatedPools.reduce((total, pool) => total + pool.desiredCount, 0)
    }

    setCluster(updatedCluster)
    setIsDeletePoolOpen(false)
    setPoolToDelete(null)
  }

  const validateNodeCounts = (min: number, desired: number, max: number) => {
    return min > 0 && min <= desired && desired <= max
  }

  const validateNodePoolChanges = (changes: Record<string, { name: string; desiredCount: number; minCount: number; maxCount: number }>) => {
    return Object.values(changes).every(change => 
      change.name.trim() !== '' && 
      validateNodeCounts(change.minCount, change.desiredCount, change.maxCount)
    )
  }



  const getFlavorDetails = (flavorId: string) => {
    return availableNodeFlavors.find(f => f.id === flavorId)
  }

  const isDeprecated = isK8sVersionDeprecated(cluster.k8sVersion)
  const nextVersion = getNextK8sVersion(cluster.k8sVersion)

  return (
    <PageShell
      title={`Edit Cluster: ${cluster.name}`}
      description="Modify node pools and cluster configuration"
      customBreadcrumbs={[
        { title: 'Kubernetes', href: '/kubernetes' },
        { title: 'Clusters', href: '/kubernetes/clusters' },
        { title: cluster.name, href: `/kubernetes/clusters/${cluster.id}` },
        { title: 'Edit', href: `/kubernetes/clusters/${cluster.id}/edit` }
      ]}
    >
      <div className="space-y-6">
        {/* Enhanced Cluster Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Cluster Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2">
                  Cluster Name
                </Label>
                <div className="text-lg font-semibold">{cluster.name}</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2">
                  Region
                </Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {cluster.region}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {getRegionDisplayName(cluster.region)}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2">
                  Status
                </Label>
                <Badge variant={cluster.status === 'active' ? 'default' : 'secondary'}>
                  {cluster.status}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2">
                  Kubernetes Version
                </Label>
                <div className="flex items-center gap-2">
                  <Badge variant={isDeprecated ? 'destructive' : 'secondary'} className="font-mono">
                    {cluster.k8sVersion}
                  </Badge>
                  {isDeprecated && nextVersion && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7"
                      onClick={() => router.push(`/kubernetes/clusters/${cluster.id}/upgrade`)}
                    >
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Upgrade to {nextVersion}
                    </Button>
                  )}
                </div>
                {isDeprecated && (
                  <Alert className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This Kubernetes version is no longer supported and will not receive security updates. 
                      Please upgrade to {nextVersion} or later immediately.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2">
                  Total Nodes
                </Label>
                <div className="text-lg font-semibold">{cluster.nodeCount}</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2">
                  Created
                </Label>
                <div className="text-sm">{new Date(cluster.createdAt).toLocaleDateString()}</div>
              </div>
              
              <div className="md:col-span-2 lg:col-span-3">
                <Label className="text-sm font-medium text-muted-foreground mb-2">
                  VPC & Networking
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">VPC ID:</span>
                    <div className="font-mono text-sm">{cluster.vpcId}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Subnets:</span>
                    <div className="font-mono text-sm">{cluster.subnetIds.join(', ')}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Security Groups:</span>
                    <div className="font-mono text-sm">{cluster.securityGroupIds.join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Node Pools Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Node Pools
              </CardTitle>
              <div className="flex items-center gap-2">
                {isNodePoolsEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={cancelNodePoolsChanges}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={saveNodePoolsChanges}
                      disabled={!hasNodePoolsChanges || !validateNodePoolChanges(nodePoolsChanges)}
                      className="bg-black text-white hover:bg-black/90"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={startNodePoolsEditing} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Node Pools
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {cluster.nodePools.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No node pools configured yet.</p>
                <p className="text-sm">Add your first node pool to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cluster.nodePools.map((pool) => {
                  const flavorDetails = getFlavorDetails(pool.flavor)
                  const isEditing = isNodePoolsEditing && nodePoolsChanges[pool.id]
                  
                  return (
                    <Card key={pool.id} className="border-2 hover:border-gray-300 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <div className="space-y-1">
                                <Label htmlFor={`name-${pool.id}`} className="text-xs text-muted-foreground">Node Pool Name</Label>
                                <Input
                                  id={`name-${pool.id}`}
                                  value={nodePoolsChanges[pool.id]?.name || pool.name}
                                  onChange={(e) => handleNodePoolChange(pool.id, 'name', e.target.value)}
                                  className={`h-8 text-sm w-48 ${(nodePoolsChanges[pool.id]?.name || pool.name).trim() === '' ? 'border-destructive focus:border-destructive' : ''}`}
                                  placeholder="Enter pool name"
                                />
                                {(nodePoolsChanges[pool.id]?.name || pool.name).trim() === '' && (
                                  <p className="text-xs text-red-500">Name is required</p>
                                )}
                              </div>
                            ) : (
                              <h4 className="font-semibold">{pool.name}</h4>
                            )}
                            <Badge variant={pool.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {pool.status}
                            </Badge>
                          </div>
                          {isNodePoolsEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPoolToDelete(pool)
                                setIsDeletePoolOpen(true)
                              }}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Instance Type */}
                        <div>
                          <Label className="text-xs text-muted-foreground">Instance Type</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {pool.flavor}
                            </Badge>
                            {flavorDetails && (
                              <span className="text-xs text-muted-foreground">
                                {flavorDetails.vcpus} vCPUs, {flavorDetails.memory}GB RAM
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Node Counts */}
                        <div>
                          <Label className="text-xs text-muted-foreground">Node Counts</Label>
                          {isEditing ? (
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              <div>
                                <Label htmlFor={`min-${pool.id}`} className="text-xs">Min</Label>
                                <Input
                                  id={`min-${pool.id}`}
                                  type="number"
                                  min="1"
                                  value={nodePoolsChanges[pool.id]?.minCount || pool.minCount}
                                  onChange={(e) => handleNodePoolChange(pool.id, 'minCount', parseInt(e.target.value) || 1)}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`desired-${pool.id}`} className="text-xs">Desired</Label>
                                <Input
                                  id={`desired-${pool.id}`}
                                  type="number"
                                  min="1"
                                  value={nodePoolsChanges[pool.id]?.desiredCount || pool.desiredCount}
                                  onChange={(e) => handleNodePoolChange(pool.id, 'desiredCount', parseInt(e.target.value) || 1)}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`max-${pool.id}`} className="text-xs">Max</Label>
                                <Input
                                  id={`max-${pool.id}`}
                                  type="number"
                                  min="1"
                                  value={nodePoolsChanges[pool.id]?.maxCount || pool.maxCount}
                                  onChange={(e) => handleNodePoolChange(pool.id, 'maxCount', parseInt(e.target.value) || 3)}
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="mt-1 grid grid-cols-3 gap-3">
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground mb-1">Min</div>
                                <div className="font-semibold text-lg">{pool.minCount}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground mb-1">Desired</div>
                                <div className="font-semibold text-lg text-blue-600">{pool.desiredCount}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground mb-1">Max</div>
                                <div className="font-semibold text-lg">{pool.maxCount}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Disk Size */}
                        <div>
                          <Label className="text-xs text-muted-foreground">Disk Size</Label>
                          <div className="mt-1">{pool.diskSize} GB</div>
                        </div>

                        {/* Labels */}
                        {Object.keys(pool.labels).length > 0 && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Labels</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(pool.labels).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {key}={value}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Taints */}
                        {pool.taints.length > 0 && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Taints</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {pool.taints.map((taint, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {taint}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Created Date */}
                        <div>
                          <Label className="text-xs text-muted-foreground">Created</Label>
                          <div className="text-xs mt-1">
                            {new Date(pool.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                
                {/* Add Node Pool Button - Only shown in edit mode and below the last card */}
                {isNodePoolsEditing && (
                  <div className="pt-2">
                    <Button 
                      onClick={() => setShowAddPoolForm(!showAddPoolForm)} 
                      size="sm" 
                      className="bg-black text-white hover:bg-black/90 w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {showAddPoolForm ? 'Cancel Add Node Pool' : 'Add Node Pool'}
                    </Button>
                  </div>
                )}

                {/* Inline Add Node Pool Form */}
                {showAddPoolForm && isNodePoolsEditing && (
                  <Card className="border-2 border-dashed border-blue-300 bg-blue-50/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-700">Add New Node Pool</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-pool-name" className="text-sm font-medium">Node Pool Name</Label>
                          <Input
                            id="new-pool-name"
                            value={newPool.name}
                            onChange={(e) => setNewPool({ ...newPool, name: e.target.value })}
                            placeholder="e.g., workers, database"
                            className="h-9"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-pool-flavor" className="text-sm font-medium">Instance Type</Label>
                          <Select value={newPool.flavor} onValueChange={(value) => setNewPool({ ...newPool, flavor: value })}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select instance type" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableNodeFlavors.map((flavor) => (
                                <SelectItem key={flavor.id} value={flavor.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{flavor.name}</span>
                                    <span className="text-muted-foreground text-xs">
                                      {flavor.vcpus}vCPU, {flavor.memory}GB
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-pool-min-count" className="text-sm font-medium">Min Nodes</Label>
                          <Input
                            id="new-pool-min-count"
                            type="number"
                            min="1"
                            value={newPool.minCount}
                            onChange={(e) => setNewPool({ ...newPool, minCount: parseInt(e.target.value) || 1 })}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-pool-desired-count" className="text-sm font-medium">Desired Nodes</Label>
                          <Input
                            id="new-pool-desired-count"
                            type="number"
                            min="1"
                            value={newPool.desiredCount}
                            onChange={(e) => setNewPool({ ...newPool, desiredCount: parseInt(e.target.value) || 1 })}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-pool-max-count" className="text-sm font-medium">Max Nodes</Label>
                          <Input
                            id="new-pool-max-count"
                            type="number"
                            min="1"
                            value={newPool.maxCount}
                            onChange={(e) => setNewPool({ ...newPool, maxCount: parseInt(e.target.value) || 3 })}
                            className="h-9"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-pool-disk-size" className="text-sm font-medium">Disk Size (GB)</Label>
                        <Input
                          id="new-pool-disk-size"
                          type="number"
                          min="20"
                          value={newPool.diskSize}
                          onChange={(e) => setNewPool({ ...newPool, diskSize: parseInt(e.target.value) || 100 })}
                          className="h-9"
                        />
                      </div>
                      
                      {!validateNodeCounts(newPool.minCount, newPool.desiredCount, newPool.maxCount) && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Node counts must follow: 0 {'<'} min ≤ desired ≤ max
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="flex items-center gap-3 pt-2">
                        <Button 
                          onClick={handleAddPool}
                          disabled={!newPool.name || !newPool.flavor || !validateNodeCounts(newPool.minCount, newPool.desiredCount, newPool.maxCount)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Node Pool
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowAddPoolForm(false)
                            setNewPool({
                              name: '',
                              flavor: '',
                              desiredCount: 1,
                              minCount: 1,
                              maxCount: 3,
                              diskSize: 100,
                              labels: {}
                            })
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add-ons Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add-ons Configuration</CardTitle>
              <div className="flex items-center gap-2">
                {isAddOnsEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={cancelAddOnsChanges}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={saveAddOnsChanges}
                      disabled={!hasAddOnsChanges}
                      className="bg-black text-white hover:bg-black/90"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={startAddOnsEditing} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Add-ons
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Enable or disable add-ons for your cluster. Some add-ons are required for basic functionality.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cluster.addOns.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{addon.displayName}</h4>
                      <Badge variant="outline" className="text-xs">
                        {addon.category}
                      </Badge>
                      {addon.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{addon.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Version: {addon.version}</span>
                      <span>Status: {addon.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id={`addon-${addon.id}`}
                      checked={isAddOnsEditing ? (addOnsChanges[addon.id] ?? addon.isEnabled) : addon.isEnabled}
                      onCheckedChange={(checked) => {
                        if (isAddOnsEditing) {
                          handleAddOnToggle(addon.id, checked)
                        }
                      }}
                      disabled={!isAddOnsEditing || !addon.isEditable}
                    />
                    <Label htmlFor={`addon-${addon.id}`} className="text-sm">
                      {isAddOnsEditing ? (addOnsChanges[addon.id] ?? addon.isEnabled) ? 'Enabled' : 'Disabled' : addon.isEnabled ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>





        {/* Delete Node Pool Dialog */}
        <Dialog open={isDeletePoolOpen} onOpenChange={setIsDeletePoolOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Node Pool</DialogTitle>
              <DialogDescription>
                This will permanently delete the node pool "{poolToDelete?.name}". All nodes in this pool will be terminated.
              </DialogDescription>
            </DialogHeader>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> Deleting this node pool will terminate all nodes and may cause service disruption 
                if workloads are running on them. Make sure to drain the nodes first.
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Node Pool Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{poolToDelete?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Nodes:</span>
                  <span className="font-medium">{poolToDelete?.desiredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instance Type:</span>
                  <span className="font-medium">{poolToDelete?.flavor}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeletePoolOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeletePool}
              >
                Delete Node Pool
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add-ons Confirmation Modal */}
        <Dialog open={isAddOnsConfirmOpen} onOpenChange={setIsAddOnsConfirmOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Confirm Add-ons Changes</DialogTitle>
              <DialogDescription>
                Please review the following changes and confirm to proceed.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {(() => {
                const removedAddOns = cluster.addOns.filter(addon => 
                  addon.isEnabled && !pendingAddOnsChanges[addon.id]
                )
                const addedDefaultAddOns = cluster.addOns.filter(addon => 
                  !addon.isEnabled && pendingAddOnsChanges[addon.id] && addon.isDefault
                )

                return (
                  <>
                    {removedAddOns.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Removed Add-ons ({removedAddOns.length}):</strong>
                          <ul className="mt-2 space-y-1">
                            {removedAddOns.map(addon => (
                              <li key={addon.id} className="text-sm">
                                • {addon.displayName} - {addon.description}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-sm">
                            You will need to manually add analogous add-ons if you need similar functionality.
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {addedDefaultAddOns.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Added Default Add-ons ({addedDefaultAddOns.length}):</strong>
                          <ul className="mt-2 space-y-1">
                            {addedDefaultAddOns.map(addon => (
                              <li key={addon.id} className="text-sm">
                                • {addon.displayName} - {addon.description}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-sm">
                            You may need to remove any conflicting add-ons you have manually declared in your cluster to avoid conflicts.
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )
              })()}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOnsConfirmOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => applyAddOnsChanges(pendingAddOnsChanges)}
                className="bg-black text-white hover:bg-black/90"
              >
                Confirm Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageShell>
  )
}

