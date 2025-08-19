"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ExternalLink, AlertCircle, Info, Plus, X, Server, AlertTriangle, Download, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import {
  availableRegions,
  mockVPCs,
  mockSubnets,
  availableKubernetesVersions,
  calculateCosts,
  type ClusterConfiguration,
  type APIServerEndpoint
} from "@/lib/cluster-creation-data"

// Define interfaces at the top level
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

export default function CreateClusterPage() {
  const router = useRouter()
  const [step, setStep] = useState<"configuration" | "review" | "nodePools" | "addons">("configuration")
  
  const [configuration, setConfiguration] = useState<Partial<ClusterConfiguration>>({
    region: "",
    vpcId: "",
    subnetIds: [],
    kubernetesVersion: "",
    apiServerEndpoint: {
      type: "public"
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [costs, setCosts] = useState(calculateCosts(configuration))

  // Filtered data based on selections
  const availableVPCs = configuration.region ? mockVPCs.filter(vpc => vpc.region === configuration.region) : []
  const availableSubnets = configuration.vpcId ? mockSubnets.filter(subnet => subnet.vpcId === configuration.vpcId) : []

  // Update costs when configuration changes
  useEffect(() => {
    setCosts(calculateCosts(configuration))
  }, [configuration])

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!configuration.region) {
      newErrors.region = "Region is required"
    }

    if (!configuration.vpcId) {
      newErrors.vpcId = "VPC is required"
    }

    if (!configuration.subnetIds || configuration.subnetIds.length === 0) {
      newErrors.subnets = "At least one subnet must be selected"
    }

    if (!configuration.kubernetesVersion) {
      newErrors.kubernetesVersion = "Kubernetes version is required"
    }

    if (configuration.apiServerEndpoint?.type === "whitelisted" && 
        (!configuration.apiServerEndpoint.whitelistedIPs || 
         configuration.apiServerEndpoint.whitelistedIPs.length === 0)) {
      newErrors.whitelistedIPs = "At least one CIDR range is required for whitelisted access"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check if form is valid
  const isFormValid = (): boolean => {
    return !!(
      configuration.region &&
      configuration.vpcId &&
      configuration.subnetIds &&
      configuration.subnetIds.length > 0 &&
      configuration.kubernetesVersion
    )
  }

  // Handle region change
  const handleRegionChange = (regionId: string) => {
    setConfiguration(prev => ({
      ...prev,
      region: regionId,
      vpcId: "", // Reset VPC when region changes
      subnetIds: [] // Reset subnets when VPC changes
    }))
  }

  // Handle VPC change
  const handleVPCChange = (vpcId: string) => {
    setConfiguration(prev => ({
      ...prev,
      vpcId,
      subnetIds: [] // Reset subnets when VPC changes
    }))
  }

  // Handle subnet selection
  const handleSubnetChange = (subnetId: string, checked: boolean) => {
    setConfiguration(prev => ({
      ...prev,
      subnetIds: checked 
        ? [...(prev.subnetIds || []), subnetId]
        : (prev.subnetIds || []).filter(id => id !== subnetId)
    }))
  }

  // Handle API endpoint type change
  const handleAPIEndpointChange = (type: APIServerEndpoint["type"]) => {
    setConfiguration(prev => ({
      ...prev,
      apiServerEndpoint: {
        type,
        whitelistedIPs: type === "whitelisted" ? [""] : undefined
      }
    }))
  }

  // Handle whitelisted IPs change
  const handleWhitelistedIPChange = (index: number, value: string) => {
    if (!configuration.apiServerEndpoint?.whitelistedIPs) return
    
    const newIPs = [...configuration.apiServerEndpoint.whitelistedIPs]
    newIPs[index] = value
    
    setConfiguration(prev => ({
      ...prev,
      apiServerEndpoint: {
        ...prev.apiServerEndpoint!,
        whitelistedIPs: newIPs
      }
    }))
  }

  // Handle form submission
  const handleReviewConfiguration = () => {
    if (validateForm()) {
      setStep("nodePools")
    }
  }

  // Handle cluster creation
  const handleCreateCluster = () => {
    // In a real implementation, this would call the API to create the cluster
    console.log("Creating cluster with configuration:", configuration)
    
    // Redirect back to Kubernetes dashboard
    router.push("/kubernetes")
  }

  // CIDR validation regex
  const isValidCIDR = (cidr: string): boolean => {
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/
    if (!cidrRegex.test(cidr)) return false
    
    const [ip, prefix] = cidr.split('/')
    const prefixNum = parseInt(prefix)
    if (prefixNum < 0 || prefixNum > 32) return false
    
    const ipParts = ip.split('.').map(Number)
    return ipParts.every(part => part >= 0 && part <= 255)
  }

  // Render different views based on step
  if (step === "nodePools") {
    return <NodePoolsView 
      onBack={() => setStep("configuration")}
      onContinue={() => setStep("addons")}
    />
  }

  if (step === "addons") {
    return <AddonsView 
      onBack={() => setStep("nodePools")}
      onContinue={() => {
        // Create the cluster and redirect to dashboard
        console.log("Creating cluster with configuration:", configuration)
        router.push("/kubernetes")
      }}
    />
  }

  if (step === "review") {
    return <ConfirmationView 
      configuration={configuration as ClusterConfiguration} 
      costs={costs}
      onBack={() => setStep("addons")}
      onCreate={handleCreateCluster}
    />
  }

  // Main configuration view
  return (
    <PageLayout
      title="Create Kubernetes Cluster"
      description="Configure and deploy a new Kubernetes cluster with enterprise-grade reliability"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Configuration Form */}
        <div className="flex-1 space-y-6">
          {/* Region Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Region</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={configuration.region}
                  onValueChange={handleRegionChange}
                >
                  <SelectTrigger className={errors.region ? "border-red-300" : ""}>
                    <SelectValue placeholder="Choose a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRegions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{region.displayName}</span>
                          <Badge variant="outline" className="ml-2">
                            {region.name}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-sm text-red-600">{errors.region}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* VPC Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select VPC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {configuration.region ? (
                  availableVPCs.length > 0 ? (
                    <Select
                      value={configuration.vpcId}
                      onValueChange={handleVPCChange}
                    >
                      <SelectTrigger className={errors.vpcId ? "border-red-300" : ""}>
                        <SelectValue placeholder="Choose a VPC" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVPCs.map((vpc) => (
                          <SelectItem key={vpc.id} value={vpc.id}>
                            <div className="space-y-1">
                              <div className="font-medium">{vpc.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {vpc.cidr} • {vpc.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No VPCs found in this region.{" "}
                        <Link 
                          href="/networking/vpc/create" 
                          className="text-primary hover:underline font-medium"
                        >
                          Create a new VPC →
                        </Link>
                      </AlertDescription>
                    </Alert>
                  )
                ) : (
                  <div className="text-muted-foreground">
                    Please select a region first
                  </div>
                )}
                {errors.vpcId && (
                  <p className="text-sm text-red-600">{errors.vpcId}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subnet Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Subnets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {configuration.vpcId ? (
                  availableSubnets.length > 0 ? (
                    <div className="space-y-3">
                      {availableSubnets.map((subnet) => (
                        <div key={subnet.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={subnet.id}
                            checked={configuration.subnetIds?.includes(subnet.id) || false}
                            onCheckedChange={(checked) => 
                              handleSubnetChange(subnet.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={subnet.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">{subnet.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {subnet.type}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {subnet.cidr} • {subnet.availabilityZone}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {subnet.description}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No subnets found in this VPC.{" "}
                        <Link 
                          href="/networking/vpc/create" 
                          className="text-primary hover:underline font-medium"
                        >
                          Create a new VPC →
                        </Link>
                      </AlertDescription>
                    </Alert>
                  )
                ) : (
                  <div className="text-muted-foreground">
                    Please select a VPC first
                  </div>
                )}
                {errors.subnets && (
                  <p className="text-sm text-red-600">{errors.subnets}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Kubernetes Version Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Kubernetes Version</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={configuration.kubernetesVersion}
                  onValueChange={(value) => setConfiguration(prev => ({ ...prev, kubernetesVersion: value }))}
                >
                  <SelectTrigger className={errors.kubernetesVersion ? "border-red-300" : ""}>
                    <SelectValue placeholder="Choose Kubernetes version" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableKubernetesVersions.map((version) => (
                      <SelectItem key={version.version} value={version.version}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{version.version}</span>
                            {version.isRecommended && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                            {version.isLatest && (
                              <Badge variant="default" className="text-xs">
                                Latest
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            EOL: {version.eolDate}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.kubernetesVersion && (
                  <p className="text-sm text-red-600">{errors.kubernetesVersion}</p>
                )}


              </div>
            </CardContent>
          </Card>

          {/* API Server Endpoint Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Kube-API Server Endpoint Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RadioGroup
                  value={configuration.apiServerEndpoint?.type}
                  onValueChange={(value) => handleAPIEndpointChange(value as APIServerEndpoint["type"])}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="flex-1">
                      <div className="font-medium">Public</div>
                      <div className="text-sm text-muted-foreground">
                        Accessible via internet
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="flex-1">
                      <div className="font-medium">Private</div>
                      <div className="text-sm text-muted-foreground">
                        Only accessible via internal VPC (bastion)
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="whitelisted" id="whitelisted" />
                    <Label htmlFor="whitelisted" className="flex-1">
                      <div className="font-medium">Whitelisted IPs</div>
                      <div className="text-sm text-muted-foreground">
                        Requires CIDR input for allowed IP ranges
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {configuration.apiServerEndpoint?.type === "whitelisted" && (
                  <div className="space-y-3 pl-6">
                    <Label className="text-sm font-medium">CIDR Ranges</Label>
                    {configuration.apiServerEndpoint.whitelistedIPs?.map((ip, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="e.g., 203.0.113.0/24"
                          value={ip}
                          onChange={(e) => handleWhitelistedIPChange(index, e.target.value)}
                          className={errors.whitelistedIPs ? "border-red-300" : ""}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newIPs = configuration.apiServerEndpoint?.whitelistedIPs?.filter((_, i) => i !== index) || []
                            setConfiguration(prev => ({
                              ...prev,
                              apiServerEndpoint: {
                                ...prev.apiServerEndpoint!,
                                whitelistedIPs: newIPs
                              }
                            }))
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newIPs = [...(configuration.apiServerEndpoint?.whitelistedIPs || []), ""]
                        setConfiguration(prev => ({
                          ...prev,
                          apiServerEndpoint: {
                            ...prev.apiServerEndpoint!,
                            whitelistedIPs: newIPs
                          }
                        }))
                      }}
                    >
                      Add CIDR Range
                    </Button>
                    {errors.whitelistedIPs && (
                      <p className="text-sm text-red-600">{errors.whitelistedIPs}</p>
                    )}
                  </div>
                )}

                {configuration.apiServerEndpoint?.type === "private" && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Private endpoint requires bastion host setup. You'll need to configure SSH access through a bastion host in the same VPC.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Review Configuration Button */}
          <div className="pt-6">
            <Button
              onClick={handleReviewConfiguration}
              disabled={!isFormValid()}
              className="w-full bg-black text-white hover:bg-black/90"
              size="lg"
            >
              Configure Node Pools
            </Button>
          </div>
        </div>

        {/* Right Side Panel - Costing */}
        <div className="lg:w-80 space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>
                Estimated Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cluster</span>
                  <div className="text-right">
                    <div className="font-medium">₹{costs.cluster.hourly.toFixed(2)}/hr</div>
                    <div className="text-xs text-muted-foreground">₹{costs.cluster.monthly.toFixed(2)}/mo</div>
                  </div>
                </div>
                

                
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <div className="text-right">
                    <div>₹{costs.cluster.hourly.toFixed(2)}/hr</div>
                    <div className="text-sm text-muted-foreground">₹{costs.cluster.monthly.toFixed(2)}/mo</div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>• All other resources are preconfigured</p>
                <p>• Costs are estimates only</p>
                <p>• Actual billing may vary</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

// Node Pools View Component
function NodePoolsView({ 
  onBack, 
  onContinue 
}: { 
  onBack: () => void
  onContinue: () => void
}) {
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
      return // Cannot remove default pool
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
    <PageLayout
      title="Configure Node Pools"
      description="Configure node pools for your MKS cluster"
    >
      <div className="space-y-6">
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
                      <p className="text-xs text-destructive">Desired nodes must not exceed max nodes</p>
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
                                className="h-4 w-4 mr-1"
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
                              <X className="h-4 w-4" />
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
          <Button variant="outline" onClick={onBack}>
            Back to Configuration
          </Button>
          <Button onClick={onContinue} disabled={!validateForm()}>
            Continue to Review
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

// Addons View Component
function AddonsView({ 
  onBack, 
  onContinue 
}: { 
  onBack: () => void
  onContinue: () => void
}) {
  // Default add-ons as specified in requirements
  const [defaultAddons, setDefaultAddons] = useState([
    {
      id: "cni",
      name: "CNI (Cilium – default)",
      description: "Handles pod networking and connectivity within the cluster.",
      enabled: true
    },
    {
      id: "csi",
      name: "CSI",
      description: "Manages storage provisioning and attachment for workloads.",
      enabled: true
    },
    {
      id: "coredns",
      name: "CoreDNS",
      description: "Provides internal DNS resolution for services and pods.",
      enabled: true
    },
    {
      id: "kube-proxy",
      name: "Kube-proxy",
      description: "Handles network proxying and load balancing for services.",
      enabled: true
    },
    {
      id: "dns-proxy",
      name: "DNS-proxy",
      description: "Optimizes DNS query handling for improved performance.",
      enabled: true
    }
  ])

  // Check if any add-ons are disabled
  const hasDisabledAddons = defaultAddons.some(addon => !addon.enabled)

  // Toggle add-on enabled/disabled
  const toggleAddon = (addonId: string) => {
    setDefaultAddons(prev => prev.map(addon => 
      addon.id === addonId ? { ...addon, enabled: !addon.enabled } : addon
    ))
  }

  // Validation
  const validateForm = () => {
    return true // No specific validation for addons yet
  }

  return (
    <PageLayout
      title="Add-ons"
      description="Krutrim installs essential Kubernetes components by default. You can disable any and install your own via CLI."
    >
      <div className="space-y-6">
        {/* Default Add-ons List */}
        <div className="space-y-4">
          {defaultAddons.map((addon) => (
            <Card 
              key={addon.id} 
              className={`p-4 transition-all duration-200 ${
                addon.enabled 
                  ? "bg-white border-gray-200" 
                  : "bg-gray-50 border-gray-100 opacity-75"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`font-medium text-lg mb-1 transition-colors duration-200 ${
                    addon.enabled ? "text-gray-900" : "text-gray-500"
                  }`}>
                    {addon.name}
                  </h3>
                  <p className={`transition-colors duration-200 ${
                    addon.enabled ? "text-muted-foreground" : "text-gray-400"
                  }`}>
                    {addon.description}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Toggle Switch */}
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        addon.enabled ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          addon.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      addon.enabled ? "text-gray-900" : "text-gray-500"
                    }`}>
                      {addon.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Central Alert - Only show if any add-ons are disabled */}
        {hasDisabledAddons && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Action required</div>
                <p>
                  You have disabled one or more default add-ons. Ensure you install compatible replacements via CLI (e.g., <code className="bg-muted px-1 py-0.5 rounded text-sm">kubectl</code>/Helm) so your cluster functions correctly.
                </p>
                <Link href="#" className="text-primary hover:underline text-sm">
                  Learn how →
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onContinue} className="bg-black text-white hover:bg-black/90">
            Create Cluster
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

// Confirmation View Component
function ConfirmationView({ 
  configuration, 
  costs, 
  onBack, 
  onCreate 
}: { 
  configuration: ClusterConfiguration
  costs: any
  onBack: () => void
  onCreate: () => void
}) {
  const [yamlContent, setYamlContent] = useState("")
  
  useEffect(() => {
    // Import the function dynamically to avoid circular dependencies
    import("@/lib/cluster-creation-data").then(({ generateClusterSpecYAML }) => {
      setYamlContent(generateClusterSpecYAML(configuration))
    })
  }, [configuration])

  const selectedVPC = mockVPCs.find(v => v.id === configuration.vpcId)
  const selectedSubnets = mockSubnets.filter(s => configuration.subnetIds.includes(s.id))
  const selectedVersion = availableKubernetesVersions.find(v => v.version === configuration.kubernetesVersion)

  return (
    <PageLayout
      title="Review Configuration"
      description="Review your cluster configuration before creation"
    >
      <div className="space-y-6">
        {/* Configuration Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Region</Label>
                <p className="font-medium">{availableRegions.find(r => r.id === configuration.region)?.displayName}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">VPC</Label>
                <p className="font-medium">{selectedVPC?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedVPC?.cidr}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Subnets</Label>
                <div className="space-y-1">
                  {selectedSubnets.map(subnet => (
                    <div key={subnet.id} className="flex items-center gap-2">
                      <Badge variant="outline">{subnet.type}</Badge>
                      <span className="text-sm">{subnet.name} ({subnet.cidr})</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Kubernetes Version</Label>
                <p className="font-medium">{selectedVersion?.version}</p>
                <p className="text-sm text-muted-foreground">EOL: {selectedVersion?.eolDate}</p>
              </div>
              

              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">API Endpoint</Label>
                <p className="font-medium capitalize">{configuration.apiServerEndpoint.type}</p>
                {configuration.apiServerEndpoint.type === "whitelisted" && (
                  <p className="text-sm text-muted-foreground">
                    {configuration.apiServerEndpoint.whitelistedIPs?.join(", ")}
                  </p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Estimated Cost</Label>
              <p className="text-2xl font-bold">₹{costs.cluster.hourly.toFixed(2)}/hour</p>
              <p className="text-muted-foreground">₹{costs.cluster.monthly.toFixed(2)}/month</p>
            </div>
          </CardContent>
        </Card>

        {/* YAML Preview */}
        <Card>
          <CardHeader>
            <CardTitle>ClusterSpec YAML</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{yamlContent}</pre>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  const blob = new Blob([yamlContent], { type: "text/yaml" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "cluster-spec.yaml"
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                Download YAML
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Configuration
          </Button>
          <Button onClick={onCreate} className="flex-1 bg-black text-white hover:bg-black/90">
            Create Cluster
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
