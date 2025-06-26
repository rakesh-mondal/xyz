"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Label } from "../../../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
import { subnets, vpcs } from "../../../../lib/data"
import Link from "next/link"
import { useToast } from "../../../../hooks/use-toast"
import { Dialog, DialogContent } from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { TooltipWrapper } from "../../../../components/ui/tooltip-wrapper"
import { HelpCircle, Plus, ChevronDown, Check, Search } from "lucide-react"

export default function CreateStaticIPPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showCreateSubnetModal, setShowCreateSubnetModal] = useState(false)
  const [formData, setFormData] = useState({
    subnet: "",
    ipType: "ipv4",
  })

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, ipType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that a subnet is selected
    if (!formData.subnet) {
      toast({
        title: "Subnet Required",
        description: "Please select a subnet before reserving an IP address.",
        variant: "destructive"
      })
      return
    }

    try {
      // In a real app, this would be an API call to reserve the IP address
      console.log("Reserving IP Address:", {
        subnet: formData.subnet,
        ipType: formData.ipType,
        timestamp: new Date().toISOString()
      })
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message and redirect
      toast({
        title: "IP Address Reserved",
        description: "Static IP address has been successfully reserved!"
      })
      
      router.push("/networking/static-ips")
    } catch (error) {
      console.error("Error reserving IP address:", error)
      toast({
        title: "Reservation Failed",
        description: "Failed to reserve IP address. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Filter only public subnets
  const publicSubnets = subnets.filter((subnet) => subnet.type === "Public")

  return (
    <PageLayout 
      title="Reserve IP Address" 
      description="Reserve and configure a static IP address for your cloud resources"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-5 pb-2.5 border-b border-border">IP Address Configuration</h2>

                  <SubnetSelector 
                    value={formData.subnet}
                    onChange={(value) => handleSelectChange("subnet", value)}
                    onCreateNew={() => setShowCreateSubnetModal(true)}
                  />

                  <div className="mb-5">
                    <Label className="block mb-2 font-medium">
                      Type <span className="text-destructive">*</span>
                    </Label>
                    <RadioGroup value={formData.ipType} onValueChange={handleRadioChange} className="flex gap-5 mt-2">
                      <div className="flex items-center">
                        <RadioGroupItem value="ipv4" id="ipv4" />
                        <Label htmlFor="ipv4" className="ml-2">
                          IPv4
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="ipv6" id="ipv6" disabled />
                        <Label htmlFor="ipv6" className="ml-2 text-muted-foreground cursor-not-allowed">
                          IPv6 (Not Available)
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs mt-1 text-muted-foreground">
                      IPv6 support is not currently available. IPv4 addresses are supported.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-secondary transition-colors"
                    onClick={() => router.push("/networking/static-ips")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black text-white hover:bg-black/90 transition-colors hover:scale-105">
                    Reserve IP Address
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-80 space-y-6">
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
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">₹0.28</span>
                  <span className="text-sm text-muted-foreground">per hour</span>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>• Estimated monthly cost: ₹204.40</p>
                  <p>• Charged while IP is reserved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Information */}
          <Card>
            <CardContent className="p-6">
              <div className="font-semibold mb-4">Static IP Information</div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Static IP addresses provide a permanent IP address for your cloud resources that won't change when you stop and start your instances.
                </p>
                <p>
                  Static IPs can only be assigned to resources in public subnets and are required for internet-facing applications.
                </p>
                <p>
                  You'll be charged for the static IP as long as it's reserved, even if it's not attached to any resource.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Subnet Modal */}
      <Dialog open={showCreateSubnetModal} onOpenChange={setShowCreateSubnetModal}>
        <DialogContent className="p-0 bg-white max-w-[70vw] max-h-[85vh] w-[70vw] h-[85vh] overflow-hidden flex flex-col">
          <CreateSubnetModalContent onClose={() => setShowCreateSubnetModal(false)} />
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}

function SubnetSelector({ value, onChange, onCreateNew }: { 
  value: string
  onChange: (value: string) => void
  onCreateNew: () => void
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const publicSubnets = subnets.filter((subnet) => subnet.type === "Public")
  
  const filteredSubnets = publicSubnets.filter(subnet => 
    subnet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subnet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subnet.vpcName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedSubnet = publicSubnets.find(subnet => subnet.id === value)

  return (
    <div className="mb-5">
      <Label className="block mb-2 font-medium">
        Subnet <span className="text-destructive">*</span>
      </Label>
      
      {publicSubnets.length > 0 ? (
        <>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className={selectedSubnet ? "text-foreground" : "text-muted-foreground"}>
                {selectedSubnet ? `${selectedSubnet.name} (${selectedSubnet.vpcName})` : "Select a public subnet"}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>

            {open && (
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
                      onCreateNew()
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
                        <span className="font-medium">{subnet.name}</span>
                        <span className="text-xs text-muted-foreground">{subnet.id} • {subnet.vpcName}</span>
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
          <p className="text-xs mt-1 text-muted-foreground">
            Only public subnets are available for IP address reservation.
          </p>
        </>
      ) : (
        <>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-3">
              No public subnets available. You need to create a public subnet first to reserve a static IP address.
            </p>
            <Button size="sm" className="bg-black text-white hover:bg-black/90 transition-colors" onClick={onCreateNew}>
              Create Public Subnet
            </Button>
          </div>
          <p className="text-xs mt-2 text-muted-foreground">
            Static IP addresses can only be assigned to resources in public subnets.
          </p>
        </>
      )}
    </div>
  )
}

function CreateSubnetModalContent({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    vpcId: "",
    name: "",
    description: "",
    accessType: "public", // Default to public for IP address reservation
    cidr: "",
    gatewayIp: "",
  })
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // In a real app, this would create the subnet via API
      console.log("Creating subnet:", formData)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Subnet Created",
        description: `Subnet "${formData.name}" has been created successfully!`
      })
      
      onClose()
      // In a real app, you would refresh the subnets list here
      window.location.reload()
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b">
        <h2 className="text-2xl font-semibold">Create Subnet</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 min-h-0 p-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2" style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}>
            <div className="space-y-6">
              <Card>
                <CardContent className="space-y-6 pt-6">
                  <form id="subnet-form" onSubmit={handleSubmit}>
                    <div className="mb-8">
                      <div className="mb-5">
                        <Label htmlFor="vpcId" className="block mb-2 font-medium">
                          VPC <span className="text-destructive">*</span>
                        </Label>
                        <Select value={formData.vpcId} onValueChange={(value) => handleSelectChange("vpcId", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a VPC" />
                          </SelectTrigger>
                          <SelectContent>
                            {vpcs.map((vpc) => (
                              <SelectItem key={vpc.id} value={vpc.id}>
                                {vpc.name} ({vpc.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Select the VPC where you want to create this subnet.
                        </p>
                      </div>

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
                            <RadioGroupItem value="public" id="modal-public" />
                            <Label htmlFor="modal-public" className="ml-2">
                              Public
                            </Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="private" id="modal-private" />
                            <Label htmlFor="modal-private" className="ml-2">
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
                          <p className="text-xs text-muted-foreground mt-1">
                            Gateway IP address for the subnet
                          </p>
                        </div>
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
          {/* Configuration Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-normal">Configuration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose public subnet for IP address reservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use descriptive names for easy identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Ensure subnet CIDR is within your VPC's CIDR range</span>
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
