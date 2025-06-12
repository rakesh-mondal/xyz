"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { VercelTabs } from "@/components/ui/vercel-tabs"
import { Button } from "@/components/ui/button"

// Tab content components
function VolumesSection() {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <h3 className="text-lg font-medium">Block Storage Volumes</h3>
      <p className="text-sm text-muted-foreground mt-1">Provision, manage, and attach block storage volumes to your cloud resources</p>
    </div>
  )
}

function SnapshotsSection() {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <h3 className="text-lg font-medium">Volume Snapshots</h3>
      <p className="text-sm text-muted-foreground mt-1">Create and manage snapshots of your block storage volumes</p>
    </div>
  )
}

function BackupSection() {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <h3 className="text-lg font-medium">Volume Backups</h3>
      <p className="text-sm text-muted-foreground mt-1">Create and manage backups of your block storage volumes</p>
    </div>
  )
}

const tabs = [
  { id: "volumes", label: "Volumes" },
  { id: "snapshots", label: "Snapshots" },
  { id: "backup", label: "Backup" },
]

export default function BlockStoragePage() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Determine active tab from URL, but don't change URL on tab change
  const getActiveTabFromPath = () => {
    if (pathname.includes('/volumes')) return "volumes"
    if (pathname.includes('/snapshots')) return "snapshots"
    if (pathname.includes('/backup')) return "backup"
    return "volumes" // default to volumes
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
      case "volumes":
        return { 
          title: "Block Storage", 
          description: "Provision, manage, and attach block storage volumes to your cloud resources."
        }
      case "snapshots":
        return { 
          title: "Block Storage", 
          description: "Provision, manage, and attach block storage volumes to your cloud resources."
        }
      case "backup":
        return { 
          title: "Block Storage", 
          description: "Provision, manage, and attach block storage volumes to your cloud resources."
        }
      default:
        return { 
          title: "Block Storage", 
          description: "Manage your block storage resources"
        }
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

        {activeTab === "volumes" && <VolumesSection />}
        {activeTab === "snapshots" && <SnapshotsSection />}
        {activeTab === "backup" && <BackupSection />}
      </div>
    </PageLayout>
  )
}
