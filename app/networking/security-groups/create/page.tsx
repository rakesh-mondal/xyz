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
import { vpcs } from "../../../../lib/data"
import Link from "next/link"
import { Plus } from "lucide-react"

interface Rule {
  id: string
  protocol: string
  portRange: string
  remoteIpPrefix: string
  description: string
}

export default function CreateSecurityGroupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    vpc: "",
    securityGroupFor: "vpc",
  })

  const [inboundRules, setInboundRules] = useState<Rule[]>([
    {
      id: "rule-1",
      protocol: "",
      portRange: "",
      remoteIpPrefix: "",
      description: "",
    },
  ])

  const [outboundRules, setOutboundRules] = useState<Rule[]>([
    {
      id: "out-rule-1",
      protocol: "all",
      portRange: "All",
      remoteIpPrefix: "0.0.0.0/0",
      description: "Allow all outbound traffic",
    },
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleRuleChange = (index: number, field: keyof Rule, value: string, isInbound: boolean) => {
    if (isInbound) {
      const newRules = [...inboundRules]
      newRules[index] = { ...newRules[index], [field]: value }
      setInboundRules(newRules)
    } else {
      const newRules = [...outboundRules]
      newRules[index] = { ...newRules[index], [field]: value }
      setOutboundRules(newRules)
    }
  }

  const addRule = (isInbound: boolean) => {
    if (isInbound) {
      setInboundRules([
        ...inboundRules,
        {
          id: `rule-${inboundRules.length + 1}`,
          protocol: "",
          portRange: "",
          remoteIpPrefix: "",
          description: "",
        },
      ])
    } else {
      setOutboundRules([
        ...outboundRules,
        {
          id: `out-rule-${outboundRules.length + 1}`,
          protocol: "",
          portRange: "",
          remoteIpPrefix: "",
          description: "",
        },
      ])
    }
  }

  const deleteRule = (index: number, isInbound: boolean) => {
    if (isInbound) {
      const newRules = [...inboundRules]
      newRules.splice(index, 1)
      setInboundRules(newRules)
    } else {
      const newRules = [...outboundRules]
      newRules.splice(index, 1)
      setOutboundRules(newRules)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create the security group
    console.log("Creating Security Group:", {
      ...formData,
      inboundRules,
      outboundRules,
    })
    router.push("/networking/security-groups")
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Networking", href: "/networking" },
          { name: "Security Groups", href: "/networking/security-groups" },
          { name: "Create Security Group" },
        ]}
      />

      <h1 className="text-2xl font-semibold mb-8">Create Security Group</h1>

      <div className="rounded-[12px] bg-[#F5F7FA] p-8 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-5 pb-2.5 border-b border-border">Basic Information</h2>

            <div className="mb-5">
              <Label htmlFor="name" className="block mb-2 font-medium">
                Security Group Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter security group name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-5">
              <Label htmlFor="description" className="block mb-2 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a description for this security group"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>

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
              <Button asChild size="sm" className="mt-2 bg-black text-white hover:bg-black/90 transition-colors">
                <Link href="/networking/vpc/create" className="flex items-center">
                  <Plus className="w-3 h-3 mr-1" />
                  Create VPC
                </Link>
              </Button>
            </div>

            <div className="mb-5">
              <Label htmlFor="securityGroupFor" className="block mb-2 font-medium">
                Security Group For <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.securityGroupFor}
                onValueChange={(value) => handleSelectChange("securityGroupFor", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vpc">VPC</SelectItem>
                  <SelectItem value="load-balancer" disabled>
                    Load Balancer (Coming Soon)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-5 pb-2.5 border-b border-border">Inbound Rules</h2>

            {inboundRules.map((rule, index) => (
              <div key={rule.id} className="rounded-lg bg-white p-5 mb-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-semibold">Rule {index + 1}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => deleteRule(index, true)}
                    className="text-sm underline hover:no-underline"
                  >
                    Delete
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block mb-2 font-medium">
                      Protocol <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={rule.protocol}
                      onValueChange={(value) => handleRuleChange(index, "protocol", value, true)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                        <SelectItem value="icmp">ICMP</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="block mb-2 font-medium">
                      Port Range <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="e.g., 80 or 8000-9000"
                      value={rule.portRange}
                      onChange={(e) => handleRuleChange(index, "portRange", e.target.value, true)}
                      required
                    />
                  </div>

                  <div>
                    <Label className="block mb-2 font-medium">
                      Remote IP Prefix <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="e.g., 0.0.0.0/0 or 192.168.1.0/24"
                      value={rule.remoteIpPrefix}
                      onChange={(e) => handleRuleChange(index, "remoteIpPrefix", e.target.value, true)}
                      required
                    />
                  </div>

                  <div>
                    <Label className="block mb-2 font-medium">Description</Label>
                    <Input
                      placeholder="e.g., Allow HTTP traffic"
                      value={rule.description}
                      onChange={(e) => handleRuleChange(index, "description", e.target.value, true)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="hover:bg-secondary transition-colors flex items-center"
              onClick={() => addRule(true)}
            >
              <span className="mr-1">+</span> Add Inbound Rule
            </Button>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-5 pb-2.5 border-b border-border">Outbound Rules</h2>

            {outboundRules.map((rule, index) => (
              <div key={rule.id} className="rounded-lg bg-white p-5 mb-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-semibold">Rule {index + 1}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => deleteRule(index, false)}
                    className="text-sm underline hover:no-underline"
                  >
                    Delete
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block mb-2 font-medium">
                      Protocol <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={rule.protocol}
                      onValueChange={(value) => handleRuleChange(index, "protocol", value, false)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                        <SelectItem value="icmp">ICMP</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="block mb-2 font-medium">
                      Port Range <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="e.g., 80 or 8000-9000"
                      value={rule.portRange}
                      onChange={(e) => handleRuleChange(index, "portRange", e.target.value, false)}
                      required
                    />
                  </div>

                  <div>
                    <Label className="block mb-2 font-medium">
                      Remote IP Prefix <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="e.g., 0.0.0.0/0 or 192.168.1.0/24"
                      value={rule.remoteIpPrefix}
                      onChange={(e) => handleRuleChange(index, "remoteIpPrefix", e.target.value, false)}
                      required
                    />
                  </div>

                  <div>
                    <Label className="block mb-2 font-medium">Description</Label>
                    <Input
                      placeholder="e.g., Allow all outbound traffic"
                      value={rule.description}
                      onChange={(e) => handleRuleChange(index, "description", e.target.value, false)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="hover:bg-secondary transition-colors flex items-center"
              onClick={() => addRule(false)}
            >
              <span className="mr-1">+</span> Add Outbound Rule
            </Button>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="hover:bg-secondary transition-colors"
              onClick={() => router.push("/networking/security-groups")}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-black/90 transition-colors hover:scale-105">
              Create Security Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
