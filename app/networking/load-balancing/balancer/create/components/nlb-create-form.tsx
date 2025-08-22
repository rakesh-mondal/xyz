"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { HelpCircle, Plus, Trash2 } from "lucide-react"
import { BasicSection } from "./sections/basic-section"
import { PoolSection } from "./sections/pool-section"

import type { LoadBalancerConfiguration } from "../page"

export interface NLBFormData {
  // Basics
  name: string
  description: string
  loadBalancerType: string
  region: string
  vpc: string
  subnet: string
  
  // Listeners with only pools (no policies/rules for NLB)
  listeners: Array<{
    id: string
    name: string
    protocol: string
    port: number
    alpnProtocol: string
    certificate: string
    
    // Only pools for NLB - no policies or rules
    pools: Array<{
      id: string
      name: string
      protocol: string
      algorithm: string
      targetGroup: string
    }>
  }>
}

interface NLBCreateFormProps {
  config: LoadBalancerConfiguration
  onBack: () => void
  onCancel: () => void
}

const getLoadBalancerTypeName = (config: LoadBalancerConfiguration) => {
  return config.loadBalancerType === "ALB" ? "Application Load Balancer" : "Network Load Balancer"
}

// Helper component for individual NLB listener configuration
interface NLBListenerCardProps {
  listener: NLBFormData['listeners'][0]
  updateListener: (listenerId: string, field: string, value: any) => void
}

