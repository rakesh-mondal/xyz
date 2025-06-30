"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { VercelTabs } from "@/components/ui/vercel-tabs"
import { Button } from "@/components/ui/button"
import { CreateButton } from "@/components/create-button"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { StatusBadge } from "@/components/status-badge"
import { ActionMenu } from "@/components/action-menu"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { ExtendVolumeModal } from "@/components/modals/extend-volume-modal"
import { useToast } from "@/hooks/use-toast"

// Mock data for block storage volumes
const mockVolumes = [
  {
    id: "vol-001",
    name: "web-server-root",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Bootable",
    size: "50",
    attachedInstance: "web-server-01",
    vpc: "vpc-main-prod",
    status: "attached",
    createdOn: "2024-01-15T10:30:00Z",
  },
  {
    id: "vol-002", 
    name: "database-storage",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "200",
    attachedInstance: "db-server-01",
    vpc: "vpc-main-prod",
    status: "attached",
    createdOn: "2024-01-20T14:22:00Z",
  },
  {
    id: "vol-003",
    name: "backup-volume",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "500",
    attachedInstance: "-",
    vpc: "vpc-backup",
    status: "available",
    createdOn: "2024-02-01T09:15:00Z",
  },
  {
    id: "vol-004",
    name: "temp-processing",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "100",
    attachedInstance: "worker-node-03",
    vpc: "vpc-main-prod",
    status: "attached",
    createdOn: "2024-02-10T16:45:00Z",
  },
  {
    id: "vol-005",
    name: "logs-storage",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "80",
    attachedInstance: "-",
    vpc: "vpc-logs",
    status: "creating",
    createdOn: "2024-02-15T12:30:00Z",
  },
  {
    id: "vol-006",
    name: "app-server-data",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "150",
    attachedInstance: "app-server-02",
    vpc: "vpc-main-prod",
    status: "attached",
    createdOn: "2024-02-20T08:15:00Z",
  },
  {
    id: "vol-007",
    name: "cache-volume",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "75",
    attachedInstance: "cache-server-01",
    vpc: "vpc-main-prod",
    status: "attached",
    createdOn: "2024-02-22T11:20:00Z",
  },
  {
    id: "vol-008",
    name: "staging-root",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Bootable",
    size: "40",
    attachedInstance: "staging-server-01",
    vpc: "vpc-staging",
    status: "attached",
    createdOn: "2024-02-25T14:30:00Z",
  },
  {
    id: "vol-009",
    name: "analytics-storage",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "300",
    attachedInstance: "-",
    vpc: "vpc-analytics",
    status: "available",
    createdOn: "2024-03-01T09:45:00Z",
  },
  {
    id: "vol-010",
    name: "test-environment",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "60",
    attachedInstance: "test-server-01",
    vpc: "vpc-testing",
    status: "attached",
    createdOn: "2024-03-05T16:10:00Z",
  },
  {
    id: "vol-011",
    name: "media-storage",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "1000",
    attachedInstance: "-",
    vpc: "vpc-media",
    status: "available",
    createdOn: "2024-03-08T13:25:00Z",
  },
  {
    id: "vol-012",
    name: "backup-secondary",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "750",
    attachedInstance: "-",
    vpc: "vpc-backup",
    status: "creating",
    createdOn: "2024-03-10T10:00:00Z",
  },
  {
    id: "vol-013",
    name: "ml-training-data",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "2000",
    attachedInstance: "ml-server-01",
    vpc: "vpc-ml",
    status: "attached",
    createdOn: "2024-03-12T07:30:00Z",
  },
  {
    id: "vol-014",
    name: "dev-workspace",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "120",
    attachedInstance: "dev-server-01",
    vpc: "vpc-development",
    status: "attached",
    createdOn: "2024-03-15T15:20:00Z",
  },
  {
    id: "vol-015",
    name: "monitoring-logs",
    type: "High-speed NVME SSD Storage (HNSS)",
    role: "Storage",
    size: "90",
    attachedInstance: "-",
    vpc: "vpc-monitoring",
    status: "available",
    createdOn: "2024-03-18T12:45:00Z",
  },
]

