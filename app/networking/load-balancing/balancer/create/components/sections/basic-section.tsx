"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { HelpCircle } from "lucide-react"
import type { ALBFormData } from "../alb-create-form"

interface BasicSectionProps {
  formData: ALBFormData
  updateFormData: (section: string, data: any) => void
  isSection?: boolean
}

export function BasicSection({ formData, updateFormData, isSection = false }: BasicSectionProps) {
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

  const isFormValid = () => {
    return formData.name?.trim().length > 0 && 
           formData.region?.length > 0 && 
           formData.vpc?.length > 0 &&
           formData.subnet?.length > 0
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
            }`}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Only alphanumeric characters, hyphens, and underscores allowed.
          </p>
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
          <Select value={formData.region || ""} onValueChange={(value) => handleChange("region", value)} required>
            <SelectTrigger className={formTouched && !formData.region ? 'border-red-300 bg-red-50' : ''}>
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
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="vpc" className="font-medium">
              VPC <span className="text-destructive">*</span>
            </Label>
            <TooltipWrapper 
              content="Select the Virtual Private Cloud where your load balancer will be deployed. This determines the network scope and security boundaries."
              side="top"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipWrapper>
          </div>
          <Select value={formData.vpc || ""} onValueChange={(value) => handleChange("vpc", value)} required>
            <SelectTrigger className={formTouched && !formData.vpc ? 'border-red-300 bg-red-50' : ''}>
              <SelectValue placeholder="Select a VPC" />
            </SelectTrigger>
            <SelectContent>
              {vpcOptions.map((vpc) => (
                <SelectItem key={vpc.value} value={vpc.value}>
                  {vpc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subnet */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="subnet" className="font-medium">
              Subnet <span className="text-destructive">*</span>
            </Label>
            <TooltipWrapper 
              content="Choose the subnet where your load balancer will be placed. For high availability, select subnets in multiple availability zones."
              side="top"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipWrapper>
          </div>
          <Select 
            value={formData.subnet || ""} 
            onValueChange={(value) => handleChange("subnet", value)} 
            disabled={!formData.vpc}
            required
          >
            <SelectTrigger className={formTouched && !formData.subnet ? 'border-red-300 bg-red-50' : ''}>
              <SelectValue placeholder={formData.vpc ? "Select a subnet" : "Select VPC first"} />
            </SelectTrigger>
            <SelectContent>
              {getSubnetsForVpc(formData.vpc || "").map((subnet) => (
                <SelectItem key={subnet} value={subnet}>
                  {subnet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
    </div>
  )
}
