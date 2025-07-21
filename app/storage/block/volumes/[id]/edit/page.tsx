"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { AddPolicyModal } from "@/components/modals/add-policy-modal"
import { ActionMenu } from "@/components/action-menu"

// Dummy data for demo
const getVolume = (id: string) => ({
  id: id,
  name: "web-server-root",
  description: "Root volume for production web server hosting main application",
  tags: ["prod", "web"],
  type: "High-speed NVME SSD Storage (HNSS)",
  size: "50",
  status: "attached",
  createdOn: "2024-01-15T10:30:00Z",
})

export default function EditVolumePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const volume = getVolume(params.id)
  if (!volume) notFound()

  // Editable fields
  const [description, setDescription] = useState(volume.description)
  const [tags, setTags] = useState<string[]>(volume.tags)
  const [tagInput, setTagInput] = useState("")

  // Policy state (dummy, design mode)
  const [snapshotPolicy, setSnapshotPolicy] = useState<any>({
    suffix: "prod",
    maxSnapshots: 5,
    scheduleDescription: "Once every day",
    enabled: true,
  })
  const [backupPolicy, setBackupPolicy] = useState<any>({
    suffix: "prod",
    maxSnapshots: 5,
    scheduleDescription: "Once every day",
    enabled: true,
  })
  const [showSnapshotModal, setShowSnapshotModal] = useState(false)
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [editSnapshot, setEditSnapshot] = useState(false)
  const [editBackup, setEditBackup] = useState(false)

  // Tag helpers
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }
  const handleRemoveTag = (tag: string) => setTags(tags.filter(t => t !== tag))

  // Save handler (design mode)
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Simulate save
    router.push(`/storage/block/volumes/${volume.id}`)
  }

  // Breadcrumbs
  const customBreadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/storage", title: "Storage" },
    { href: "/storage/block", title: "Block Storage" },
    { href: `/storage/block/volumes/${volume.id}`, title: volume.name },
    { href: `/storage/block/volumes/${volume.id}/edit`, title: "Edit" }
  ]

  return (
    <PageLayout title={`Edit Volume: ${volume.name}`} customBreadcrumbs={customBreadcrumbs}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSave}>
                {/* Volume Configuration */}
                <div className="mb-8">
                  <div className="mb-5">
                    <Label className="font-medium">Volume Name</Label>
                    <Input value={volume.name} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div className="mb-5">
                    <Label className="font-medium">Type</Label>
                    <Input value={volume.type} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div className="mb-5">
                    <Label className="font-medium">Size (GB)</Label>
                    <Input value={volume.size} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div className="mb-5">
                    <Label htmlFor="description" className="block mb-2 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a description for this volume"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                    />
                  </div>
                  <div className="mb-5">
                    <Label className="block mb-2 font-medium">Tags</Label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {tags.map(tag => (
                        <span key={tag} className="bg-gray-200 rounded px-2 py-1 text-sm flex items-center gap-1">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-red-500 ml-1">×</button>
                        </span>
                      ))}
                      <Input
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}}
                        placeholder="Add tag"
                        className="w-32"
                      />
                      <Button type="button" size="sm" variant="outline" onClick={handleAddTag}>Add</Button>
                    </div>
                  </div>
                </div>
                {/* Snapshot Policy Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Snapshot Policy</h2>
                  {snapshotPolicy ? (
                    <div className="bg-gray-50 rounded p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-700 font-medium mb-1">{snapshotPolicy.scheduleDescription}</div>
                        <div className="text-xs text-gray-500 mb-1">Max Snapshots: {snapshotPolicy.maxSnapshots}</div>
                        <div className="text-xs text-gray-500 mb-1">Suffix: {snapshotPolicy.suffix}</div>
                        <div className="text-xs text-gray-500">Status: {snapshotPolicy.enabled ? "Enabled" : "Disabled"}</div>
                      </div>
                      <ActionMenu
                        resourceName="Snapshot Policy"
                        resourceType="Policy"
                        onEdit={() => setEditSnapshot(true)}
                        onCustomDelete={() => setSnapshotPolicy(null)}
                        deleteLabel="Delete"
                      />
                    </div>
                  ) : (
                    <Button variant="default" onClick={() => setShowSnapshotModal(true)}>Add Policy</Button>
                  )}
                  <AddPolicyModal
                    open={showSnapshotModal || editSnapshot}
                    onClose={() => { setShowSnapshotModal(false); setEditSnapshot(false); }}
                    onSave={policy => { setSnapshotPolicy(policy); }}
                    mode={editSnapshot ? "edit" : "add"}
                    type="snapshot"
                    initialPolicy={editSnapshot ? snapshotPolicy : undefined}
                  />
                </div>
                {/* Backup Policy Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Backup Policy</h2>
                  {backupPolicy ? (
                    <div className="bg-gray-50 rounded p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-700 font-medium mb-1">{backupPolicy.scheduleDescription}</div>
                        <div className="text-xs text-gray-500 mb-1">Max Backups: {backupPolicy.maxSnapshots}</div>
                        <div className="text-xs text-gray-500 mb-1">Suffix: {backupPolicy.suffix}</div>
                        <div className="text-xs text-gray-500">Status: {backupPolicy.enabled ? "Enabled" : "Disabled"}</div>
                      </div>
                      <ActionMenu
                        resourceName="Backup Policy"
                        resourceType="Policy"
                        onEdit={() => setEditBackup(true)}
                        onCustomDelete={() => setBackupPolicy(null)}
                        deleteLabel="Delete"
                      />
                    </div>
                  ) : (
                    <Button variant="default" onClick={() => setShowBackupModal(true)}>Add Policy</Button>
                  )}
                  <AddPolicyModal
                    open={showBackupModal || editBackup}
                    onClose={() => { setShowBackupModal(false); setEditBackup(false); }}
                    onSave={policy => { setBackupPolicy(policy); }}
                    mode={editBackup ? "edit" : "add"}
                    type="backup"
                    initialPolicy={editBackup ? backupPolicy : undefined}
                  />
                </div>
                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.push(`/storage/block/volumes/${volume.id}`)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black text-white hover:bg-black/90 transition-colors">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Side Panel */}
        <div className="w-80 flex-shrink-0">
          <div className="space-y-6">
            <div
              style={{
                borderRadius: '16px',
                border: '4px solid #FFF',
                background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
                boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
                padding: '1.5rem'
              }}
            >
              <h3 className="text-base font-semibold mb-4">Current Configuration</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume ID:</span>
                  <span className="font-mono">{volume.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{volume.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="capitalize">{volume.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(volume.createdOn).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 