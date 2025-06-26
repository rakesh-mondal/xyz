"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { VercelTabs } from "@/components/ui/vercel-tabs"
import { Button } from "@/components/ui/button"
import { CreateButton } from "@/components/create-button"

// Tab content components with empty states
function VolumesSection() {
  return (
    <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
      <div className="flex flex-col items-center justify-center py-12">
        {/* SVG Illustration */}
        <div className="mb-6">
          <svg width="215" height="140" viewBox="0 0 215 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="215" height="140" fill="#FFFFFF"></rect>
            <path d="M64 0L64 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M151 0L151 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M215 32H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M215 108H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M215 71H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M199 0L199 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M16 0L16 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M0 16L215 16" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M0 124L215 124" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M78.6555 76.8751L105.795 63.5757C106.868 63.05 108.132 63.05 109.205 63.5757L136.344 76.8751C137.628 77.5037 138.438 78.7848 138.438 80.1854V90.7764C138.438 92.177 137.628 93.4578 136.344 94.0867L109.205 107.386C108.132 107.912 106.868 107.912 105.795 107.386L78.6555 94.0867C77.3724 93.4581 76.5625 92.177 76.5625 90.7764V80.1854C76.5625 78.7848 77.3724 77.504 78.6555 76.8751Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
            <g opacity="0.6">
              <path d="M77.8 78.1958L107.5 93.2146L137.2 78.1958" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M107.5 107.445V93.2197" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
            <path d="M78.6555 47.0687L105.795 33.7693C106.868 33.2436 108.132 33.2436 109.205 33.7693L136.344 47.0687C137.628 47.6973 138.438 48.9784 138.438 50.379V60.97C138.438 62.3706 137.628 63.6514 136.344 64.2803L109.205 77.5797C108.132 78.1054 106.868 78.1054 105.795 77.5797L78.6555 64.2803C77.3724 63.6517 76.5625 62.3706 76.5625 60.97V50.379C76.5625 48.9784 77.3724 47.6976 78.6555 47.0687Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
            <g opacity="0.6">
              <path d="M77.8 48.3943L107.5 63.4133L137.2 48.3943" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M107.5 77.6435V63.4182" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
          </svg>
        </div>
        
        <div className="text-center space-y-4 max-w-md">
          <h4 className="text-lg font-medium text-foreground">No Volumes Found</h4>
          <div className="text-muted-foreground">
            <p className="text-sm">
              Create block storage volumes to provide persistent storage for your cloud resources and applications.{' '}
              <a href="/documentation/volumes" className="text-primary hover:underline">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button 
              onClick={() => window.location.href = '/storage/block/volumes/create'}
              size="sm"
            >
              Create Volume
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SnapshotsSection() {
  return (
    <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
      <div className="flex flex-col items-center justify-center py-12">
        {/* SVG Illustration */}
        <div className="mb-6">
          <svg width="215" height="140" viewBox="0 0 215 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="215" height="140" fill="#FFFFFF"></rect>
            <path d="M64 0L64 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M151 0L151 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M215 32H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M215 108H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M215 71H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M199 0L199 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M16 0L16 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M0 16L215 16" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M0 124L215 124" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M78.6555 76.8751L105.795 63.5757C106.868 63.05 108.132 63.05 109.205 63.5757L136.344 76.8751C137.628 77.5037 138.438 78.7848 138.438 80.1854V90.7764C138.438 92.177 137.628 93.4578 136.344 94.0867L109.205 107.386C108.132 107.912 106.868 107.912 105.795 107.386L78.6555 94.0867C77.3724 93.4581 76.5625 92.177 76.5625 90.7764V80.1854C76.5625 78.7848 77.3724 77.504 78.6555 76.8751Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
            <g opacity="0.6">
              <path d="M77.8 78.1958L107.5 93.2146L137.2 78.1958" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M107.5 107.445V93.2197" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
            <path d="M78.6555 47.0687L105.795 33.7693C106.868 33.2436 108.132 33.2436 109.205 33.7693L136.344 47.0687C137.628 47.6973 138.438 48.9784 138.438 50.379V60.97C138.438 62.3706 137.628 63.6514 136.344 64.2803L109.205 77.5797C108.132 78.1054 106.868 78.1054 105.795 77.5797L78.6555 64.2803C77.3724 63.6517 76.5625 62.3706 76.5625 60.97V50.379C76.5625 48.9784 77.3724 47.6976 78.6555 47.0687Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
            <g opacity="0.6">
              <path d="M77.8 48.3943L107.5 63.4133L137.2 48.3943" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M107.5 77.6435V63.4182" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
          </svg>
        </div>
        
        <div className="text-center space-y-4 max-w-md">
          <h4 className="text-lg font-medium text-foreground">No Snapshots Found</h4>
          <div className="text-muted-foreground">
            <p className="text-sm">
              Create snapshots to capture point-in-time copies of your volumes for backup and disaster recovery.{' '}
              <a href="/documentation/snapshots" className="text-primary hover:underline">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button 
              onClick={() => window.location.href = '/storage/block/snapshots/create'}
              size="sm"
            >
              Create Snapshot
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BackupSection() {
  return (
    <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
      <div className="flex flex-col items-center justify-center py-12">
        {/* SVG Illustration */}
        <div className="mb-6">
          <svg width="215" height="140" viewBox="0 0 215 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="215" height="140" fill="#FFFFFF"></rect>
            <path d="M64 0L64 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M151 0L151 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M215 32H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M215 108H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M215 71H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
            <path d="M199 0L199 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M16 0L16 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M0 16L215 16" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M0 124L215 124" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
            <path d="M78.6555 76.8751L105.795 63.5757C106.868 63.05 108.132 63.05 109.205 63.5757L136.344 76.8751C137.628 77.5037 138.438 78.7848 138.438 80.1854V90.7764C138.438 92.177 137.628 93.4578 136.344 94.0867L109.205 107.386C108.132 107.912 106.868 107.912 105.795 107.386L78.6555 94.0867C77.3724 93.4581 76.5625 92.177 76.5625 90.7764V80.1854C76.5625 78.7848 77.3724 77.504 78.6555 76.8751Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
            <g opacity="0.6">
              <path d="M77.8 78.1958L107.5 93.2146L137.2 78.1958" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M107.5 107.445V93.2197" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
            <path d="M78.6555 47.0687L105.795 33.7693C106.868 33.2436 108.132 33.2436 109.205 33.7693L136.344 47.0687C137.628 47.6973 138.438 48.9784 138.438 50.379V60.97C138.438 62.3706 137.628 63.6514 136.344 64.2803L109.205 77.5797C108.132 78.1054 106.868 78.1054 105.795 77.5797L78.6555 64.2803C77.3724 63.6517 76.5625 62.3706 76.5625 60.97V50.379C76.5625 48.9784 77.3724 47.6976 78.6555 47.0687Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
            <g opacity="0.6">
              <path d="M77.8 48.3943L107.5 63.4133L137.2 48.3943" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M107.5 77.6435V63.4182" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
          </svg>
        </div>
        
        <div className="text-center space-y-4 max-w-md">
          <h4 className="text-lg font-medium text-foreground">No Backups Found</h4>
          <div className="text-muted-foreground">
            <p className="text-sm">
              Create automated backups to ensure your data is protected and can be restored when needed.{' '}
              <a href="/documentation/backups" className="text-primary hover:underline">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button 
              onClick={() => window.location.href = '/storage/block/backup/create'}
              size="sm"
            >
              Create Backup
            </Button>
          </div>
        </div>
      </div>
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
          description: "Create and manage snapshots of your block storage volumes."
        }
      case "backup":
        return { 
          title: "Block Storage", 
          description: "Create and manage backups of your block storage volumes."
        }
      default:
        return { 
          title: "Block Storage", 
          description: "Manage your block storage resources"
        }
    }
  }

  // Get dynamic button info based on active tab
  const getButtonInfo = () => {
    switch (activeTab) {
      case "volumes":
        return { 
          href: "/storage/block/volumes/create", 
          label: "Create Volume"
        }
      case "snapshots":
        return { 
          href: "/storage/block/snapshots/create", 
          label: "Create Snapshot"
        }
      case "backup":
        return { 
          href: "/storage/block/backup/create", 
          label: "Create Backup"
        }
      default:
        return { 
          href: "/storage/block/volumes/create", 
          label: "Create Volume"
        }
    }
  }

  const { title, description } = getPageInfo()
  const { href, label } = getButtonInfo()

  return (
    <PageLayout 
      title={title} 
      description={description}
      headerActions={
        <CreateButton href={href} label={label} />
      }
    >
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
