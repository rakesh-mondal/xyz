"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, AlertCircle, Info, AlertTriangle } from "lucide-react"
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
import { NodePoolsAndAddonsView } from "./components/node-pools-addons-view"

// Mock security groups data
const mockSecurityGroups = [
  { id: "sg-default", name: "default", description: "Default security group" },
  { id: "sg-web", name: "web-servers", description: "Security group for web servers" },
  { id: "sg-db", name: "database", description: "Security group for database servers" },
  { id: "sg-app", name: "application", description: "Security group for application servers" },
  { id: "sg-cache", name: "cache-servers", description: "Security group for cache servers" }
]

// Step Indicator Component
function StepIndicator({ currentStep }: { currentStep: "configuration" | "nodePoolsAndAddons" }) {
  const steps = [
    { key: "configuration", title: "Configuration", description: "Basic cluster settings" },
    { key: "nodePoolsAndAddons", title: "Node Pools & Add-ons", description: "Configure compute and extensions" }
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10" />
        <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key
          const isCompleted = steps.findIndex(s => s.key === currentStep) > index
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white ${
                isActive ? 'border-primary text-primary' : 
                isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                'border-gray-300 text-gray-400'
              }`}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <div className="ml-3">
                <div className={`text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
          )
        })}
        </div>
      </div>
    </div>
  )
}

