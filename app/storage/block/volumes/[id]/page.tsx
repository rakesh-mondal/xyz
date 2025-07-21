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
import { AttachedVolumeAlert, DeleteVolumeConfirmation } from "../../../../../components/modals/delete-volume-modals"
import { snapshots } from "@/lib/data";
import { ActionMenu } from "../../../../../components/action-menu";
import { AddPolicyModal } from "../../../../../components/modals/add-policy-modal";
import { CreateBackupModal } from "../../../../../components/modals/create-backup-modal";

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

export default function VolumeDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAttachedAlertOpen, setIsAttachedAlertOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)
  const [snapshotPolicyDeleted, setSnapshotPolicyDeleted] = useState(false);
  const [backupPolicyDeleted, setBackupPolicyDeleted] = useState(false);
  const [showAddSnapshotPolicy, setShowAddSnapshotPolicy] = useState(false);
  const [showAddBackupPolicy, setShowAddBackupPolicy] = useState(false);
  const [snapshotPolicyState, setSnapshotPolicyState] = useState<any>(null);
  const [backupPolicyState, setBackupPolicyState] = useState<any>(null);
  const [editSnapshot, setEditSnapshot] = useState(false);
  const [editBackup, setEditBackup] = useState(false);
  const volume = getVolume(params.id)
  const [showBackupModal, setShowBackupModal] = useState(false);

  if (!volume) {
    notFound()
  }

  const handleDeleteClick = () => {
    // Check if volume is attached to a VM
    if (volume.attachedInstances && volume.attachedInstances.length > 0) {
      // Volume is attached - show alert preventing deletion
      setIsAttachedAlertOpen(true)
    } else {
      // Volume is not attached - show deletion confirmation
      setIsDeleteConfirmOpen(true)
    }
  }

  const handleActualDelete = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would delete the volume
      console.log("Deleting volume:", volume.name)
      
      // Navigate back to volumes list
      router.push("/storage/block")
    } catch (error) {
      throw error // Let the modal handle the error
    }
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

  // Find snapshot policy for this volume (mock: match volume.name or id to snapshot.volumeVM)
  const snapshotPolicy = !snapshotPolicyDeleted && (snapshotPolicyState || snapshots.find(
    (snap) => snap.volumeVM === volume.name && snap.policy
  )?.policy);

  // Dummy backup policy (for demo, you can expand this as needed)
  const backupPolicies = [
    {
      volumeId: "vol-001",
      enabled: true,
      schedule: "Daily at 3:00 AM",
      retention: 7,
      nextExecution: "2024-12-20T03:00:00Z",
    },
    {
      volumeId: "vol-002",
      enabled: false,
      schedule: "Weekly on Sunday at 2:00 AM",
      retention: 4,
      nextExecution: null,
    },
  ];
  const backupPolicy = !backupPolicyDeleted && (backupPolicyState || backupPolicies.find((p) => p.volumeId === volume.id));

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
          <Button variant="outline" onClick={() => setShowBackupModal(true)}>
            Create Instant Backup
          </Button>
          <Button variant="outline" onClick={handleExtend}>
            Extend Volume
          </Button>
        </div>
      }
    >
      <CreateBackupModal
        open={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onCreate={async ({ name, description, tags }) => {
          const price = `$${(Number(volume.size) * 0.10).toFixed(2)}`;
          toast({
            title: "Backup Created",
            description: `Backup '${name}' for volume '${volume.name}' created. Price: ${price}`,
          });
          setShowBackupModal(false);
        }}
        price={`$${(Number(volume.size) * 0.10).toFixed(2)}`}
        volume={volume}
      />
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
            onClick={handleDeleteClick}
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

      {/* Snapshot Policy Section */}
      <div className="bg-card text-card-foreground border-border border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Snapshot Policy</h2>
        {snapshotPolicy ? (
          <div className="bg-gray-50 rounded p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-700 font-medium">{snapshotPolicy.scheduleDescription}</div>
              <div className="text-xs text-gray-500 mt-1">Max Snapshots: {snapshotPolicy.maxSnapshots}</div>
              <div className="text-xs text-gray-500">Next Execution: {snapshotPolicy.nextExecution ? new Date(snapshotPolicy.nextExecution).toLocaleString() : "-"}</div>
              <div className="text-xs text-gray-500">Status: {snapshotPolicy.enabled ? "Enabled" : "Disabled"}</div>
            </div>
            <ActionMenu
              resourceName="Snapshot Policy"
              resourceType="Policy"
              onEdit={() => { setEditSnapshot(true); }}
              onCustomDelete={() => { setSnapshotPolicyDeleted(true); setSnapshotPolicyState(null); }}
              deleteLabel="Delete"
            />
          </div>
        ) : (
          <Button variant="default" onClick={() => setShowAddSnapshotPolicy(true)}>Add Policy</Button>
        )}
      </div>
      <AddPolicyModal
        open={showAddSnapshotPolicy || editSnapshot}
        onClose={() => { setShowAddSnapshotPolicy(false); setEditSnapshot(false); }}
        onSave={policy => { setSnapshotPolicyState(policy); setSnapshotPolicyDeleted(false); }}
        mode={editSnapshot ? "edit" : "add"}
        type="snapshot"
        initialPolicy={editSnapshot ? snapshotPolicy : undefined}
      />

      {/* Backup Policy Section */}
      <div className="bg-card text-card-foreground border-border border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Backup Policy</h2>
        {backupPolicy ? (
          <div className="bg-gray-50 rounded p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-700 font-medium">{backupPolicy.schedule}</div>
              <div className="text-xs text-gray-500 mt-1">Retention: {backupPolicy.retention} backups</div>
              <div className="text-xs text-gray-500">Next Execution: {backupPolicy.nextExecution ? new Date(backupPolicy.nextExecution).toLocaleString() : "-"}</div>
              <div className="text-xs text-gray-500">Status: {backupPolicy.enabled ? "Enabled" : "Disabled"}</div>
            </div>
            <ActionMenu
              resourceName="Backup Policy"
              resourceType="Policy"
              onEdit={() => { setEditBackup(true); }}
              onCustomDelete={() => { setBackupPolicyDeleted(true); setBackupPolicyState(null); }}
              deleteLabel="Delete"
            />
          </div>
        ) : (
          <Button variant="default" onClick={() => setShowAddBackupPolicy(true)}>Add Policy</Button>
        )}
      </div>
      <AddPolicyModal
        open={showAddBackupPolicy || editBackup}
        onClose={() => { setShowAddBackupPolicy(false); setEditBackup(false); }}
        onSave={policy => { setBackupPolicyState(policy); setBackupPolicyDeleted(false); }}
        mode={editBackup ? "edit" : "add"}
        type="backup"
        initialPolicy={editBackup ? backupPolicy : undefined}
      />

      {/* Alert for volumes attached to VMs */}
      <AttachedVolumeAlert
        isOpen={isAttachedAlertOpen}
        onClose={() => setIsAttachedAlertOpen(false)}
        volume={{
          name: volume.name,
          attachedInstance: volume.attachedInstances.length > 0 ? volume.attachedInstances[0] : ""
        }}
      />

      {/* Confirmation for detached volumes */}
      <DeleteVolumeConfirmation
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        volume={{
          name: volume.name,
          id: volume.id
        }}
        onConfirm={handleActualDelete}
      />

      {/* Extend Volume Modal */}
      <ExtendVolumeModal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
        volume={volume}
        onConfirm={handleExtendConfirm}
      />
    </PageLayout>
  )
} 