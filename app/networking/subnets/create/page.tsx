"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Label } from "../../../../components/ui/label"
import { Badge } from "../../../../components/ui/badge"
import { Dialog, DialogContent } from "../../../../components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion"
import { TooltipWrapper } from "../../../../components/ui/tooltip-wrapper"
import { HelpCircle, ChevronDown, Check, Search } from "lucide-react"
import { vpcs } from "../../../../lib/data"
import Link from "next/link"

export default function CreateSubnetPage() {
  const router = useRouter()
  const [showCreateVpcModal, setShowCreateVpcModal] = useState(false)
  const [formData, setFormData] = useState({
    vpcId: "",
    name: "",
    description: "",
    accessType: "",
    cidr: "",
    gatewayIp: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, accessType: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating subnet:", formData)
    // Handle form submission
    router.push("/networking/subnets")
  }

  return (
    <PageLayout 
      title="Create Subnet" 
      description="Configure and create a new subnet for your Virtual Private Cloud"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <VPCSelector 
                    value={formData.vpcId}
                    onChange={(value) => handleSelectChange("vpcId", value)}
                    onCreateNew={() => setShowCreateVpcModal(true)}
                  />

                  <div className="mb-5">
                    <Label htmlFor="name" className="block mb-2 font-medium">
                      Name <span className="text-destructive">*</span>
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
                    <RadioGroup value={formData.accessType} onValueChange={handleRadioChange} className="flex gap-5 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="ml-2">
                          Public
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="ml-2">
                          Private
                        </Label>
                      </div>
                    </RadioGroup>

                    {formData.accessType === "public" && (
                      <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-gray-600" style={{ fontSize: '13px' }}>
                          Public subnets can be accessed through the internet. Public IP addresses which you want to assign to
                          your publicly accessible VMs can only be assigned to this type of subnet.
                        </p>
                      </div>
                    )}

                    {formData.accessType === "private" && (
                      <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-gray-600" style={{ fontSize: '13px' }}>
                          Private subnets cannot be accessed through the internet. Only private IP addresses will be created
                          inside this subnet and you can only add privately accessible VMs inside this subnet.
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
                          content={
                            <div className="space-y-2">
                              <p className="font-medium">CIDR Block Configuration</p>
                              <p>Define the IP address range for your subnet using CIDR notation (e.g., 192.168.1.0/24).</p>
                              <p><strong>Examples:</strong></p>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>/24 = 254 usable IPs (good for small environments)</li>
                                <li>/23 = 510 usable IPs (good for medium environments)</li>
                                <li>/22 = 1022 usable IPs (good for large environments)</li>
                              </ul>
                              <p><strong>Important:</strong> Choose a CIDR block that doesn't overlap with existing subnets and provides adequate IP addresses for your resources.</p>
                            </div>
                          }
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
                      <p className="text-xs text-muted-foreground mt-1">
                        IP address range in CIDR notation
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="gatewayIp" className="font-medium">
                          Gateway IP <span className="text-destructive">*</span>
                        </Label>
                        <TooltipWrapper 
                          content={
                            <div className="space-y-2">
                              <p className="font-medium">Gateway IP Configuration</p>
                              <p>The gateway IP serves as the default route for resources in this subnet to communicate with other subnets and external networks.</p>
                              <p><strong>Best Practices:</strong></p>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Usually the first IP in your CIDR range (e.g., 192.168.1.1 for 192.168.1.0/24)</li>
                                <li>Must be within your subnet's CIDR range</li>
                                <li>Cannot be the network or broadcast address</li>
                              </ul>
                              <p><strong>Example:</strong> For subnet 192.168.1.0/24, use 192.168.1.1 as gateway</p>
                            </div>
                          }
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
                      <p className="text-xs text-muted-foreground mt-1">
                        Gateway IP address for the subnet
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <div className="flex justify-end gap-4 px-6 pb-6">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-secondary transition-colors"
                onClick={() => router.push("/networking/subnets")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-black text-white hover:bg-black/90 transition-colors hover:scale-105"
                onClick={handleSubmit}
              >
                Create Subnet
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-normal">Configuration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose descriptive names for easy identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use private subnets for better security</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Plan IP address allocation to avoid future conflicts</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showCreateVpcModal} onOpenChange={setShowCreateVpcModal}>
        <DialogContent className="p-0 bg-white max-w-[80vw] max-h-[85vh] w-[80vw] h-[85vh] overflow-hidden flex flex-col">
          <CreateVPCModalContent onClose={() => setShowCreateVpcModal(false)} />
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}

function VPCSelector({ value, onChange, onCreateNew }: { 
  value: string
  onChange: (value: string) => void
  onCreateNew: () => void
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredVPCs = vpcs.filter(vpc => 
    vpc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vpc.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedVPC = vpcs.find(vpc => vpc.id === value)

  return (
    <div className="mb-5">
      <Label className="block mb-2 font-medium">
        VPC <span className="text-destructive">*</span>
      </Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={selectedVPC ? "text-foreground" : "text-muted-foreground"}>
            {selectedVPC ? `${selectedVPC.name} (${selectedVPC.id})` : "Select VPC"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>

        {open && (
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
                  onCreateNew()
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
      <p className="text-xs text-muted-foreground mt-1">
        Select the VPC where you want to create this subnet.
      </p>
    </div>
  )
}

function CreateVPCModalContent({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    vpcName: "",
    region: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [isFirstVPC] = useState(true)

  // Mock region availability data
  const regionAvailability = {
    "us-east-1": {
      name: "US East (N. Virginia)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "high" },
        { type: "GPU RTX A5000", availability: "medium" },
        { type: "GPU RTX A6000", availability: "medium" },
        { type: "Storage", availability: "high" },
      ]
    },
    "us-west-2": {
      name: "US West (Oregon)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "medium" },
        { type: "GPU RTX A5000", availability: "low" },
        { type: "GPU RTX A6000", availability: "low" },
        { type: "Storage", availability: "high" },
      ]
    },
    "eu-west-1": {
      name: "EU (Ireland)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "high" },
        { type: "GPU RTX A5000", availability: "medium" },
        { type: "GPU RTX A6000", availability: "medium" },
        { type: "Storage", availability: "high" },
      ]
    },
    "ap-south-1": {
      name: "Asia Pacific (Mumbai)",
      resources: [
        { type: "CPU Instances", availability: "medium" },
        { type: "GPU A40", availability: "medium" },
        { type: "GPU RTX A5000", availability: "high" },
        { type: "GPU RTX A6000", availability: "high" },
        { type: "Storage", availability: "medium" },
      ]
    },
    "ap-southeast-1": {
      name: "Asia Pacific (Singapore)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "low" },
        { type: "GPU RTX A5000", availability: "medium" },
        { type: "GPU RTX A6000", availability: "medium" },
        { type: "Storage", availability: "high" },
      ]
    }
  }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log("Creating VPC:", formData)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    onClose()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b">
        <h2 className="text-2xl font-semibold">Create Virtual Private Cloud</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 min-h-0 p-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2" style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}>
            <div className="space-y-6">
              <Card>
                <CardContent className="space-y-6 pt-6">
                  <form id="vpc-form" onSubmit={handleSubmit}>
                    {/* VPC Configuration */}
                    <div className="mb-8">
                      <div className="mb-5">
                        <Label htmlFor="vpcName" className="block mb-2 font-medium">
                          VPC Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="vpcName"
                          placeholder="Enter VPC name"
                          value={formData.vpcName}
                          onChange={handleChange}
                          className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Only alphanumeric characters, hyphens, and underscores allowed.
                        </p>
                      </div>

                      <div className="mb-5">
                        <Label htmlFor="region" className="block mb-2 font-medium">
                          Region <span className="text-destructive">*</span>
                        </Label>
                        <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                            <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                            <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                            <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
                            <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {/* Region Availability Display */}
                        {formData.region && regionAvailability[formData.region as keyof typeof regionAvailability] && (
                          <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xs text-gray-900">
                                Resource Availability
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

                      <div className="mb-5">
                        <Label htmlFor="description" className="block mb-2 font-medium">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Enter a description for this VPC"
                          value={formData.description}
                          onChange={handleChange}
                          className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]"
                        />
                      </div>

                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex-shrink-0 space-y-6">
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
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Price Summary</h3>
                {isFirstVPC && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">First VPC</Badge>
                )}
              </div>
            </div>
            <div>
              {isFirstVPC ? (
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-green-600">Free</div>
                  <p className="text-sm text-muted-foreground">
                    Your first Virtual Private Cloud is free! This includes the basic VPC setup and one subnet.
                  </p>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>• First VPC: ₹0.00/month</p>
                    <p>• Subsequent VPCs: ₹500.00/month</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-2xl font-bold">₹500.00</div>
                  <p className="text-sm text-muted-foreground">per month</p>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>• VPC Setup: ₹500.00/month</p>
                    <p>• Additional subnets: ₹100.00/month each</p>
                    <p>• Data transfer charges apply</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-normal">Configuration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose a descriptive VPC name for easy identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Select the region closest to your users for better performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use private networks for better security</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Plan your CIDR blocks to avoid IP conflicts</span>
                </li>
              </ul>
            </CardContent>
          </Card>
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
            form="vpc-form"
            className="bg-black text-white hover:bg-black/90 transition-colors" 
            disabled={loading}
          >
            {loading ? "Creating..." : "Create VPC"}
          </Button>
        </div>
      </div>
    </div>
  )
}
