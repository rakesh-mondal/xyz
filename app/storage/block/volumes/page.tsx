"use client"
import { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { ActionMenu } from "@/components/action-menu"
import { DeleteVolumeModal } from "@/components/modals/delete-volume-modal"
import { ExtendVolumeModal } from "@/components/modals/extend-volume-modal"
import { VMAttachmentWarningModal } from "@/components/modals/vm-attachment-warning-modal"
import { Edit, ChevronUp, ChevronDown, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tabs = [
  { title: "Volumes", href: "/storage/block/volumes" },
  { title: "Snapshots", href: "/storage/block/snapshots" },
  { title: "Backup", href: "/storage/block/backup" },
]

type SortableColumn = "name" | "size" | "type" | "createdOn"
type Volume = {
  id: string
  name: string
  status: string
  size: string
  type: string
  attachedTo: string
  createdOn: string
}

const mockVolumes: Volume[] = [
  {
    id: "vol-1",
    name: "Production Volume",
    status: "available",
    size: "500 GB",
    type: "SSD",
    attachedTo: "web-server-1",
    createdOn: "2023-01-10",
  },
  {
    id: "vol-2",
    name: "Dev Volume",
    status: "in-use",
    size: "200 GB",
    type: "HDD",
    attachedTo: "dev-server-2",
    createdOn: "2023-02-15",
  },
]

export default function BlockStorageVolumesPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedVolume, setSelectedVolume] = useState<any>(null)

  // Mock handlers
  const handleDelete = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowDeleteModal(false)
  }
  const handleExtend = async (newSize: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowExtendModal(false)
  }
  const handleEdit = async (updated: { name: string; description: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowEditModal(false)
  }

  const columns = [
    {
      key: "name",
      label: "Volume Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "size",
      label: "Size",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
    },
    {
      key: "attachedTo",
      label: "Attached To",
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <ActionMenu
          viewHref="#"
          onEdit={() => { setSelectedVolume(row); setShowEditModal(true) }}
          deleteHref="#"
          resourceName={row.name}
          resourceType="Volume"
          onExtend={() => { setSelectedVolume(row); setShowExtendModal(true) }}
          onWarning={() => { setSelectedVolume(row); setShowWarningModal(true) }}
        />
      ),
    },
  ]

  // Add actions property to each volume row for DataTable
  const dataWithActions = mockVolumes.map((vol) => ({ ...vol, actions: null }))

  // Example VPC options (replace with real data if available)
  const vpcOptions = [
    { value: "all", label: "All VPCs" },
    { value: "production-vpc", label: "production-vpc" },
    { value: "development-vpc", label: "development-vpc" },
    { value: "staging-vpc", label: "staging-vpc" },
  ]

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <PageShell
      title="Block Storage"
      description="Provision, manage, and attach block storage volumes to your cloud resources."
      tabs={tabs}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">VPC:</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px] border-input">
              <SelectValue placeholder="All VPCs" />
            </SelectTrigger>
            <SelectContent>
              {vpcOptions.map((vpc) => (
                <SelectItem key={vpc.value} value={vpc.value}>{vpc.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="default">Create Volume</Button>
      </div>
      <ShadcnDataTable
        columns={columns}
        data={dataWithActions}
        searchableColumns={["name"]}
        defaultSort={{ column: "name", direction: "asc" }}
        pageSize={10}
        enableSearch={true}
        enableColumnVisibility={true}
        enablePagination={true}
        onRefresh={handleRefresh}
      />
      {/* Modals */}
      <DeleteVolumeModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        volumeName={selectedVolume?.name || ""}
        onConfirm={handleDelete}
      />
      <ExtendVolumeModal
        open={showExtendModal}
        onClose={() => setShowExtendModal(false)}
        currentSize={selectedVolume?.size ? parseInt(selectedVolume.size) : 100}
        onExtend={handleExtend}
      />
      <VMAttachmentWarningModal
        open={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        volumeName={selectedVolume?.name || ""}
        instanceName={selectedVolume?.attachedTo || ""}
      />
      {showEditModal && (
        <EditVolumeModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          volume={selectedVolume}
          onEdit={handleEdit}
        />
      )}
    </PageShell>
  )
}

function EditVolumeModal({ open, onClose, volume, onEdit }: { open: boolean; onClose: () => void; volume: any; onEdit: (data: { name: string; description: string }) => void }) {
  const [name, setName] = useState(volume?.name || "")
  const [description, setDescription] = useState(volume?.description || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onEdit({ name, description })
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Edit className="h-5 w-5" />Edit Volume</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-1" htmlFor="edit-volume-name">Volume Name*</label>
            <Input id="edit-volume-name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block font-bold mb-1" htmlFor="edit-volume-description">Description</label>
            <Textarea id="edit-volume-description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}