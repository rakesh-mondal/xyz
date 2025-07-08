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
import { TooltipWrapper } from "../../../../../components/ui/tooltip-wrapper"

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
              onClick={() => {
                toast({
                  title: "Download started",
                  description: `Downloading snapshot "${snapshot.name}" metadata.`
                })
              }}
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

      {/* Policy Configuration Section */}
      <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Policy Configuration</h3>
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                snapshot.policy.enabled 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {snapshot.policy.enabled ? "Active" : "Inactive"}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Schedule Information */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Schedule Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Policy Type:</span>
                      <span className="font-medium capitalize">{snapshot.policy.policyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Schedule:</span>
                      <span className="font-medium">{snapshot.policy.scheduleDescription}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`font-medium ${
                        snapshot.policy.enabled ? "text-green-600" : "text-gray-600"
                      }`}>
                        {snapshot.policy.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    {snapshot.policy.nextExecution && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Execution:</span>
                        <span className="font-medium">
                          {formatDate(snapshot.policy.nextExecution)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Policy Settings */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Policy Settings</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Maximum Snapshots:</span>
                      <span className="font-medium">{snapshot.policy.maxSnapshots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Retention Policy:</span>
                      <span className="font-medium">
                        {snapshot.policy.maxSnapshots > 10 ? "Long-term" : "Standard"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Auto-cleanup:</span>
                      <span className="font-medium">
                        {snapshot.policy.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CRON Expression Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">CRON Expression</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Expression:</span>
                <TooltipWrapper 
                  content="Copy CRON expression to clipboard" 
                  side="top"
                >
                  <button
                    type="button"
                    className="p-1 hover:bg-muted/50 rounded transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(snapshot.policy.cronExpression)
                      toast({
                        title: "Copied to clipboard",
                        description: "CRON expression has been copied to your clipboard."
                      })
                    }}
                  >
                    <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipWrapper>
              </div>
              <div className="font-mono text-sm bg-background border rounded px-3 py-2 mb-2">
                {snapshot.policy.cronExpression}
              </div>
              <p className="text-xs text-muted-foreground">
                This expression schedules: <span className="font-medium">{snapshot.policy.scheduleDescription}</span>
              </p>
            </div>
          </div>

          {/* Policy Actions */}
          {snapshot.status === "available" && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Policy Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="sm" 
                  variant={snapshot.policy.enabled ? "outline" : "default"}
                  onClick={() => {
                    toast({
                      title: snapshot.policy.enabled ? "Policy disabled" : "Policy enabled",
                      description: `Snapshot policy has been ${snapshot.policy.enabled ? "disabled" : "enabled"}.`
                    })
                  }}
                >
                  {snapshot.policy.enabled ? "Disable Policy" : "Enable Policy"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Edit policy",
                      description: "Edit policy functionality would be implemented here."
                    })
                  }}
                >
                  Edit Policy
                </Button>
                {snapshot.policy.enabled && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Manual execution triggered",
                        description: "A manual snapshot has been triggered outside the regular schedule."
                      })
                    }}
                  >
                    Run Now
                  </Button>
                )}
              </div>
            </div>
          )}
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