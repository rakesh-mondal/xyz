"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "../../../../components/breadcrumbs"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Label } from "../../../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
import { vpcs } from "../../../../lib/data"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function CreateSubnetPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    vpc: "",
    name: "",
    description: "",
    accessType: "public",
    cidr: "",
    gatewayIp: "",
  })
  const [showCreateVpcModal, setShowCreateVpcModal] = useState(false)

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
    // In a real app, this would create the subnet
    console.log("Creating Subnet:", formData)
    router.push("/networking/subnets")
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Networking", href: "/networking" },
          { name: "Subnets", href: "/networking/subnets" },
          { name: "Create Subnet" },
        ]}
      />

      <h1 className="text-2xl font-semibold mb-8">Create Subnet</h1>

      <div className="rounded-[12px] bg-[#F5F7FA] p-8 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-5 pb-2.5 border-b border-border">Subnet Configuration</h2>

            <div className="mb-5">
              <Label htmlFor="vpc" className="block mb-2 font-medium">
                VPC <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.vpc} onValueChange={(value) => handleSelectChange("vpc", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a VPC" />
                </SelectTrigger>
                <SelectContent>
                  {vpcs.map((vpc) => (
                    <SelectItem key={vpc.id} value={vpc.id}>
                      {vpc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" size="sm" className="mt-2 bg-black text-white hover:bg-black/90 transition-colors" onClick={() => setShowCreateVpcModal(true)}>
                Create VPC
              </Button>
            </div>

            <div className="mb-5">
              <Label htmlFor="name" className="block mb-2 font-medium">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input id="name" placeholder="Enter subnet name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="mb-5">
              <Label htmlFor="description" className="block mb-2 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a description for this subnet"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[100px]"
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
                <div className="bg-muted border-l-4 border-primary p-4 mt-2.5 rounded text-sm">
                  Public subnets can be accessed through the internet. Public IP addresses which you want to assign to
                  your publicly accessible VMs can only be assigned to this type of subnet.
                </div>
              )}

              {formData.accessType === "private" && (
                <div className="bg-muted border-l-4 border-primary p-4 mt-2.5 rounded text-sm">
                  Private subnets cannot be accessed through the internet. Only private IP addresses will be created
                  inside this subnet and you can only add privately accessible VMs inside this subnet.
                </div>
              )}
            </div>

            <div className="mb-5">
              <Label htmlFor="cidr" className="block mb-2 font-medium">
                CIDR <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cidr"
                placeholder="e.g., 192.168.1.0/24"
                value={formData.cidr}
                onChange={handleChange}
                required
              />
              <p className="text-xs mt-1 text-muted-foreground">
                Specify the IP address range for this subnet using CIDR notation.
              </p>
            </div>

            <div className="mb-5">
              <Label htmlFor="gatewayIp" className="block mb-2 font-medium">
                Gateway IP <span className="text-destructive">*</span>
              </Label>
              <Input
                id="gatewayIp"
                placeholder="e.g., 192.168.1.1"
                value={formData.gatewayIp}
                onChange={handleChange}
                required
              />
              <p className="text-xs mt-1 text-muted-foreground">The IP address of the gateway for this subnet.</p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="hover:bg-secondary transition-colors"
              onClick={() => router.push("/networking/subnets")}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-black/90 transition-colors hover:scale-105">
              Create Subnet
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={showCreateVpcModal} onOpenChange={setShowCreateVpcModal}>
        <DialogContent className="p-0 bg-white overflow-hidden max-w-lg">
          <CreateVPCModalContent onClose={() => setShowCreateVpcModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateVPCModalContent({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    vpcName: "",
    region: "",
    description: "",
    networkName: "",
    routerName: "",
  })
  const [loading, setLoading] = useState(false)

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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Create Virtual Private Cloud</h2>
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
      <div className="mb-5">
        <Label htmlFor="networkName" className="block mb-2 font-medium">
          Network Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="networkName"
          placeholder="Enter network name"
          value={formData.networkName}
          onChange={handleChange}
          className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
          required
        />
      </div>
      <div className="mb-5">
        <Label htmlFor="routerName" className="block mb-2 font-medium">
          Router Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="routerName"
          placeholder="Enter router name"
          value={formData.routerName}
          onChange={handleChange}
          className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
          required
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-black text-white hover:bg-black/90 transition-colors hover:scale-105" disabled={loading}>
          {loading ? "Creating..." : "Create VPC"}
        </Button>
      </div>
    </form>
  )
}
