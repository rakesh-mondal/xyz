"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { HelpCircle, Plus, Trash2, Info } from "lucide-react"
import { BasicSection } from "./sections/basic-section"
import { CreateVPCModal } from "@/components/modals/vm-creation-modals"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PolicyRulesSection } from "./sections/policy-rules-section"
import { PoolSection } from "./sections/pool-section"
import { vpcs } from "@/lib/data"

import type { LoadBalancerConfiguration } from "../page"

export interface ALBFormData {
  // Basics
  name: string
  description: string
  loadBalancerType: string
  region: string
  vpc: string
  subnet: string
  
  // Performance Tier
  performanceTier: string
  standardConfig: string
  ipAddressType: string
  
  // Listeners with nested Policy & Rules and Pools
  listeners: Array<{
    id: string
    name: string
    protocol: string
    port: number
    certificate: string
    
    // Nested Policy & Rules for this listener
    policies: Array<{
      id: string
      name: string
      action: string
    }>
    rules: Array<{
      id: string
      ruleType: string
      comparator: string
      value: string
      key?: string
    }>
    
    // Nested Pools for this listener
    pools: Array<{
      id: string
      name: string
      protocol: string
      algorithm: string
      targetGroup: string
    }>
  }>
}

interface ALBCreateFormProps {
  config: LoadBalancerConfiguration
  onBack: () => void
  onCancel: () => void
  isEditMode?: boolean
  editData?: any
  customBreadcrumbs?: Array<{ href: string; title: string }>
}

const getLoadBalancerTypeName = (config: LoadBalancerConfiguration) => {
  return config.loadBalancerType === "ALB" ? "Application Load Balancer" : "Network Load Balancer"
}

// Helper component for individual listener configuration
interface ListenerCardProps {
  listener: ALBFormData['listeners'][0]
  updateListener: (listenerId: string, field: string, value: any) => void
  isEditMode?: boolean
}