// Tab content components with empty states
function VolumesSection() {
  const [selectedVolume, setSelectedVolume] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)
  const [volumeToExtend, setVolumeToExtend] = useState<any>(null)
  const { toast } = useToast()

  const handleDeleteClick = (volume: any) => {
    setSelectedVolume(volume)
    setIsDeleteModalOpen(true)
  }

  const handleExtendVolume = (volume: any) => {
    setVolumeToExtend(volume)
    setIsExtendModalOpen(true)
  }

  const handleCreateSnapshot = (volume: any) => {
    // Navigate to create snapshot page with volume context
    window.location.href = `/storage/block/snapshots/create?volumeId=${volume.id}`
  }

  const handleDeleteConfirm = async () => {
    if (!selectedVolume) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Volume deleted successfully",
        description: `${selectedVolume.name} has been deleted.`,
      })

      // In a real app, you would refresh the data here
      console.log(`Deleting volume: ${selectedVolume.name}`)
      
      setIsDeleteModalOpen(false)
      setSelectedVolume(null)
    } catch (error) {
      toast({
        title: "Failed to delete volume",
        description: "An error occurred while deleting the volume.",
        variant: "destructive",
      })
    }
  }

  const handleExtendConfirm = async (newSize: number) => {
    if (!volumeToExtend) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would update the volume data here
      console.log(`Extending volume ${volumeToExtend.name} to ${newSize} GB`)
      
      // Close modal and reset state
      setIsExtendModalOpen(false)
      setVolumeToExtend(null)
      
      // Refresh would happen in a real app
      // For now, just show success message via toast (handled in modal)
    } catch (error) {
      throw error // Let the modal handle the error
    }
  }

  const columns = [
    {
      key: "name",
      label: "Volume Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => {
        // Only show link for volumes with "attached" or "available" status
        if (row.status === "attached" || row.status === "available") {
          return (
            <a
              href={`/storage/block/volumes/${row.id}`}
              className="text-primary font-medium hover:underline text-sm"
            >
              {value}
            </a>
          );
        }
        // For "creating" status, just show plain text
        return <div className="font-medium text-sm">{value}</div>;
      },
    },
    {
      key: "type",
      label: "Volume Type",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">{value}</div>
      ),
    },
    {
      key: "role",
      label: "Volume Role",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">{value}</div>
      ),
    },
    {
      key: "size",
      label: "Size (In GB)",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">{value} GB</div>
      ),
    },
    {
      key: "attachedInstance",
      label: "Attached Instance Name",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="text-sm">{value === "-" ? "Not attached" : value}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "actions",
      label: "Action",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/storage/block/volumes/${row.id}`}
            editHref={row.status !== "creating" ? `/storage/block/volumes/${row.id}/edit` : undefined}
            onExtend={row.status !== "creating" ? () => handleExtendVolume(row) : undefined}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType="Volume"
            deleteLabel="Delete Volume"
          />
        </div>
      ),
    },
  ]

  // Add actions property to each volume row for DataTable
  const dataWithActions = mockVolumes.map((volume) => ({ ...volume, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  // Get unique VPCs for filter options
  const vpcOptions = Array.from(new Set(mockVolumes.map(volume => volume.vpc)))
    .map(vpc => ({ value: vpc, label: vpc }))

  // Add "All VPCs" option at the beginning
  vpcOptions.unshift({ value: "all", label: "All VPCs" })

  return (
    <div className="space-y-6">
      <ShadcnDataTable
        columns={columns}
        data={dataWithActions}
        searchableColumns={["name", "attachedInstance"]}
        defaultSort={{ column: "status", direction: "asc" }}
        pageSize={10}
        enableSearch={true}
        enablePagination={true}
        onRefresh={handleRefresh}
        enableVpcFilter={true}
        vpcOptions={vpcOptions}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={selectedVolume?.name || ""}
        resourceType="Volume"
        onConfirm={handleDeleteConfirm}
      />

      {volumeToExtend && (
        <ExtendVolumeModal
          isOpen={isExtendModalOpen}
          onClose={() => {
            setIsExtendModalOpen(false)
            setVolumeToExtend(null)
          }}
          volume={volumeToExtend}
          onConfirm={handleExtendConfirm}
        />
      )}
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
