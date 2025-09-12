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
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, AlertCircle, Info, Plus, X, Server, AlertTriangle, Download, ChevronDown, ChevronRight, Search, Check, HardDrive, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  availableRegions,
  mockVPCs,
  mockSubnets,
  availableKubernetesVersions,
  calculateCosts,
  type ClusterConfiguration,
  type APIServerEndpoint
} from "@/lib/cluster-creation-data"
import { CreateVPCModal } from "@/components/modals/vm-creation-modals"

// Mock security groups data
const mockSecurityGroups = [
  { id: "sg-default", name: "default-sg", description: "Default security group" },
  { id: "sg-web", name: "web-sg", description: "Web security group" },
  { id: "sg-db", name: "db-sg", description: "Database security group" }
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
  isDefault?: boolean
}

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: "configuration" | "nodePoolsAndAddons" }) {
  const steps = [
    { id: "configuration", title: "Set Up Your Cluster", isCompleted: currentStep === "nodePoolsAndAddons" },
    { id: "nodePoolsAndAddons", title: "Node Pools & Add-ons", isCompleted: false }
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.isCompleted

          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                isCompleted ? 'bg-black border-black' : isActive ? 'border-black bg-white' : 'border-gray-300 bg-white'
              }`}>
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${isActive ? 'text-black' : 'text-gray-400'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`ml-3 text-sm font-medium ${isActive ? 'text-black' : isCompleted ? 'text-black' : 'text-gray-400'}`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-black' : 'bg-gray-200'}`} />
              )}
            </div>

          )
        })}
        </div>
      </div>
    </div>
  )
}

