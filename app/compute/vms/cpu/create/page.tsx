// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { HelpCircle, RefreshCw, Plus, X, ChevronDown, Search, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CreateVPCModal } from "@/components/modals/vm-creation-modals"

// Mock data
const vpcs = [
  { id: "vpc-1", name: "production-vpc", region: "us-east-1" },
  { id: "vpc-2", name: "development-vpc", region: "us-west-2" },
  { id: "vpc-3", name: "staging-vpc", region: "us-east-1" },
]

const bootableVolumes = [
  { id: "vol-1", name: "ubuntu-22.04-boot", size: "20 GB", image: "Ubuntu 22.04 LTS" },
  { id: "vol-2", name: "centos-8-boot", size: "25 GB", image: "CentOS 8" },
]

const storageVolumes = [
  { id: "vol-s1", name: "data-storage-1", size: "100 GB" },
  { id: "vol-s2", name: "backup-storage", size: "500 GB" },
]

const machineImages = [
  { id: "img-1", name: "Ubuntu 22.04 LTS", type: "Linux" },
  { id: "img-2", name: "CentOS 8", type: "Linux" },
  { id: "img-3", name: "Windows Server 2022", type: "Windows" },
]

const sshKeys = [
  { id: "ssh-1", name: "prod-admin-key" },
  { id: "ssh-2", name: "dev-key" },
  { id: "ssh-3", name: "backup-key" },
]

const subnets = [
  { id: "subnet-1", name: "public-subnet-1", type: "Public", cidr: "10.0.1.0/24" },
  { id: "subnet-2", name: "private-subnet-1", type: "Private", cidr: "10.0.2.0/24" },
]

const reservedIPs = [
  { id: "ip-1", address: "203.0.113.1", subnet: "subnet-1" },
  { id: "ip-2", address: "203.0.113.2", subnet: "subnet-1" },
]

const securityGroups = [
  { id: "sg-1", name: "web-servers", description: "Web server security group" },
  { id: "sg-2", name: "database", description: "Database security group" },
]

interface FormData {
  name: string
  vpcId: string
  bootableVolumeType: "existing" | "new"
  existingBootableVolume: string
  newBootableVolumeSize: string
  newBootableVolumeImage: string
  newBootableVolumeName: string
  storageVolumeType: "existing" | "new" | "none"
  existingStorageVolumes: string[]
  newStorageVolumeName: string
  newStorageVolumeSize: string
  newStorageVolumeType: "ssd" | "hdd"
  newStorageVolumeDescription: string
  sshKeyId: string
  startupScript: string
  tags: { key: string; value: string }[]
  subnetId: string
  ipAddressType: "floating" | "reserved"
  reservedIpId: string
  securityGroupId: string
  networkSpeed: string
}

