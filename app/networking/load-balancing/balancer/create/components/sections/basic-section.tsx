"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { HelpCircle, ChevronDown, Search, Check } from "lucide-react"
import { vpcs, subnets } from "@/lib/data"
import type { ALBFormData } from "../alb-create-form"

interface BasicSectionProps {
  formData: ALBFormData
  updateFormData: (section: string, data: any) => void
  isSection?: boolean
  isEditMode?: boolean
  onCreateVPC?: () => void
  onCreateSubnet?: () => void
}

export function BasicSection({ formData, updateFormData, isSection = false, isEditMode = false, onCreateVPC, onCreateSubnet }: BasicSectionProps) {
  const [formTouched, setFormTouched] = useState(false)
  
  const updateField = (field: string, value: string) => {
    setFormTouched(true)
    updateFormData("basics", { [field]: value })
  }

  // Mock region availability data (from VPC create page pattern)
  const regionAvailability = {
    "us-east-1": {
      name: "US East (N. Virginia)",
      resources: [
        { type: "Load Balancers", availability: "high" },
        { type: "Target Groups", availability: "high" },
        { type: "SSL Certificates", availability: "high" },
        { type: "Health Checks", availability: "high" },
      ]
    },
    "us-west-2": {
      name: "US West (Oregon)",
      resources: [
        { type: "Load Balancers", availability: "medium" },
        { type: "Target Groups", availability: "high" },
        { type: "SSL Certificates", availability: "medium" },
        { type: "Health Checks", availability: "high" },
      ]
    },
    "eu-west-1": {
      name: "EU (Ireland)",
      resources: [
        { type: "Load Balancers", availability: "high" },
        { type: "Target Groups", availability: "high" },
        { type: "SSL Certificates", availability: "high" },
        { type: "Health Checks", availability: "medium" },
      ]
    },
    "ap-south-1": {
      name: "Asia Pacific (Mumbai)",
      resources: [
        { type: "Load Balancers", availability: "medium" },
        { type: "Target Groups", availability: "medium" },
        { type: "SSL Certificates", availability: "medium" },
        { type: "Health Checks", availability: "high" },
      ]
    }
  }

  const vpcOptions = [
    { value: "production-vpc", label: "production-vpc", subnets: ["subnet-prod-1", "subnet-prod-2", "subnet-prod-3"] },
    { value: "development-vpc", label: "development-vpc", subnets: ["subnet-dev-1", "subnet-dev-2"] },
    { value: "staging-vpc", label: "staging-vpc", subnets: ["subnet-staging-1", "subnet-staging-2"] }
  ]

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high": return "bg-green-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-gray-400"
      default: return "bg-gray-300"
    }
  }

  const getAvailabilityBars = (availability: string) => {
    const totalBars = 3
    const activeBars = availability === "high" ? 3 : availability === "medium" ? 2 : 1
    
    return Array.from({ length: totalBars }, (_, index) => (
      <div
        key={index}
        className={`h-1.5 w-6 rounded-sm ${
          index < activeBars ? getAvailabilityColor(availability) : "bg-gray-300"
        }`}
      />
    ))
  }

  const getSubnetsForVpc = (vpcValue: string) => {
    const vpc = vpcOptions.find(v => v.value === vpcValue)
    return vpc ? vpc.subnets : []
  }

  const handleChange = (field: string, value: string) => {
    setFormTouched(true)
    
    // Clear subnet if VPC changes
    if (field === "vpc") {
      updateFormData("basics", { [field]: value, subnet: "" })
    } else {
      updateFormData("basics", { [field]: value })
    }
  }

  const isPublicSubnet = (subnetId: string) => {
    const selectedVPCName = vpcs.find(vpc => vpc.id === formData.vpc)?.name
    const subnet = subnets.find(s => s.id === subnetId && s.vpcName === selectedVPCName)
    return subnet?.type === "Public"
  }

  const isFormValid = () => {
    return formData.name?.trim().length > 0 && 
           formData.region?.length > 0 && 
           formData.vpc?.length > 0 &&
           formData.subnet?.length > 0 &&
           formData.performanceTier?.length > 0 &&
           (!isPublicSubnet(formData.subnet) || formData.ipAddressType?.length > 0)
  }





  return (
    <div className="space-y-6">
        {/* Load Balancer Name */}
        <div>
          <Label htmlFor="name" className="block mb-2 font-medium">
            Load Balancer Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter load balancer name"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              formTouched && !formData.name?.trim() ? 'border-red-300 bg-red-50' : ''
            } ${isEditMode ? 'bg-muted text-muted-foreground' : ''}`}
            disabled={isEditMode}
            required
          />
          {!isEditMode && (
            <p className="text-xs text-muted-foreground mt-1">
              Only alphanumeric characters, hyphens, and underscores allowed.
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="block mb-2 font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter a description for this load balancer"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]"
          />
        </div>

        {/* Load Balancer Type (read-only) */}
        <div>
          <Label className="block mb-2 font-medium">
            Load Balancer Type
          </Label>
          <Input
            value={formData.loadBalancerType || ""}
            disabled
            className="bg-muted"
          />
        </div>

        {/* Region */}
        <div>
          <Label htmlFor="region" className="block mb-2 font-medium">
            Region <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.region || ""} onValueChange={(value) => handleChange("region", value)} disabled={isEditMode} required>
            <SelectTrigger className={`${formTouched && !formData.region ? 'border-red-300 bg-red-50' : ''} ${isEditMode ? 'bg-muted text-muted-foreground' : ''}`}>
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
              <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
              <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
              <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Region Availability Display */}
          {formData.region && regionAvailability[formData.region as keyof typeof regionAvailability] && (
            <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs text-gray-900">
                  Load Balancer Availability
                </h4>
                <span className="text-xs text-gray-500">
                  {regionAvailability[formData.region as keyof typeof regionAvailability].name}
                </span>
              </div>
              <div className="space-y-2">
                {regionAvailability[formData.region as keyof typeof regionAvailability].resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">
                      {resource.type}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {getAvailabilityBars(resource.availability)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-sm"></div>
                      <span>High</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-yellow-500 rounded-sm"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-sm"></div>
                      <span>Low</span>
                    </div>
                  </div>
                  <span>Updated 5 min ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VPC */}
        <VPCSelectorInline 
          value={formData.vpc || ""}
          onChange={(value) => {
            if (value === "__create_new__") {
              onCreateVPC?.()
            } else {
              handleChange("vpc", value)
            }
          }}
          formTouched={formTouched}
          disabled={isEditMode}
          isEditMode={isEditMode}
        />

        {/* Subnet */}
        <SubnetSelectorInline 
          value={formData.subnet || ""}
          vpcId={formData.vpc || ""}
          onChange={(value) => {
            if (value === "__create_new__") {
              onCreateSubnet?.()
            } else {
              handleChange("subnet", value)
            }
          }}
          formTouched={formTouched}
          disabled={!formData.vpc || isEditMode}
          isEditMode={isEditMode}
        />

        {/* Performance Tier and Configuration */}
        <div className="mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Performance Tier */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="font-medium">
                  Performance Tier <span className="text-destructive">*</span>
                </Label>
                <TooltipWrapper 
                  content="Standard Load Balancer contains 4vCPUs and 8GB RAM. Pro Load Balancer contains 8vCPUs and 16GB RAM."
                  side="top"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                </TooltipWrapper>
              </div>
              
              <RadioGroup 
                value={formData.performanceTier || ""} 
                onValueChange={(value) => handleChange("performanceTier", value)}
                className="space-y-3 mt-2"
                disabled={isEditMode}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" disabled={isEditMode} />
                  <Label htmlFor="standard" className={`cursor-pointer ${isEditMode ? 'text-muted-foreground cursor-not-allowed' : ''}`}>
                    Standard
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pro" id="pro" disabled />
                  <Label htmlFor="pro" className="text-muted-foreground cursor-not-allowed">
                    Pro
                  </Label>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Coming Soon
                  </Badge>
                </div>
              </RadioGroup>
            </div>

            {/* Configuration */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="font-medium">
                  Configuration <span className="text-destructive">*</span>
                </Label>
                <TooltipWrapper 
                  content="High Availability provisions the load balancer with 2 nodes - 1 primary and 1 backup for enhanced reliability and fault tolerance."
                  side="top"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                </TooltipWrapper>
              </div>
              
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gray-100 border-2 border-gray-300 rounded-full">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  </div>
                  <Label className="text-foreground font-medium cursor-default">
                    High Availability
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Load balancer will be provisioned with 2 nodes (1 primary, 1 backup) for enhanced reliability and fault tolerance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* IP Address Type - Only show if public subnet is selected */}
        {formData.subnet && isPublicSubnet(formData.subnet) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Label className="font-medium">
                IP Address Type <span className="text-destructive">*</span>
              </Label>
              <TooltipWrapper 
                content="Choose how the public IP address should be allocated for your load balancer in the public subnet."
                side="top"
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipWrapper>
            </div>
            
            <div className={`p-4 border border-gray-200 rounded-lg ${isEditMode ? 'bg-gray-100' : 'bg-gray-50'}`}>
              <RadioGroup 
                value={formData.ipAddressType || ""} 
                onValueChange={(value) => handleChange("ipAddressType", value)}
                className="space-y-4"
                disabled={isEditMode}
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="floating-ip" id="floating-ip" className="mt-0.5" disabled={isEditMode} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="floating-ip" className={`cursor-pointer ${isEditMode ? 'text-muted-foreground cursor-not-allowed' : ''}`}>
                        Floating IP
                      </Label>
                      <TooltipWrapper 
                        content="A floating IP can be dynamically assigned and reassigned to different resources. It provides flexibility to move IPs between instances."
                        side="top"
                      >
                        <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipWrapper>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dynamic IP assignment that can be moved between resources
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="reserve-ip" id="reserve-ip" className="mt-0.5" disabled={isEditMode} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="reserve-ip" className={`cursor-pointer ${isEditMode ? 'text-muted-foreground cursor-not-allowed' : ''}`}>
                        Reserve IP
                      </Label>
                      <TooltipWrapper 
                        content="A reserved IP is permanently allocated to your account and remains static. It's ideal for services that require a consistent IP address."
                        side="top"
                      >
                        <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipWrapper>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Static IP address reserved exclusively for your account
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
    </div>
  )
}

// VPC Selector Component
function VPCSelectorInline({ value, onChange, formTouched, disabled = false, isEditMode = false }: {
  value: string
  onChange: (value: string) => void
  formTouched: boolean
  disabled?: boolean
  isEditMode?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredVPCs = vpcs.filter(vpc =>
    vpc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vpc.id.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const selectedVPC = vpcs.find(vpc => vpc.id === value)
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Label className="font-medium">
          VPC <span className="text-destructive">*</span>
        </Label>
        <TooltipWrapper 
          content="Select the Virtual Private Cloud where your load balancer will be deployed. This determines the network scope and security boundaries."
          side="top"
        >
          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
        </TooltipWrapper>
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className={`w-full flex items-center justify-between px-3 py-2 border border-input rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            formTouched && !value ? 'border-red-300 bg-red-50' : ''
          } ${disabled ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background'}`}
        >
          <span className={selectedVPC ? "text-foreground" : "!text-[#64748b]"}>
            {selectedVPC ? `${selectedVPC.name} (${selectedVPC.region})` : "Select VPC to isolate your load balancer"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
        {open && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search VPCs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="p-1">
              <button
                type="button"
                onClick={() => {
                  onChange("__create_new__")
                  setOpen(false)
                }}
                className="w-full flex items-center px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm text-primary font-medium"
              >
                Create new VPC
              </button>
              {filteredVPCs.map((vpc) => (
                <button
                  key={vpc.id}
                  type="button"
                  onClick={() => {
                    onChange(vpc.id)
                    setOpen(false)
                    setSearchTerm("")
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{vpc.name}</span>
                    <span className="text-xs text-muted-foreground">{vpc.id} • {vpc.region}</span>
                  </div>
                  {value === vpc.id && <Check className="h-4 w-4" />}
                </button>
              ))}
              {filteredVPCs.length === 0 && searchTerm && (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  No VPCs found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Subnet Selector Component
function SubnetSelectorInline({ value, vpcId, onChange, formTouched, disabled, isEditMode = false }: {
  value: string
  vpcId: string
  onChange: (value: string) => void
  formTouched: boolean
  disabled: boolean
  isEditMode?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filter subnets based on selected VPC
  const selectedVPCName = vpcs.find(vpc => vpc.id === vpcId)?.name
  const vpcSubnets = subnets.filter(subnet => 
    subnet.vpcName === selectedVPCName
  )
  
  const filteredSubnets = vpcSubnets.filter(subnet => 
    subnet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subnet.id.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const selectedSubnet = vpcSubnets.find(subnet => subnet.id === value)
  const selectedVPC = vpcs.find(vpc => vpc.id === vpcId)
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Label className="font-medium">
          Subnet <span className="text-destructive">*</span>
        </Label>
        <TooltipWrapper 
          content="Choose the subnet where your load balancer will be placed."
          side="top"
        >
          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
        </TooltipWrapper>
      </div>
      
      {!disabled && vpcSubnets.length > 0 ? (
        <>
          <div className="relative">
            <button
              type="button"
              onClick={() => !disabled && setOpen(!open)}
              disabled={disabled}
              className={`w-full flex items-center justify-between px-3 py-2 border border-input rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                formTouched && !value ? 'border-red-300 bg-red-50' : ''
              } ${disabled ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background'}`}
            >
              <span className={selectedSubnet ? "text-foreground" : "text-muted-foreground"}>
                {selectedSubnet 
                  ? `${selectedSubnet.name} (${selectedSubnet.type})` 
                  : "Select a subnet within this VPC"
                }
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>

            {open && !disabled && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search subnets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="p-1">
                  <button
                    type="button"
                    onClick={() => {
                      onChange("__create_new__")
                      setOpen(false)
                    }}
                    className="w-full flex items-center px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm text-primary font-medium"
                  >
                    Create new subnet
                  </button>
                  
                  {filteredSubnets.map((subnet) => (
                    <button
                      key={subnet.id}
                      type="button"
                      onClick={() => {
                        onChange(subnet.id)
                        setOpen(false)
                        setSearchTerm("")
                      }}
                      className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{subnet.name}</span>
                          <Badge 
                            variant={subnet.type === "Public" ? "default" : "secondary"}
                            className={`text-xs ${subnet.type === "Public" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {subnet.type}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{subnet.id} • {subnet.cidr}</span>
                      </div>
                      {value === subnet.id && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                  
                  {filteredSubnets.length === 0 && searchTerm && (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      No subnets found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {!isEditMode && (
            <p className="text-xs mt-1 text-muted-foreground">
              Both public and private subnets are available for load balancer placement.
            </p>
          )}
        </>
      ) : disabled ? (
        <>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              Please select a VPC first to see available subnets.
            </p>
          </div>
          {!isEditMode && (
            <p className="text-xs mt-2 text-muted-foreground">
              Subnets will be loaded automatically once you select a VPC.
            </p>
          )}
        </>
      ) : (
        <>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-3">
              No subnets available in this VPC ({selectedVPC?.name}). You need to create a subnet first.
            </p>
            <Button 
              type="button"
              size="sm" 
              className="bg-black text-white hover:bg-black/90 transition-colors" 
              onClick={() => onChange("__create_new__")}
            >
              Create Subnet
            </Button>
          </div>
          {!isEditMode && (
            <p className="text-xs mt-2 text-muted-foreground">
              Load balancers can be placed in both public and private subnets.
            </p>
          )}
        </>
      )}
    </div>
  )
}
