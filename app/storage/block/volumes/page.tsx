"use client"
import { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { ActionMenu } from "@/components/action-menu"
import { DeleteVolumeModal } from "@/components/modals/delete-volume-modal"
import { ExtendVolumeModal } from "@/components/modals/extend-volume-modal"
import { VMAttachmentWarningModal } from "@/components/modals/vm-attachment-warning-modal"
import { Edit, ChevronUp, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
  const [sortBy, setSortBy] = useState<SortableColumn>("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  // Mock handlers
  const handleDelete = async () => {
    // Simulate delete
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowDeleteModal(false)
  }
  const handleExtend = async (newSize: number) => {
    // Simulate extend
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowExtendModal(false)
  }
  const handleEdit = async (updated: { name: string; description: string }) => {
    // Simulate edit
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowEditModal(false)
  }

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortBy(col as SortableColumn)
      setSortDir("asc")
    }
  }

  const sortedVolumes = [...mockVolumes].sort((a, b) => {
    let aVal: string | number | Date = a[sortBy]
    let bVal: string | number | Date = b[sortBy]
    if (sortBy === "size") {
      aVal = parseInt(a.size)
      bVal = parseInt(b.size)
    }
    if (sortBy === "createdOn") {
      aVal = new Date(a.createdOn)
      bVal = new Date(b.createdOn)
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1
    return 0
  })

  return (
    <PageShell
      title="Block Storage"
      description="Provision, manage, and attach block storage volumes to your cloud resources."
      tabs={tabs}
    >
      <div className="flex justify-end mb-4">
        <Button variant="default">Create Volume</Button>
      </div>
      <div className="overflow-hidden bg-card text-card-foreground border-border border rounded-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm cursor-pointer select-none" onClick={() => handleSort("name")}>Volume Name {sortBy === "name" && (sortDir === "asc" ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />)}</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Status</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm cursor-pointer select-none" onClick={() => handleSort("size")}>Size {sortBy === "size" && (sortDir === "asc" ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />)}</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm cursor-pointer select-none" onClick={() => handleSort("type")}>Type {sortBy === "type" && (sortDir === "asc" ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />)}</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Attached To</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm cursor-pointer select-none" onClick={() => handleSort("createdOn")}>Created On {sortBy === "createdOn" && (sortDir === "asc" ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />)}</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedVolumes.map((vol) => (
              <tr key={vol.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-5 py-2.5 border-b border-border">{vol.name}</td>
                <td className="px-5 py-2.5 border-b border-border">
                  <StatusBadge status={vol.status} />
                </td>
                <td className="px-5 py-2.5 border-b border-border">{vol.size}</td>
                <td className="px-5 py-2.5 border-b border-border">{vol.type}</td>
                <td className="px-5 py-2.5 border-b border-border">{vol.attachedTo}</td>
                <td className="px-5 py-2.5 border-b border-border">{vol.createdOn}</td>
                <td className="px-5 py-2.5 border-b border-border">
                  <ActionMenu
                    viewHref="#"
                    onEdit={() => { setSelectedVolume(vol); setShowEditModal(true) }}
                    deleteHref="#"
                    resourceName={vol.name}
                    resourceType="Volume"
                    onExtend={() => { setSelectedVolume(vol); setShowExtendModal(true) }}
                    onWarning={() => { setSelectedVolume(vol); setShowWarningModal(true) }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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