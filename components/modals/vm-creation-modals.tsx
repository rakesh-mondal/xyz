"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

// Create VPC Modal within VM Creation
interface CreateVPCModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (vpcId: string) => void
  preselectedRegion?: string
}

export function CreateVPCModal({ open, onClose, onSuccess, preselectedRegion }: CreateVPCModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    vpcName: "",
    description: "",
    region: preselectedRegion || "",
    cidr: "10.0.0.0/16"
  })

  const regions = [
    { id: "us-east-1", name: "US East (N. Virginia)" },
    { id: "us-west-2", name: "US West (Oregon)" },
    { id: "eu-west-1", name: "EU (Ireland)" },
    { id: "ap-south-1", name: "Asia Pacific (Mumbai)" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate VPC creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newVpcId = `vpc-${Date.now()}`
      toast({
        title: "VPC created successfully",
        description: `${formData.vpcName} has been created and is ready for use.`
      })
      
      onSuccess(newVpcId)
      onClose()
      
      // Reset form
      setFormData({
        vpcName: "",
        description: "",
        region: preselectedRegion || "",
        cidr: "10.0.0.0/16"
      })
    } catch (error) {
      toast({
        title: "Failed to create VPC",
        description: "Please try again later."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New VPC</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vpc-name" className="block mb-2 font-medium">
              VPC Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="vpc-name"
              placeholder="Enter VPC name"
              value={formData.vpcName}
              onChange={(e) => setFormData(prev => ({ ...prev, vpcName: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="vpc-description">Description</Label>
            <Textarea
              id="vpc-description"
              placeholder="Enter VPC description (optional)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="vpc-region" className="block mb-2 font-medium">
              Region <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.region} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
              disabled={!!preselectedRegion}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vpc-cidr">CIDR Block</Label>
            <Input
              id="vpc-cidr"
              placeholder="10.0.0.0/16"
              value={formData.cidr}
              onChange={(e) => setFormData(prev => ({ ...prev, cidr: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Default subnet will be created automatically
            </p>
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.vpcName || !formData.region}
              className="bg-black text-white hover:bg-black/90"
            >
              {isLoading ? "Creating..." : "Create VPC"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Create Subnet Modal within VM Creation
interface CreateSubnetModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (subnetId: string) => void
  vpcId: string
  vpcName?: string
}

export function CreateSubnetModal({ open, onClose, onSuccess, vpcId, vpcName }: CreateSubnetModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    subnetName: "",
    description: "",
    cidr: "10.0.1.0/24",
    accessibility: "public"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate subnet creation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newSubnetId = `subnet-${Date.now()}`
      toast({
        title: "Subnet created successfully",
        description: `${formData.subnetName} has been created in ${vpcName || "the selected VPC"}.`
      })
      
      onSuccess(newSubnetId)
      onClose()
      
      // Reset form
      setFormData({
        subnetName: "",
        description: "",
        cidr: "10.0.1.0/24",
        accessibility: "public"
      })
    } catch (error) {
      toast({
        title: "Failed to create subnet",
        description: "Please try again later."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Subnet</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Creating subnet in: <span className="font-medium">{vpcName || vpcId}</span>
          </div>

          <div>
            <Label htmlFor="subnet-name" className="block mb-2 font-medium">
              Subnet Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subnet-name"
              placeholder="Enter subnet name"
              value={formData.subnetName}
              onChange={(e) => setFormData(prev => ({ ...prev, subnetName: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="subnet-description">Description</Label>
            <Textarea
              id="subnet-description"
              placeholder="Enter subnet description (optional)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="subnet-cidr" className="block mb-2 font-medium">
              CIDR Block <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subnet-cidr"
              placeholder="10.0.1.0/24"
              value={formData.cidr}
              onChange={(e) => setFormData(prev => ({ ...prev, cidr: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="subnet-accessibility" className="block mb-2 font-medium">
              Network Accessibility
            </Label>
            <Select 
              value={formData.accessibility} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, accessibility: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select accessibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Public subnets allow internet access
            </p>
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.subnetName || !formData.cidr}
              className="bg-black text-white hover:bg-black/90"
            >
              {isLoading ? "Creating..." : "Create Subnet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Create Security Group Modal within VM Creation
interface CreateSecurityGroupModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (sgId: string) => void
  vpcId: string
  vpcName?: string
}

export function CreateSecurityGroupModal({ open, onClose, onSuccess, vpcId, vpcName }: CreateSecurityGroupModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    sgName: "",
    description: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate security group creation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newSgId = `sg-${Date.now()}`
      toast({
        title: "Security group created successfully",
        description: `${formData.sgName} has been created with default SSH access rules.`
      })
      
      onSuccess(newSgId)
      onClose()
      
      // Reset form
      setFormData({
        sgName: "",
        description: ""
      })
    } catch (error) {
      toast({
        title: "Failed to create security group",
        description: "Please try again later."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Security Group</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Creating security group in: <span className="font-medium">{vpcName || vpcId}</span>
          </div>

          <div>
            <Label htmlFor="sg-name" className="block mb-2 font-medium">
              Security Group Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sg-name"
              placeholder="Enter security group name"
              value={formData.sgName}
              onChange={(e) => setFormData(prev => ({ ...prev, sgName: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="sg-description" className="block mb-2 font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="sg-description"
              placeholder="Describe the purpose of this security group"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm">
              <div className="font-medium text-blue-900 mb-1">Default Rules</div>
              <div className="text-blue-800 space-y-1">
                <div>• SSH (Port 22) - Inbound from anywhere</div>
                <div>• HTTP (Port 80) - Inbound from anywhere</div>
                <div>• HTTPS (Port 443) - Inbound from anywhere</div>
                <div>• All traffic - Outbound to anywhere</div>
              </div>
              <div className="text-xs text-blue-700 mt-2">
                You can modify these rules after creation
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.sgName || !formData.description}
              className="bg-black text-white hover:bg-black/90"
            >
              {isLoading ? "Creating..." : "Create Security Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 