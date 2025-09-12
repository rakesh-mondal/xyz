"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function CreateClusterPage() {
  // Form state
  const [formData, setFormData] = useState({
    region: "",
    vpcId: "",
    subnetId: "",
    kubernetesVersion: "",
    podCIDR: "10.244.0.0/16",
    serviceCIDR: "10.96.0.0/12",
    apiServerAccess: "public"
  })
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formTouched, setFormTouched] = useState(false)

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.region) {
      newErrors.region = "Region is required"
    }
    if (!formData.vpcId) {
      newErrors.vpcId = "VPC is required"
    }
    if (!formData.subnetId) {
      newErrors.subnetId = "Subnet is required"
    }
    if (!formData.kubernetesVersion) {
      newErrors.kubernetesVersion = "Kubernetes version is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check if form is valid
  const isFormValid = () => {
    return !!(
      formData.region &&
      formData.vpcId &&
      formData.subnetId &&
      formData.kubernetesVersion
    )
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormTouched(true)
    
    if (validateForm()) {
      // Form is valid - would normally submit here
      console.log("Form submitted:", formData)
      alert("Cluster creation started! (This is a design prototype)")
    }
  }

  // Handle field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFormTouched(true)
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <PageLayout
      title="Set Up Your Cluster"
      description="Configure and deploy a new Kubernetes cluster with enterprise-grade reliability"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Configuration Form */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
              {/* Region Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Region <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.region} onValueChange={(value) => handleFieldChange('region', value)}>
                  <SelectTrigger className={formTouched && !formData.region ? 'border-red-300 bg-red-50' : ''}>
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
                {errors.region && (
                  <p className="text-sm text-red-600 mt-1">{errors.region}</p>
                )}
              </div>

              {/* VPC Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  VPC <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.vpcId} onValueChange={(value) => handleFieldChange('vpcId', value)}>
                  <SelectTrigger className={formTouched && !formData.vpcId ? 'border-red-300 bg-red-50' : ''}>
                    <SelectValue placeholder="Select VPC to isolate your workload" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vpc-1">Default VPC (10.0.0.0/16)</SelectItem>
                    <SelectItem value="vpc-2">Production VPC (172.16.0.0/16)</SelectItem>
                    <SelectItem value="vpc-3">Development VPC (192.168.0.0/16)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.vpcId && (
                  <p className="text-sm text-red-600 mt-1">{errors.vpcId}</p>
                )}
              </div>

              {/* Subnet Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Subnet <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.subnetId} onValueChange={(value) => handleFieldChange('subnetId', value)}>
                  <SelectTrigger className={formTouched && !formData.subnetId ? 'border-red-300 bg-red-50' : ''}>
                    <SelectValue placeholder="Select a subnet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subnet-1">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Public Subnet 1</span>
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            Public
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground ml-2">
                          10.0.1.0/24 • us-east-1a
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="subnet-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Private Subnet 1</span>
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                            Private
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground ml-2">
                          10.0.2.0/24 • us-east-1b
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.subnetId && (
                  <p className="text-sm text-red-600 mt-1">{errors.subnetId}</p>
                )}
              </div>

              {/* Kubernetes Version */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Kubernetes Version <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.kubernetesVersion} onValueChange={(value) => handleFieldChange('kubernetesVersion', value)}>
                  <SelectTrigger className={formTouched && !formData.kubernetesVersion ? 'border-red-300 bg-red-50' : ''}>
                    <SelectValue placeholder="Select a version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.29.0">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">1.29.0</span>
                          <Badge variant="secondary" className="text-xs">
                            Recommended
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground ml-4">
                          EOL: Dec 2024
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="1.28.5">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">1.28.5</span>
                        </div>
                        <span className="text-sm text-muted-foreground ml-4">
                          EOL: Oct 2024
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.kubernetesVersion && (
                  <p className="text-sm text-red-600 mt-1">{errors.kubernetesVersion}</p>
                )}
              </div>

              {/* Network Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Network Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pod CIDR */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="font-medium">
                        Pod CIDR <span className="text-destructive">*</span>
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>IP address range for pods in your worker nodes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      value={formData.podCIDR}
                      onChange={(e) => handleFieldChange('podCIDR', e.target.value)}
                      className="font-mono"
                      placeholder="10.244.0.0/16"
                    />
                  </div>

                  {/* Service CIDR */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="font-medium">
                        Service CIDR <span className="text-destructive">*</span>
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>IP address range for services which will be connected to the pods in your worker nodes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      value={formData.serviceCIDR}
                      onChange={(e) => handleFieldChange('serviceCIDR', e.target.value)}
                      className="font-mono"
                      placeholder="10.96.0.0/12"
                    />
                  </div>
                </div>
              </div>

              {/* API Server Access */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  API Server Access
                </Label>
                <RadioGroup 
                  value={formData.apiServerAccess} 
                  onValueChange={(value) => handleFieldChange('apiServerAccess', value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="flex-1">
                      <div className="font-medium">Public</div>
                      <div className="text-sm text-muted-foreground">
                        Accessible via internet
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              </form>
            </CardContent>
            
            <div className="flex justify-end gap-4 px-6 pb-6">
              <Button variant="outline" asChild>
                <Link href="/kubernetes">Cancel</Link>
              </Button>
              <Button 
                type="submit"
                disabled={!isFormValid()}
                className={`transition-colors ${
                  isFormValid() 
                    ? 'bg-black text-white hover:bg-black/90' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleSubmit}
              >
                Start Cluster Creation
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Side Panel */}
        <div className="w-full md:w-80 space-y-6">
          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-normal">Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose the region closest to your users for better performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use private subnets for enhanced security</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Select latest stable Kubernetes version for security patches</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Plan node pool sizing based on your workload requirements</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Estimated Costs */}
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
                <h3 className="text-base font-semibold">Estimated Costs</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cluster</span>
                  <div className="text-right">
                    <div className="font-medium">₹2.50/hr</div>
                    <div className="text-xs text-muted-foreground">₹1,800/mo</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <div className="text-right">
                    <div>₹2.50/hr</div>
                    <div className="text-sm text-muted-foreground">₹1,800/mo</div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>• Node pools will be configured in the next step</p>
                <p>• Costs are estimates only</p>
                <p>• Actual billing may vary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}