export default function CreateClusterClientComponent() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState<"configuration" | "nodePoolsAndAddons">("configuration")
  const [clusterCreationStarted, setClusterCreationStarted] = useState(false)
  const [showNavigationGuard, setShowNavigationGuard] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  
  const [configuration, setConfiguration] = useState<Partial<ClusterConfiguration>>({
    region: "",
    vpcId: "",
    subnetId: "",
    kubernetesVersion: "",
    apiServerEndpoint: {
      type: "public"
    },
    podCIDR: "10.244.0.0/16",
    serviceCIDR: "10.96.0.0/12"
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [costs, setCosts] = useState(calculateCosts(configuration))
  const [formTouched, setFormTouched] = useState(false)
  const [showCreateVPCModal, setShowCreateVPCModal] = useState(false)

  // Navigation guard - prevent accidental navigation when cluster creation started
  useEffect(() => {
    if (!clusterCreationStarted) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      setShowNavigationGuard(true)
      setPendingNavigation(window.location.pathname)
      // Push the current state back to prevent navigation
      window.history.pushState(null, '', window.location.pathname)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)
    
    // Push initial state to handle back button
    window.history.pushState(null, '', window.location.pathname)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [clusterCreationStarted])

  // Confirm navigation
  const confirmNavigation = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation)
    }
    setShowNavigationGuard(false)
    setPendingNavigation(null)
  }

  // Cancel navigation
  const cancelNavigation = () => {
    setShowNavigationGuard(false)
    setPendingNavigation(null)
  }

  // Update costs when configuration changes
  useEffect(() => {
    setCosts(calculateCosts(configuration))
  }, [configuration])

  // Get available VPCs based on selected region
  const availableVPCs = useMemo(() => {
    if (!configuration.region) return []
    return mockVPCs.filter(vpc => vpc.region === configuration.region)
  }, [configuration.region])

  // Get available subnets based on selected VPC
  const availableSubnets = useMemo(() => {
    if (!configuration.vpcId) return []
    return mockSubnets.filter(subnet => subnet.vpcId === configuration.vpcId)
  }, [configuration.vpcId])

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!configuration.region) {
      newErrors.region = "Region is required"
    }

    if (!configuration.vpcId) {
      newErrors.vpcId = "VPC is required"
    }

    if (!configuration.subnetId) {
      newErrors.subnets = "A subnet must be selected"
    }

    if (!configuration.kubernetesVersion) {
      newErrors.kubernetesVersion = "Kubernetes version is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check if form is valid for enabling the Continue button
  const isFormValid = () => {
    return !!(
      configuration.region &&
      configuration.vpcId &&
      configuration.subnetId &&
      configuration.kubernetesVersion
    )
  }

  // Handle region change
  const handleRegionChange = (regionId: string) => {
    setConfiguration(prev => ({
      ...prev,
      region: regionId,
      vpcId: "", // Reset VPC when region changes
      subnetId: "" // Reset subnet when region changes
    }))
    setFormTouched(true)
  }

  // Handle VPC change
  const handleVPCChange = (vpcId: string) => {
    setConfiguration(prev => ({
      ...prev,
      vpcId,
      subnetId: "" // Reset subnet when VPC changes
    }))
  }

  // Handle subnet selection
  const handleSubnetChange = (subnetId: string) => {
    setConfiguration(prev => ({
      ...prev,
      subnetId: subnetId
    }))
  }

  // Handle Kubernetes version change
  const handleKubernetesVersionChange = (version: string) => {
    setConfiguration(prev => ({
      ...prev,
      kubernetesVersion: version
    }))
    setFormTouched(true)
  }

  // Handle API server endpoint change
  const handleAPIServerEndpointChange = (type: "public") => {
    setConfiguration(prev => ({
      ...prev,
      apiServerEndpoint: { type }
    }))
  }

  // Handle CIDR changes
  const handlePodCIDRChange = (cidr: string) => {
    setConfiguration(prev => ({
      ...prev,
      podCIDR: cidr
    }))
  }

  const handleServiceCIDRChange = (cidr: string) => {
    setConfiguration(prev => ({
      ...prev,
      serviceCIDR: cidr
    }))
  }

  // Continue to next step
  const handleContinue = () => {
    if (validateForm()) {
      setStep("nodePoolsAndAddons")
    }
  }

  // Handle cluster creation completion
  const handleCompleteCluster = () => {
    setClusterCreationStarted(true)
    
    // Simulate cluster creation
    toast({
      title: "Cluster Creation Started",
      description: "Your Kubernetes cluster is being created. This may take several minutes.",
    })

    // Simulate navigation after creation
    setTimeout(() => {
      router.push('/kubernetes')
    }, 2000)
  }

  // CIDR validation helper
  const isValidCIDR = (cidr: string): boolean => {
    const cidrPattern = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/
    if (!cidrPattern.test(cidr)) return false
    
    const [ip, prefix] = cidr.split('/')
    const prefixNum = parseInt(prefix, 10)
    if (prefixNum < 0 || prefixNum > 32) return false
    
    const ipParts = ip.split('.').map(part => parseInt(part, 10))
    if (ipParts.some(part => part < 0 || part > 255)) return false

    return ipParts.every(part => part >= 0 && part <= 255)
  }

  // Render different views based on step
  if (step === "nodePoolsAndAddons") {
    return (
      <>
        <NodePoolsAndAddonsView 
          onBack={() => setStep("configuration")}
          onContinue={handleCompleteCluster}
          clusterCost={costs.cluster}
          clusterCreationStarted={clusterCreationStarted}
        />
        
        {/* Navigation Guard Modal - always rendered when cluster creation started */}
        <Dialog open={showNavigationGuard} onOpenChange={setShowNavigationGuard}>
          <DialogContent className="sm:max-w-md" style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}>
            <DialogHeader className="space-y-3 pb-4">
              <DialogTitle className="text-base font-semibold text-black pr-8">
                Cluster creation in progress
              </DialogTitle>
              <hr className="border-border" />
            </DialogHeader>
            
            <div className="pt-2 pb-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your cluster is being created in the background. Once the cluster is ready, billing will begin and continue until you delete it from the dashboard.
                </AlertDescription>
              </Alert>
            </div>
            
            <DialogFooter className="flex gap-3 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={cancelNavigation}
                className="flex-1 sm:flex-none"
              >
                Stay on Page
              </Button>
              <Button 
                onClick={confirmNavigation}
                className="flex-1 sm:flex-none bg-black hover:bg-black/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Stopping..." : "Leave Anyway"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Configuration step
  return (
    <PageLayout
      title="Create Cluster"
      description="Configure your Kubernetes cluster settings and node pools"
    >
      <div className="max-w-7xl mx-auto">
        <StepIndicator currentStep={step} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Configuration Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Configuration</CardTitle>
                <CardDescription>
                  Set up the basic configuration for your Kubernetes cluster
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Region Selection */}
                <div>
                  <Label className="block mb-2 font-medium">
                    Region <span className="text-destructive">*</span>
                  </Label>
                  <Select value={configuration.region || ""} onValueChange={handleRegionChange}>
                    <SelectTrigger className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.region ? "border-red-300 bg-red-50" : ""}`}>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRegions.map((region) => (
                        <SelectItem key={region.id} value={region.id} disabled={!region.isAvailable}>
                          <div className="flex items-center justify-between w-full">
                            <span>{region.displayName}</span>
                            {!region.isAvailable && (
                              <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && (
                    <p className="text-xs text-destructive mt-1">{errors.region}</p>
                  )}
                </div>

                {/* VPC Selection */}
                <div className="mb-8">
                  <div className="mb-5">
                    <Label className="block mb-2 font-medium">
                      VPC <span className="text-destructive">*</span>
                    </Label>
                    {configuration.region ? (
                      availableVPCs.length > 0 ? (
                        <VPCSelectorInline
                          value={configuration.vpcId || ""}
                          region={configuration.region}
                          availableVPCs={availableVPCs}
                          onChange={handleVPCChange}
                          error={errors.vpcId}
                        />
                      ) : (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            No VPCs found in this region.{" "}
                            <button 
                              onClick={() => setShowCreateVPCModal(true)}
                              className="text-primary hover:underline font-medium"
                            >
                              Create a new VPC →
                            </button>
                          </AlertDescription>
                        </Alert>
                      )
                    ) : (
                      <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/30">
                        Please select a region first to view available VPCs
                      </div>
                    )}
                  </div>
                </div>

                {/* Subnet Selection */}
                <div className="mb-8">
                  <div className="mb-5">
                    <Label className="block mb-2 font-medium">
                      Subnet <span className="text-destructive">*</span>
                    </Label>
                    {configuration.vpcId ? (
                      availableSubnets.length > 0 ? (
                        <Select 
                          value={configuration.subnetId || ""} 
                          onValueChange={handleSubnetChange}
                        >
                          <SelectTrigger className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.subnets ? "border-red-300 bg-red-50" : ""}`}>
                            <SelectValue placeholder="Select a subnet" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSubnets.map((subnet) => (
                              <SelectItem key={subnet.id} value={subnet.id}>
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{subnet.name}</span>
                                    <Badge 
                                      variant="secondary" 
                                      className={`text-xs ${
                                        subnet.type === "Public" 
                                          ? "bg-blue-100 text-blue-800" 
                                          : "bg-orange-100 text-orange-800"
                                      }`}
                                    >
                                      {subnet.type}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground ml-2">
                                    {subnet.cidr} • {subnet.availabilityZone}
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
                      <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/30">
                        Please select a VPC first to view available subnets
                      </div>
                    )}
                    {errors.subnets && (
                      <p className="text-xs text-destructive mt-1">{errors.subnets}</p>
                    )}
                  </div>
                </div>

                {/* Kubernetes Version */}
                <div>
                  <Label className="block mb-2 font-medium">
                    Kubernetes Version <span className="text-destructive">*</span>
                  </Label>
                  <Select value={configuration.kubernetesVersion || ""} onValueChange={handleKubernetesVersionChange}>
                    <SelectTrigger className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.kubernetesVersion ? "border-red-300 bg-red-50" : ""}`}>
                      <SelectValue placeholder="Select Kubernetes version" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableKubernetesVersions.map((version) => (
                        <SelectItem key={version.version} value={version.version}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <span>v{version.version}</span>
                              {version.isRecommended && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Recommended
                                </Badge>
                              )}
                              {version.isLatest && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  Latest
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              EOL: {version.eolDate}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.kubernetesVersion && (
                    <p className="text-xs text-destructive mt-1">{errors.kubernetesVersion}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Advanced Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Configuration</CardTitle>
                <CardDescription>
                  Configure advanced cluster networking and API server settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* API Server Endpoint */}
                <div>
                  <Label className="block mb-2 font-medium">API Server Endpoint</Label>
                  <RadioGroup
                    value={configuration.apiServerEndpoint?.type || "public"}
                    onValueChange={(value) => handleAPIServerEndpointChange(value as "public")}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public" className="font-normal">
                        Public - Cluster API server will be accessible from the internet
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Pod CIDR */}
                <div>
                  <Label htmlFor="pod-cidr" className="block mb-2 font-medium">
                    Pod CIDR
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="inline w-4 h-4 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>CIDR block for pod IP addresses. Must not overlap with VPC or service CIDR.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="pod-cidr"
                    value={configuration.podCIDR || ""}
                    onChange={(e) => handlePodCIDRChange(e.target.value)}
                    placeholder="10.244.0.0/16"
                    className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      configuration.podCIDR && !isValidCIDR(configuration.podCIDR) ? "border-red-300 bg-red-50" : ""
                    }`}
                  />
                  {configuration.podCIDR && !isValidCIDR(configuration.podCIDR) && (
                    <p className="text-xs text-destructive mt-1">Please enter a valid CIDR block</p>
                  )}
                </div>

                {/* Service CIDR */}
                <div>
                  <Label htmlFor="service-cidr" className="block mb-2 font-medium">
                    Service CIDR
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="inline w-4 h-4 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>CIDR block for service IP addresses. Must not overlap with VPC or pod CIDR.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="service-cidr"
                    value={configuration.serviceCIDR || ""}
                    onChange={(e) => handleServiceCIDRChange(e.target.value)}
                    placeholder="10.96.0.0/12"
                    className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      configuration.serviceCIDR && !isValidCIDR(configuration.serviceCIDR) ? "border-red-300 bg-red-50" : ""
                    }`}
                  />
                  {configuration.serviceCIDR && !isValidCIDR(configuration.serviceCIDR) && (
                    <p className="text-xs text-destructive mt-1">Please enter a valid CIDR block</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Cost Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Region:</span>
                      <span className="text-sm font-medium">
                        {configuration.region ? 
                          availableRegions.find(r => r.id === configuration.region)?.displayName || configuration.region 
                          : "Not selected"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">VPC:</span>
                      <span className="text-sm font-medium">
                        {configuration.vpcId ? 
                          availableVPCs.find(v => v.id === configuration.vpcId)?.name || configuration.vpcId 
                          : "Not selected"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Subnet:</span>
                      <span className="text-sm font-medium">
                        {configuration.subnetId ? 
                          availableSubnets.find(s => s.id === configuration.subnetId)?.name || configuration.subnetId 
                          : "Not selected"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Kubernetes:</span>
                      <span className="text-sm font-medium">
                        {configuration.kubernetesVersion ? `v${configuration.kubernetesVersion}` : "Not selected"}
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Estimated Costs</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cluster (hourly):</span>
                        <span className="text-sm font-medium">${costs.cluster.hourly.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cluster (monthly):</span>
                        <span className="text-sm font-medium">${costs.cluster.monthly.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-medium">
                        <span className="text-sm">Total (monthly):</span>
                        <span className="text-sm">${costs.total.monthly.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={() => router.push('/kubernetes')}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={!isFormValid()}
            className="bg-black hover:bg-black/90"
          >
            Continue to Node Pools & Add-ons
          </Button>
        </div>
      </div>

      {/* Create VPC Modal */}
      <CreateVPCModal
        open={showCreateVPCModal}
        onClose={() => setShowCreateVPCModal(false)}
        onSuccess={(vpcId) => {
          setShowCreateVPCModal(false)
          handleVPCChange(vpcId)
        }}
        preselectedRegion={configuration.region}
      />
    </PageLayout>
  )
}

// VPC Selector Component
function VPCSelectorInline({ value, region, availableVPCs, onChange, error }: {
  value: string
  region: string
  availableVPCs: any[]
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <div className="space-y-3">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${error ? "border-red-300 bg-red-50" : ""}`}>
          <SelectValue placeholder="Select a VPC" />
        </SelectTrigger>
        <SelectContent>
          {availableVPCs.map((vpc) => (
            <SelectItem key={vpc.id} value={vpc.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{vpc.name}</span>
                  <Badge 
                    variant={vpc.status === 'active' ? 'secondary' : 'outline'}
                    className={vpc.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {vpc.status}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground ml-2">{vpc.cidr}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      
      <div className="text-sm text-muted-foreground">
        Don't have a VPC?{" "}
        <Link href="/networking/vpc/create" className="text-primary hover:underline font-medium">
          Create a new VPC →
        </Link>
      </div>
    </div>

  )
}

// Combined Node Pools and Add-ons View Component
function NodePoolsAndAddonsView({ 
  onBack, 
  onContinue,
  clusterCost,
  clusterCreationStarted
}: { 
  onBack: () => void
  onContinue: () => void
  clusterCost: { hourly: number; monthly: number }
  clusterCreationStarted: boolean
}) {
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
  const [yamlPreviewOpen, setYamlPreviewOpen] = useState(false)
  const [highlightedStorage, setHighlightedStorage] = useState<string | null>(null)

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
    { size: 50, label: "50GB", isDefault: false },
    { size: 100, label: "100GB", isDefault: false },
    { size: 200, label: "200GB", isDefault: true },
    { size: 500, label: "500GB", isDefault: false },
    { size: 1024, label: "1TB", isDefault: false }
  ]

  const storageNotches = [
    { value: 50, label: "50GB" },
    { value: 100, label: "100GB" },
    { value: 200, label: "200GB" },
    { value: 500, label: "500GB" },
    { value: 1024, label: "1TB" }
  ]

  // Add a new node pool
  const addNodePool = () => {
    const newPool: NodePool = {
      id: `node-pool-${nextPoolId}`,
      name: `node-pool-${nextPoolId}`,
      instanceFlavor: "cpu-2x-8gb",
      storageSize: 50,
      subnetId: "",
      securityGroupId: undefined,
      desiredNodes: 1,
      minNodes: 1,
      maxNodes: 3,
      taints: [{ key: "", value: "", effect: "NoSchedule" }],
      labels: [{ key: "", value: "" }],
      tags: [{ key: "", value: "" }]
    }
    setNodePools([...nodePools, newPool])
    setNextPoolId(nextPoolId + 1)
  }

  // Remove a node pool (can't remove default pool)
  const removeNodePool = (poolId: string) => {
    setNodePools(nodePools.filter(pool => pool.id !== poolId))
  }

  // Update a node pool
  const updateNodePool = (poolId: string, updates: Partial<NodePool>) => {
    setNodePools(nodePools.map(pool => 
      pool.id === poolId ? { ...pool, ...updates } : pool
    ))
  }

  // Add empty taint/label/tag
  const addEmptyField = (poolId: string, type: 'taints' | 'labels' | 'tags') => {
    const emptyField = type === 'taints' 
      ? { key: "", value: "", effect: "NoSchedule" }
      : { key: "", value: "" }
    
    updateNodePool(poolId, {
      [type]: [...(nodePools.find(p => p.id === poolId)?.[type] || []), emptyField]
    })
  }

  // Remove taint/label/tag
  const removeField = (poolId: string, type: 'taints' | 'labels' | 'tags', index: number) => {
    const pool = nodePools.find(p => p.id === poolId)
    if (!pool) return
    
    const updatedFields = pool[type].filter((_, i) => i !== index)
    updateNodePool(poolId, { [type]: updatedFields })
  }

  // Update taint/label/tag
  const updateField = (poolId: string, type: 'taints' | 'labels' | 'tags', index: number, field: string, value: string) => {
    const pool = nodePools.find(p => p.id === poolId)
    if (!pool) return
    
    const updatedFields = pool[type].map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    updateNodePool(poolId, { [type]: updatedFields })
  }

  // Calculate total costs
  const calculateTotalCosts = () => {
    let totalHourly = clusterCost.hourly
    let totalMonthly = clusterCost.monthly

    nodePools.forEach(pool => {
      const flavor = instanceFlavors.find(f => f.id === pool.instanceFlavor)
      if (flavor) {
        const poolHourly = flavor.pricePerHour * pool.desiredNodes
        const poolMonthly = poolHourly * 24 * 30
        totalHourly += poolHourly
        totalMonthly += poolMonthly
      }
    })

    return { hourly: totalHourly, monthly: totalMonthly }
  }

  const totalCosts = calculateTotalCosts()

  // Validation
  const isValid = () => {
    return nodePools.every(pool => 
      pool.name.trim() !== "" &&
      pool.instanceFlavor !== "" &&
      pool.subnetId !== "" &&
      pool.desiredNodes >= pool.minNodes &&
      pool.desiredNodes <= pool.maxNodes
    )
  }

  // Generate YAML preview
  const generateYAMLPreview = () => {
    const yamlContent = `apiVersion: v1
kind: Namespace
metadata:
  name: default-namespace
---
${nodePools.map(pool => `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${pool.name}
  namespace: default-namespace
spec:
  replicas: ${pool.desiredNodes}
  selector:
    matchLabels:
      app: ${pool.name}
  template:
    metadata:
      labels:
        app: ${pool.name}
${pool.labels.filter(l => l.key && l.value).map(label => `        ${label.key}: "${label.value}"`).join('\n')}
    spec:
      containers:
      - name: app
        image: nginx:latest
        resources:
          requests:
            memory: "${instanceFlavors.find(f => f.id === pool.instanceFlavor)?.ram}Gi"
            cpu: "${instanceFlavors.find(f => f.id === pool.instanceFlavor)?.vcpus}"
      nodeSelector:
        kubernetes.io/arch: amd64
${pool.taints.filter(t => t.key && t.value).map(taint => `      tolerations:
      - key: "${taint.key}"
        value: "${taint.value}"
        effect: "${taint.effect}"`).join('\n')}
---`).join('\n')}`

    return yamlContent
  }

  return (
    <PageLayout
      title="Create Cluster"
      description="Configure node pools and add-ons for your Kubernetes cluster"
    >
      <div className="max-w-7xl mx-auto">
        <StepIndicator currentStep="nodePoolsAndAddons" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Node Pools Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Node Pools</CardTitle>
                  <CardDescription>
                    Configure the compute resources for your cluster
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addNodePool}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pool
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {nodePools.map((pool, poolIndex) => {
                  const flavor = instanceFlavors.find(f => f.id === pool.instanceFlavor)
                  const poolCost = flavor ? flavor.pricePerHour * pool.desiredNodes : 0

                  return (
                    <div key={pool.id} className="p-6 border rounded-lg space-y-6 relative">
                      {/* Pool Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Server className="w-5 h-5 text-muted-foreground" />
                            <h3 className="font-medium">{pool.name}</h3>
                            {pool.isDefault && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            ${poolCost.toFixed(2)}/hr
                          </span>
                          {!pool.isDefault && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeNodePool(pool.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pool Name */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Pool Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            value={pool.name}
                            onChange={(e) => updateNodePool(pool.id, { name: e.target.value })}
                            placeholder="Enter pool name"
                            className={!pool.name.trim() ? 'border-red-300 bg-red-50' : ''}
                          />
                          {!pool.name.trim() && (
                            <p className="text-xs text-destructive mt-1">Pool name is required</p>
                          )}
                        </div>

                        {/* Instance Flavor */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Instance Flavor <span className="text-destructive">*</span>
                          </Label>
                          <Select 
                            value={pool.instanceFlavor} 
                            onValueChange={(value) => updateNodePool(pool.id, { instanceFlavor: value })}
                          >
                            <SelectTrigger className={!pool.instanceFlavor ? 'border-red-300 bg-red-50' : ''}>
                              <SelectValue placeholder="Select instance type" />
                            </SelectTrigger>
                            <SelectContent>
                              {instanceFlavors.map((flavor) => (
                                <SelectItem key={flavor.id} value={flavor.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{flavor.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {flavor.vcpus} vCPUs, {flavor.ram}GB RAM
                                      </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-4">
                                      ${flavor.pricePerHour}/hr
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {!pool.instanceFlavor && (
                            <p className="text-xs text-destructive mt-1">Please select an instance flavor</p>
                          )}
                        </div>

                        {/* Storage Size */}
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium mb-2 block">
                            Storage Size: {pool.storageSize}GB
                          </Label>
                          <div className="space-y-4">
                            <Slider
                              value={[pool.storageSize]}
                              onValueChange={(value) => {
                                updateNodePool(pool.id, { storageSize: value[0] })
                                setHighlightedStorage(pool.id)
                                setTimeout(() => setHighlightedStorage(null), 200)
                              }}
                              max={1024}
                              min={50}
                              step={50}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              {storageNotches.map((notch) => (
                                <span key={notch.value}>{notch.label}</span>
                              ))}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {storagePresets.map((preset) => (
                                <Button
                                  key={preset.size}
                                  variant={pool.storageSize === preset.size ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => updateNodePool(pool.id, { storageSize: preset.size })}
                                  className={`text-xs ${
                                    highlightedStorage === pool.id && pool.storageSize === preset.size 
                                      ? 'animate-pulse bg-primary' 
                                      : ''
                                  }`}
                                >
                                  {preset.label}
                                  {preset.isDefault && <span className="ml-1 text-xs">(Default)</span>}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Subnet */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
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
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{subnet.name}</span>
                                      <Badge 
                                        variant="secondary" 
                                        className={`text-xs ${
                                          subnet.type === "Public" 
                                            ? "bg-blue-100 text-blue-800" 
                                            : "bg-orange-100 text-orange-800"
                                        }`}
                                      >
                                        {subnet.type}
                                      </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {subnet.cidr}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {!pool.subnetId && (
                            <p className="text-xs text-destructive">Please select a subnet</p>
                          )}
                        </div>

                        {/* Security Group */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Security Group</Label>
                          <Select 
                            value={pool.securityGroupId || ""} 
                            onValueChange={(value) => updateNodePool(pool.id, { securityGroupId: value || undefined })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select security group (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockSecurityGroups.map((sg) => (
                                <SelectItem key={sg.id} value={sg.id}>
                                  <div>
                                    <div className="font-medium">{sg.name}</div>
                                    <div className="text-xs text-muted-foreground">{sg.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Node Count Configuration */}
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium mb-2 block">Node Count Configuration</Label>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">Min Nodes</Label>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                value={pool.minNodes}
                                onChange={(e) => updateNodePool(pool.id, { minNodes: parseInt(e.target.value) || 1 })}
                                className="text-center"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">Desired Nodes</Label>
                              <Input
                                type="number"
                                min={pool.minNodes}
                                max={pool.maxNodes}
                                value={pool.desiredNodes}
                                onChange={(e) => updateNodePool(pool.id, { desiredNodes: parseInt(e.target.value) || 1 })}
                                className={`text-center ${
                                  pool.desiredNodes < pool.minNodes || pool.desiredNodes > pool.maxNodes 
                                    ? 'border-red-300 bg-red-50' 
                                    : ''
                                }`}
                              />
                              {(pool.desiredNodes < pool.minNodes || pool.desiredNodes > pool.maxNodes) && (
                                <p className="text-xs text-destructive mt-1">
                                  Must be between {pool.minNodes} and {pool.maxNodes}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block">Max Nodes</Label>
                              <Input
                                type="number"
                                min={pool.minNodes}
                                max="100"
                                value={pool.maxNodes}
                                onChange={(e) => updateNodePool(pool.id, { maxNodes: parseInt(e.target.value) || 1 })}
                                className="text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Configuration - Collapsible */}
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                          <ChevronRight className="w-4 h-4 transform transition-transform group-data-[state=open]:rotate-90" />
                          Advanced Configuration (Taints, Labels, Tags)
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4 space-y-6">
                          {/* Taints */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Taints</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addEmptyField(pool.id, 'taints')}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Taint
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {pool.taints.map((taint, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                  <Input
                                    placeholder="Key"
                                    value={taint.key}
                                    onChange={(e) => updateField(pool.id, 'taints', index, 'key', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Input
                                    placeholder="Value"
                                    value={taint.value}
                                    onChange={(e) => updateField(pool.id, 'taints', index, 'value', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Select
                                    value={taint.effect}
                                    onValueChange={(value) => updateField(pool.id, 'taints', index, 'effect', value)}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="NoSchedule">NoSchedule</SelectItem>
                                      <SelectItem value="PreferNoSchedule">PreferNoSchedule</SelectItem>
                                      <SelectItem value="NoExecute">NoExecute</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeField(pool.id, 'taints', index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Labels */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Labels</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addEmptyField(pool.id, 'labels')}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Label
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {pool.labels.map((label, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                  <Input
                                    placeholder="Key"
                                    value={label.key}
                                    onChange={(e) => updateField(pool.id, 'labels', index, 'key', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Input
                                    placeholder="Value"
                                    value={label.value}
                                    onChange={(e) => updateField(pool.id, 'labels', index, 'value', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeField(pool.id, 'labels', index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tags */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Tags</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addEmptyField(pool.id, 'tags')}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Tag
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {pool.tags.map((tag, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                  <Input
                                    placeholder="Key"
                                    value={tag.key}
                                    onChange={(e) => updateField(pool.id, 'tags', index, 'key', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Input
                                    placeholder="Value"
                                    value={tag.value}
                                    onChange={(e) => updateField(pool.id, 'tags', index, 'value', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeField(pool.id, 'tags', index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Add-ons Section */}
            <Card>
              <CardHeader>
                <CardTitle>Add-ons</CardTitle>
                <CardDescription>
                  Essential add-ons for your Kubernetes cluster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {defaultAddons.map((addon) => (
                    <div key={addon.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        id={addon.id}
                        checked={addon.enabled}
                        onCheckedChange={(checked) => {
                          setDefaultAddons(defaultAddons.map(a => 
                            a.id === addon.id ? { ...a, enabled: !!checked } : a
                          ))
                        }}
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-1">
                        <Label htmlFor={addon.id} className="text-sm font-medium leading-none cursor-pointer">
                          {addon.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {addon.description}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {addon.version}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Node Pool Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Node Pool Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nodePools.map((pool) => {
                    const flavor = instanceFlavors.find(f => f.id === pool.instanceFlavor)
                    const poolCost = flavor ? flavor.pricePerHour * pool.desiredNodes : 0
                    
                    return (
                      <div key={pool.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{pool.name}</span>
                          {pool.isDefault && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Instance: {flavor?.name || 'Not selected'}</div>
                          <div>Nodes: {pool.desiredNodes} ({pool.minNodes}-{pool.maxNodes})</div>
                          <div>Storage: {pool.storageSize}GB</div>
                          <div className="font-medium text-foreground">Cost: ${poolCost.toFixed(2)}/hr</div>
                        </div>
                        {pool !== nodePools[nodePools.length - 1] && <Separator />}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Cost Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cluster:</span>
                      <span>${clusterCost.hourly.toFixed(2)}/hr</span>
                    </div>
                    {nodePools.map((pool) => {
                      const flavor = instanceFlavors.find(f => f.id === pool.instanceFlavor)
                      const poolCost = flavor ? flavor.pricePerHour * pool.desiredNodes : 0
                      
                      return (
                        <div key={pool.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{pool.name}:</span>
                          <span>${poolCost.toFixed(2)}/hr</span>
                        </div>
                      )
                    })}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Total (hourly):</span>
                      <span>${totalCosts.hourly.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total (monthly):</span>
                      <span>${totalCosts.monthly.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* YAML Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setYamlPreviewOpen(!yamlPreviewOpen)}
                    className="w-full"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {yamlPreviewOpen ? 'Hide' : 'Show'} YAML Preview
                  </Button>
                  
                  {yamlPreviewOpen && (
                    <div className="mt-4">
                      <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-48">
                        {generateYAMLPreview()}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" onClick={onBack}>
            Back to Configuration
          </Button>
          
          <Button 
            onClick={onContinue}
            disabled={!isValid() || clusterCreationStarted}
            className="bg-black hover:bg-black/90"
          >
            {clusterCreationStarted ? "Creating Cluster..." : "Start Cluster Creation"}
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
