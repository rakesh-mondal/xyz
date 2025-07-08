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
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Policy scheduler state
  const [minute, setMinute] = useState("10")
  const [hour, setHour] = useState("4")
  const [dayOfMonth, setDayOfMonth] = useState("23")
  const [month, setMonth] = useState("Jan")
  const [dayOfWeek, setDayOfWeek] = useState("*")

  const formRef = useRef<HTMLFormElement>(null)

  // Refs for form fields
  const customNameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  // Generate CRON expression
  const generateCronExpression = () => {
    const monthMap: { [key: string]: string } = {
      "Jan": "1", "Feb": "2", "Mar": "3", "Apr": "4", "May": "5", "Jun": "6",
      "Jul": "7", "Aug": "8", "Sep": "9", "Oct": "10", "Nov": "11", "Dec": "12"
    }
    
    const cronMonth = monthMap[month] || month
    return `${minute} ${hour} ${dayOfMonth} ${cronMonth} ${dayOfWeek}`
  }

  // Generate CRON explanation
  const generateCronExplanation = () => {
    const monthName = month
    const dayOfWeekText = dayOfWeek === "*" ? "undefined" : `day ${dayOfWeek} of the week`
    
    return `This job will run at minute ${minute} of hour ${hour} on day ${dayOfMonth} of the month in ${monthName} on ${dayOfWeekText}.`
  }

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
    if (selectedVolume) {
      const volume = mockVolumes.find(v => v.id === selectedVolume)
      resourceName = volume?.name || ""
    } else if (selectedVM) {
      const vm = mockVMs.find(v => v.id === selectedVM)
      resourceName = vm?.name || ""
    }
    
    if (resourceName) {
      const generatedName = generateSnapshotName(resourceName, "volume") // Assuming volume for now
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
    if (selectedVolume === "") {
      setError("Please select a volume.")
      setLoading(false)
      return
    }
    
    if (selectedVM === "") {
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
                      onClick={() => setSnapshotType("volume")}
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
                      onClick={() => setSnapshotType("vm")}
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

                {/* Policy Scheduler */}
                <div className="mb-5">
                  <Label className="block mb-3 font-medium">
                    Policy Scheduler <span className="text-destructive">*</span>
                  </Label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {/* Minute */}
                    <div>
                      <Label htmlFor="minute" className="block mb-1 text-sm">
                        Minute <span className="text-muted-foreground">(0-59)</span>
                      </Label>
                      <Input
                        id="minute"
                        type="text"
                        value={minute}
                        onChange={(e) => setMinute(e.target.value)}
                        placeholder="0-59"
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">*/Every n minute</p>
                    </div>

                    {/* Hour */}
                    <div>
                      <Label htmlFor="hour" className="block mb-1 text-sm">
                        Hour <span className="text-muted-foreground">(0-23)</span>
                      </Label>
                      <Input
                        id="hour"
                        type="text"
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        placeholder="0-23"
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">*/Every n hour</p>
                    </div>

                    {/* Day of Month */}
                    <div>
                      <Label htmlFor="dayOfMonth" className="block mb-1 text-sm">
                        Day of Month <span className="text-muted-foreground">(1-31)</span>
                      </Label>
                      <Input
                        id="dayOfMonth"
                        type="text"
                        value={dayOfMonth}
                        onChange={(e) => setDayOfMonth(e.target.value)}
                        placeholder="1-31"
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">*/Every n day-of-month</p>
                    </div>

                    {/* Month */}
                    <div>
                      <Label htmlFor="month" className="block mb-1 text-sm">
                        Month <span className="text-muted-foreground">(1-12) or (JAN-DEC)</span>
                      </Label>
                      <Input
                        id="month"
                        type="text"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        placeholder="1-12 or JAN-DEC"
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">*/Every n month</p>
                    </div>

                    {/* Day of Week */}
                    <div className="md:col-span-2">
                      <Label htmlFor="dayOfWeek" className="block mb-1 text-sm">
                        Day of Week <span className="text-muted-foreground">(0-6) or (SUN-SAT)</span>
                      </Label>
                      <Input
                        id="dayOfWeek"
                        type="text"
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(e.target.value)}
                        placeholder="0-6 or SUN or *"
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">*/Every n day-of-week</p>
                    </div>
                  </div>

                  {/* Generated CRON Expression */}
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-2">Generated CRON Expression</h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <code className="text-primary font-mono text-base">
                        {generateCronExpression()}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(generateCronExpression())
                          toast({
                            title: "CRON expression copied",
                            description: "The CRON expression has been copied to your clipboard."
                          })
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Explanation:</strong><br />
                      {generateCronExplanation()}
                    </div>
                  </div>
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
        <div className="w-80 flex-shrink-0">
          {/* Pricing Summary */}
          <Card className="mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Snapshot Creation</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Snapshot Storage:</span>
                  <span className="font-medium">$0.05/GB/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Transfer:</span>
                  <span className="font-medium">$0.02/GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Requests:</span>
                  <span className="font-medium">$0.004/1000 requests</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Monthly Cost:</span>
                    <span className="text-primary">$2.50</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allowed Formats */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Allowed Formats</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-muted-foreground">Single values</strong>
                  <p className="text-xs mt-1">e.g., 5, MON, JAN</p>
                </div>
                <div>
                  <strong className="text-muted-foreground">Wildcard *</strong>
                  <p className="text-xs mt-1">any value</p>
                </div>
                <div>
                  <strong className="text-muted-foreground">Step values</strong>
                  <p className="text-xs mt-1">e.g., */15</p>
                </div>
                <div>
                  <strong className="text-muted-foreground">Ranges</strong>
                  <p className="text-xs mt-1">e.g., 1-5, MON-FRI</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-destructive">
                    <strong>Note:</strong> Comma-separated values are <strong>not allowed</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Tips */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Best Practices</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Create snapshots during low-traffic periods for better performance</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Schedule regular snapshots for critical volumes to ensure data protection</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use descriptive names to easily identify snapshot contents and purpose</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Monitor snapshot storage costs as they accumulate over time</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>Test snapshot restoration procedures regularly to verify data integrity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
