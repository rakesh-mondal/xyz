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
import { AttachedVolumeAlert, DeleteVolumeConfirmation } from "@/components/modals/delete-volume-modals"
import { DeleteSnapshotConstraintModal, DeleteSnapshotConfirmationModal } from "@/components/modals/delete-snapshot-modals"
import { useToast } from "@/hooks/use-toast"
import { filterDataForUser, shouldShowEmptyState, getEmptyStateMessage } from "@/lib/demo-data-filter"
import { canDeletePrimarySnapshot, getPrimarySnapshotsForResource } from "@/lib/data"
import { EmptyState } from "@/components/ui/empty-state"
import { snapshots } from "@/lib/data"

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

// Mock backup data for block storage
const mockBackups = [
  {
    id: "backup-001",
    name: "web-server-backup-primary",
    size: "50 GB",
    volumeName: "web-server-root",
    type: "Primary",
    status: "completed",
    vpc: "vpc-main-prod",
    createdOn: "2024-12-19T08:30:00Z",
    description: "Primary backup of web server root volume",
  },
  {
    id: "backup-002", 
    name: "db-storage-backup-delta",
    size: "25 GB",
    volumeName: "database-storage",
    type: "Delta",
    status: "completed",
    vpc: "vpc-main-prod",
    createdOn: "2024-12-19T02:00:00Z",
    description: "Daily delta backup of database storage",
  },
  {
    id: "backup-003",
    name: "app-server-backup-primary",
    size: "120 GB",
    volumeName: "app-server-data",
    type: "Primary",
    status: "creating",
    vpc: "vpc-main-prod",
    createdOn: "2024-12-19T10:15:00Z",
    description: "Primary backup of application server data volume",
  },
  {
    id: "backup-004",
    name: "backup-vol-delta",
    size: "75 GB",
    volumeName: "backup-volume",
    type: "Delta",
    status: "completed",
    vpc: "vpc-backup",
    createdOn: "2024-12-18T20:45:00Z",
    description: "Delta backup of backup volume",
  },
  {
    id: "backup-005",
    name: "staging-backup-primary", 
    size: "40 GB",
    volumeName: "staging-root",
    type: "Primary",
    status: "completed",
    vpc: "vpc-staging",
    createdOn: "2024-12-18T16:30:00Z",
    description: "Primary backup of staging server root volume",
  },
  {
    id: "backup-006",
    name: "temp-processing-backup-delta",
    size: "15 GB",
    volumeName: "temp-processing",
    type: "Delta",
    status: "completed",
    vpc: "vpc-main-prod",
    createdOn: "2024-12-19T06:20:00Z",
    description: "Delta backup of temporary processing volume",
  },
  {
    id: "backup-007",
    name: "logs-storage-backup-primary",
    size: "65 GB",
    volumeName: "logs-storage",
    type: "Primary",
    status: "failed",
    vpc: "vpc-logs",
    createdOn: "2024-12-17T14:10:00Z",
    description: "Primary backup of logs storage volume - backup failed",
  },
  {
    id: "backup-008",
    name: "cache-backup-delta",
    size: "30 GB", 
    volumeName: "cache-volume",
    type: "Delta",
    status: "completed",
    vpc: "vpc-main-prod",
    createdOn: "2024-12-19T04:15:00Z",
    description: "Delta backup of cache volume",
  },
  {
    id: "backup-009",
    name: "analytics-backup-primary",
    size: "280 GB",
    volumeName: "analytics-storage",
    type: "Primary",
    status: "completed",
    vpc: "vpc-analytics",
    createdOn: "2024-12-18T12:00:00Z",
    description: "Primary backup of analytics storage volume",
  },
  {
    id: "backup-010",
    name: "test-env-backup",
    size: "55 GB",
    volumeName: "test-environment",
    type: "Primary",
    status: "creating",
    vpc: "vpc-testing",
    createdOn: "2024-12-19T09:45:00Z",
    description: "Primary backup of test environment volume",
  },
  {
    id: "backup-011",
    name: "media-backup-delta",
    size: "150 GB",
    volumeName: "media-storage",
    type: "Delta",
    status: "completed",
    vpc: "vpc-media",
    createdOn: "2024-12-18T23:30:00Z",
    description: "Delta backup of media storage volume",
  },
  {
    id: "backup-012",
    name: "ml-training-backup-primary",
    size: "1.8 TB",
    volumeName: "ml-training-data",
    type: "Primary",
    status: "completed",
    vpc: "vpc-ml",
    createdOn: "2024-12-18T08:00:00Z",
    description: "Primary backup of ML training data volume",
  },
  {
    id: "backup-013",
    name: "dev-workspace-backup-delta",
    size: "35 GB",
    volumeName: "dev-workspace",
    type: "Delta",
    status: "completed",
    vpc: "vpc-development",
    createdOn: "2024-12-19T07:30:00Z",
    description: "Delta backup of development workspace",
  },
  {
    id: "backup-014",
    name: "monitoring-backup-primary",
    size: "80 GB",
    volumeName: "monitoring-logs",
    type: "Primary",
    status: "completed",
    vpc: "vpc-monitoring",
    createdOn: "2024-12-18T18:20:00Z",
    description: "Primary backup of monitoring logs volume",
  },
  {
    id: "backup-015",
    name: "backup-secondary-delta",
    size: "200 GB",
    volumeName: "backup-secondary",
    type: "Delta",
    status: "failed",
    vpc: "vpc-backup",
    createdOn: "2024-12-19T03:45:00Z",
    description: "Delta backup of secondary backup volume - backup failed",
  }
]

