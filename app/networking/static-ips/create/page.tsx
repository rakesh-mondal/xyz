"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "../../../../components/breadcrumbs"
import { Button } from "../../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Label } from "../../../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group"
import { subnets } from "../../../../lib/data"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function CreateStaticIPPage() {
  const router = useRouter()
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would reserve the IP address
    console.log("Reserving IP Address:", formData)
    router.push("/networking/static-ips")
  }

  // Filter only public subnets
  const publicSubnets = subnets.filter((subnet) => subnet.type === "Public")

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Networking", href: "/networking" },
          { name: "Static IP Addresses", href: "/networking/static-ips" },
          { name: "Reserve IP Address" },
        ]}
      />

      <h1 className="text-2xl font-semibold mb-8">Reserve IP Address</h1>

      <div className="rounded-[12px] bg-[#F5F7FA] p-8 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-5 pb-2.5 border-b border-border">IP Address Configuration</h2>

            <div className="mb-5">
              <Label htmlFor="subnet" className="block mb-2 font-medium">
                Subnet <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.subnet} onValueChange={(value) => handleSelectChange("subnet", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subnet" />
                </SelectTrigger>
                <SelectContent>
                  {publicSubnets.map((subnet) => (
                    <SelectItem key={subnet.id} value={subnet.id}>
                      {subnet.name} ({subnet.vpcName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs mt-1 text-muted-foreground">
                Only public subnets are available for IP address reservation.
              </p>
              <Button asChild size="sm" className="mt-2 bg-black text-white hover:bg-black/90 transition-colors">
                <Link href="/networking/subnets/create" className="flex items-center">
                  <Plus className="w-3 h-3 mr-1" />
                  Create Subnet
                </Link>
              </Button>
            </div>

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
                  <Label htmlFor="ipv6" className="ml-2 text-muted-foreground">
                    IPv6 (Coming Soon)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="rounded-[12px] bg-white p-4 mb-8 shadow-sm">
            <div className="font-semibold mb-2">Price Details</div>
            <div className="flex justify-between text-sm mb-1">
              <span>Static IP Address (IPv4)</span>
              <span>₹0.005 per hour</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Estimated monthly cost (730 hours)</span>
              <span>₹3.65</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border mt-2">
              <span>Total</span>
              <span>₹0.005 per hour</span>
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
      </div>
    </div>
  )
}
