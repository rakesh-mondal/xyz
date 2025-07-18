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
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export default function CreateInstantSnapshotPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVolume, setSelectedVolume] = useState(searchParams.get('volumeId') || "")
  const [selectedVM, setSelectedVM] = useState("")
  const [snapshotType, setSnapshotType] = useState<"volume" | "vm">("volume")
  const [autoGeneratedName, setAutoGeneratedName] = useState("")

  // Refs for form fields
  const customNameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  // Generate instant snapshot name (simpler than policy version)
  const generateInstantSnapshotName = (resourceName: string, resourceType: "volume" | "vm") => {
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-')
    const baseType = resourceType === "vm" ? "vm" : "vol"
    return `${resourceName}-${baseType}-instant-${timestamp}`
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
      const generatedName = generateInstantSnapshotName(resourceName, type)
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
    if (snapshotType === "volume" && selectedVolume === "") {
      setError("Please select a volume.")
      setLoading(false)
      return
    }
    
    if (snapshotType === "vm" && selectedVM === "") {
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
        title: "Instant Snapshot Creation Started",
        description: `Creating instant snapshot "${finalName}". This will be completed immediately.`,
      })
      
      // Navigate back to snapshots list
      router.push("/storage/block?tab=snapshots")
    } catch (err) {
      setError("Failed to create instant snapshot. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      title="Create Instant Snapshot"
      description="Create an immediate snapshot of your volume or VM for backup and disaster recovery."
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
                            Create an instant snapshot of a specific volume
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
                            Create an instant snapshot of an entire virtual machine
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource Selection */}
                <div className="mb-5">
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
                </div>

                {/* Auto-generated Name Display */}
                {autoGeneratedName && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="font-medium">
                        Auto-generated Name
                      </Label>
                      <TooltipWrapper 
                        content="This name includes a timestamp for uniqueness. You can override it below." 
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
                      Custom Name (Optional)
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
                    placeholder={autoGeneratedName || "Enter custom snapshot name"} 
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
                    {loading ? "Creating Instant Snapshot..." : "Create Instant Snapshot"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex-shrink-0 space-y-6">
          {/* Instant Snapshot Summary */}
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
                <h3 className="text-base font-semibold">Instant Snapshot</h3>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">₹2.50</span>
                  <span className="text-sm text-muted-foreground">per snapshot</span>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>• Snapshot Storage: ₹0.05/GB/month</p>
                  <p>• Data Transfer: ₹0.02/GB</p>
                  <p>• API Requests: ₹0.004/1000 requests</p>
                  <p>• One-time instant snapshot creation</p>
                </div>
              </div>
            </div>
          </div>



          {/* Best Practices */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Best Practices</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Create snapshots before major system changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use descriptive names with timestamps for easy identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Ensure applications are in a consistent state before snapshotting</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Delete old instant snapshots regularly to manage costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Test snapshot restore procedures periodically</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