export default function CreateClusterPage() {
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
    if (!clusterCreationStarted || step !== "nodePoolsAndAddons") {
      return
    }

    // Navigation interception - intercept sidebar navigation attempts
    const handleNavigationClick = (e: Event) => {
      const target = e.target as HTMLElement
      
      // Skip if it's within a modal or dialog
      if (target.closest('[role="dialog"]') || target.closest('.modal')) {
        return
      }
      
      // Check if it's a navigation link
      const link = target.closest('a[href]') as HTMLAnchorElement
      if (link && link.href && !link.href.includes('#') && !link.href.includes('javascript:')) {
        const url = new URL(link.href)
        
        // Skip external links
        if (url.origin !== window.location.origin) {
          return
        }
        
        // Skip if it's the current page or related pages
        if (url.pathname.includes('/kubernetes/clusters/create')) {
          return
        }
        
        e.preventDefault()
        e.stopPropagation()
        
        // Store the intended navigation
        setPendingNavigation(url.pathname)
        setShowNavigationGuard(true)
        
        return false
      }
    }

    // Add event listeners
    document.addEventListener('click', handleNavigationClick, true)
    
    return () => {
      document.removeEventListener('click', handleNavigationClick, true)
    }
  }, [clusterCreationStarted, step])

  // Update costs when configuration changes
  useEffect(() => {
    setCosts(calculateCosts(configuration))
  }, [configuration])

  // Get available VPCs for selected region
  const availableVPCs = configuration.region 
    ? mockVPCs.filter(vpc => vpc.region === configuration.region)
    : []

  // Get available subnets for selected VPC
  const availableSubnets = configuration.vpcId 
    ? mockSubnets.filter(subnet => subnet.vpcId === configuration.vpcId)
    : []

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

  // Check if form is valid
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
      subnetId
    }))
  }

  // Handle API endpoint type change
  const handleAPIEndpointChange = (type: APIServerEndpoint["type"]) => {
    setConfiguration(prev => ({
      ...prev,
      apiServerEndpoint: {
        type
      }
    }))
  }

  // Handle form submission and start cluster creation
  const handleReviewConfiguration = () => {
    if (validateForm()) {
      // Start cluster creation
      setClusterCreationStarted(true)
      console.log("Starting cluster creation with configuration:", configuration)
      
      // Move to next step
      setStep("nodePoolsAndAddons")
    }
  }

  // Handle cluster completion
  const handleCompleteCluster = () => {
    // Finalize cluster setup with node pools and add-ons
    console.log("Completing cluster setup with node pools and add-ons")
    
    // Show success toast message
    toast({
      title: "Cluster Created Successfully! 🎉",
      description: "Your Kubernetes cluster has been created and is being provisioned. You can monitor its status from the dashboard."
    })
    
    // Redirect back to Kubernetes dashboard
    router.push("/kubernetes")
  }

  // Handle cluster deletion from navigation guard
  const handleDeleteCluster = async () => {
    setIsDeleting(true)
    
    // Simulate cluster deletion
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast({
      title: "Cluster Creation Cancelled",
      description: "The cluster creation has been cancelled and resources have been cleaned up."
    })
    
    // Navigate to the pending destination or dashboard
    if (pendingNavigation) {
      router.push(pendingNavigation)
    } else {
      router.push("/kubernetes")
    }
    
    setIsDeleting(false)
    setShowNavigationGuard(false)
    setPendingNavigation(null)
  }

  // Handle continuing with cluster creation
  const handleContinueCreation = () => {
    setShowNavigationGuard(false)
    setPendingNavigation(null)
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
  if (step === "nodePoolsAndAddons") {
    return (
      <>
        <NodePoolsAndAddonsView 
          onBack={() => setStep("configuration")}
          onContinue={handleCompleteCluster}
          clusterCost={costs.cluster}
          clusterCreationStarted={clusterCreationStarted}
        />
        
        {/* Navigation Guard Modal */}
        <Dialog open={showNavigationGuard} onOpenChange={setShowNavigationGuard}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cluster creation in progress</DialogTitle>
              <DialogDescription>
                Your cluster is being created. Do you want to cancel the creation and navigate away?
              </DialogDescription>
            </DialogHeader>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your cluster is being created in the background. Once the cluster is ready, billing will begin and continue until you delete it from the dashboard.
              </AlertDescription>
            </Alert>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleContinueCreation}>
                Continue Creation
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteCluster}
                disabled={isDeleting}
              >
                {isDeleting ? "Cancelling..." : "Cancel & Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Main configuration view
  return (
    <PageLayout
      title="Create Kubernetes Cluster"
      description="Configure and deploy a new Kubernetes cluster with enterprise-grade reliability"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Configuration Form */}
        <div className="flex-1 space-y-6">
          <StepIndicator currentStep="configuration" />

          {/* Basic Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Configuration</CardTitle>
              <CardDescription>
                Configure the basic settings for your Kubernetes cluster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Region Selection */}
              <div className="mb-8">
                <div className="mb-5">
                  <Label className="block mb-2 font-medium">
                    Region <span className="text-destructive">*</span>
                  </Label>
                  <Select value={configuration.region} onValueChange={handleRegionChange}>
                    <SelectTrigger className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.region ? "border-red-300 bg-red-50" : ""}`}>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRegions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium">{region.displayName}</div>
                              <div className="text-sm text-muted-foreground">{region.name}</div>
                            </div>
                            {!region.isAvailable && (
                              <Badge variant="outline" className="text-xs">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && (
                    <p className="text-sm text-red-600 mt-1">{errors.region}</p>
                  )}
                </div>
              </div>

              {/* VPC Selection */}
              <div className="mb-8">
                <div className="mb-5">
                  <Label className="block mb-2 font-medium">
                    VPC <span className="text-destructive">*</span>
                  </Label>
                  <VPCSelectorInline
                    value={configuration.vpcId || ""}
                    region={configuration.region || ""}
                    availableVPCs={availableVPCs}
                    onChange={(value) => {
                      if (value === "__create_new__") {
                        setShowCreateVPCModal(true)
                      } else {
                        handleVPCChange(value)
                      }
                    }}
                    error={errors.vpcId}
                  />
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
                    <div className="text-muted-foreground">
                      Pick a VPC to see available subnets
                    </div>
                  )}
                  {errors.subnets && (
                    <p className="text-sm text-red-600 mt-1">{errors.subnets}</p>
                  )}
                </div>
              </div>

              {/* Kubernetes Version Selection */}
              <div className="mb-8">
                <div className="mb-5">
                  <Label className="block mb-2 font-medium">
                    Kubernetes Version <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={configuration.kubernetesVersion}
                    onValueChange={(value) => setConfiguration(prev => ({ ...prev, kubernetesVersion: value }))}
                  >
                    <SelectTrigger className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.kubernetesVersion ? "border-red-300 bg-red-50" : ""}`}>
                      <SelectValue placeholder="Select a version" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableKubernetesVersions.map((version) => (
                        <SelectItem key={version.version} value={version.version}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">v{version.version}</span>
                              {version.isRecommended && (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                  Recommended
                                </Badge>
                              )}
                              {version.isLatest && (
                                <Badge variant="outline" className="text-xs">
                                  Latest
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              EOL: {version.eolDate}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.kubernetesVersion && (
                    <p className="text-sm text-red-600 mt-1">{errors.kubernetesVersion}</p>
                  )}
                </div>
              </div>

              {/* API Server Endpoint */}
              <div className="mb-8">
                <div className="mb-5">
                  <Label className="block mb-2 font-medium">
                    API Server Endpoint
                  </Label>
                  <RadioGroup 
                    value={configuration.apiServerEndpoint?.type || "public"} 
                    onValueChange={handleAPIEndpointChange}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public" className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">Public endpoint</div>
                          <div className="text-sm text-muted-foreground">
                            API server will be accessible from the internet
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Advanced Network Configuration */}
              <div className="mb-8">
                <div className="mb-5">
                  <Label className="block mb-2 font-medium">
                    Advanced Network Configuration
                  </Label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="block mb-2 text-sm">Pod CIDR</Label>
                        <Input
                          value={configuration.podCIDR}
                          onChange={(e) => setConfiguration(prev => ({ ...prev, podCIDR: e.target.value }))}
                          placeholder="10.244.0.0/16"
                          className={!isValidCIDR(configuration.podCIDR || "") ? "border-red-300 bg-red-50" : ""}
                        />
                      </div>
                      <div>
                        <Label className="block mb-2 text-sm">Service CIDR</Label>
                        <Input
                          value={configuration.serviceCIDR}
                          onChange={(e) => setConfiguration(prev => ({ ...prev, serviceCIDR: e.target.value }))}
                          placeholder="10.96.0.0/12"
                          className={!isValidCIDR(configuration.serviceCIDR || "") ? "border-red-300 bg-red-50" : ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button variant="outline" onClick={() => router.push("/kubernetes")}>
                  Cancel
                </Button>
                <Button onClick={handleReviewConfiguration} disabled={!isFormValid()}>
                  Continue to Node Pools
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Cost Summary */}
        <div className="w-full md:w-80">
          <Card>
            <CardHeader>
              <CardTitle>Estimated Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Cluster</span>
                  <span>₹{costs.cluster.hourly.toFixed(2)}/hr</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{costs.cluster.hourly.toFixed(2)}/hr</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ ₹{costs.cluster.monthly.toFixed(2)}/month
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create VPC Modal */}
      <CreateVPCModal
        open={showCreateVPCModal}
        onClose={() => setShowCreateVPCModal(false)}
        onSuccess={(vpcId: string) => {
          handleVPCChange(vpcId)
          setShowCreateVPCModal(false)
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
  if (!region) {
    return (
      <div className="text-muted-foreground">
        Select a region first to see available VPCs
      </div>
    )
  }

  if (availableVPCs.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No VPCs found in this region.{" "}
          <button 
            onClick={() => onChange("__create_new__")}
            className="text-primary hover:underline font-medium"
          >
            Create a new VPC →
          </button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${error ? "border-red-300 bg-red-50" : ""}`}>
          <SelectValue placeholder="Select a VPC" />
        </SelectTrigger>
        <SelectContent>
          {availableVPCs.map((vpc) => (
            <SelectItem key={vpc.id} value={vpc.id}>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium">{vpc.name}</div>
                  <div className="text-sm text-muted-foreground">{vpc.cidr}</div>
                </div>
                <Badge 
                  variant={vpc.status === "active" ? "default" : "secondary"} 
                  className="ml-2 text-xs"
                >
                  {vpc.status}
                </Badge>
              </div>
            </SelectItem>
          ))}
          <SelectItem value="__create_new__" className="text-primary font-medium">
            <ExternalLink className="h-4 w-4 mr-2 inline" />
            Create new VPC
          </SelectItem>
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}
