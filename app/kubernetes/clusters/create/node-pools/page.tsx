"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Plus, X, Server, HardDrive, Tag, AlertTriangle, Download, Edit3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Instance flavors from the screenshot
const instanceFlavors = [
  { id: "cpu-1x-4gb", name: "CPU-1x-4GB", vcpus: 1, ram: 4, pricePerHour: 3 },
  { id: "cpu-2x-8gb", name: "CPU-2x-8GB", vcpus: 2, ram: 8, pricePerHour: 6 },
  { id: "cpu-4x-16gb", name: "CPU-4x-16GB", vcpus: 4, ram: 16, pricePerHour: 13 },
  { id: "cpu-8x-32gb", name: "CPU-8x-32GB", vcpus: 8, ram: 32, pricePerHour: 25 },
  { id: "cpu-16x-64gb", name: "CPU-16x-64GB", vcpus: 16, ram: 64, pricePerHour: 49 },
  { id: "cpu-32x-128gb", name: "CPU-32x-128GB", vcpus: 32, ram: 128, pricePerHour: 97 }
]

// Storage presets
const storagePresets = [
  { size: 20, label: "20GB" },
  { size: 100, label: "100GB" },
  { size: 500, label: "500GB" },
  { size: 1000, label: "1TB" }
]

interface NodePool {
  id: string
  name: string
  instanceFlavor: string
  storageSize: number
  desiredNodes: number
  minNodes: number
  maxNodes: number
  taints: Array<{ key: string; value: string; effect: string }>
  labels: Array<{ key: string; value: string }>
  tags: string[]
  isDefault: boolean
}

interface Taint {
  key: string
  value: string
  effect: string
}

interface Label {
  key: string
  value: string
}

