"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { VercelTabs } from "@/components/ui/vercel-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Server, Play, Square, RotateCcw, Settings, Monitor, Activity } from "lucide-react"
import { CpuPricingCards } from "./cpu/components/pricing-cards"
import { GpuPricingCards } from "./gpu/components/pricing-cards"

// VM Data and interfaces
interface VirtualMachine {
  id: string
  name: string
  status: "running" | "stopped" | "pending" | "error"
  vcpus: number
  memory: string
  storage: string
  os: string
  region: string
  uptime: string
  ip: string
}

const mockVMs: VirtualMachine[] = [
  {
    id: "vm-001",
    name: "Web Server 01",
    status: "running",
    vcpus: 4,
    memory: "16 GB",
    storage: "100 GB SSD",
    os: "Ubuntu 22.04",
    region: "us-west-1",
    uptime: "15 days",
    ip: "192.168.1.10"
  },
  {
    id: "vm-002",
    name: "Database Server",
    status: "running",
    vcpus: 8,
    memory: "32 GB",
    storage: "500 GB SSD",
    os: "CentOS 8",
    region: "us-west-1",
    uptime: "23 days",
    ip: "192.168.1.20"
  },
  {
    id: "vm-003",
    name: "Development Server",
    status: "stopped",
    vcpus: 2,
    memory: "8 GB",
    storage: "50 GB SSD",
    os: "Ubuntu 22.04",
    region: "us-east-1",
    uptime: "0 days",
    ip: "192.168.1.30"
  },
  {
    id: "vm-004",
    name: "Load Balancer",
    status: "pending",
    vcpus: 2,
    memory: "4 GB",
    storage: "20 GB SSD",
    os: "Alpine Linux",
    region: "us-west-1",
    uptime: "0 days",
    ip: "pending"
  }
]

// Tab content components - CPU VM with simple placeholder
function CpuVmSection() {
  return (
    <div className="space-y-6">
      <CpuPricingCards />
    </div>
  )
}

function GpuVmSection() {
  return (
    <div className="space-y-6">
      <GpuPricingCards />
    </div>
  )
}

function GpuBaremetalSection() {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <h3 className="text-lg font-medium">GPU Baremetal Content</h3>
      <p className="text-sm text-muted-foreground mt-1">This is a placeholder for GPU Baremetal management interface</p>
    </div>
  )
}

function MyInstancesSection() {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <h3 className="text-lg font-medium">My Instances Content</h3>
      <p className="text-sm text-muted-foreground mt-1">This is a placeholder for instance management interface</p>
    </div>
  )
}

const tabs = [
  { id: "cpu", label: "CPU VMs" },
  { id: "gpu", label: "GPU VMs" },
  { id: "gpu-baremetal", label: "GPU Baremetal" },
  { id: "instances", label: "My Instances" },
]

export default function VMsPage() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Determine active tab from URL, but don't change URL on tab change
  const getActiveTabFromPath = () => {
    if (pathname.includes('/cpu')) return "cpu"
    if (pathname.includes('/gpu')) return "gpu" 
    if (pathname.includes('/gpu-baremetal')) return "gpu-baremetal"
    if (pathname.includes('/instances')) return "instances"
    return "cpu" // default to cpu
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath())

  // Handle tab change without URL navigation to prevent refreshes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // Don't navigate - just change the local state
  }

  // Update active tab when URL changes (for direct navigation)
  useEffect(() => {
    setActiveTab(getActiveTabFromPath())
  }, [pathname])

  // Get title and description based on active tab
  const getPageInfo = () => {
    switch (activeTab) {
      case "cpu":
        return { title: "CPU Virtual Machines", description: "Create and manage CPU-based virtual machines" }
      case "gpu":
        return { title: "GPU Virtual Machines", description: "Create and manage GPU-accelerated virtual machines" }
      case "ai-pods":
        return { title: "AI Pods", description: "Manage specialized AI compute pods for machine learning workloads" }
      case "instances":
        return { title: "My Instances", description: "View and manage all your virtual machine instances" }
      case "images":
        return { title: "Machine Images", description: "Manage your virtual machine images and templates" }
      default:
        return { title: "Virtual Machines", description: "Manage your virtual machine resources" }
    }
  }

  const { title, description } = getPageInfo()

  return (
    <PageLayout title={title} description={description}>
      <div className="space-y-6">
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          size="lg"
        />

        {activeTab === "cpu" && <CpuVmSection />}
        {activeTab === "gpu" && <GpuVmSection />}
        {activeTab === "gpu-baremetal" && <GpuBaremetalSection />}
        {activeTab === "instances" && <MyInstancesSection />}
      </div>
    </PageLayout>
  )
} 