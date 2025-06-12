"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { VercelTabs } from "@/components/ui/vercel-tabs"

// Tab content components
function ASGSection() {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <h3 className="text-lg font-medium">Auto Scaling Groups</h3>
      <p className="text-sm text-muted-foreground mt-1">Create and manage auto scaling groups for your resources</p>
    </div>
  )
}

function TemplatesSection() {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <h3 className="text-lg font-medium">Auto Scaling Templates</h3>
      <p className="text-sm text-muted-foreground mt-1">Create and manage templates for your auto scaling configurations</p>
    </div>
  )
}

const tabs = [
  { id: "asg", label: "ASG" },
  { id: "templates", label: "Templates" },
]

export default function AutoScalingPage() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Determine active tab from URL, but don't change URL on tab change
  const getActiveTabFromPath = () => {
    if (pathname.includes('/asg')) return "asg"
    if (pathname.includes('/templates')) return "templates"
    return "asg" // default to asg
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
      case "asg":
        return { title: "Auto Scaling Groups", description: "Manage your auto scaling groups and configurations" }
      case "templates":
        return { title: "Auto Scaling Templates", description: "Manage your auto scaling templates and configurations" }
      default:
        return { title: "Auto Scaling", description: "Manage your auto scaling resources" }
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

        {activeTab === "asg" && <ASGSection />}
        {activeTab === "templates" && <TemplatesSection />}
      </div>
    </PageLayout>
  )
}
