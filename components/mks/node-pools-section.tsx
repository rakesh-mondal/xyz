"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Edit, 
  Save, 
  X, 
  Server, 
  AlertTriangle, 
  Crown,
  HardDrive,
  Cpu,
  MemoryStick,
  Trash2,
  Plus
} from "lucide-react"
import { type MKSCluster, type MKSNodePool, availableNodeFlavors } from "@/lib/mks-data"

interface NodePoolsSectionProps {
  cluster: MKSCluster
  onUpdate: (updatedCluster: MKSCluster) => void
}

export function NodePoolsSection({ cluster, onUpdate }: NodePoolsSectionProps) {
  // Node Pools editing state
  const [isNodePoolsEditing, setIsNodePoolsEditing] = useState(false)
  const [nodePoolsChanges, setNodePoolsChanges] = useState<Record<string, { name: string; desiredCount: number; minCount: number; maxCount: number }>>({})
  const [hasNodePoolsChanges, setHasNodePoolsChanges] = useState(false)
  
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

  const getFlavorDetails = (flavorId: string) => {
    return availableNodeFlavors.find(f => f.id === flavorId)
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

    onUpdate(updatedCluster)
    setHasNodePoolsChanges(false)
    setIsNodePoolsEditing(false)
  }

  // Cancel node pools changes
  const cancelNodePoolsChanges = () => {
    setNodePoolsChanges({})
    setHasNodePoolsChanges(false)
    setIsNodePoolsEditing(false)
    setShowAddPoolForm(false)
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

    onUpdate(updatedCluster)
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

  const openDeletePool = (pool: MKSNodePool) => {
    setPoolToDelete(pool)
    setIsDeletePoolOpen(true)
  }

  const handleDeletePool = () => {
    if (!poolToDelete) return

    const updatedPools = cluster.nodePools.filter(pool => pool.id !== poolToDelete.id)
    const updatedCluster = {
      ...cluster,
      nodePools: updatedPools,
      nodeCount: updatedPools.reduce((total, pool) => total + pool.desiredCount, 0)
    }

    onUpdate(updatedCluster)
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

  return (
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
            <p className="text-sm">Node pools will appear here once configured.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cluster.nodePools.map((pool) => {
              const flavorDetails = getFlavorDetails(pool.flavor)
              const isDefault = pool.name === 'prod-workers' || pool.name === 'staging-workers' || pool.name === 'dev-workers'
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
                        {isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        <Badge variant={pool.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {pool.status}
                        </Badge>
                      </div>
                      {isNodePoolsEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeletePool(pool)}
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
                {!showAddPoolForm ? (
                  <Button 
                    onClick={() => setShowAddPoolForm(true)}
                    variant="outline"
                    className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Node Pool
                  </Button>
                ) : (
                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Add New Node Pool</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-pool-name">Pool Name</Label>
                          <Input
                            id="new-pool-name"
                            value={newPool.name}
                            onChange={(e) => setNewPool(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter pool name"
                            className={newPool.name.trim() === '' ? 'border-destructive focus:border-destructive' : ''}
                          />
                          {newPool.name.trim() === '' && (
                            <p className="text-xs text-red-500">Name is required</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-pool-flavor">Instance Type</Label>
                          <Select value={newPool.flavor} onValueChange={(value) => setNewPool(prev => ({ ...prev, flavor: value }))}>
                            <SelectTrigger className={newPool.flavor === '' ? 'border-destructive focus:border-destructive' : ''}>
                              <SelectValue placeholder="Select instance type" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableNodeFlavors.map((flavor) => (
                                <SelectItem key={flavor.id} value={flavor.id}>
                                  {flavor.name} ({flavor.vcpus} vCPU, {flavor.memory}GB)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {newPool.flavor === '' && (
                            <p className="text-xs text-red-500">Instance type is required</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-pool-min">Min Nodes</Label>
                          <Input
                            id="new-pool-min"
                            type="number"
                            min="1"
                            value={newPool.minCount}
                            onChange={(e) => setNewPool(prev => ({ ...prev, minCount: parseInt(e.target.value) || 1 }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-pool-desired">Desired Nodes</Label>
                          <Input
                            id="new-pool-desired"
                            type="number"
                            min="1"
                            value={newPool.desiredCount}
                            onChange={(e) => setNewPool(prev => ({ ...prev, desiredCount: parseInt(e.target.value) || 1 }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-pool-max">Max Nodes</Label>
                          <Input
                            id="new-pool-max"
                            type="number"
                            min="1"
                            value={newPool.maxCount}
                            onChange={(e) => setNewPool(prev => ({ ...prev, maxCount: parseInt(e.target.value) || 3 }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-pool-disk">Disk Size (GB)</Label>
                        <Input
                          id="new-pool-disk"
                          type="number"
                          min="20"
                          value={newPool.diskSize}
                          onChange={(e) => setNewPool(prev => ({ ...prev, diskSize: parseInt(e.target.value) || 100 }))}
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
          </div>
        )}

        {/* Edit Mode Info */}
        {isNodePoolsEditing && (
          <Alert className="mt-4 border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Edit Mode:</strong> You can modify node counts and names for each pool, add new pools, or delete existing ones. 
              Changes will be applied when you save. The default pool cannot be deleted but can be resized.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

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
    </Card>
  )
}
