"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { PageLayout } from "../../../../../components/page-layout"
import { DetailGrid } from "../../../../../components/detail-grid"
import { Button } from "../../../../../components/ui/button"
import { getSnapshot } from "../../../../../lib/data"
import { DeleteConfirmationModal } from "../../../../../components/delete-confirmation-modal"
import { StatusBadge } from "../../../../../components/status-badge"
import { Edit, Trash2, Download, Copy } from "lucide-react"
import { useToast } from "../../../../../hooks/use-toast"

export default function SnapshotDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const snapshot = getSnapshot(params.id)

  if (!snapshot) {
    notFound()
  }

  const handleDelete = () => {
    // In a real app, this would delete the snapshot
    console.log("Deleting snapshot:", snapshot.name)
    toast({
      title: "Snapshot deleted",
      description: `Snapshot "${snapshot.name}" has been deleted successfully.`
    })
    router.push("/storage/block?tab=snapshots")
  }

  const handleEdit = () => {
    // In a real app, this might allow editing snapshot metadata
    toast({
      title: "Edit snapshot",
      description: "Edit functionality would be implemented here."
    })
  }

  const handleClone = () => {
    // Clone snapshot functionality
    toast({
      title: "Clone snapshot",
      description: `Creating a new volume from snapshot "${snapshot.name}".`
    })
  }

  const handleRestore = () => {
    // Restore snapshot functionality
    toast({
      title: "Restore snapshot",
      description: `Restoring snapshot "${snapshot.name}" to original volume.`
    })
  }

  const handleDownload = () => {
    // Download snapshot metadata or export
    toast({
      title: "Download started",
      description: `Downloading snapshot "${snapshot.name}" metadata.`
    })
  }

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  // Get resource type (Volume or VM) based on volumeVM name pattern
  const getResourceType = (resourceName: string) => {
    // If it has a VM naming pattern (like staging-server-01), it's a VM
    if (resourceName.includes('-server-') || resourceName.includes('-vm-') || resourceName.includes('server')) {
      return "Virtual Machine"
    }
    return "Volume"
  }

  const customBreadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/storage", title: "Storage" },
    { href: "/storage/block", title: "Block Storage" },
    { href: "/storage/block?tab=snapshots", title: "Snapshots" },
    { href: `/storage/block/snapshots/${snapshot.id}`, title: snapshot.name }
  ]

  return (
    <PageLayout title={snapshot.name} customBreadcrumbs={customBreadcrumbs} hideViewDocs={true}>
      {/* Snapshot Basic Information */}
      <div className="mb-6 group relative" style={{
        borderRadius: '16px',
        border: '4px solid #FFF',
        background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
        boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
        padding: '1.5rem'
      }}>
        {/* Overlay Action Buttons */}
        {snapshot.status !== "deleting" && snapshot.status !== "creating" && (
          <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {snapshot.name !== "web-server-backup-primary" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        <DetailGrid>
          {/* Snapshot ID, Type, Status, Created On in one row */}
          <div className="col-span-full grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Snapshot ID</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{snapshot.id}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Type</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  snapshot.type === "Primary" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {snapshot.type}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Status</label>
              <div>
                <StatusBadge status={snapshot.status} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Created On</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{formatDate(snapshot.createdOn)}</div>
            </div>
          </div>
          
          {/* Size and Source Resource in one row */}
          <div className="col-span-full grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Size</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{snapshot.size}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Source {getResourceType(snapshot.volumeVM)}</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{snapshot.volumeVM}</div>
            </div>
          </div>
          
          {/* Description */}
          <div className="col-span-full">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Description</label>
              <div className="font-medium" style={{ fontSize: '14px' }}>{snapshot.description}</div>
            </div>
          </div>
        </DetailGrid>
      </div>

      {/* Actions Section */}
      <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Snapshot Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Clone to Volume */}
              <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Copy className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Clone to New Volume</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Create a new volume from this snapshot
                    </p>
                    <Button 
                      size="sm" 
                      onClick={handleClone}
                      disabled={snapshot.status !== "available"}
                    >
                      Clone Volume
                    </Button>
                  </div>
                </div>
              </div>

              {/* Restore */}
              <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Restore Snapshot</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Restore this snapshot to the original resource
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleRestore}
                      disabled={snapshot.status !== "available"}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              </div>

              {/* Download */}
              <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Download className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Export Snapshot</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download snapshot metadata and configuration
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleDownload}
                      disabled={snapshot.status !== "available"}
                    >
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Snapshot Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Snapshot Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Storage Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{snapshot.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{snapshot.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Encryption:</span>
                      <span className="font-medium">AES-256</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Source Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resource Type:</span>
                      <span className="font-medium">{getResourceType(snapshot.volumeVM)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resource Name:</span>
                      <span className="font-medium">{snapshot.volumeVM}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{formatDate(snapshot.createdOn)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={snapshot.name}
        resourceType="Snapshot"
        onConfirm={handleDelete}
      />
    </PageLayout>
  )
} 