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

export default function CreateVPCPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    vpcName: "",
    region: "",
    description: "",
    networkName: "",
    routerName: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create the VPC
    console.log("Creating VPC:", formData)
    router.push("/networking/vpc")
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Networking", href: "/networking" },
          { name: "Virtual Private Cloud", href: "/networking/vpc" },
          { name: "Create VPC" },
        ]}
      />

      <h1 className="text-2xl font-semibold mb-8">Create Virtual Private Cloud</h1>

      <div className="rounded-[12px] bg-[#F5F7FA] p-8 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-5 pb-2.5 border-b border-border">VPC Configuration</h2>

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
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="hover:bg-secondary transition-colors"
              onClick={() => router.push("/networking/vpc")}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-black/90 transition-colors hover:scale-105">
              Create VPC
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
