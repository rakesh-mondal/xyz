"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Info } from "lucide-react"

import type { LoadBalancerConfiguration } from "../page"

interface LoadBalancerConfigurationModalProps {
  isOpen: boolean
  onComplete: (config: LoadBalancerConfiguration) => void
  onClose: () => void
}

export function LoadBalancerConfigurationModal({ isOpen, onComplete, onClose }: LoadBalancerConfigurationModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<"SW" | "HW" | "">("")
  const [selectedType, setSelectedType] = useState<"ALB" | "NLB" | "">("")



  const handleInfrastructureSelect = (type: "SW" | "HW") => {
    setSelectedInfrastructure(type)
  }

  const handleTypeSelect = (type: "ALB" | "NLB") => {
    setSelectedType(type)
  }

  const handleNextStep = () => {
    if (currentStep === 0 && selectedInfrastructure) {
      setCurrentStep(1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep === 1) {
      setCurrentStep(0)
      setSelectedType("") // Reset selection when going back
    }
  }

  const handleComplete = () => {
    if (selectedInfrastructure && selectedType) {
      onComplete({
        infrastructureType: selectedInfrastructure,
        loadBalancerType: selectedType
      })
    }
  }

  const isStepComplete = () => {
    if (currentStep === 0) return selectedInfrastructure !== ""
    if (currentStep === 1) return selectedType !== ""
    return false
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {currentStep === 0 ? "Choose Infrastructure Type" : "Load Balancer Type"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {currentStep === 0 
              ? "Select your infrastructure deployment preference" 
              : "Choose the type of load balancer based on your application needs"
            }
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Content */}
          <div className="px-6 py-6">
            {currentStep === 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                  {/* Software Load Balancer */}
                  <div 
                    className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
                      selectedInfrastructure === "SW" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 hover:bg-muted/20"
                    }`}
                    onClick={() => handleInfrastructureSelect("SW")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">Software Load Balancer</h3>
                          {selectedInfrastructure === "SW" ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Cloud-native, scalable load balancing solution with automatic provisioning and management.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Auto-scaling capabilities</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Cost-effective</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Easy management</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Quick deployment</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            <span>Recommended for most workloads</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hardware Load Balancer (F5) */}
                  <div 
                    className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
                      selectedInfrastructure === "HW" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 hover:bg-muted/20"
                    }`}
                    onClick={() => handleInfrastructureSelect("HW")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">Hardware Load Balancer (F5)</h3>
                          {selectedInfrastructure === "HW" ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Enterprise-grade F5 hardware appliances for maximum performance and advanced features.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Ultra-high performance</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Advanced security features</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Enterprise support</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Dedicated hardware</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            <span>Best for enterprise and high-traffic applications</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                  {/* Application Load Balancer */}
                  <div 
                    className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
                      selectedType === "ALB" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 hover:bg-muted/20"
                    }`}
                    onClick={() => handleTypeSelect("ALB")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">Application Load Balancer</h3>
                          {selectedType === "ALB" ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <Badge variant="outline" className="mb-3">Layer 7 (HTTP/HTTPS)</Badge>
                        <p className="text-sm text-muted-foreground mb-4">
                          Advanced routing, SSL termination, and content-based routing for web applications.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>HTTP/HTTPS traffic</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Content-based routing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>SSL termination</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>WebSocket support</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            <span>Best for web applications and microservices</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network Load Balancer */}
                  <div 
                    className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
                      selectedType === "NLB" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 hover:bg-muted/20"
                    }`}
                    onClick={() => handleTypeSelect("NLB")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">Network Load Balancer</h3>
                          {selectedType === "NLB" ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <Badge variant="outline" className="mb-3">Layer 4 (TCP/UDP)</Badge>
                        <p className="text-sm text-muted-foreground mb-4">
                          Ultra-high performance and low latency for TCP/UDP traffic with static IP support.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>TCP/UDP traffic</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Ultra-low latency</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>High throughput</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Static IP addresses</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded text-sm text-purple-700">
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            <span>Best for gaming, IoT, and real-time applications</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center border-t pt-4">
            <div className="flex gap-2">
              {currentStep === 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                >
                  ← Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              
              {currentStep === 0 && (
                <Button
                  onClick={handleNextStep}
                  disabled={!isStepComplete()}
                  className={`transition-colors ${
                    isStepComplete() 
                      ? 'bg-black text-white hover:bg-black/90' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </Button>
              )}

              {currentStep === 1 && (
                <Button
                  onClick={handleComplete}
                  disabled={!isStepComplete()}
                  className={`transition-colors ${
                    isStepComplete() 
                      ? 'bg-black text-white hover:bg-black/90' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Create Load Balancer
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
