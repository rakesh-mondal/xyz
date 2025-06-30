"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { PageLayout } from "../../../../../components/page-layout"
import { DetailSection } from "../../../../../components/detail-section"
import { DetailGrid } from "../../../../../components/detail-grid"
import { DetailItem } from "../../../../../components/detail-item"
import { Button } from "../../../../../components/ui/button"
import { DeleteConfirmationModal } from "../../../../../components/delete-confirmation-modal"
import { ShadcnDataTable } from "../../../../../components/ui/shadcn-data-table"
import { StatusBadge } from "../../../../../components/status-badge"
import { Edit, Trash2, Plus } from "lucide-react"
import { useToast } from "../../../../../hooks/use-toast"
import { ExtendVolumeModal } from "../../../../../components/modals/extend-volume-modal"

// Mock function to get volume by ID
const getVolume = (id: string) => {
  const mockVolumes = [
    {
      id: "vol-001",
      name: "web-server-root",
      description: "Root volume for production web server hosting main application",
      type: "High-speed NVME SSD Storage (HNSS)",
      role: "Bootable",
      size: "50",
      attachedInstances: ["web-server-01"],
      vpc: "vpc-main-prod",
      status: "attached",
      createdOn: "2024-01-15T10:30:00Z",
      updatedOn: "2024-01-15T10:30:00Z",
    },
    {
      id: "vol-002", 
      name: "database-storage",
      description: "High-performance storage for PostgreSQL database with automated backups",
      type: "High-speed NVME SSD Storage (HNSS)",
      role: "Storage",
      size: "200",
      attachedInstances: ["db-server-01"],
      vpc: "vpc-main-prod",
      status: "attached",
      createdOn: "2024-01-20T14:22:00Z",
      updatedOn: "2024-02-05T09:15:00Z",
    },
    {
      id: "vol-003",
      name: "backup-volume",
      description: "Secondary backup storage for critical data archival and disaster recovery",
      type: "High-speed NVME SSD Storage (HNSS)",
      role: "Storage",
      size: "500",
      attachedInstances: [],
      vpc: "vpc-backup",
      status: "available",
      createdOn: "2024-02-01T09:15:00Z",
      updatedOn: "2024-02-01T09:15:00Z",
    },
  ]
  
  return mockVolumes.find(volume => volume.id === id)
}

// Mock snapshot policies data
const mockSnapshotPolicies = [
  {
    id: "snap-policy-001",
    name: "daily-backup-policy",
    description: "Creates daily snapshots at 2 AM for point-in-time recovery",
    scheduler: "0 2 * * *",
    volumeId: "vol-001",
  },
  {
    id: "snap-policy-002",
    name: "hourly-db-snapshots",
    description: "Hourly database snapshots during business hours for high availability",
    scheduler: "0 9-17 * * 1-5",
    volumeId: "vol-002",
  },
]

// Mock backup policies data
const mockBackupPolicies = [
  {
    id: "backup-policy-001",
    name: "weekly-full-backup",
    description: "Full backup every Sunday at midnight with 30-day retention",
    scheduler: "0 0 * * 0",
    volumeId: "vol-001",
  },
  {
    id: "backup-policy-002",
    name: "incremental-backup",
    description: "Incremental backup every 6 hours with 7-day retention",
    scheduler: "0 */6 * * *",
    volumeId: "vol-002",
  },
]