// Tab content components with empty states
function VolumesSection() {
  const [selectedVolume, setSelectedVolume] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAttachedAlertOpen, setIsAttachedAlertOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)
  const [volumeToExtend, setVolumeToExtend] = useState<any>(null)
  const { toast } = useToast()

  // Filter data based on user type for demo
  const filteredVolumes = filterDataForUser(mockVolumes)
  const showEmptyState = shouldShowEmptyState() && filteredVolumes.length === 0

  const handleDeleteClick = (volume: any) => {
    setSelectedVolume(volume)
    
    // Check if volume is attached to a VM
    if (volume.attachedInstance && volume.attachedInstance !== "-") {
      // Volume is attached - show alert preventing deletion
      setIsAttachedAlertOpen(true)
    } else {
      // Volume is not attached - show deletion confirmation
      setIsDeleteConfirmOpen(true)
    }
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
      
      // In a real app, you would refresh the data here
      console.log(`Deleting volume: ${selectedVolume.name}`)
      
      setIsDeleteModalOpen(false)
      setSelectedVolume(null)
    } catch (error) {
      throw error // Let the modal handle the error display
    }
  }

  const handleActualDelete = async () => {
    if (!selectedVolume) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would refresh the data here
      console.log(`Deleting volume: ${selectedVolume.name}`)
      
      // Reset state
      setIsDeleteConfirmOpen(false)
      setSelectedVolume(null)
    } catch (error) {
      throw error // Let the modal handle the error display
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
              className="text-primary font-medium hover:underline leading-5"
            >
              {value}
            </a>
          );
        }
        // For "creating" status, just show plain text
        return <div className="font-medium leading-5">{value}</div>;
      },
    },
    {
      key: "type",
      label: "Volume Type",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "role",
      label: "Volume Role",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "size",
      label: "Size (In GB)",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value} GB</div>
      ),
    },
    {
      key: "attachedInstance",
      label: "Attached Instance Name",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="leading-5">{value === "-" ? "Not attached" : value}</div>
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
  const dataWithActions = filteredVolumes.map((volume) => ({ ...volume, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  // Get unique VPCs for filter options
  const vpcOptions = Array.from(new Set(filteredVolumes.map(volume => volume.vpc)))
    .map(vpc => ({ value: vpc, label: vpc }))

  // Add "All VPCs" option at the beginning
  vpcOptions.unshift({ value: "all", label: "All VPCs" })

  return (
    <div className="space-y-6">
      {showEmptyState ? (
        <EmptyState
          {...getEmptyStateMessage('volumes')}
        />
      ) : (
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
      )}

      {/* Alert for volumes attached to VMs */}
      {selectedVolume && (
        <AttachedVolumeAlert
          isOpen={isAttachedAlertOpen}
          onClose={() => {
            setIsAttachedAlertOpen(false)
            setSelectedVolume(null)
          }}
          volume={{
            name: selectedVolume.name,
            attachedInstance: selectedVolume.attachedInstance
          }}
        />
      )}

      {/* Confirmation for detached volumes */}
      {selectedVolume && (
        <DeleteVolumeConfirmation
          isOpen={isDeleteConfirmOpen}
          onClose={() => {
            setIsDeleteConfirmOpen(false)
            setSelectedVolume(null)
          }}
          volume={{
            name: selectedVolume.name,
            id: selectedVolume.id
          }}
          onConfirm={handleActualDelete}
        />
      )}

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
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null)
  const [deleteStep, setDeleteStep] = useState<"constraint" | "confirmation" | null>(null)
  const [constraintReason, setConstraintReason] = useState("")
  const { toast } = useToast()

  // Filter data based on user type for demo
  const filteredSnapshots = filterDataForUser(snapshots)
  const showEmptyState = shouldShowEmptyState() && filteredSnapshots.length === 0

  const handleDeleteClick = (snapshot: any) => {
    setSelectedSnapshot(snapshot)
    
    // Check if this is a Primary snapshot and if it can be safely deleted
    if (snapshot.type === "Primary" && !canDeletePrimarySnapshot(snapshot.id)) {
      const reason = `You must create another Primary snapshot for "${snapshot.volumeVM}" before deleting this one. This is the only Primary snapshot for this resource.`
      setConstraintReason(reason)
      setDeleteStep("constraint")
    } else {
      // Snapshot can be deleted, show confirmation modal
      setDeleteStep("confirmation")
    }
  }

  const handleConstraintConfirm = () => {
    // Move to confirmation step if deletion is allowed
    setDeleteStep("confirmation")
  }

  const handleActualDelete = async () => {
    if (!selectedSnapshot) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would refresh the data here
      console.log(`Deleting snapshot: ${selectedSnapshot.name}`)
      
      // Reset state
      setDeleteStep(null)
      setSelectedSnapshot(null)
    } catch (error) {
      throw error // Let the modal handle the error display
    }
  }

  const handleCloseModals = () => {
    setDeleteStep(null)
    setSelectedSnapshot(null)
    setConstraintReason("")
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/storage/block/snapshots/${row.id}`}
          className="text-primary font-medium hover:underline leading-5"
        >
          {value}
        </a>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "size",
      label: "Size",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "volumeVM",
      label: "Volume / VM",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{new Date(value).toLocaleDateString()}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/storage/block/snapshots/${row.id}`}
            editHref={`/storage/block/snapshots/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType="Snapshot"
            deleteLabel="Delete Snapshot"
          />
        </div>
      ),
    },
  ]

  // Add actions property to each snapshot row for DataTable
  const dataWithActions = filteredSnapshots.map((snapshot) => ({ ...snapshot, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {showEmptyState ? (
        <EmptyState
          {...getEmptyStateMessage('snapshots')}
        />
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={["name", "volumeVM"]}
          defaultSort={{ column: "createdOn", direction: "desc" }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
        />
      )}

      {/* Step 1: Constraint Warning Modal */}
      {selectedSnapshot && (
        <DeleteSnapshotConstraintModal
          open={deleteStep === "constraint"}
          onClose={handleCloseModals}
          snapshot={selectedSnapshot}
          constraintReason={constraintReason}
          onConfirm={deleteStep === "constraint" && !constraintReason.includes("must create another") ? handleConstraintConfirm : undefined}
        />
      )}

      {/* Step 2: Name Confirmation Modal */}
      {selectedSnapshot && (
        <DeleteSnapshotConfirmationModal
          open={deleteStep === "confirmation"}
          onClose={handleCloseModals}
          snapshot={selectedSnapshot}
          onConfirm={handleActualDelete}
        />
      )}
    </div>
  )
}

function BackupSection() {
  const [selectedBackup, setSelectedBackup] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { toast } = useToast()

  // Filter data based on user type for demo
  const filteredBackups = filterDataForUser(mockBackups)
  const showEmptyState = shouldShowEmptyState() && filteredBackups.length === 0

  const handleDeleteClick = (backup: any) => {
    setSelectedBackup(backup)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBackup) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would refresh the data here
      console.log(`Deleting backup: ${selectedBackup.name}`)
      
      toast({
        title: "Backup deleted",
        description: `Backup "${selectedBackup.name}" has been successfully deleted.`,
      })
      
      // Reset state
      setIsDeleteModalOpen(false)
      setSelectedBackup(null)
    } catch (error) {
      throw error // Let the modal handle the error display
    }
  }

  const columns = [
    {
      key: "name",
      label: "Backup Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/storage/block/backup/${row.id}`}
          className="text-primary font-medium hover:underline leading-5"
        >
          {value}
        </a>
      ),
    },
    {
      key: "size",
      label: "Size",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "volumeName",
      label: "Volume Name",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "createdOn",
      label: "Created",
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="text-muted-foreground leading-5">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/storage/block/backup/${row.id}`}
            editHref={`/storage/block/backup/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType="Backup"
            deleteLabel="Delete Backup"
          />
        </div>
      ),
    },
  ]

  // Add actions property to each backup row for DataTable
  const dataWithActions = filteredBackups.map((backup) => ({ ...backup, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  // Get unique VPCs for filter options
  const vpcOptions = Array.from(new Set(filteredBackups.map(backup => backup.vpc)))
    .map(vpc => ({ value: vpc, label: vpc }))

  // Add "All VPCs" option at the beginning
  vpcOptions.unshift({ value: "all", label: "All VPCs" })

  return (
    <div>
      {showEmptyState ? (
        <EmptyState
          {...getEmptyStateMessage('backup')}
        />
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={["name", "volumeName"]}
          defaultSort={{ column: "createdOn", direction: "desc" }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableVpcFilter={true}
          vpcOptions={vpcOptions}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={selectedBackup?.name || ""}
        resourceType="Backup"
        onConfirm={handleDeleteConfirm}
      />
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
