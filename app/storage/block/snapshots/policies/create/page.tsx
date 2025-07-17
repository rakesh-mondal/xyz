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
import { Switch } from "@/components/ui/switch"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { HelpCircle, Copy } from "lucide-react"
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

export default function CreateSnapshotPolicyPage() {
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
  
  // Policy scheduler mode state (specific value vs any value)
  const [minuteMode, setMinuteMode] = useState<"specific" | "any">("specific")
  const [hourMode, setHourMode] = useState<"specific" | "any">("specific")
  const [dayOfMonthMode, setDayOfMonthMode] = useState<"specific" | "any">("specific")
  const [monthMode, setMonthMode] = useState<"specific" | "any">("specific")
  const [dayOfWeekMode, setDayOfWeekMode] = useState<"specific" | "any">("any")

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
    
    const cronMinute = minuteMode === "any" ? "*" : minute
    const cronHour = hourMode === "any" ? "*" : hour
    const cronDayOfMonth = dayOfMonthMode === "any" ? "*" : dayOfMonth
    const cronMonth = monthMode === "any" ? "*" : (monthMap[month] || month)
    const cronDayOfWeek = dayOfWeekMode === "any" ? "*" : dayOfWeek
    
    return `${cronMinute} ${cronHour} ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`
  }

  // Generate CRON explanation
  const generateCronExplanation = () => {
    const minuteText = minuteMode === "any" ? "every minute" : `minute ${minute}`
    const hourText = hourMode === "any" ? "every hour" : `hour ${hour}`
    const dayOfMonthText = dayOfMonthMode === "any" ? "every day" : `day ${dayOfMonth} of the month`
    const monthText = monthMode === "any" ? "every month" : `in ${month}`
    const dayOfWeekText = dayOfWeekMode === "any" ? "every day of the week" : `on day ${dayOfWeek} of the week`
    
    return `This job will run at ${minuteText} of ${hourText} on ${dayOfMonthText} ${monthText} ${dayOfWeekText}.`
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
      setError("Policy name is required.")
      setLoading(false)
      return
    }
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Show success toast
      toast({
        title: "Snapshot Policy Created",
        description: `Policy "${finalName}" has been created successfully.`,
      })
      
      // Navigate back to snapshots list
      router.push("/storage/block?tab=snapshots")
    } catch (err) {
      setError("Failed to create snapshot policy. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      title="Create Snapshot Policy"
      description="Create an automated snapshot policy for regular backups of your volumes or VMs."
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

                {/* Resource Selection and Configuration in one row */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {/* Resource Selection */}
                  {snapshotType === "volume" ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="volume" className="font-medium">
                          Select Volume <span className="text-destructive">*</span>
                        </Label>
                        <TooltipWrapper 
                          content="Only volumes that are available or attached can be snapshotted." 
                          side="top"
                        >
                          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipWrapper>
                      </div>
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
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="vm" className="font-medium">
                          Select Virtual Machine <span className="text-destructive">*</span>
                        </Label>
                        <TooltipWrapper 
                          content="VM snapshots capture the entire machine state including all attached volumes." 
                          side="top"
                        >
                          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipWrapper>
                      </div>
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
                    </div>
                  )}

                  {/* Maximum Snapshots */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="maxSnapshots" className="font-medium">
                        Maximum Snapshots <span className="text-destructive">*</span>
                      </Label>
                      <TooltipWrapper 
                        content="When this limit is reached, the oldest snapshot (except Primary) will be replaced." 
                        side="top"
                      >
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipWrapper>
                    </div>
                    <Select value={maxSnapshots} onValueChange={handleMaxSnapshotsChange} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 10}, (_, i) => (
                          <SelectItem key={i+1} value={String(i+1)}>{i+1} snapshot{i+1 > 1 ? 's' : ''}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Auto-generated Name Display */}
                {autoGeneratedName && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="font-medium">
                        Auto-generated Name
                      </Label>
                      <TooltipWrapper 
                        content="This name follows the automatic naming convention. You can override it below." 
                        side="top"
                      >
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipWrapper>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-sm font-mono">{autoGeneratedName}</code>
                    </div>
                  </div>
                )}

                {/* Custom Name Override */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="customName" className="font-medium">
                      Policy Name (Optional)
                    </Label>
                    <TooltipWrapper 
                      content="Leave empty to use the auto-generated name. Only alphanumeric characters, hyphens, and underscores allowed." 
                      side="top"
                    >
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipWrapper>
                  </div>
                  <Input 
                    id="customName" 
                    ref={customNameRef} 
                    placeholder={autoGeneratedName || "Enter custom policy name"} 
                    className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
                
                {/* Description */}
                <div className="mb-5">
                  <Label htmlFor="description" className="block mb-2 font-medium">
                    Description
                  </Label>
                  <Textarea 
                    id="description" 
                    ref={descriptionRef} 
                    placeholder="Enter policy description" 
                    className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                  />
                </div>

                {/* Policy Scheduler */}
                <div className="mb-5">
                  <Label className="block mb-3 font-medium">
                    Policy Scheduler <span className="text-destructive">*</span>
                  </Label>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* Minute */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Minute</Label>
                      <div className="flex items-center space-x-1 mb-3">
                        <Switch
                          checked={minuteMode === "specific"}
                          onCheckedChange={(checked) => setMinuteMode(checked ? "specific" : "any")}
                          className="scale-75 flex-shrink-0"
                        />
                        <span className="text-xs text-muted-foreground leading-none">
                          {minuteMode === "specific" ? "Specific" : "Any"}
                        </span>
                      </div>
                      {minuteMode === "specific" ? (
                        <Input
                          type="number"
                          value={minute}
                          onChange={(e) => setMinute(e.target.value)}
                          placeholder="0-59"
                          min="0"
                          max="59"
                          className="text-sm h-8"
                        />
                      ) : (
                        <div className="text-center py-2 bg-muted/50 rounded text-muted-foreground text-xs border min-h-[32px] flex items-center justify-center">
                          Every minute
                        </div>
                      )}
                    </div>

                    {/* Hour */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Hour</Label>
                      <div className="flex items-center space-x-1 mb-3">
                        <Switch
                          checked={hourMode === "specific"}
                          onCheckedChange={(checked) => setHourMode(checked ? "specific" : "any")}
                          className="scale-75 flex-shrink-0"
                        />
                        <span className="text-xs text-muted-foreground leading-none">
                          {hourMode === "specific" ? "Specific" : "Any"}
                        </span>
                      </div>
                      {hourMode === "specific" ? (
                        <Input
                          type="number"
                          value={hour}
                          onChange={(e) => setHour(e.target.value)}
                          placeholder="0-23"
                          min="0"
                          max="23"
                          className="text-sm h-8"
                        />
                      ) : (
                        <div className="text-center py-2 bg-muted/50 rounded text-muted-foreground text-xs border min-h-[32px] flex items-center justify-center">
                          Every hour
                        </div>
                      )}
                    </div>

                    {/* Day */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Day</Label>
                      <div className="flex items-center space-x-1 mb-3">
                        <Switch
                          checked={dayOfMonthMode === "specific"}
                          onCheckedChange={(checked) => setDayOfMonthMode(checked ? "specific" : "any")}
                          className="scale-75 flex-shrink-0"
                        />
                        <span className="text-xs text-muted-foreground leading-none">
                          {dayOfMonthMode === "specific" ? "Specific" : "Any"}
                        </span>
                      </div>
                      {dayOfMonthMode === "specific" ? (
                        <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({length: 31}, (_, i) => (
                              <SelectItem key={i+1} value={String(i+1)}>{i+1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-center py-2 bg-muted/50 rounded text-muted-foreground text-xs border min-h-[32px] flex items-center justify-center">
                          Every day
                        </div>
                      )}
                    </div>

                    {/* Month */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Month</Label>
                      <div className="flex items-center space-x-1 mb-3">
                        <Switch
                          checked={monthMode === "specific"}
                          onCheckedChange={(checked) => setMonthMode(checked ? "specific" : "any")}
                          className="scale-75 flex-shrink-0"
                        />
                        <span className="text-xs text-muted-foreground leading-none">
                          {monthMode === "specific" ? "Specific" : "Any"}
                        </span>
                      </div>
                      {monthMode === "specific" ? (
                        <Select value={month} onValueChange={setMonth}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                            ].map((m) => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-center py-2 bg-muted/50 rounded text-muted-foreground text-xs border min-h-[32px] flex items-center justify-center">
                          Every month
                        </div>
                      )}
                    </div>

                    {/* Day of Week */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Weekday</Label>
                      <div className="flex items-center space-x-1 mb-3">
                        <Switch
                          checked={dayOfWeekMode === "specific"}
                          onCheckedChange={(checked) => setDayOfWeekMode(checked ? "specific" : "any")}
                          className="scale-75 flex-shrink-0"
                        />
                        <span className="text-xs text-muted-foreground leading-none">
                          {dayOfWeekMode === "specific" ? "Specific" : "Any"}
                        </span>
                      </div>
                      {dayOfWeekMode === "specific" ? (
                        <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              {value: "0", label: "Sun"},
                              {value: "1", label: "Mon"},
                              {value: "2", label: "Tue"},
                              {value: "3", label: "Wed"},
                              {value: "4", label: "Thu"},
                              {value: "5", label: "Fri"},
                              {value: "6", label: "Sat"}
                            ].map((day) => (
                              <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-center py-2 bg-muted/50 rounded text-muted-foreground text-xs border min-h-[32px] flex items-center justify-center">
                          Any weekday
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generated CRON Expression */}
                  <div className="bg-muted/50 p-3 rounded-lg mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">CRON Expression:</span>
                      <TooltipWrapper 
                        content="Copy CRON expression to clipboard" 
                        side="top"
                      >
                        <button
                          type="button"
                          className="p-1 hover:bg-muted/50 rounded transition-colors"
                          onClick={() => {
                            navigator.clipboard.writeText(generateCronExpression())
                            toast({
                              title: "CRON expression copied",
                              description: "The CRON expression has been copied to your clipboard."
                            })
                          }}
                        >
                          <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                        </button>
                      </TooltipWrapper>
                    </div>
                    <code className="text-primary font-mono text-sm bg-white px-2 py-1 rounded border">
                      {generateCronExpression()}
                    </code>
                    <p className="text-xs text-muted-foreground mt-2">
                      {generateCronExplanation()}
                    </p>
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
                    {loading ? "Creating Policy..." : "Create Policy"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex-shrink-0 space-y-6">
          {/* Snapshot Policy Summary */}
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
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Snapshot Policy Summary</h3>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">₹5.00</span>
                  <span className="text-sm text-muted-foreground">per month</span>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>• Policy Management: ₹1.00/month</p>
                  <p>• Snapshot Storage: ₹0.05/GB/month</p>
                  <p>• Automated Execution: ₹0.10/run</p>
                  <p>• Estimated based on policy configuration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Allowed Formats */}
          <Card>
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
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Schedule snapshots during low-traffic periods for better performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Set appropriate retention limits to balance protection and storage costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use descriptive names to easily identify policy purpose</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Monitor policy execution logs to ensure proper functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Test restore procedures regularly to verify snapshot integrity</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
} 