export default function CreateVMPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    vpcId: "",
    bootableVolumeType: "existing",
    existingBootableVolume: "",
    newBootableVolumeSize: "20",
    newBootableVolumeImage: "",
    newBootableVolumeName: "",
    storageVolumeType: "none",
    existingStorageVolumes: [],
    newStorageVolumeName: "",
    newStorageVolumeSize: "100",
    newStorageVolumeType: "ssd",
    newStorageVolumeDescription: "",
    sshKeyId: "",
    startupScript: "",
    tags: [],
    subnetId: "",
    ipAddressType: "floating",
    reservedIpId: "",
    securityGroupId: "",
    networkSpeed: "100 Mbps",
  })

  const [showCreateVPCModal, setShowCreateVPCModal] = useState(false)
  const [step, setStep] = useState<"form" | "confirmation">("form")

  const selectedVPC = vpcs.find(vpc => vpc.id === formData.vpcId)
  const selectedSubnet = subnets.find(subnet => subnet.id === formData.subnetId)
  const isPrivateSubnet = selectedSubnet?.type === "Private"
  const showIPAddressType = selectedSubnet?.type === "Public"
  const availableReservedIPs = reservedIPs.filter(ip => ip.subnet === formData.subnetId)

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { key: "", value: "" }]
    }))
  }

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const updateTag = (index: number, field: "key" | "value", value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => 
        i === index ? { ...tag, [field]: value } : tag
      )
    }))
  }

  const handleVPCCreated = (vpcId: string) => {
    handleInputChange("vpcId", vpcId)
    setShowCreateVPCModal(false)
  }

  const calculatePricing = () => {
    const basePricing = 12
    let storagePricing = 0
    if (formData.bootableVolumeType === "new") {
      const bootableSize = parseInt(formData.newBootableVolumeSize) || 20
      storagePricing += bootableSize * 0.05
    }
    if (formData.storageVolumeType === "new") {
      const storageSize = parseInt(formData.newStorageVolumeSize) || 100
      storagePricing += storageSize * 0.03
    }
    
    let ipPricing = 0
    if (showIPAddressType) {
      if (formData.ipAddressType === "floating") {
        ipPricing = 1
      } else if (formData.ipAddressType === "reserved") {
        ipPricing = 2
      }
    } else if (selectedSubnet?.type === "Public") {
      ipPricing = 1
    }
    
    const total = basePricing + storagePricing + ipPricing
    
    return { 
      vm: basePricing, 
      storage: storagePricing, 
      ip: ipPricing, 
      total: parseFloat(total.toFixed(2))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === "form") {
      setStep("confirmation")
    } else {
      toast({
        title: "VM creation initiated",
        description: `${formData.name} is being created. This may take a few minutes.`
      })
      router.push("/compute/vms")
    }
  }

  const pricing = calculatePricing()

  if (step === "confirmation") {
    return (
      <PageLayout
        title="Confirm VM Creation"
        description="Review your configuration and confirm VM creation"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6" style={{
            borderRadius: '16px',
            border: '4px solid #FFF',
            background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
            boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
            padding: '1.5rem'
          }}>
            <h2 className="text-xl font-semibold mb-6">VM Configuration Summary</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>VM Name</label>
                  <div className="font-medium" style={{ fontSize: '14px' }}>{formData.name}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>VPC</label>
                  <div className="font-medium" style={{ fontSize: '14px' }}>{selectedVPC?.name}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>SSH Key</label>
                  <div className="font-medium" style={{ fontSize: '14px' }}>{sshKeys.find(k => k.id === formData.sshKeyId)?.name}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Security Group</label>
                  <div className="font-medium" style={{ fontSize: '14px' }}>{securityGroups.find(sg => sg.id === formData.securityGroupId)?.name}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>VM Cost</label>
                    <div className="font-medium" style={{ fontSize: '14px' }}>₹{pricing.vm}/hr</div>
                  </div>
                  {pricing.storage > 0 && (
                    <div className="space-y-1">
                      <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Storage Cost</label>
                      <div className="font-medium" style={{ fontSize: '14px' }}>₹{pricing.storage}/hr</div>
                    </div>
                  )}
                  {pricing.ip > 0 && (
                    <div className="space-y-1">
                      <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>IP Address Cost</label>
                      <div className="font-medium" style={{ fontSize: '14px' }}>₹{pricing.ip}/hr</div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Total Cost</label>
                    <div className="font-semibold text-lg text-gray-900">₹{pricing.total}/hr</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("form")}
            >
              Back to Edit
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-black text-white hover:bg-black/90"
            >
              Create VM
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title="Create Virtual Machine"
      description="Configure and deploy a new virtual machine instance"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="block mb-2 font-medium">
                      VM Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter VM name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Only alphanumeric characters, hyphens, and underscores allowed.
                    </p>
                  </div>

                  <VPCSelectorInline
                    value={formData.vpcId}
                    onChange={(value) => {
                      if (value === "__create_new__") {
                        setShowCreateVPCModal(true)
                      } else {
                        handleInputChange("vpcId", value)
                      }
                    }}
                  />
                </div>

                <div className="mb-6 mt-8">
                  <Label className="block mb-2 font-medium">
                    SSH Key <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.sshKeyId} onValueChange={(value) => {
                    if (value === "__create_new__") {
                      router.push("/settings/ssh-keys?create=true&return=/compute/vms/cpu/create")
                    } else {
                      handleInputChange("sshKeyId", value)
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SSH key" />
                    </SelectTrigger>
                    <SelectContent>
                      {sshKeys.map((key) => (
                        <SelectItem key={key.id} value={key.id}>
                          {key.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="__create_new__" className="text-blue-600 font-medium">
                        <Plus className="h-4 w-4 mr-2 inline" />
                        Create new SSH key
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-6">
                  <Label className="block mb-2 font-medium">
                    Security Group <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.securityGroupId} onValueChange={(value) => {
                    if (value === "__create_new__") {
                      router.push("/networking/security-groups/create?return=/compute/vms/cpu/create")
                    } else {
                      handleInputChange("securityGroupId", value)
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select security group" />
                    </SelectTrigger>
                    <SelectContent>
                      {securityGroups.map((sg) => (
                        <SelectItem key={sg.id} value={sg.id}>
                          {sg.name} - {sg.description}
                        </SelectItem>
                      ))}
                      <SelectItem value="__create_new__" className="text-blue-600 font-medium">
                        <Plus className="h-4 w-4 mr-2 inline" />
                        Create new security group
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/compute/vms")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-black text-white hover:bg-black/90"
                    disabled={!formData.name || !formData.vpcId || !formData.sshKeyId || !formData.securityGroupId}
                  >
                    Review Configuration
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-6">
          <div 
            className="sticky top-6"
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
            <div className="space-y-3">
              <div className="text-2xl font-bold">₹{pricing.total}</div>
              <p className="text-sm text-muted-foreground">per hour</p>
              
              <div className="text-xs text-muted-foreground pt-2 border-t space-y-1">
                <div className="flex justify-between">
                  <span>VM Instance (4 vCPU, 16 GB RAM, {formData.networkSpeed})</span>
                  <span>₹{pricing.vm}/hr</span>
                </div>
                
                {pricing.storage > 0 && (
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span>₹{pricing.storage}/hr</span>
                  </div>
                )}
                
                {pricing.ip > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {formData.ipAddressType === "floating" ? "Floating IP" : 
                       formData.ipAddressType === "reserved" ? "Reserved IP" : "Public IP"}
                    </span>
                    <span>₹{pricing.ip}/hr</span>
                  </div>
                )}
                
                <div className="pt-1 mt-2 border-t">
                  <span>Monthly estimate: ~₹{(pricing.total * 24 * 30).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateVPCModal
        open={showCreateVPCModal}
        onClose={() => setShowCreateVPCModal(false)}
        onSuccess={handleVPCCreated}
        preselectedRegion={selectedVPC?.region}
      />
    </PageLayout>
  )
}

function VPCSelectorInline({ value, onChange }: {
  value: string
  onChange: (value: string) => void
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
            {selectedVPC ? `${selectedVPC.name} (${selectedVPC.region})` : "Select VPC"}
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