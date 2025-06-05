"use client"
import { useState, useRef } from "react"
import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Plus, ChevronDown, ChevronUp, X, ArrowLeft } from "lucide-react"

const tabs = [
  { title: "Volumes", href: "/storage/block/volumes" },
  { title: "Snapshots", href: "/storage/block/snapshots" },
  { title: "Backup", href: "/storage/block/backup" },
]

export default function CreateVolumePage() {
  const [volumeSize, setVolumeSize] = useState(100)
  const [sourceType, setSourceType] = useState("none")
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [tags, setTags] = useState([{ key: "", value: "" }])
  const [showSnapshotPolicy, setShowSnapshotPolicy] = useState(false)
  const [showBackupPolicy, setShowBackupPolicy] = useState(false)
  const [snapshotPolicy, setSnapshotPolicy] = useState({
    nameSuffix: "",
    maxSnapshots: 5,
    frequency: "day",
    dayOfWeek: "monday",
    dayOfMonth: "1",
  })
  const [backupPolicy, setBackupPolicy] = useState({
    nameSuffix: "",
    maxBackups: 5,
    incremental: true,
    frequency: "day",
    dayOfWeek: "monday",
    dayOfMonth: "1",
  })
  const [showCreateVpcModal, setShowCreateVpcModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVpc, setSelectedVpc] = useState("")

  // Refs for form fields
  const nameRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)

  const handleSizeChange = (value: number[]) => {
    setVolumeSize(value[0])
  }

  const addTag = () => {
    setTags([...tags, { key: "", value: "" }])
  }

  const updateTag = (index: number, field: "key" | "value", value: string) => {
    const newTags = [...tags]
    newTags[index][field] = value
    setTags(newTags)
  }

  const updateSnapshotPolicy = (field: string, value: any) => {
    setSnapshotPolicy({
      ...snapshotPolicy,
      [field]: value,
    })
  }

  const updateBackupPolicy = (field: string, value: any) => {
    setBackupPolicy({
      ...backupPolicy,
      [field]: value,
    })
  }

  const calculatePrice = () => {
    // Simple price calculation
    const pricePerGB = 0.1
    return (volumeSize * pricePerGB).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const name = nameRef.current?.value.trim() || ""
    const description = descRef.current?.value.trim() || ""
    const vpc = selectedVpc
    if (!name || !vpc) {
      setError("Please fill all required fields.")
      setLoading(false)
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      window.location.href = "/storage/block/volumes"
    } catch (err) {
      setError("Failed to create volume. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell
      title="Create Volume"
      description="Provision a new block storage volume for your cloud resources."
      tabs={tabs}
    >
      <div className="flex items-center mb-6">
        <Link
          href="/storage/block/volumes"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Volumes
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main form content */}
        <div className="flex-1 bg-[#F5F7FA] p-6 rounded-[12px]">
          <form id="create-volume-form" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-6">
              <div className="space-y-4 border-b pb-6">
                <div className="grid gap-2">
                  <Label htmlFor="volume-name">Volume Name*</Label>
                  <Input id="volume-name" ref={nameRef} placeholder="Enter volume name" required className="bg-white" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" ref={descRef} placeholder="Enter description" className="bg-white" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vpc">VPC*</Label>
                  <div className="flex gap-2 items-center">
                    <Select required value={selectedVpc} onValueChange={setSelectedVpc}>
                      <SelectTrigger className="flex-1 bg-white">
                        <SelectValue placeholder="Select VPC" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="vpc-1">VPC-1</SelectItem>
                        <SelectItem value="vpc-2">VPC-2</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowCreateVpcModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create VPC
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 py-2">
                  <Label className="text-base font-medium">Volume Type*</Label>
                  <RadioGroup defaultValue="hnss" className="space-y-1">
                    <div className="flex items-center space-x-3 rounded-[8px] border border-[#e2e8f0] p-3 bg-white">
                      <RadioGroupItem value="hnss" id="hnss" />
                      <div className="flex flex-col">
                        <Label htmlFor="hnss" className="font-medium">
                          High-speed NVME SSD storage (HNSS)
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">xxx MBPS Throughput</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid gap-3 py-2">
                  <Label className="text-base font-medium">Source*</Label>
                  <RadioGroup value={sourceType} onValueChange={setSourceType} className="space-y-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-3 rounded-[8px] border border-[#e2e8f0] p-3 bg-white">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none" className="font-medium">
                          None
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 rounded-[8px] border border-[#e2e8f0] p-3 bg-white">
                        <RadioGroupItem value="snapshots" id="snapshots" />
                        <Label htmlFor="snapshots" className="font-medium">
                          Snapshots
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 rounded-[8px] border border-[#e2e8f0] p-3 bg-white">
                        <RadioGroupItem value="other-volumes" id="other-volumes" />
                        <Label htmlFor="other-volumes" className="font-medium">
                          Other volumes
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                {sourceType === "snapshots" && (
                  <div className="grid gap-2">
                    <Label htmlFor="snapshots-select">Snapshots*</Label>
                    <Select>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="No Snapshots created" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="empty">No Snapshots created</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {sourceType === "other-volumes" && (
                  <div className="grid gap-2">
                    <Label htmlFor="other-volumes-select">Other Volumes*</Label>
                    <Select>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="No volumes available" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="empty">No volumes available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid gap-3 py-2">
                  <Label htmlFor="size" className="text-base font-medium">
                    Size (GB)*
                  </Label>
                  <div className="bg-white p-6 rounded-md border border-[#e2e8f0]">
                    <Slider
                      id="size"
                      min={4}
                      max={2048}
                      step={1}
                      value={[volumeSize]}
                      onValueChange={handleSizeChange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm font-medium mt-4">
                      <span>4 GB</span>
                      <span>2048 GB</span>
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-lg font-semibold">Current selection: {volumeSize} GB</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 border-b pb-6">
                <div className="grid gap-2">
                  <Label>Tags</Label>
                  <div className="space-y-3">
                    {tags.map((tag, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Key"
                          value={tag.key}
                          onChange={(e) => updateTag(index, "key", e.target.value)}
                          className="bg-white"
                        />
                        <Input
                          placeholder="Value"
                          value={tag.value}
                          onChange={(e) => updateTag(index, "value", e.target.value)}
                          className="bg-white"
                        />
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" className="mt-2 w-fit" onClick={addTag}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Tag
                  </Button>
                </div>
              </div>
              <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="w-full">
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex w-full justify-between p-0 font-medium text-foreground"
                  >
                    Advanced Settings
                    <span>
                      {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">Snapshot Policy</Label>
                      {!showSnapshotPolicy ? (
                        <Button type="button" variant="outline" size="sm" onClick={() => setShowSnapshotPolicy(true)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Snapshot Policy
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive h-8 px-2"
                          onClick={() => setShowSnapshotPolicy(false)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    {showSnapshotPolicy ? (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label>Snapshot name (suffix)</Label>
                              <Input
                                value={snapshotPolicy.nameSuffix}
                                onChange={(e) => updateSnapshotPolicy("nameSuffix", e.target.value)}
                                placeholder="e.g., daily"
                                className="bg-white"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Maximum snapshots allowed</Label>
                              <Input
                                type="number"
                                min={1}
                                max={10}
                                value={snapshotPolicy.maxSnapshots}
                                onChange={(e) => updateSnapshotPolicy("maxSnapshots", Number.parseInt(e.target.value))}
                                className="bg-white"
                              />
                              <p className="text-xs text-muted-foreground">Minimum 1, Maximum 10</p>
                            </div>
                            <div className="grid gap-2">
                              <Label>Scheduler</Label>
                              <Select
                                value={snapshotPolicy.frequency}
                                onValueChange={(value) => updateSnapshotPolicy("frequency", value)}
                              >
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="30min">30 Minutes</SelectItem>
                                  <SelectItem value="hour">Hour</SelectItem>
                                  <SelectItem value="day">Day</SelectItem>
                                  <SelectItem value="month">Month</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {snapshotPolicy.frequency === "day" && (
                              <div className="grid gap-2">
                                <Label>Day of the week</Label>
                                <Select
                                  value={snapshotPolicy.dayOfWeek}
                                  onValueChange={(value) => updateSnapshotPolicy("dayOfWeek", value)}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectItem value="monday">Monday</SelectItem>
                                    <SelectItem value="tuesday">Tuesday</SelectItem>
                                    <SelectItem value="wednesday">Wednesday</SelectItem>
                                    <SelectItem value="thursday">Thursday</SelectItem>
                                    <SelectItem value="friday">Friday</SelectItem>
                                    <SelectItem value="saturday">Saturday</SelectItem>
                                    <SelectItem value="sunday">Sunday</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            {snapshotPolicy.frequency === "month" && (
                              <div className="grid gap-2">
                                <Label>Day of the month</Label>
                                <Select
                                  value={snapshotPolicy.dayOfMonth}
                                  onValueChange={(value) => updateSnapshotPolicy("dayOfMonth", value)}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {Array.from({ length: 31 }, (_, i) => (
                                      <SelectItem key={i} value={(i + 1).toString()}>
                                        {i + 1}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Alert variant="default">
                        <AlertDescription>
                          No snapshot policy defined. Click "Add Snapshot Policy" to create one.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">Backup Policy</Label>
                      {!showBackupPolicy ? (
                        <Button type="button" variant="outline" size="sm" onClick={() => setShowBackupPolicy(true)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Backup Policy
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive h-8 px-2"
                          onClick={() => setShowBackupPolicy(false)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    {showBackupPolicy ? (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label>Backup name (suffix)</Label>
                              <Input
                                value={backupPolicy.nameSuffix}
                                onChange={(e) => updateBackupPolicy("nameSuffix", e.target.value)}
                                placeholder="e.g., monthly"
                                className="bg-white"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Maximum backups allowed</Label>
                              <Input
                                type="number"
                                min={1}
                                max={10}
                                value={backupPolicy.maxBackups}
                                onChange={(e) => updateBackupPolicy("maxBackups", Number.parseInt(e.target.value))}
                                className="bg-white"
                              />
                              <p className="text-xs text-muted-foreground">Minimum 1, Maximum 10</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Switch
                                id="backup-incremental-toggle"
                                checked={backupPolicy.incremental}
                                onCheckedChange={(checked) => updateBackupPolicy("incremental", checked)}
                                className="data-[state=checked]:bg-black"
                              />
                              <div className="flex items-center gap-2">
                                <Label htmlFor="backup-incremental-toggle">Incremental</Label>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label>Scheduler</Label>
                              <Select
                                value={backupPolicy.frequency}
                                onValueChange={(value) => updateBackupPolicy("frequency", value)}
                              >
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="30min">30 Minutes</SelectItem>
                                  <SelectItem value="hour">Hour</SelectItem>
                                  <SelectItem value="day">Day</SelectItem>
                                  <SelectItem value="month">Month</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {backupPolicy.frequency === "day" && (
                              <div className="grid gap-2">
                                <Label>Day of the week</Label>
                                <Select
                                  value={backupPolicy.dayOfWeek}
                                  onValueChange={(value) => updateBackupPolicy("dayOfWeek", value)}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectItem value="monday">Monday</SelectItem>
                                    <SelectItem value="tuesday">Tuesday</SelectItem>
                                    <SelectItem value="wednesday">Wednesday</SelectItem>
                                    <SelectItem value="thursday">Thursday</SelectItem>
                                    <SelectItem value="friday">Friday</SelectItem>
                                    <SelectItem value="saturday">Saturday</SelectItem>
                                    <SelectItem value="sunday">Sunday</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            {backupPolicy.frequency === "month" && (
                              <div className="grid gap-2">
                                <Label>Day of the month</Label>
                                <Select
                                  value={backupPolicy.dayOfMonth}
                                  onValueChange={(value) => updateBackupPolicy("dayOfMonth", value)}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {Array.from({ length: 31 }, (_, i) => (
                                      <SelectItem key={i} value={(i + 1).toString()}>
                                        {i + 1}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Alert variant="default">
                        <AlertDescription>
                          No backup policy defined. Click "Add Backup Policy" to create one.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <div className="flex justify-end gap-4 mt-6">
                <Button type="button" variant="outline" asChild disabled={loading}>
                  <Link href="/storage/block/volumes">Cancel</Link>
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Volume"}
                </Button>
              </div>
            </div>
          </form>
        </div>
        {/* Pricing summary - sticky card on the right */}
        <div className="w-full lg:w-80">
          <div className="lg:sticky lg:top-6">
            <Card className="border border-[#e2e8f0] shadow-sm rounded-[12px] bg-[#F5F7FA]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Price Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Volume Size:</span>
                      <span>{volumeSize} GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Price per GB:</span>
                      <span>₹0.10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Cost:</span>
                      <span>₹{calculatePrice()}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>Total Monthly Cost:</span>
                      <span>₹{calculatePrice()}</span>
                    </div>
                  </div>
                  {/* Additional pricing information */}
                  <div className="pt-4 border-t text-xs text-muted-foreground">
                    <p>Prices are estimates and may vary based on usage and additional services.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Create VPC Modal */}
      {showCreateVpcModal && (
        <Dialog open={showCreateVpcModal} onOpenChange={setShowCreateVpcModal}>
          <DialogContent className="p-0 bg-white overflow-hidden">
            <div className="flex justify-between items-center p-6">
              <h2 className="text-2xl font-semibold">Create VPC</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setShowCreateVpcModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="vpc-name" className="text-xl">
                  VPC Name*
                </Label>
                <Input id="vpc-name" placeholder="Enter VPC name" className="border-[#e2e8f0] bg-white" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vpc-description" className="text-xl">
                  Description
                </Label>
                <Textarea
                  id="vpc-description"
                  placeholder="Enter description"
                  className="min-h-[120px] border-[#e2e8f0] bg-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6">
              <Button variant="outline" onClick={() => setShowCreateVpcModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateVpcModal(false)}>
                Create VPC
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageShell>
  )
} 