"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Label } from "../../../../components/ui/label"
import { Badge } from "../../../../components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion"
import { TooltipWrapper } from "../../../../components/ui/tooltip-wrapper"
import { HelpCircle } from "lucide-react"

export default function CreateVPCPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    vpcName: "",
    region: "",
    description: "",
    subnetName: "",
    subnetDescription: "",
    cidr: "",
    gatewayIp: "",
    networkAccessibility: "",
  })

  // Mock data to check if this is the first VPC
  const [isFirstVPC] = useState(true) // This would come from your data/API

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
    <PageLayout 
      title="Create Virtual Private Cloud" 
      description="Configure and create a new Virtual Private Cloud for your infrastructure"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
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

                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      You can configure specific settings such as the Subnet, CIDR block, and Gateway IP in the advanced settings.
                    </p>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="mb-8">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="advanced-settings">
                      <AccordionTrigger className="text-base font-semibold">
                        Advanced Settings
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4">
                          <div className="mb-5">
                            <div className="flex items-center gap-2 mb-2">
                              <Label htmlFor="subnetName" className="font-medium">
                                Subnet Name
                              </Label>
                              <TooltipWrapper 
                                content="Name for your subnet. Use letters, numbers, hyphens, underscores."
                                side="top"
                              >
                                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                              </TooltipWrapper>
                            </div>
                            <Input
                              id="subnetName"
                              placeholder="Enter subnet name"
                              value={formData.subnetName}
                              onChange={handleChange}
                              className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            />
                          </div>

                          <div className="mb-5">
                            <Label htmlFor="subnetDescription" className="block mb-2 font-medium">
                              Subnet Description
                            </Label>
                            <Textarea
                              id="subnetDescription"
                              placeholder="Enter subnet description"
                              value={formData.subnetDescription}
                              onChange={handleChange}
                              className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                            />
                          </div>

                          {/* CIDR, Gateway IP, and Network Accessibility in one row */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Label htmlFor="cidr" className="font-medium">
                                  CIDR
                                </Label>
                                <TooltipWrapper 
                                  content="IP range for subnet. Example: 10.0.0.0/24 = 254 IPs"
                                  side="top"
                                >
                                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                                </TooltipWrapper>
                              </div>
                              <Input
                                id="cidr"
                                placeholder="e.g., 10.0.0.0/24"
                                value={formData.cidr}
                                onChange={handleChange}
                                className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                IP address range in CIDR notation
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Label htmlFor="gatewayIp" className="font-medium">
                                  Gateway IP
                                </Label>
                                <TooltipWrapper 
                                  content="Default gateway IP. Usually first IP in range (e.g., 10.0.0.1)"
                                  side="top"
                                >
                                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                                </TooltipWrapper>
                              </div>
                              <Input
                                id="gatewayIp"
                                placeholder="e.g., 10.0.0.1"
                                value={formData.gatewayIp}
                                onChange={handleChange}
                                className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Gateway IP address
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Label htmlFor="networkAccessibility" className="font-medium">
                                  Network Accessibility
                                </Label>
                                <TooltipWrapper 
                                  content="Private: isolated from internet. Public: internet accessible"
                                  side="top"
                                >
                                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                                </TooltipWrapper>
                              </div>
                              <Select value={formData.networkAccessibility} onValueChange={(value) => handleSelectChange("networkAccessibility", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select accessibility" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="private">Private</SelectItem>
                                  <SelectItem value="public">Public</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-1">
                                Internet accessibility
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 px-6">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-secondary transition-colors"
                onClick={() => router.push("/networking/vpc")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-black text-white hover:bg-black/90 transition-colors hover:scale-105"
                onClick={handleSubmit}
              >
                Create VPC
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Side Panel */}
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
              <CardTitle className="text-base">Configuration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Choose a descriptive VPC name for easy identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Select the region closest to your users for better performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Use private networks for better security</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">Plan your CIDR blocks to avoid IP conflicts</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
