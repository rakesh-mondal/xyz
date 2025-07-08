"use client"

import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { snapshots } from "@/lib/data"

// Mock data for volumes - using the same structure as block storage page
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

// VMs data for VM snapshot option
const mockVMs = [
  { id: "vm-001", name: "web-server-01", vpc: "vpc-main-prod", status: "running" },
  { id: "vm-002", name: "db-server-01", vpc: "vpc-main-prod", status: "running" },
  { id: "vm-003", name: "staging-server-01", vpc: "vpc-staging", status: "running" },
  { id: "vm-004", name: "test-server-01", vpc: "vpc-testing", status: "running" },
  { id: "vm-005", name: "ml-server-01", vpc: "vpc-ml", status: "running" },
  { id: "vm-006", name: "dev-server-01", vpc: "vpc-development", status: "running" },
]

export default function CreateSnapshotPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVolume, setSelectedVolume] = useState(searchParams.get('volumeId') || "")
  const [selectedVM, setSelectedVM] = useState("")
  const [snapshotType, setSnapshotType] = useState<"volume" | "vm">("volume")
  const [autoGeneratedName, setAutoGeneratedName] = useState("")
  const [maxSnapshots, setMaxSnapshots] = useState("5")
  
  // Refs for form fields
  const customNameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  // Calculate next snapshot number and name based on existing snapshots
  const generateSnapshotName = (resourceName: string, resourceType: "volume" | "vm") => {
    // Get existing snapshots for this resource
    const existingSnapshots = snapshots.filter(snap => 
      snap.volumeVM === resourceName
    )
    
    // Sort by creation date to understand snapshot sequence
    existingSnapshots.sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime())
    
    let snapshotNumber: number
    let snapshotTypeLabel: string
    
    if (existingSnapshots.length === 0) {
      // First snapshot - always Primary with number 1
      snapshotNumber = 1
      snapshotTypeLabel = "Primary"
    } else {
      // Check how many snapshots exist
      const maxSnapshotsNum = parseInt(maxSnapshots)
      
      if (existingSnapshots.length < maxSnapshotsNum) {
        // We haven't reached the limit, continue numbering
        snapshotNumber = existingSnapshots.length + 1
        snapshotTypeLabel = "Delta"
      } else {
        // We've reached the limit, new snapshot gets max number
        snapshotNumber = maxSnapshotsNum
        snapshotTypeLabel = "Delta"
      }
    }
    
    // Generate name: resourcename-type-number
    const baseType = resourceType === "vm" ? "vm" : "vol"
    return `${resourceName}-${baseType}-${snapshotTypeLabel.toLowerCase()}-${snapshotNumber}`
  }

  // Update auto-generated name when volume/VM selection changes
  const handleResourceChange = (resourceId: string, type: "volume" | "vm") => {
    let resourceName = ""
    
    if (type === "volume") {
      const volume = mockVolumes.find(v => v.id === resourceId)
      resourceName = volume?.name || ""
      setSelectedVolume(resourceId)
      setSelectedVM("")
    } else {
      const vm = mockVMs.find(v => v.id === resourceId)
      resourceName = vm?.name || ""
      setSelectedVM(resourceId)
      setSelectedVolume("")
    }
    
    if (resourceName) {
      const generatedName = generateSnapshotName(resourceName, type)
      setAutoGeneratedName(generatedName)
    }
  }

  // Update auto-generated name when max snapshots changes
  const handleMaxSnapshotsChange = (value: string) => {
    setMaxSnapshots(value)
    
    // Regenerate name with new max snapshots value
    let resourceName = ""
    if (snapshotType === "volume" && selectedVolume) {
      const volume = mockVolumes.find(v => v.id === selectedVolume)
      resourceName = volume?.name || ""
    } else if (snapshotType === "vm" && selectedVM) {
      const vm = mockVMs.find(v => v.id === selectedVM)
      resourceName = vm?.name || ""
    }
    
    if (resourceName) {
      const generatedName = generateSnapshotName(resourceName, snapshotType)
      setAutoGeneratedName(generatedName)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const customName = customNameRef.current?.value.trim() || ""
    const description = descriptionRef.current?.value.trim() || ""
    
    // Validate required fields
    if (snapshotType === "volume" && !selectedVolume) {
      setError("Please select a volume.")
      setLoading(false)
      return
    }
    
    if (snapshotType === "vm" && !selectedVM) {
      setError("Please select a VM.")
      setLoading(false)
      return
    }
    
    const finalName = customName || autoGeneratedName
    if (!finalName) {
      setError("Snapshot name is required.")
      setLoading(false)
      return
    }
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Show success toast
      toast({
        title: "Snapshot Creation Started",
        description: `Creating snapshot "${finalName}". This may take a few minutes.`,
      })
      
      // Navigate back to snapshots list
      router.push("/storage/block?tab=snapshots")
    } catch (err) {
      setError("Failed to create snapshot. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      title="Create Snapshot"
      description="Create an instant snapshot of your volume or VM for backup and disaster recovery."
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {/* Snapshot Type Selection */}
                <div className="mb-8">
                  <Label className="block mb-3 font-medium">
                    Snapshot Type <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        snapshotType === "volume" 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setSnapshotType("volume")
                        setSelectedVM("")
                        setAutoGeneratedName("")
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="snapshotType" 
                          value="volume" 
                          checked={snapshotType === "volume"}
                          onChange={() => {}}
                          className="text-primary"
                        />
                        <div>
                          <div className="font-medium">Volume Snapshot</div>
                          <div className="text-sm text-muted-foreground">
                            Create a snapshot of a specific volume
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        snapshotType === "vm" 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setSnapshotType("vm")
                        setSelectedVolume("")
                        setAutoGeneratedName("")
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="snapshotType" 
                          value="vm" 
                          checked={snapshotType === "vm"}
                          onChange={() => {}}
                          className="text-primary"
                        />
                        <div>
                          <div className="font-medium">VM Snapshot</div>
                          <div className="text-sm text-muted-foreground">
                            Create a snapshot of an entire virtual machine
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource Selection */}
                {snapshotType === "volume" ? (
                  <div className="mb-5">
                    <Label htmlFor="volume" className="block mb-2 font-medium">
                      Select Volume <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={selectedVolume} 
                      onValueChange={(value) => handleResourceChange(value, "volume")}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a volume" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVolumes
                          .filter(volume => volume.status !== "creating") // Only show available volumes
                          .map((volume) => (
                          <SelectItem key={volume.id} value={volume.id}>
                            {volume.name} ({volume.id}) - {volume.size}GB - {volume.status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Only volumes that are available or attached can be snapshotted.
                    </p>
                  </div>
                ) : (
                  <div className="mb-5">
                    <Label htmlFor="vm" className="block mb-2 font-medium">
                      Select Virtual Machine <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={selectedVM} 
                      onValueChange={(value) => handleResourceChange(value, "vm")}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a virtual machine" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVMs.map((vm) => (
                          <SelectItem key={vm.id} value={vm.id}>
                            {vm.name} ({vm.id}) - {vm.vpc} - {vm.status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      VM snapshots capture the entire machine state including all attached volumes.
                    </p>
                  </div>
                )}

                {/* Snapshot Configuration */}
                <div className="mb-5">
                  <Label htmlFor="maxSnapshots" className="block mb-2 font-medium">
                    Maximum Snapshots <span className="text-destructive">*</span>
                  </Label>
                  <Select value={maxSnapshots} onValueChange={handleMaxSnapshotsChange} required>
                    <SelectTrigger className="max-w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 10}, (_, i) => (
                        <SelectItem key={i+1} value={String(i+1)}>{i+1} snapshot{i+1 > 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    When this limit is reached, the oldest snapshot (except Primary) will be replaced.
                  </p>
                </div>

                {/* Auto-generated Name Display */}
                {autoGeneratedName && (
                  <div className="mb-5">
                    <Label className="block mb-2 font-medium">Auto-generated Name</Label>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-sm font-mono">{autoGeneratedName}</code>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This name follows the automatic naming convention. You can override it below.
                    </p>
                  </div>
                )}

                {/* Custom Name Override */}
                <div className="mb-5">
                  <Label htmlFor="customName" className="block mb-2 font-medium">
                    Custom Name (Optional)
                  </Label>
                  <Input 
                    id="customName" 
                    ref={customNameRef} 
                    placeholder={autoGeneratedName || "Enter custom snapshot name"} 
                    className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use the auto-generated name. Only alphanumeric characters, hyphens, and underscores allowed.
                  </p>
                </div>
                
                {/* Description */}
                <div className="mb-5">
                  <Label htmlFor="description" className="block mb-2 font-medium">
                    Description
                  </Label>
                  <Textarea 
                    id="description" 
                    ref={descriptionRef} 
                    placeholder="Enter snapshot description" 
                    className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push("/storage/block?tab=snapshots")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating Snapshot..." : "Create Snapshot"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex-shrink-0 space-y-6">
          {/* Information Panel */}
          <div 
            style={{
              borderRadius: '16px',
              border: '4px solid #FFF',
              background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
              boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
              padding: '1.5rem'
            }}
          >
            <div className="pb-4">
              <h3 className="text-base font-semibold">Snapshot Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Snapshot Types</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>
                    <strong>Primary:</strong> The first snapshot created (number 1). Never gets replaced.
                  </div>
                  <div>
                    <strong>Delta:</strong> Subsequent snapshots that capture changes since the previous snapshot.
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Naming Logic</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• First snapshot: Always numbered "1" (Primary)</div>
                  <div>• Additional snapshots: Continue numbering (2, 3, 4...)</div>
                  <div>• When limit reached: Old snapshots shift down, Primary "1" remains</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Best Practices</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• Create snapshots before major changes</div>
                  <div>• Use descriptive names for easy identification</div>
                  <div>• Regular snapshots help with disaster recovery</div>
                  <div>• Consider snapshot frequency based on data criticality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
