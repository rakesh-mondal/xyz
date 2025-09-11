"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertTriangle, Download, ChevronRight, Plus, X, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for subnets
const mockSubnets = [
  { id: "subnet-1", name: "subnet-prod-1a", type: "Public" },
  { id: "subnet-2", name: "subnet-prod-1b", type: "Private" },
  { id: "subnet-3", name: "subnet-staging-1a", type: "Public" }
]

interface NodePool {
  id: string
  name: string
  instanceFlavor: string
  storageSize: number
  subnetId: string
  securityGroupId?: string
  desiredNodes: number
  minNodes: number
  maxNodes: number
  taints: { key: string; value: string; effect: string }[]
  labels: { key: string; value: string }[]
  tags: { key: string; value: string }[]
  isDefault: boolean
}

interface NodePoolsAndAddonsViewProps {
  onBack: () => void
  onContinue: () => void
  clusterCost: { hourly: number; monthly: number }
  clusterCreationStarted: boolean
}

export function NodePoolsAndAddonsView({ 
  onBack, 
  onContinue,
  clusterCost,
  clusterCreationStarted
}: NodePoolsAndAddonsViewProps) {
  const { toast } = useToast()
  
  // Node Pools State
  const [nodePools, setNodePools] = useState<NodePool[]>([
    {
      id: "default-pool",
      name: "default-pool",
      instanceFlavor: "cpu-2x-8gb",
      storageSize: 50,
      subnetId: "",
      securityGroupId: undefined,
      desiredNodes: 2,
      minNodes: 1,
      maxNodes: 5,
      taints: [{ key: "", value: "", effect: "NoSchedule" }],
      labels: [{ key: "", value: "" }],
      tags: [{ key: "", value: "" }],
      isDefault: true
    }
  ])

  // Add-ons State
  const [defaultAddons, setDefaultAddons] = useState([
    {
      id: "cni",
      name: "CNI (Cilium – default)",
      description: "Handles pod networking and connectivity within the cluster.",
      version: "v1.15.3",
      enabled: true
    },
    {
      id: "csi",
      name: "CSI",
      description: "Manages storage provisioning and attachment for workloads.",
      version: "v1.9.2",
      enabled: true
    },
    {
      id: "coredns",
      name: "CoreDNS",
      description: "Provides internal DNS resolution for services and pods.",
      version: "v1.11.1",
      enabled: true
    },
    {
      id: "kube-proxy",
      name: "Kube-proxy",
      description: "Handles network proxying and load balancing for services.",
      version: "v1.29.0",
      enabled: true
    },
    {
      id: "dns-proxy",
      name: "DNS-proxy",
      description: "Optimizes DNS query handling for improved performance.",
      version: "v2.4.1",
      enabled: true
    }
  ])

  const [nextPoolId, setNextPoolId] = useState(2)

  // Instance flavors
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
    { size: 50, label: "50GB" },
    { size: 100, label: "100GB" },
    { size: 200, label: "200GB" },
    { size: 500, label: "500GB" },
    { size: 1000, label: "1TB" }
  ]

  const hasDisabledAddons = defaultAddons.some(addon => !addon.enabled)

  const toggleAddon = (addonId: string) => {
    setDefaultAddons(prev => prev.map(addon => 
      addon.id === addonId ? { ...addon, enabled: !addon.enabled } : addon
    ))
  }

  const updateNodePool = (poolId: string, updates: Partial<NodePool>) => {
    setNodePools(prev => prev.map(pool => 
      pool.id === poolId ? { ...pool, ...updates } : pool
    ))
  }

  const addNodePool = () => {
    const newPool: NodePool = {
      id: `pool-${nextPoolId}`,
      name: `worker-pool-${nextPoolId}`,
      instanceFlavor: "cpu-2x-8gb",
      storageSize: 100,
      subnetId: "",
      securityGroupId: undefined,
      desiredNodes: 2,
      minNodes: 1,
      maxNodes: 5,
      taints: [{ key: "", value: "", effect: "NoSchedule" }],
      labels: [{ key: "", value: "" }],
      tags: [{ key: "", value: "" }],
      isDefault: false
    }
    setNodePools(prev => [...prev, newPool])
    setNextPoolId(prev => prev + 1)
  }

  const removeNodePool = (poolId: string) => {
    setNodePools(prev => prev.filter(pool => pool.id !== poolId))
  }

  const validateForm = () => {
    return nodePools.every(pool => pool.subnetId && pool.name.trim())
  }

  // Calculate costs
  const calculateCosts = () => {
    const clusterCost = 2.5 // Base cluster cost
    const totalInstanceCost = nodePools.reduce((total, pool) => {
      const flavor = instanceFlavors.find(f => f.id === pool.instanceFlavor)
      return total + (flavor?.pricePerHour || 0) * pool.desiredNodes
    }, 0)
    const totalStorageCost = nodePools.reduce((total, pool) => {
      return total + (pool.storageSize * 0.125) // ₹0.125 per GB per hour
    }, 0)
    
    return {
      clusterCost,
      totalInstanceCost,
      totalStorageCost,
      totalCost: clusterCost + totalInstanceCost + totalStorageCost
    }
  }

  const costs = calculateCosts()

  return (
    <PageLayout
      title="Node Pools & Add-ons"
      description="Configure node pools and cluster add-ons for your Kubernetes cluster"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Configuration Form */}
        <div className="flex-1 space-y-6">
          {/* Node Pools */}
          {nodePools.map((pool, index) => (
            <Card key={pool.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg">
                        {pool.name}
                        {pool.isDefault && (
                          <Badge variant="secondary" className="ml-2">
                            Default Node Pool (required)
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                  {!pool.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNodePool(pool.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pool Name */}
                <div>
                  <Label className="block mb-2 font-medium">
                    Pool Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={pool.name}
                    onChange={(e) => updateNodePool(pool.id, { name: e.target.value })}
                    placeholder="Enter pool name"
                  />
                </div>

                {/* Instance Flavor */}
                <div>
                  <Label className="block mb-2 font-medium">
                    Instance Flavor <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={pool.instanceFlavor} 
                    onValueChange={(value) => updateNodePool(pool.id, { instanceFlavor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select instance flavor" />
                    </SelectTrigger>
                    <SelectContent>
                      {instanceFlavors.map((flavor) => (
                        <SelectItem key={flavor.id} value={flavor.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{flavor.name}</span>
                            <div className="flex items-center gap-2 ml-4">
                              <span className="text-xs text-muted-foreground">
                                {flavor.vcpus} vCPUs, {flavor.ram}GB RAM
                              </span>
                              <Badge variant="outline" className="text-xs">
                                ₹{flavor.pricePerHour}/hr
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subnet */}
                <div>
                  <Label className="block mb-2 font-medium">
                    Subnet <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={pool.subnetId} 
                    onValueChange={(value) => updateNodePool(pool.id, { subnetId: value })}
                  >
                    <SelectTrigger className={!pool.subnetId ? 'border-red-300 bg-red-50' : ''}>
                      <SelectValue placeholder="Select a subnet" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSubnets.map((subnet) => (
                        <SelectItem key={subnet.id} value={subnet.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{subnet.name}</span>
                            <Badge 
                              variant="secondary" 
                              className={`ml-2 text-xs ${
                                subnet.type === 'Public' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {subnet.type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!pool.subnetId && (
                    <p className="text-xs text-destructive">Please select a subnet</p>
                  )}
                </div>

                {/* Storage Size */}
                <div>
                  <Label className="block mb-2 font-medium">Storage Size (GB)</Label>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {storagePresets.map((preset) => (
                        <Button
                          key={preset.size}
                          variant={pool.storageSize === preset.size ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateNodePool(pool.id, { storageSize: preset.size })}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[pool.storageSize]}
                        onValueChange={(value) => updateNodePool(pool.id, { storageSize: value[0] })}
                        max={2000}
                        min={50}
                        step={10}
                        className="flex-1"
                      />
                      <div className="w-20">
                        <Input
                          type="number"
                          value={pool.storageSize}
                          onChange={(e) => updateNodePool(pool.id, { storageSize: parseInt(e.target.value) || 50 })}
                          min={50}
                          max={2000}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node Count */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="block mb-2 font-medium">Desired Nodes</Label>
                    <Input
                      type="number"
                      value={pool.desiredNodes}
                      onChange={(e) => updateNodePool(pool.id, { desiredNodes: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={10}
                    />
                  </div>
                  <div>
                    <Label className="block mb-2 font-medium">Min Nodes</Label>
                    <Input
                      type="number"
                      value={pool.minNodes}
                      onChange={(e) => updateNodePool(pool.id, { minNodes: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={10}
                    />
                  </div>
                  <div>
                    <Label className="block mb-2 font-medium">Max Nodes</Label>
                    <Input
                      type="number"
                      value={pool.maxNodes}
                      onChange={(e) => updateNodePool(pool.id, { maxNodes: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={20}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Node Pool Button */}
          <Card>
            <CardContent className="space-y-6 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={addNodePool}
                className="w-full h-16 border-dashed"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Node Pool
              </Button>
            </CardContent>
          </Card>

          {/* Add-ons Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Switch
                      checked={defaultAddons.every(addon => addon.enabled)}
                      onCheckedChange={(checked) => {
                        setDefaultAddons(prev => prev.map(addon => ({ ...addon, enabled: checked })))
                      }}
                    />
                    Add-ons
                  </CardTitle>
                </div>
              </div>
              <CardDescription>
                Krutrim installs essential Kubernetes components by default. You can disable any and install your own via CLI.
                {hasDisabledAddons && (
                  <Alert className="border-yellow-200 bg-yellow-50 mt-3 py-3">
                    <div className="flex gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" style={{ marginTop: '1px' }} />
                      <div className="text-xs text-yellow-800 leading-relaxed">
                        <strong>Warning:</strong> Disabling essential add-ons may affect cluster functionality. Some features may not work as expected.
                      </div>
                    </div>
                  </Alert>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {defaultAddons.map((addon) => (
                  <div
                    key={addon.id}
                    className={`p-4 border rounded-lg relative cursor-pointer transition-all hover:border-gray-300 ${
                      addon.enabled 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-card'
                    }`}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        addon.enabled 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300'
                      }`}>
                        {addon.enabled && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <div className="text-sm font-medium leading-none">
                          {addon.name}
                        </div>
                        <Badge variant="outline" className="text-xs font-medium ml-2">
                          {addon.version}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-2 ml-8">
                      <p className="text-sm text-muted-foreground">
                        {addon.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onBack}>
                  Back
                </Button>
                <Button onClick={onContinue} disabled={!validateForm()} className="bg-black text-white hover:bg-black/90">
                  Create Cluster
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          {/* Cost Summary */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Cost Summary</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cluster</span>
                  <div className="text-right">
                    <div className="font-medium">₹{costs.clusterCost.toFixed(2)}/hr</div>
                    <div className="text-xs text-muted-foreground">₹{(costs.clusterCost * 24 * 30).toFixed(2)}/mo</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Instance Costs</span>
                  <div className="text-right">
                    <div className="font-medium">₹{costs.totalInstanceCost.toFixed(2)}/hr</div>
                    <div className="text-xs text-muted-foreground">₹{(costs.totalInstanceCost * 24 * 30).toFixed(2)}/mo</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Storage Costs</span>
                  <div className="text-right">
                    <div className="font-medium">₹{costs.totalStorageCost.toFixed(2)}/hr</div>
                    <div className="text-xs text-muted-foreground">₹{(costs.totalStorageCost * 24 * 30).toFixed(2)}/mo</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <div className="text-right">
                    <div>₹{costs.totalCost.toFixed(2)}/hr</div>
                    <div className="text-sm text-muted-foreground">₹{(costs.totalCost * 24 * 30).toFixed(2)}/mo</div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>• All other resources are preconfigured</p>
                <p>• Costs are estimates only</p>
                <p>• Actual billing may vary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