function NLBListenerCard({ listener, updateListener }: NLBListenerCardProps) {
  const protocolOptions = [
    { value: "TCP", label: "TCP", defaultPort: 80 },
    { value: "UDP", label: "UDP", defaultPort: 80 },
    { value: "TCP_UDP", label: "TCP_UDP", defaultPort: 80 },
    { value: "TLS", label: "TLS", defaultPort: 443 }
  ]

  const alpnProtocolOptions = [
    { value: "http/1.1", label: "HTTP/1.1" },
    { value: "h2", label: "HTTP/2" },
    { value: "h2c", label: "HTTP/2 over cleartext" }
  ]

  const certificateOptions = [
    { value: "cert-1", label: "wildcard.example.com (*.example.com)" },
    { value: "cert-2", label: "api.example.com" },
    { value: "cert-3", label: "app.example.com" },
    { value: "cert-4", label: "staging.example.com" }
  ]

  const updateListenerField = (field: string, value: string | number) => {
    if (field === "protocol") {
      const protocol = protocolOptions.find(p => p.value === value)
      if (protocol) {
        updateListener(listener.id, field, value)
        updateListener(listener.id, "port", protocol.defaultPort)
      }
    } else {
      updateListener(listener.id, field, value)
    }
  }

  const updatePools = (section: string, data: any) => {
    // Handle the "pools" section
    if (section === "pools") {
      if (data.pools) {
        updateListener(listener.id, "pools", data.pools)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Listener Basic Configuration */}
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20">
          {/* Listener Name */}
          <div>
            <Label className="block mb-2 font-medium">
              Listener Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g., web-listener, api-listener"
              value={listener.name}
              onChange={(e) => updateListenerField("name", e.target.value)}
              className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          {/* Protocol */}
          <div>
            <Label className="block mb-2 font-medium">
              Protocol <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={listener.protocol} 
              onValueChange={(value) => updateListenerField("protocol", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select protocol" />
              </SelectTrigger>
              <SelectContent>
                {protocolOptions.map((protocol) => (
                  <SelectItem key={protocol.value} value={protocol.value}>
                    {protocol.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Port */}
          <div>
            <Label className="block mb-2 font-medium">
              Port <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              min="1"
              max="65535"
              placeholder="80"
              value={listener.port}
              onChange={(e) => updateListenerField("port", parseInt(e.target.value) || 80)}
              className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Port auto-fills based on protocol selection
            </p>
          </div>

          {/* ALPN Protocol */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="font-medium">
                ALPN Protocol
              </Label>
              <TooltipWrapper 
                content="Application-Layer Protocol Negotiation allows the client and server to negotiate which protocol should be performed over a secure connection."
                side="top"
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipWrapper>
            </div>
            <Select 
              value={listener.alpnProtocol} 
              onValueChange={(value) => updateListenerField("alpnProtocol", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ALPN protocol" />
              </SelectTrigger>
              <SelectContent>
                {alpnProtocolOptions.map((protocol) => (
                  <SelectItem key={protocol.value} value={protocol.value}>
                    {protocol.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Certificate */}
          {listener.protocol === "TLS" && (
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Label className="font-medium">
                  SSL Certificate <span className="text-destructive">*</span>
                </Label>
                <TooltipWrapper 
                  content="Select an SSL certificate for TLS listeners. The certificate must be valid and associated with your domain."
                  side="top"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                </TooltipWrapper>
              </div>
              <Select 
                value={listener.certificate} 
                onValueChange={(value) => updateListenerField("certificate", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SSL certificate" />
                </SelectTrigger>
                <SelectContent>
                  {certificateOptions.map((cert) => (
                    <SelectItem key={cert.value} value={cert.value}>
                      {cert.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Pool Section - No Policy & Rules for NLB */}
      <div className="space-y-4">
        <h4 className="font-medium text-base">Pool Configuration</h4>
        <PoolSection
          formData={{
            ...{} as any,
            pools: listener.pools
          }}
          updateFormData={updatePools}
          isSection={true}
        />
      </div>
    </div>
  )
}

export function NLBCreateForm({ config, onBack, onCancel }: NLBCreateFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<NLBFormData>({
    name: "",
    description: "",
    loadBalancerType: getLoadBalancerTypeName(config),
    region: "",
    vpc: "",
    subnet: "",
    listeners: []
  })

  // Initialize with default listener
  useEffect(() => {
    if (formData.listeners.length === 0) {
      setFormData(prev => ({
        ...prev,
        listeners: [createNewListener()]
      }))
    }
  }, [])

  const createNewListener = () => ({
    id: crypto.randomUUID(),
    name: "",
    protocol: "",
    port: 80,
    alpnProtocol: "",
    certificate: "",
    pools: [{
      id: crypto.randomUUID(),
      name: "",
      protocol: "",
      algorithm: "",
      targetGroup: ""
    }]
  })

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }))
  }

  const addListener = () => {
    setFormData(prev => ({
      ...prev,
      listeners: [...prev.listeners, createNewListener()]
    }))
  }

  const removeListener = (listenerId: string) => {
    if (formData.listeners.length > 1) {
      setFormData(prev => ({
        ...prev,
        listeners: prev.listeners.filter(listener => listener.id !== listenerId)
      }))
    }
  }

  const updateListener = (listenerId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      listeners: prev.listeners.map(listener =>
        listener.id === listenerId ? { ...listener, [field]: value } : listener
      )
    }))
  }

  const handleReviewAndCreate = () => {
    // Navigate to summary page with form data
    router.push(`/networking/load-balancing/balancer/create/summary?config=${JSON.stringify(config)}&data=${JSON.stringify(formData)}`)
  }

  const isFormValid = () => {
    const basicValid = formData.name?.trim().length > 0 && 
                      formData.region?.length > 0 && 
                      formData.vpc?.length > 0 &&
                      formData.subnet?.length > 0

    // At least one listener must have basic configuration
    const listenersValid = formData.listeners.some(listener => 
      listener.name?.trim().length > 0 && 
      listener.protocol?.length > 0 &&
      listener.port > 0
    )
    
    return basicValid && listenersValid
  }

  return (
    <PageLayout
      title="Create Network Load Balancer"
      description="Configure your Network Load Balancer for high-performance TCP/UDP traffic routing"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardContent className="space-y-8 pt-6">
              {/* Required Section: Basics */}
              <div className="space-y-6">
                <BasicSection
                  formData={formData as any}
                  updateFormData={updateFormData}
                  isSection={true}
                />
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600" style={{ fontSize: '13px' }}>
                    Configure multiple listeners below. Each listener can have its own Pool configuration for TCP/UDP traffic routing.
                  </p>
                </div>
              </div>

              {/* Listeners Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Listeners Configuration</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addListener}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Listener
                  </Button>
                </div>

                {/* Listeners Accordion */}
                <Accordion type="multiple" className="w-full space-y-4">
                  {formData.listeners.map((listener, index) => (
                    <AccordionItem 
                      key={listener.id} 
                      value={listener.id}
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span>
                            Listener {index + 1}
                            {listener.name && ` - ${listener.name}`}
                            {listener.protocol && ` (${listener.protocol}:${listener.port})`}
                          </span>
                          {formData.listeners.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeListener(listener.id)
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <NLBListenerCard 
                          listener={listener}
                          updateListener={updateListener}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>

            {/* Submit Actions */}
            <div className="flex justify-end gap-4 px-6 pb-6">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-secondary transition-colors"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReviewAndCreate}
                disabled={!isFormValid()}
                className={`transition-colors ${
                  isFormValid() 
                    ? 'bg-black text-white hover:bg-black/90' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Review & Create
              </Button>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Best Practices */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Best Practices</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground text-sm">Use descriptive names for easy identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground text-sm">Basic configuration is required to create a load balancer</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground text-sm">Pool configuration can be updated later after creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground text-sm">Choose appropriate protocols for your traffic requirements</span>
                </li>
              </ul>
            </CardContent>
          </Card>

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
              <h3 className="text-base font-semibold">Estimated Cost</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹0.80</span>
                <span className="text-sm text-muted-foreground">per hour</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Network Load Balancer optimized for high-performance TCP/UDP traffic.
              </p>
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>• NLB Setup: ₹0.80/hour</p>
                <p>• Estimated monthly: ₹584.00</p>
                <p>• Data processing charges apply</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