export default function NodePoolCreationPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [nodePools, setNodePools] = useState<NodePool[]>([
    {
      id: "default-pool",
      name: "default-pool",
      instanceFlavor: "cpu-2x-8gb",
      storageSize: 100,
      desiredNodes: 2,
      minNodes: 1,
      maxNodes: 5,
      taints: [],
      labels: [],
      tags: [],
      isDefault: true
    }
  ])

  const [nextPoolId, setNextPoolId] = useState(2)
  const [yamlPreviewOpen, setYamlPreviewOpen] = useState(false)

  // Get selected instance flavor details
  const getSelectedFlavor = (flavorId: string) => {
    return instanceFlavors.find(f => f.id === flavorId) || instanceFlavors[1]
  }

  // Calculate costs
  const calculateCosts = useMemo(() => {
    let totalInstanceCost = 0
    let totalStorageCost = 0

    nodePools.forEach(pool => {
      const flavor = getSelectedFlavor(pool.instanceFlavor)
      const instanceCost = flavor.pricePerHour * pool.desiredNodes
      const storageCost = pool.storageSize * 0.0625 * pool.desiredNodes // ₹0.0625 per GB per hour
      
      totalInstanceCost += instanceCost
      totalStorageCost += storageCost
    })

    return {
      totalInstanceCost,
      totalStorageCost,
      totalCost: totalInstanceCost + totalStorageCost
    }
  }, [nodePools])

  // Add new node pool
  const addNodePool = () => {
    const newPool: NodePool = {
      id: `pool-${nextPoolId}`,
      name: `node-pool-${nextPoolId}`,
      instanceFlavor: "cpu-2x-8gb",
      storageSize: 100,
      desiredNodes: 1,
      minNodes: 1,
      maxNodes: 3,
      taints: [],
      labels: [],
      tags: [],
      isDefault: false
    }
    
    setNodePools([...nodePools, newPool])
    setNextPoolId(nextPoolId + 1)
  }

  // Remove node pool
  const removeNodePool = (poolId: string) => {
    if (nodePools.find(p => p.id === poolId)?.isDefault) {
      toast({
        title: "Cannot remove default pool",
        description: "The default node pool is required and cannot be deleted.",
        variant: "destructive"
      })
      return
    }
    
    setNodePools(nodePools.filter(p => p.id !== poolId))
  }

  // Update node pool
  const updateNodePool = (poolId: string, updates: Partial<NodePool>) => {
    setNodePools(nodePools.map(pool => 
      pool.id === poolId ? { ...pool, ...updates } : pool
    ))
  }

  // Add taint
  const addTaint = (poolId: string) => {
    const pool = nodePools.find(p => p.id === poolId)
    if (pool) {
      const newTaint: Taint = { key: "", value: "", effect: "NoSchedule" }
      updateNodePool(poolId, {
        taints: [...pool.taints, newTaint]
      })
    }
  }

  // Remove taint
  const removeTaint = (poolId: string, index: number) => {
    const pool = nodePools.find(p => p.id === poolId)
    if (pool) {
      updateNodePool(poolId, {
        taints: pool.taints.filter((_, i) => i !== index)
      })
    }
  }

  // Update taint
  const updateTaint = (poolId: string, index: number, field: keyof Taint, value: string) => {
    const pool = nodePools.find(p => p.id === poolId)
    if (pool) {
      const updatedTaints = pool.taints.map((taint, i) => 
        i === index ? { ...taint, [field]: value } : taint
      )
      updateNodePool(poolId, { taints: updatedTaints })
    }
  }

  // Add label
  const addLabel = (poolId: string) => {
    const pool = nodePools.find(p => p.id === poolId)
    if (pool) {
      const newLabel: Label = { key: "", value: "" }
      updateNodePool(poolId, {
        labels: [...pool.labels, newLabel]
      })
    }
  }

  // Remove label
  const removeLabel = (poolId: string, index: number) => {
    const pool = nodePools.find(p => p.id === poolId)
    if (pool) {
      updateNodePool(poolId, {
        labels: pool.labels.filter((_, i) => i !== index)
      })
    }
  }

  // Update label
  const updateLabel = (poolId: string, index: number, field: keyof Label, value: string) => {
    const pool = nodePools.find(p => p.id === poolId)
    if (pool) {
      const updatedLabels = pool.labels.map((label, i) => 
        i === index ? { ...label, [field]: value } : label
      )
      updateNodePool(poolId, { labels: updatedLabels })
    }
  }

  // Add tag
  const addTag = (poolId: string, tag: string) => {
    const pool = nodePools.find(p => p.id === poolId)
    if (pool && tag.trim() && !pool.tags.includes(tag.trim())) {
      updateNodePool(poolId, {
        tags: [...pool.tags, tag.trim()]
      })
    }
  }

  // Remove tag
  const removeTag = (poolId: string, tag: string) => {
    const pool = nodePools.find(p => p.id === poolId)
    if (pool) {
      updateNodePool(poolId, {
        tags: pool.tags.filter(t => t !== tag)
      })
    }
  }

  // Validation
  const validateForm = () => {
    for (const pool of nodePools) {
      // Check if name is provided
      if (!pool.name.trim()) {
        return false
      }
      // Check node count validation
      if (pool.minNodes < 0 || pool.maxNodes < pool.minNodes || pool.desiredNodes < pool.minNodes || pool.desiredNodes > pool.maxNodes) {
        return false
      }
    }
    return true
  }

  // Handle save and continue
  const handleSaveAndContinue = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the validation errors before continuing.",
        variant: "destructive"
      })
      return
    }

    // In a real implementation, this would save the configuration
    toast({
      title: "Configuration Saved",
      description: "Node pool configuration has been saved successfully."
    })
    
    // Navigate to next step (would be implemented in real app)
    router.push("/kubernetes/clusters/create/next-step")
  }

  // Generate YAML preview
  const generateYAML = () => {
    const yaml = `apiVersion: v1
kind: Cluster
metadata:
  name: mks-cluster
spec:
  nodePools:
${nodePools.map(pool => {
  const flavor = getSelectedFlavor(pool.instanceFlavor)
  return `  - name: ${pool.name}
    instanceType: ${flavor.name}
    vcpus: ${flavor.vcpus}
    memory: ${flavor.ram}GB
    storage: ${pool.storageSize}GB
    scaling:
      desired: ${pool.desiredNodes}
      min: ${pool.minNodes}
      max: ${pool.maxNodes}
    ${pool.labels.length > 0 ? `labels:
${pool.labels.map(label => `      ${label.key}: "${label.value}"`).join('\n')}` : ''}
    ${pool.taints.length > 0 ? `taints:
${pool.taints.map(taint => `      - key: "${taint.key}"
        value: "${taint.value}"
        effect: ${taint.effect}`).join('\n')}` : ''}
    ${pool.tags.length > 0 ? `tags:
${pool.tags.map(tag => `      - ${tag}`).join('\n')}` : ''}`
}).join('\n')}`
    
    return yaml
  }

  // Download YAML
  const downloadYAML = () => {
    const yaml = generateYAML()
    const blob = new Blob([yaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mks-cluster-spec.yaml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Node Pools</h1>
          <p className="text-muted-foreground">Configure node pools for your MKS cluster</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {nodePools.map((pool, index) => (
            <Card key={pool.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">
                        {pool.name}
                        {pool.isDefault && (
                          <Badge variant="secondary" className="ml-2">
                            Default Node Pool (required)
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {pool.isDefault ? "Primary node pool for your cluster" : "Additional node pool"}
                      </CardDescription>
                    </div>
                  </div>
                  {!pool.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNodePool(pool.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Node Pool Name */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Node Pool Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={pool.name}
                    onChange={(e) => updateNodePool(pool.id, { name: e.target.value })}
                    placeholder="Enter node pool name (e.g., workers, database, gpu-nodes)"
                    className={`w-full ${!pool.name.trim() ? 'border-destructive focus:border-destructive' : ''}`}
                  />
                  {!pool.name.trim() && (
                    <p className="text-xs text-destructive">Node pool name is required</p>
                  )}
                </div>

                {/* Instance Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Instance Flavor <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {instanceFlavors.map((flavor) => (
                      <Card
                        key={flavor.id}
                        className={`cursor-pointer transition-all ${
                          pool.instanceFlavor === flavor.id
                            ? "ring-2 ring-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => updateNodePool(pool.id, { instanceFlavor: flavor.id })}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="font-medium text-sm">{flavor.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {flavor.vcpus} vCPU • {flavor.ram} GB RAM
                          </div>
                          <div className="text-sm font-semibold text-primary mt-2">
                            ₹{flavor.pricePerHour}/hour
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Storage Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Storage Size (GB) <span className="text-destructive">*</span>
                  </Label>
                  <div className="space-y-4">
                    {/* Quick Presets + Custom Input Row */}
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mb-2 block">Quick Select</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {storagePresets.map((preset) => (
                            <Button
                              key={preset.size}
                              type="button"
                              variant={pool.storageSize === preset.size ? "default" : "outline"}
                              size="sm"
                              className={`h-9 text-xs font-medium ${
                                pool.storageSize === preset.size ? "bg-primary text-primary-foreground" : ""
                              }`}
                              onClick={() => updateNodePool(pool.id, { storageSize: preset.size })}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="w-28">
                        <Label className="text-xs text-muted-foreground mb-2 block">Custom</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={pool.storageSize}
                            onChange={(e) => {
                              const value = Math.max(4, Math.min(2048, Number(e.target.value) || 4))
                              updateNodePool(pool.id, { storageSize: value })
                            }}
                            className="w-full h-9 text-xs text-center pr-8"
                            min={4}
                            max={2048}
                          />
                          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">GB</span>
                        </div>
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="space-y-2">
                      <Slider
                        value={[pool.storageSize]}
                        onValueChange={(value) => updateNodePool(pool.id, { storageSize: value[0] })}
                        max={2048}
                        min={4}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>4 GB</span>
                        <span>2048 GB</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-800">
                          <strong>Note:</strong> Volume size cannot be edited later. Choose carefully.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node Scaling */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Node Scaling <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Desired Nodes</Label>
                      <Input
                        type="number"
                        value={pool.desiredNodes}
                        onChange={(e) => updateNodePool(pool.id, { desiredNodes: Math.max(1, Number(e.target.value) || 1) })}
                        min={1}
                        className="text-center"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Min Nodes</Label>
                      <Input
                        type="number"
                        value={pool.minNodes}
                        onChange={(e) => updateNodePool(pool.id, { minNodes: Math.max(0, Number(e.target.value) || 0) })}
                        min={0}
                        className="text-center"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Max Nodes</Label>
                      <Input
                        type="number"
                        value={pool.maxNodes}
                        onChange={(e) => updateNodePool(pool.id, { maxNodes: Math.max(1, Number(e.target.value) || 1) })}
                        min={1}
                        className="text-center"
                      />
                    </div>
                  </div>
                  
                  {/* Validation */}
                  {pool.minNodes > pool.maxNodes && (
                    <p className="text-xs text-destructive">Min nodes cannot be greater than max nodes</p>
                  )}
                  {pool.desiredNodes < pool.minNodes && (
                    <p className="text-xs text-destructive">Desired nodes must be at least min nodes</p>
                  )}
                  {pool.desiredNodes > pool.maxNodes && (
                    <p className="text-xs text-destructive">Desired nodes cannot exceed max nodes</p>
                  )}
                </div>

                {/* Taints */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Taints (Optional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addTaint(pool.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Taint
                    </Button>
                  </div>
                  
                  {pool.taints.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No taints configured</p>
                  ) : (
                    <div className="space-y-3">
                      {pool.taints.map((taint, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2">
                          <Input
                            placeholder="Key"
                            value={taint.key}
                            onChange={(e) => updateTaint(pool.id, index, "key", e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Value"
                            value={taint.value}
                            onChange={(e) => updateTaint(pool.id, index, "value", e.target.value)}
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <select
                              value={taint.effect}
                              onChange={(e) => updateTaint(pool.id, index, "effect", e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background"
                            >
                              <option value="NoSchedule">NoSchedule</option>
                              <option value="PreferNoSchedule">PreferNoSchedule</option>
                              <option value="NoExecute">NoExecute</option>
                            </select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTaint(pool.id, index)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Labels */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Labels (Optional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLabel(pool.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Label
                    </Button>
                  </div>
                  
                  {pool.labels.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No labels configured</p>
                  ) : (
                    <div className="space-y-3">
                      {pool.labels.map((label, index) => (
                        <div key={index} className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Key"
                            value={label.key}
                            onChange={(e) => updateLabel(pool.id, index, "key", e.target.value)}
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Input
                              placeholder="Value"
                              value={label.value}
                              onChange={(e) => updateLabel(pool.id, index, "value", e.target.value)}
                              className="text-sm"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLabel(pool.id, index)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Tags (Optional)</Label>
                  
                  {/* Tag Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter tag and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.target as HTMLInputElement
                          if (input.value.trim()) {
                            addTag(pool.id, input.value.trim())
                            input.value = ''
                          }
                        }
                      }}
                      className="text-sm"
                    />
                  </div>
                  
                  {/* Tags Display */}
                  {pool.tags.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No tags added</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {pool.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(pool.id, tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Node Pool Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addNodePool}
            className="w-full h-16 border-dashed"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Node Pool
          </Button>
        </div>

        {/* Right Column - Summary & Cost */}
        <div className="space-y-6">
          {/* Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Instance Costs:</span>
                  <span className="font-medium">₹{calculateCosts.totalInstanceCost.toFixed(2)}/hour</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Storage Costs:</span>
                  <span className="font-medium">₹{calculateCosts.totalStorageCost.toFixed(2)}/hour</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">₹{calculateCosts.totalCost.toFixed(2)}/hour</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  ≈ ₹{(calculateCosts.totalCost * 24 * 30).toFixed(2)}/month
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Node Pool Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Node Pool Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nodePools.map((pool) => {
                const flavor = getSelectedFlavor(pool.instanceFlavor)
                return (
                  <div key={pool.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{pool.name}</span>
                      {pool.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{flavor.name} • {pool.desiredNodes} nodes</div>
                      <div>{pool.storageSize} GB storage</div>
                      <div>₹{(flavor.pricePerHour * pool.desiredNodes).toFixed(2)}/hour</div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* YAML Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Collapsible open={yamlPreviewOpen} onOpenChange={setYamlPreviewOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>View YAML</span>
                    {yamlPreviewOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                      {generateYAML()}
                    </pre>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadYAML}
                    className="w-full mt-3"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download YAML
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSaveAndContinue}>
          Save & Continue
        </Button>
      </div>
    </div>
  )
}