export default function VolumeDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)
  const volume = getVolume(params.id)

  if (!volume) {
    notFound()
  }

  const handleDelete = () => {
    // In a real app, this would delete the volume
    console.log("Deleting volume:", volume.name)
    toast({
      title: "Volume deleted successfully",
      description: `${volume.name} has been deleted.`,
    })
    router.push("/storage/block")
  }

  const handleEdit = () => {
    router.push(`/storage/block/volumes/${volume.id}/edit`)
  }

  const handleExtend = () => {
    setIsExtendModalOpen(true)
  }

  const handleExtendConfirm = async (newSize: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would update the volume data here
      console.log(`Extending volume ${volume.name} to ${newSize} GB`)
      
      // Close modal
      setIsExtendModalOpen(false)
      
      // Refresh would happen in a real app
    } catch (error) {
      throw error // Let the modal handle the error
    }
  }

  const handleCreateSnapshot = () => {
    router.push(`/storage/block/snapshots/create?volumeId=${volume.id}`)
  }

  const handleCreateSnapshotPolicy = () => {
    router.push(`/storage/block/snapshots/policies/create?volumeId=${volume.id}`)
  }

  const handleCreateBackupPolicy = () => {
    router.push(`/storage/block/backup/policies/create?volumeId=${volume.id}`)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  // Filter policies for this volume
  const volumeSnapshotPolicies = volume.id === "vol-002" ? [] : mockSnapshotPolicies.filter(policy => policy.volumeId === volume.id)
  const volumeBackupPolicies = volume.id === "vol-002" ? [] : mockBackupPolicies.filter(policy => policy.volumeId === volume.id)

  // Snapshot policies table columns
  const snapshotPolicyColumns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/storage/block/snapshots/policies/${row.id}`}
          className="text-primary font-medium hover:underline text-sm"
        >
          {value}
        </a>
      ),
    },
    {
      key: "description",
      label: "Description",
      searchable: true,
      render: (value: string) => (
        <div className="max-w-xs text-sm" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "scheduler",
      label: "Scheduler",
      sortable: true,
      render: (value: string) => (
        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{value}</code>
      ),
    },
  ]

  // Backup policies table columns
  const backupPolicyColumns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/storage/block/backup/policies/${row.id}`}
          className="text-primary font-medium hover:underline text-sm"
        >
          {value}
        </a>
      ),
    },
    {
      key: "description",
      label: "Description",
      searchable: true,
      render: (value: string) => (
        <div className="max-w-xs text-sm" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "scheduler",
      label: "Scheduler",
      sortable: true,
      render: (value: string) => (
        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{value}</code>
      ),
    },
  ]

  const customBreadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/storage", title: "Storage" },
    { href: "/storage/block", title: "Block Storage" },
    { href: `/storage/block/volumes/${volume.id}`, title: volume.name }
  ]

  return (
    <PageLayout 
      title={volume.name} 
      customBreadcrumbs={customBreadcrumbs} 
      hideViewDocs={true}
      headerActions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCreateSnapshot}>
            Create Snapshot
          </Button>
          <Button variant="outline" onClick={handleExtend}>
            Extend Volume
          </Button>
        </div>
      }
    >
      {/* Volume Basic Information */}
      <div className="mb-6 group relative" style={{
        borderRadius: '16px',
        border: '4px solid #FFF',
        background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
        boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
        padding: '1.5rem'
      }}>
        {/* Overlay Edit/Delete Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <DetailGrid>
          {/* Volume ID, Status, Volume Type, Size in one row */}
          <div className="col-span-full grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Volume ID</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{volume.id}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Status</label>
              <div>
                <StatusBadge status={volume.status} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Volume Type</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{volume.type}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Size</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{volume.size} GB</div>
            </div>
          </div>
          
          {/* Created At, Updated At, Volume Role, Attached VMs in second row */}
          <div className="col-span-full grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Created At</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{formatDate(volume.createdOn)}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Updated At</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{formatDate(volume.updatedOn)}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Volume Role</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{volume.role}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Attached VM Names</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>
                {volume.attachedInstances.length > 0 ? volume.attachedInstances.join(", ") : "Not attached"}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="col-span-full">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Description</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{volume.description}</div>
            </div>
          </div>
        </DetailGrid>
      </div>

      {/* Snapshot Policies Section */}
      <div className="bg-card text-card-foreground border-border border rounded-lg p-6 mb-6">
        {volumeSnapshotPolicies.length > 0 ? (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-5 pb-2.5 border-b border-border">
              <h2 className="text-lg font-semibold">Snapshot Policies ({volumeSnapshotPolicies.length})</h2>
              <Button variant="outline" size="sm" onClick={handleCreateSnapshotPolicy}>
                <Plus className="h-4 w-4 mr-2" />
                Add Policy
              </Button>
            </div>
            <ShadcnDataTable
              columns={snapshotPolicyColumns}
              data={volumeSnapshotPolicies}
              searchableColumns={["name", "description"]}
              pageSize={5}
              enableSearch={true}
              enableColumnVisibility={false}
              enablePagination={true}
              enableVpcFilter={false}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            {/* SVG Illustration */}
            <div className="mb-4">
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="80" fill="#FFFFFF"></rect>
                <path d="M36 0L36 80" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10" strokeDasharray="2 2"></path>
                <path d="M84 0L84 80" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10" strokeDasharray="2 2"></path>
                <path d="M120 18H0" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10" strokeDasharray="2 2"></path>
                <path d="M120 62H0" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10" strokeDasharray="2 2"></path>
                <path d="M120 40H0" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10" strokeDasharray="2 2"></path>
                <path d="M111 0L111 80" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10"></path>
                <path d="M9 0L9 80" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10"></path>
                <path d="M0 9L120 9" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10"></path>
                <path d="M0 71L120 71" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10"></path>
                <path d="M44 44L59 36.5C59.6 36.2 60.4 36.2 61 36.5L76 44C76.8 44.4 77.3 45.2 77.3 46V52C77.3 52.8 76.8 53.6 76 54L61 61.5C60.4 61.8 59.6 61.8 59 61.5L44 54C43.2 53.6 42.7 52.8 42.7 52V46C42.7 45.2 43.2 44.4 44 44Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"></path>
                <g opacity="0.6">
                  <path d="M43.5 45L60 53L76.5 45" stroke="#5C5E63" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M60 61.5V53" stroke="#5C5E63" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
                <path d="M44 27L59 19.5C59.6 19.2 60.4 19.2 61 19.5L76 27C76.8 27.4 77.3 28.2 77.3 29V35C77.3 35.8 76.8 36.6 76 37L61 44.5C60.4 44.8 59.6 44.8 59 44.5L44 37C43.2 36.6 42.7 35.8 42.7 35V29C42.7 28.2 43.2 27.4 44 27Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"></path>
                <g opacity="0.6">
                  <path d="M43.5 28L60 36L76.5 28" stroke="#5C5E63" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M60 44.5V36" stroke="#5C5E63" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
              </svg>
            </div>
            
            <div className="text-center space-y-2 max-w-sm">
              <h4 className="text-base font-medium text-foreground">Snapshot Policies</h4>
              <div className="text-muted-foreground">
                <p className="text-sm">
                  Create automated snapshot policies for point-in-time recovery.{' '}
                  <a href="/documentation/snapshots" className="text-primary hover:underline">
                    Learn more
                  </a>
                </p>
              </div>
              <div className="flex justify-center pt-1">
                <Button 
                  onClick={handleCreateSnapshotPolicy}
                  size="sm"
                >
                  Create Snapshot Policy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backup Policies Section */}
      <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
        {volumeBackupPolicies.length > 0 ? (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-5 pb-2.5 border-b border-border">
              <h2 className="text-lg font-semibold">Backup Policies ({volumeBackupPolicies.length})</h2>
              <Button variant="outline" size="sm" onClick={handleCreateBackupPolicy}>
                <Plus className="h-4 w-4 mr-2" />
                Add Policy
              </Button>
            </div>
            <ShadcnDataTable
              columns={backupPolicyColumns}
              data={volumeBackupPolicies}
              searchableColumns={["name", "description"]}
              pageSize={5}
              enableSearch={true}
              enableColumnVisibility={false}
              enablePagination={true}
              enableVpcFilter={false}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            {/* SVG Illustration */}
            <div className="mb-4">
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="80" fill="#FFFFFF"></rect>
                <path d="M36 0L36 80" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10" strokeDasharray="2 2"></path>
                <path d="M84 0L84 80" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10" strokeDasharray="2 2"></path>
                <path d="M120 18H0" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10" strokeDasharray="2 2"></path>
                <path d="M120 62H0" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10" strokeDasharray="2 2"></path>
                <path d="M120 40H0" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10" strokeDasharray="2 2"></path>
                <path d="M111 0L111 80" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10"></path>
                <path d="M9 0L9 80" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10"></path>
                <path d="M0 9L120 9" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10"></path>
                <path d="M0 71L120 71" stroke="#EEEFF1" strokeWidth="0.6" strokeMiterlimit="10"></path>
                <path d="M44 44L59 36.5C59.6 36.2 60.4 36.2 61 36.5L76 44C76.8 44.4 77.3 45.2 77.3 46V52C77.3 52.8 76.8 53.6 76 54L61 61.5C60.4 61.8 59.6 61.8 59 61.5L44 54C43.2 53.6 42.7 52.8 42.7 52V46C42.7 45.2 43.2 44.4 44 44Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"></path>
                <g opacity="0.6">
                  <path d="M43.5 45L60 53L76.5 45" stroke="#5C5E63" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M60 61.5V53" stroke="#5C5E63" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
                <path d="M44 27L59 19.5C59.6 19.2 60.4 19.2 61 19.5L76 27C76.8 27.4 77.3 28.2 77.3 29V35C77.3 35.8 76.8 36.6 76 37L61 44.5C60.4 44.8 59.6 44.8 59 44.5L44 37C43.2 36.6 42.7 35.8 42.7 35V29C42.7 28.2 43.2 27.4 44 27Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"></path>
                <g opacity="0.6">
                  <path d="M43.5 28L60 36L76.5 28" stroke="#5C5E63" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M60 44.5V36" stroke="#5C5E63" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
              </svg>
            </div>
            
            <div className="text-center space-y-2 max-w-sm">
              <h4 className="text-base font-medium text-foreground">Backup Policies</h4>
              <div className="text-muted-foreground">
                <p className="text-sm">
                  Set up automated backup policies for data protection.{' '}
                  <a href="/documentation/backups" className="text-primary hover:underline">
                    Learn more
                  </a>
                </p>
              </div>
              <div className="flex justify-center pt-1">
                <Button 
                  onClick={handleCreateBackupPolicy}
                  size="sm"
                >
                  Create Backup Policy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={volume.name}
        resourceType="Volume"
        onConfirm={handleDelete}
      />
    </PageLayout>
  )
} 