"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { LoadBalancerConfigurationModal } from "./components/load-balancer-configuration-modal"
import { ALBCreateForm } from "./components/alb-create-form"

export type LoadBalancerConfiguration = {
  infrastructureType: "SW" | "HW" | ""
  loadBalancerType: "ALB" | "NLB" | ""
}

export default function CreateLoadBalancerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [config, setConfig] = useState<LoadBalancerConfiguration>({
    infrastructureType: "",
    loadBalancerType: ""
  })

  // Show modal on page load if no configuration is set
  useEffect(() => {
    if (!config.infrastructureType || !config.loadBalancerType) {
      setShowModal(true)
    }
  }, [])

  const handleConfigurationComplete = (configuration: LoadBalancerConfiguration) => {
    setConfig(configuration)
    setShowModal(false)
  }

  const handleModalClose = () => {
    // If modal is closed without selection, go back to list
    router.push("/networking/load-balancing/balancer")
  }

  const handleBack = () => {
    // Reset configuration and show modal again
    setConfig({ infrastructureType: "", loadBalancerType: "" })
    setShowModal(true)
  }

  // Show modal if configuration is not complete
  if (showModal || (!config.infrastructureType || !config.loadBalancerType)) {
    return (
      <PageLayout
        title="Create Load Balancer"
        description="Choose your load balancer configuration to get started"
      >
        <LoadBalancerConfigurationModal
          isOpen={showModal}
          onComplete={handleConfigurationComplete}
          onClose={handleModalClose}
        />
      </PageLayout>
    )
  }

  // Show appropriate form based on configuration
  if (config.loadBalancerType === "ALB") {
    return (
      <ALBCreateForm
        config={config}
        onBack={handleBack}
        onCancel={() => router.push("/networking/load-balancing/balancer")}
      />
    )
  }

  // Placeholder for NLB form (will be implemented later)
  return (
    <PageLayout
      title="Create Network Load Balancer"
      description="Network Load Balancer configuration form coming soon"
    >
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">NLB Configuration</h3>
          <p className="text-muted-foreground mb-4">
            Network Load Balancer form will be available soon
          </p>
          <button
            onClick={handleBack}
            className="text-primary hover:underline"
          >
            ← Back to Configuration
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