function ListenerCard({ listener, updateListener, isEditMode = false }: ListenerCardProps) {
  const protocolOptions = [
    { value: "HTTP", label: "HTTP", defaultPort: 80 },
    { value: "HTTPS", label: "HTTPS", defaultPort: 443 },
    { value: "TERMINATED_HTTPS", label: "TERMINATED_HTTPS", defaultPort: 443 },
    { value: "TCP", label: "TCP", defaultPort: 80 },
    { value: "UDP", label: "UDP", defaultPort: 80 }
  ]

  const certificateOptions = [
    { value: "cert-1", label: "wildcard.example.com (*.example.com)" },
    { value: "cert-2", label: "api.example.com" },
    { value: "cert-3", label: "app.example.com" },
    { value: "cert-4", label: "staging.example.com" }
  ]

  const updateListenerField = (field: string, value: string | number) => {
    if (field === "protocol") {
      const protocol = protocolOptions.find(p => p.value === value)
      if (protocol) {
        updateListener(listener.id, field, value)
        updateListener(listener.id, "port", protocol.defaultPort)
      }
    } else {
      updateListener(listener.id, field, value)
    }
  }

  const updatePoliciesAndRules = (section: string, data: any) => {
    // Handle the "policyRules" section which contains both policies and rules
    if (section === "policyRules") {
      if (data.policies) {
        updateListener(listener.id, "policies", data.policies)
      }
      if (data.rules) {
        updateListener(listener.id, "rules", data.rules)
      }
    }
  }

  const updatePools = (section: string, data: any) => {
    // Handle the "pools" section
    if (section === "pools") {
      if (data.pools) {
        updateListener(listener.id, "pools", data.pools)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Listener Basic Configuration */}
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20">
          {/* Listener Name */}
          <div>
            <Label className="block mb-2 font-medium">
              Listener Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g., web-listener, api-listener"
              value={listener.name}
              onChange={(e) => updateListenerField("name", e.target.value)}
              className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          {/* Protocol */}
          <div>
            <Label className="block mb-2 font-medium">
              Protocol <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={listener.protocol} 
              onValueChange={(value) => updateListenerField("protocol", value)}
              disabled={isEditMode}
            >
              <SelectTrigger className={isEditMode ? 'bg-muted text-muted-foreground' : ''}>
                <SelectValue placeholder="Select protocol" />
              </SelectTrigger>
              <SelectContent>
                {protocolOptions.map((protocol) => (
                  <SelectItem key={protocol.value} value={protocol.value}>
                    {protocol.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Port */}
          <div>
            <Label className="block mb-2 font-medium">
              Port <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              min="1"
              max="65535"
              placeholder="80"
              value={listener.port}
              onChange={(e) => updateListenerField("port", parseInt(e.target.value) || 80)}
              className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${isEditMode ? 'bg-muted text-muted-foreground' : ''}`}
              disabled={isEditMode}
            />
            {!isEditMode && (
              <p className="text-xs text-muted-foreground mt-1">
                Port auto-fills based on protocol selection
              </p>
            )}
          </div>

          {/* Certificate */}
          {(listener.protocol === "HTTPS" || listener.protocol === "TERMINATED_HTTPS") && (
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Label className="font-medium">
                  SSL Certificate <span className="text-destructive">*</span>
                </Label>
                <TooltipWrapper 
                  content="Select an SSL certificate for HTTPS listeners. The certificate must be valid and associated with your domain."
                  side="top"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                </TooltipWrapper>
              </div>
              <Select 
                value={listener.certificate} 
                onValueChange={(value) => updateListenerField("certificate", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SSL certificate" />
                </SelectTrigger>
                <SelectContent>
                  {certificateOptions.map((cert) => (
                    <SelectItem key={cert.value} value={cert.value}>
                      {cert.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Nested Policy & Rules Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Policy & Rules Configuration</h4>
        <div className="border rounded-lg p-4 bg-muted/10">
          <PolicyRulesSection
            formData={{
              ...{} as ALBFormData,
              policies: listener.policies,
              rules: listener.rules
            }}
            updateFormData={updatePoliciesAndRules}
            isSection={true}
          />
        </div>
      </div>

      {/* Nested Pool Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Pool Configuration</h4>
        <PoolSection
          formData={{
            ...{} as ALBFormData,
            pools: listener.pools
          }}
          updateFormData={updatePools}
          isSection={true}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  )
}

export function ALBCreateForm({ config, onBack, onCancel, isEditMode = false, editData, customBreadcrumbs }: ALBCreateFormProps) {
  const router = useRouter()
  const [showCreateVPCModal, setShowCreateVPCModal] = useState(false)
  const [showCreateSubnetModal, setShowCreateSubnetModal] = useState(false)
  const [formData, setFormData] = useState<ALBFormData>({
    name: isEditMode ? editData?.name || "" : "",
    description: isEditMode ? editData?.description || "" : "",
    loadBalancerType: getLoadBalancerTypeName(config),
    region: isEditMode ? editData?.region || "" : "",
    vpc: isEditMode ? editData?.vpc || "" : "",
    subnet: isEditMode ? editData?.subnet || "" : "",
    performanceTier: isEditMode ? editData?.performanceTier || "standard" : "standard",
    standardConfig: isEditMode ? editData?.standardConfig || "" : "",
    ipAddressType: isEditMode ? editData?.ipAddressType || "" : "",
    listeners: isEditMode ? editData?.listeners || [] : []
  })

  // Initialize with default listener (only in create mode)
  useEffect(() => {
    if (!isEditMode && formData.listeners.length === 0) {
      setFormData(prev => ({
        ...prev,
        listeners: [createNewListener()]
      }))
    }
  }, [isEditMode])

  const createNewListener = () => ({
    id: crypto.randomUUID(),
    name: "",
    protocol: "",
    port: 80,
    certificate: "",
    policies: [{
      id: crypto.randomUUID(),
      name: "",
      action: ""
    }],
    rules: [{
      id: crypto.randomUUID(),
      ruleType: "",
      comparator: "",
      value: "",
      key: ""
    }],
    pools: [{
      id: crypto.randomUUID(),
      name: "",
      protocol: "",
      algorithm: "",
      targetGroup: ""
    }]
  })

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }))
  }

  const addListener = () => {
    setFormData(prev => ({
      ...prev,
      listeners: [...prev.listeners, createNewListener()]
    }))
  }

  const removeListener = (listenerId: string) => {
    if (formData.listeners.length > 1) {
      setFormData(prev => ({
        ...prev,
        listeners: prev.listeners.filter(listener => listener.id !== listenerId)
      }))
    }
  }

  const updateListener = (listenerId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      listeners: prev.listeners.map(listener =>
        listener.id === listenerId ? { ...listener, [field]: value } : listener
      )
    }))
  }

  const handleVPCCreated = (vpcId: string) => {
    setFormData(prev => ({ ...prev, vpc: vpcId }))
    setShowCreateVPCModal(false)
  }

  const handleSubnetCreated = (subnetId: string) => {
    setFormData(prev => ({ ...prev, subnet: subnetId }))
    setShowCreateSubnetModal(false)
  }

  const handleReviewAndCreate = () => {
    if (isEditMode) {
      // Handle edit save
      console.log("Saving ALB changes:", formData)
      // In a real app, this would be an API call to update the load balancer
      
      // Navigate back to details page
      router.push(`/networking/load-balancing/balancer/${editData?.id}`)
    } else {
      // Navigate to summary page with form data
      router.push(`/networking/load-balancing/balancer/create/summary?config=${JSON.stringify(config)}&data=${JSON.stringify(formData)}`)
    }
  }

  const isFormValid = () => {
    const basicValid = formData.name?.trim().length > 0 && 
                      formData.region?.length > 0 && 
                      formData.vpc?.length > 0 &&
                      formData.subnet?.length > 0 &&
                      formData.performanceTier?.length > 0 &&
                      formData.standardConfig?.length > 0

    // At least one listener must have basic configuration
    const listenersValid = formData.listeners.some(listener => 
      listener.name?.trim().length > 0 && 
      listener.protocol?.length > 0 &&
      listener.port > 0
    )
    
    return basicValid && listenersValid
  }

  return (
    <PageLayout
      title={isEditMode ? `Edit ${editData?.name}` : "Create Application Load Balancer"}
      description={isEditMode ? "Modify your Application Load Balancer configuration" : "Configure your Application Load Balancer for content based HTTP/HTTPS routing"}
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={false}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardContent className="space-y-8 pt-6">
              {/* Required Section: Basics */}
              <div className="space-y-6">
                <BasicSection
                  formData={formData}
                  updateFormData={updateFormData}
                  isSection={true}
                  isEditMode={isEditMode}
                  onCreateVPC={() => setShowCreateVPCModal(true)}
                  onCreateSubnet={() => setShowCreateSubnetModal(true)}
                />
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600" style={{ fontSize: '13px' }}>
                      Configure multiple listeners below. Each listener can have its own Policy & Rules and Pool configurations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Listeners Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Listeners Configuration</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addListener}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Listener
                  </Button>
                </div>

                {/* Listeners Accordion */}
                <Accordion type="multiple" className="w-full space-y-4">
                  {formData.listeners.map((listener, index) => (
                    <AccordionItem 
                      key={listener.id} 
                      value={listener.id}
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span>
                            Listener {index + 1}
                            {listener.name && ` - ${listener.name}`}
                            {listener.protocol && ` (${listener.protocol}:${listener.port})`}
                          </span>
                          {formData.listeners.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeListener(listener.id)
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <ListenerCard 
                          listener={listener}
                          updateListener={updateListener}
                          isEditMode={isEditMode}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>

            {/* Submit Actions */}
            <div className="flex justify-end gap-4 px-6 pb-6">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-secondary transition-colors"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReviewAndCreate}
                disabled={!isFormValid()}
                className={`transition-colors ${
                  isFormValid() 
                    ? 'bg-black text-white hover:bg-black/90' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isEditMode ? "Save Changes" : "Review & Create"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Best Practices */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Best Practices</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground text-sm">Existence of a Target Group is mandatory for creation of LB.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground text-sm">A target group must consist of active VMs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground text-sm">You can have multiple listeners, mapped to 1 target group each.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground text-sm">Policy and rules are additional methods to route traffic, in application load balancers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground text-sm">Policies define actions to take when all associated rules evaluate to true. Rules define the specific conditions (e.g., URL path, headers) to match client requests.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Price Summary */}
          <div 
            style={{
              borderRadius: '16px',
              border: '4px solid #FFF',
              background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
              boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
              padding: '1.5rem'
            }}
          >
            <div className="pb-4">
              <h3 className="text-base font-semibold">Estimated Cost</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹1.20</span>
                <span className="text-sm text-muted-foreground">per hour</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Application Load Balancer with {config.infrastructureType === "SW" ? "software" : "hardware"} infrastructure.
              </p>
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>• ALB Setup: ₹1.20/hour</p>
                <p>• Estimated monthly: ₹876.00</p>
                <p>• Data processing charges apply</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create VPC Modal */}
      <CreateVPCModal
        open={showCreateVPCModal}
        onClose={() => setShowCreateVPCModal(false)}
        onSuccess={handleVPCCreated}
        preselectedRegion={formData.region || undefined}
      />

      {/* Create Subnet Modal */}
      <Dialog open={showCreateSubnetModal} onOpenChange={setShowCreateSubnetModal}>
        <DialogContent className="p-0 bg-white max-w-[70vw] max-h-[85vh] w-[70vw] h-[85vh] overflow-hidden flex flex-col">
          <CreateSubnetModalContent 
            vpcId={formData.vpc}
            onClose={() => setShowCreateSubnetModal(false)} 
            onSuccess={handleSubnetCreated}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}

// Create Subnet Modal Content Component
function CreateSubnetModalContent({ vpcId, onClose, onSuccess }: { 
  vpcId: string
  onClose: () => void 
  onSuccess: (subnetId: string) => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accessType: "public",
    cidr: "",
    gatewayIp: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, accessType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      console.log("Creating subnet:", { ...formData, vpcId })
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate created subnet ID
      const newSubnetId = `subnet-${Math.random().toString(36).substr(2, 9)}`
      
      toast({
        title: "Subnet Created",
        description: `Subnet "${formData.name}" has been created successfully!`
      })
      
      onSuccess(newSubnetId)
    } catch (error) {
      console.error("Error creating subnet:", error)
      toast({
        title: "Creation Failed",
        description: "Failed to create subnet. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedVPC = vpcs.find(vpc => vpc.id === vpcId)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b">
        <h2 className="text-2xl font-semibold">Create Subnet</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new subnet in {selectedVPC?.name}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 min-h-0 p-6">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2">
            <form id="subnet-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-5">
                <Label htmlFor="name" className="block mb-2 font-medium">
                  Subnet Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter subnet name"
                  value={formData.name}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only alphanumeric characters, hyphens, and underscores allowed.
                </p>
              </div>

              <div className="mb-5">
                <Label htmlFor="description" className="block mb-2 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter subnet description"
                  value={formData.description}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                />
              </div>

              <div className="mb-5">
                <Label className="block mb-2 font-medium">
                  Access Type <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-5 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      value="public"
                      id="modal-public"
                      checked={formData.accessType === "public"}
                      onChange={(e) => handleRadioChange(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <Label htmlFor="modal-public" className="ml-2">
                      Public
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      value="private"
                      id="modal-private"
                      checked={formData.accessType === "private"}
                      onChange={(e) => handleRadioChange(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <Label htmlFor="modal-private" className="ml-2">
                      Private
                    </Label>
                  </div>
                </div>

                {formData.accessType === "public" && (
                  <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-600" style={{ fontSize: '13px' }}>
                      Public subnets can be accessed through the internet. Resources in public subnets can have public IP addresses.
                    </p>
                  </div>
                )}

                {formData.accessType === "private" && (
                  <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-600" style={{ fontSize: '13px' }}>
                      Private subnets cannot be accessed through the internet. Resources in private subnets only have private IP addresses.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="cidr" className="font-medium">
                      CIDR <span className="text-destructive">*</span>
                    </Label>
                    <TooltipWrapper 
                      content="Specify the IP address range for this subnet using CIDR notation"
                      side="top"
                    >
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipWrapper>
                  </div>
                  <Input
                    id="cidr"
                    placeholder="e.g., 192.168.1.0/24"
                    value={formData.cidr}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="gatewayIp" className="font-medium">
                      Gateway IP <span className="text-destructive">*</span>
                    </Label>
                    <TooltipWrapper 
                      content="The gateway IP address for this subnet (usually the first IP in the range)"
                      side="top"
                    >
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipWrapper>
                  </div>
                  <Input
                    id="gatewayIp"
                    placeholder="e.g., 192.168.1.1"
                    value={formData.gatewayIp}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-6 border-t bg-gray-50">
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="subnet-form"
            className="bg-black text-white hover:bg-black/90 transition-colors" 
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Subnet"}
          </Button>
        </div>
      </div>
    </div>
  )
}
