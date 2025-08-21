"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BasicSection } from "./sections/basic-section"
import { ListenersSection } from "./sections/listeners-section"
import { PolicyRulesSection } from "./sections/policy-rules-section"
import { PoolSection } from "./sections/pool-section"

import type { LoadBalancerConfiguration } from "../page"

export interface ALBFormData {
  // Basics
  name: string
  description: string
  loadBalancerType: string
  region: string
  vpc: string
  subnet: string
  
  // Listeners
  listeners: Array<{
    id: string
    name: string
    protocol: string
    port: number
    alpnProtocol: string
    certificate: string
  }>
  
  // Policy & Rules
  policies: Array<{
    id: string
    name: string
    action: string
  }>
  rules: Array<{
    id: string
    ruleType: string
    comparator: string
    value: string
    key?: string
  }>
  
  // Pool
  pools: Array<{
    id: string
    name: string
    protocol: string
    algorithm: string
    targetGroup: string
  }>
}

interface ALBCreateFormProps {
  config: LoadBalancerConfiguration
  onBack: () => void
  onCancel: () => void
}

const getFullLoadBalancerTypeName = (config: LoadBalancerConfiguration) => {
  const infrastructure = config.infrastructureType === "SW" ? "Software" : "Hardware (F5)"
  const type = config.loadBalancerType === "ALB" ? "Application Load Balancer" : "Network Load Balancer"
  return `${infrastructure} ${type}`
}

export function ALBCreateForm({ config, onBack, onCancel }: ALBCreateFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ALBFormData>({
    name: "",
    description: "",
    loadBalancerType: getFullLoadBalancerTypeName(config),
    region: "",
    vpc: "",
    subnet: "",
    listeners: [],
    policies: [],
    rules: [],
    pools: []
  })

  const sections = [
    { name: "Basics", component: BasicSection },
    { name: "Listeners", component: ListenersSection },
    { name: "Policy & Rules", component: PolicyRulesSection },
    { name: "Pool", component: PoolSection }
  ]

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }))
  }

  const handleReviewAndCreate = () => {
    // Navigate to summary page with form data
    router.push(`/networking/load-balancing/balancer/create/summary?config=${JSON.stringify(config)}&data=${JSON.stringify(formData)}`)
  }

  const isFormValid = () => {
    return formData.name?.trim().length > 0 && 
           formData.region?.length > 0 && 
           formData.vpc?.length > 0 &&
           formData.subnet?.length > 0
  }

  return (
    <PageLayout
      title={`Create Application Load Balancer (${config.infrastructureType})`}
      description="Configure your Application Load Balancer with advanced routing and SSL termination"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardContent className="space-y-8 pt-6">
              {/* Required Section: Basics */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Load Balancer Configuration</h3>
                <BasicSection
                  formData={formData}
                  updateFormData={updateFormData}
                  isSection={true}
                />
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600" style={{ fontSize: '13px' }}>
                    You can configure advanced settings such as Listeners, Policy & Rules, and Pools in the optional sections below.
                  </p>
                </div>
              </div>

              {/* Optional Sections in Accordion */}
              <div>
                <Accordion type="multiple" className="w-full">
                  {sections.slice(1).map((section, index) => {
                    const SectionComponent = section.component
                    const sectionName = section.name === "Policy & Rules" ? "Policy & Rules Configuration" : `${section.name} Configuration`
                    return (
                      <AccordionItem key={section.name} value={section.name.toLowerCase().replace(/\s+/g, '-')}>
                        <AccordionTrigger className="text-base font-semibold">
                          {sectionName}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4">
                            <SectionComponent
                              formData={formData}
                              updateFormData={updateFormData}
                              isSection={true}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
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
          {/* Configuration Summary */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Configuration</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Infrastructure:</span>
                  <Badge variant="outline">{config.infrastructureType}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">{config.loadBalancerType}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Layout:</span>
                  <span className="font-medium">Single Card</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <span className="text-muted-foreground text-sm">Optional sections can be configured later after creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground text-sm">Configure listeners and rules for advanced routing</span>
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
                <span className="text-2xl font-bold">₹1.20</span>
                <span className="text-sm text-muted-foreground">per hour</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Application Load Balancer with {config.infrastructureType === "SW" ? "software" : "hardware"} infrastructure.
              </p>
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>• ALB Setup: ₹1.20/hour</p>
                <p>• Estimated monthly: ₹876.00</p>
                <p>• Data processing charges apply</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
