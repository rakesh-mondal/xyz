"use client"
import { useState, useRef } from "react"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronDown, X, ArrowLeft, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { HelpCircle, Search } from "lucide-react"
import { vpcs } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export default function CreateVolumePage() {
  const [volumeSize, setVolumeSize] = useState(50)
  const [sourceType, setSourceType] = useState("none")

  const [selectedImageId, setSelectedImageId] = useState("")
  const [selectedSnapshotId, setSelectedSnapshotId] = useState("")
  const [currentView, setCurrentView] = useState("basic")
  const [availability, setAvailability] = useState("high")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVpc, setSelectedVpc] = useState("")
  const [snapshotEnabled, setSnapshotEnabled] = useState(false)
  const [showCreateVpcModal, setShowCreateVpcModal] = useState(false)
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

  // Refs for form fields
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

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
    // Base price per GB: ₹0.10/GB/month for HNSS
    const basePrice = volumeSize * 0.10
    return basePrice
  }

  // Pricing calculations
  const storageCost = volumeSize * 0.10 // ₹0.10 per GB per month
  const estimatedIOPS = volumeSize * 3 // Estimate 3 IOPS per GB for HNSS
  const iopsCost = (estimatedIOPS / 1000) * 5 // ₹5 per 1000 IOPS per month
  const snapshotCost = snapshotEnabled ? volumeSize * 0.02 : 0 // ₹0.02 per GB for snapshots
  const totalCost = storageCost + iopsCost + snapshotCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const name = nameRef.current?.value.trim() || ""
    const description = descriptionRef.current?.value.trim() || ""
    const vpc = selectedVpc
    if (!name || !vpc) {
      setError("Please fill all required fields.")
      setLoading(false)
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      window.location.href = "/storage/block"
    } catch (err) {
      setError("Failed to create volume. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      title="Create Volume"
      description="Provision a new block storage volume for your cloud resources."
    >
      <div className="flex items-center mb-6">
        <Link
          href="/storage/block"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Block Storage
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="volume-name">Volume Name <span className="text-destructive">*</span></Label>
                      <Input 
                        id="volume-name" 
                        ref={nameRef} 
                        placeholder="Enter volume name" 
                        required 
                        className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Only alphanumeric characters, hyphens, and underscores allowed.
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        ref={descriptionRef} 
                        placeholder="Enter description" 
                        className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                      />
                    </div>
                    
                    <VPCSelector 
                      value={selectedVpc}
                      onChange={setSelectedVpc}
                      onCreateNew={() => setShowCreateVpcModal(true)}
                    />
                  </div>

                  {/* Volume Configuration */}
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <Label className="text-base font-medium">Volume Type <span className="text-destructive">*</span></Label>
                      <RadioGroup defaultValue="hnss" className="space-y-1">
                        <div className="flex items-center space-x-3 rounded-lg border border-border p-4 bg-background">
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
                    
                    <div className="grid gap-3">
                      <Label className="text-base font-medium">Source <span className="text-destructive">*</span></Label>
                      <RadioGroup value={sourceType} onValueChange={setSourceType} className="space-y-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-3 rounded-lg border border-border p-4 bg-background">
                            <RadioGroupItem value="none" id="none" />
                            <Label htmlFor="none" className="font-medium">
                              None
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 rounded-lg border border-border p-4 bg-background">
                            <RadioGroupItem value="snapshots" id="snapshots" />
                            <Label htmlFor="snapshots" className="font-medium">
                              Snapshots
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 rounded-lg border border-border p-4 bg-background">
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
                        <Label htmlFor="snapshots-select">Snapshots <span className="text-destructive">*</span></Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="No Snapshots created" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="empty">No Snapshots created</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {sourceType === "other-volumes" && (
                      <div className="grid gap-2">
                        <Label htmlFor="other-volumes-select">Other Volumes <span className="text-destructive">*</span></Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="No volumes available" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="empty">No volumes available</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="grid gap-3">
                      <Label htmlFor="size" className="text-base font-medium">
                        Size (GB) <span className="text-destructive">*</span>
                      </Label>
                      <div className="p-6 rounded-lg border border-border bg-background">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">{volumeSize} GB</span>
                          <span className="text-sm text-muted-foreground">${calculatePrice()}/month</span>
                        </div>
                        <Slider
                          id="size"
                          min={4}
                          max={2048}
                          step={1}
                          value={[volumeSize]}
                          onValueChange={handleSizeChange}
                          className="my-6"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-4">
                          <span>4 GB</span>
                          <span>2048 GB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
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
                        Add Tag
                      </Button>
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <div className="mb-8">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="advanced-settings">
                        <AccordionTrigger className="text-base font-semibold">
                          Advanced Settings
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4 space-y-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <Label className="text-base font-medium">Snapshot Policy</Label>
                                {!showSnapshotPolicy ? (
                                  <Button type="button" variant="outline" size="sm" onClick={() => setShowSnapshotPolicy(true)}>
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
                                <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
                                  <div className="flex flex-col items-center justify-center py-8">
                                    {/* SVG Illustration */}
                                    <div className="mb-4">
                                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="64" height="64" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1"/>
                                        <path d="M20 24H44C45.1046 24 46 24.8954 46 26V42C46 43.1046 45.1046 44 44 44H20C18.8954 44 18 43.1046 18 42V26C18 24.8954 18.8954 24 20 24Z" stroke="#64748B" strokeWidth="1.5" fill="none"/>
                                        <path d="M32 32L28 28M32 32L36 28M32 32V38" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M40 36V38" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </div>
                                    
                                    <div className="text-center space-y-2 max-w-sm">
                                      <h4 className="text-sm font-medium text-foreground">No Snapshot Policy</h4>
                                      <p className="text-xs text-muted-foreground">
                                        Configure automated snapshots to backup your volume data at regular intervals
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <Label className="text-base font-medium">Backup Policy</Label>
                                {!showBackupPolicy ? (
                                  <Button type="button" variant="outline" size="sm" onClick={() => setShowBackupPolicy(true)}>
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
                                <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
                                  <div className="flex flex-col items-center justify-center py-8">
                                    {/* SVG Illustration */}
                                    <div className="mb-4">
                                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="64" height="64" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1"/>
                                        <path d="M18 20H38C40.2091 20 42 21.7909 42 24V40C42 42.2091 40.2091 44 38 44H18C15.7909 44 14 42.2091 14 40V24C14 21.7909 15.7909 20 18 20Z" stroke="#64748B" strokeWidth="1.5" fill="none"/>
                                        <path d="M22 28H34" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
                                        <path d="M22 32H34" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
                                        <path d="M22 36H30" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
                                        <path d="M46 24L50 28L46 32" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </div>
                                    
                                    <div className="text-center space-y-2 max-w-sm">
                                      <h4 className="text-sm font-medium text-foreground">No Backup Policy</h4>
                                      <p className="text-xs text-muted-foreground">
                                        Set up automated backups to create incremental or full backups of your volume
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </form>
            </CardContent>
            <div className="flex justify-end gap-4 px-6 pb-6">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-secondary transition-colors"
                onClick={() => window.location.href = "/storage/block"}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-black text-white hover:bg-black/90 transition-colors hover:scale-105"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Volume"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="w-full md:w-80 space-y-6">
          {/* Price Summary */}
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
                <h3 className="text-base font-semibold">Price Summary</h3>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div className="text-2xl font-bold">₹{totalCost.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">per month</p>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>• Storage ({volumeSize} GB): ₹{storageCost.toFixed(2)}/month</p>
                  <p>• IOPS ({estimatedIOPS.toLocaleString()}): ₹{iopsCost.toFixed(2)}/month</p>
                  {snapshotEnabled && <p>• Snapshot backup: ₹{snapshotCost.toFixed(2)}/month</p>}
                  <p>• Data transfer charges apply</p>
                </div>
              </div>
            </div>
          </div>

          {/* Volume Configuration Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-normal">Volume Configuration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose volume size based on your storage needs - you can extend later</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Bootable volumes require at least 20 GB for operating system</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Enable encryption for sensitive data protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Regular snapshots help protect against data loss</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>High-performance volumes are ideal for databases and applications</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create VPC Modal */}
      {showCreateVpcModal && (
        <Dialog open={showCreateVpcModal} onOpenChange={setShowCreateVpcModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-white overflow-hidden">
            <CreateVPCModalContent onClose={() => setShowCreateVpcModal(false)} />
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  )
}

function CreateVPCModalContent({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    vpcName: "",
    region: "",
    description: "",
    subnetName: "",
    subnetDescription: "",
    cidr: "",
    gatewayIp: "",
    networkAccessibility: "",
  })
  const [loading, setLoading] = useState(false)
  const [isFirstVPC] = useState(true)

  // Mock region availability data
  const regionAvailability = {
    "us-east-1": {
      name: "US East (N. Virginia)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "high" },
        { type: "GPU RTX A5000", availability: "medium" },
        { type: "GPU RTX A6000", availability: "medium" },
        { type: "Storage", availability: "high" },
      ]
    },
    "us-west-2": {
      name: "US West (Oregon)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "medium" },
        { type: "GPU RTX A5000", availability: "low" },
        { type: "GPU RTX A6000", availability: "low" },
        { type: "Storage", availability: "high" },
      ]
    },
    "eu-west-1": {
      name: "EU (Ireland)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "high" },
        { type: "GPU RTX A5000", availability: "medium" },
        { type: "GPU RTX A6000", availability: "medium" },
        { type: "Storage", availability: "high" },
      ]
    },
    "ap-south-1": {
      name: "Asia Pacific (Mumbai)",
      resources: [
        { type: "CPU Instances", availability: "medium" },
        { type: "GPU A40", availability: "medium" },
        { type: "GPU RTX A5000", availability: "high" },
        { type: "GPU RTX A6000", availability: "high" },
        { type: "Storage", availability: "medium" },
      ]
    },
    "ap-southeast-1": {
      name: "Asia Pacific (Singapore)",
      resources: [
        { type: "CPU Instances", availability: "high" },
        { type: "GPU A40", availability: "low" },
        { type: "GPU RTX A5000", availability: "medium" },
        { type: "GPU RTX A6000", availability: "medium" },
        { type: "Storage", availability: "high" },
      ]
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high": return "bg-green-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-gray-400"
      default: return "bg-gray-300"
    }
  }

  const getAvailabilityBars = (availability: string) => {
    const totalBars = 3
    const activeBars = availability === "high" ? 3 : availability === "medium" ? 2 : 1
    
    return Array.from({ length: totalBars }, (_, index) => (
      <div
        key={index}
        className={`h-1.5 w-6 rounded-sm ${
          index < activeBars ? getAvailabilityColor(availability) : "bg-gray-300"
        }`}
      />
    ))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log("Creating VPC:", formData)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    onClose()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b">
        <h2 className="text-lg font-semibold">Create New VPC</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure and create a new Virtual Private Cloud</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <Card>
              <CardContent className="space-y-6 pt-6">
                <form id="vpc-form" onSubmit={handleSubmit}>
                  {/* VPC Configuration */}
                  <div className="mb-8">
                    <div className="mb-5">
                      <Label htmlFor="vpcName" className="block mb-2 font-medium">
                        VPC Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="vpcName"
                        placeholder="Enter VPC name"
                        value={formData.vpcName}
                        onChange={handleChange}
                        className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Only alphanumeric characters, hyphens, and underscores allowed.
                      </p>
                    </div>

                    <div className="mb-5">
                      <Label htmlFor="region" className="block mb-2 font-medium">
                        Region <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                          <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                          <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                          <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
                          <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Region Availability Display */}
                      {formData.region && regionAvailability[formData.region as keyof typeof regionAvailability] && (
                        <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs text-gray-900">
                              Resource Availability
                            </h4>
                            <span className="text-xs text-gray-500">
                              {regionAvailability[formData.region as keyof typeof regionAvailability].name}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {regionAvailability[formData.region as keyof typeof regionAvailability].resources.map((resource, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-xs text-gray-700">
                                  {resource.type}
                                </span>
                                <div className="flex items-center gap-0.5">
                                  {getAvailabilityBars(resource.availability)}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <div className="h-1.5 w-1.5 bg-green-500 rounded-sm"></div>
                                  <span>High</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="h-1.5 w-1.5 bg-yellow-500 rounded-sm"></div>
                                  <span>Medium</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="h-1.5 w-1.5 bg-gray-400 rounded-sm"></div>
                                  <span>Low</span>
                                </div>
                              </div>
                              <span>Updated 5 min ago</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-5">
                      <Label htmlFor="description" className="block mb-2 font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Enter a description for this VPC"
                        value={formData.description}
                        onChange={handleChange}
                        className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]"
                      />
                    </div>

                    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-600" style={{ fontSize: '13px' }}>
                        You can configure specific settings such as the Subnet, CIDR block, and Gateway IP in the advanced settings.
                      </p>
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <div className="mb-8">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="advanced-settings">
                        <AccordionTrigger className="text-base font-semibold">
                          Advanced Settings
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4">
                            <div className="mb-5">
                              <div className="flex items-center gap-2 mb-2">
                                <Label htmlFor="subnetName" className="font-medium">
                                  Subnet Name
                                </Label>
                                <TooltipWrapper 
                                  content="Name for your subnet. Use letters, numbers, hyphens, underscores."
                                  side="top"
                                >
                                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                                </TooltipWrapper>
                              </div>
                              <Input
                                id="subnetName"
                                placeholder="Enter subnet name"
                                value={formData.subnetName}
                                onChange={handleChange}
                                className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              />
                            </div>

                            <div className="mb-5">
                              <Label htmlFor="subnetDescription" className="block mb-2 font-medium">
                                Subnet Description
                              </Label>
                              <Textarea
                                id="subnetDescription"
                                placeholder="Enter subnet description"
                                value={formData.subnetDescription}
                                onChange={handleChange}
                                className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                              />
                            </div>

                            {/* CIDR, Gateway IP, and Network Accessibility in one row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Label htmlFor="cidr" className="font-medium">
                                    CIDR
                                  </Label>
                                  <TooltipWrapper 
                                    content="IP range for subnet. Example: 10.0.0.0/24 = 254 IPs"
                                    side="top"
                                  >
                                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                                  </TooltipWrapper>
                                </div>
                                <Input
                                  id="cidr"
                                  placeholder="e.g., 10.0.0.0/24"
                                  value={formData.cidr}
                                  onChange={handleChange}
                                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  IP address range in CIDR notation
                                </p>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Label htmlFor="gatewayIp" className="font-medium">
                                    Gateway IP
                                  </Label>
                                  <TooltipWrapper 
                                    content="Default gateway IP. Usually first IP in range (e.g., 10.0.0.1)"
                                    side="top"
                                  >
                                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                                  </TooltipWrapper>
                                </div>
                                <Input
                                  id="gatewayIp"
                                  placeholder="e.g., 10.0.0.1"
                                  value={formData.gatewayIp}
                                  onChange={handleChange}
                                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Gateway IP address
                                </p>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Label htmlFor="networkAccessibility" className="font-medium">
                                    Network Accessibility
                                  </Label>
                                  <TooltipWrapper 
                                    content="Private: isolated from internet. Public: internet accessible"
                                    side="top"
                                  >
                                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                                  </TooltipWrapper>
                                </div>
                                <Select value={formData.networkAccessibility} onValueChange={(value) => handleSelectChange("networkAccessibility", value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select accessibility" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="private">Private</SelectItem>
                                    <SelectItem value="public">Public</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Internet accessibility
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="w-80 flex-shrink-0 space-y-6">
            {/* Price Summary */}
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
                  <h3 className="text-base font-semibold">Price Summary</h3>
                  {isFirstVPC && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">First VPC</Badge>
                  )}
                </div>
              </div>
              <div>
                {isFirstVPC ? (
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-green-600">Free</div>
                    <p className="text-sm text-muted-foreground">
                      Your first Virtual Private Cloud is free! This includes the basic VPC setup and one subnet.
                    </p>
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      <p>• First VPC: ₹0.00/month</p>
                      <p>• Subsequent VPCs: ₹500.00/month</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-2xl font-bold">₹500.00</div>
                    <p className="text-sm text-muted-foreground">per month</p>
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      <p>• VPC Setup: ₹500.00/month</p>
                      <p>• Additional subnets: ₹100.00/month each</p>
                      <p>• Data transfer charges apply</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Configuration Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-normal">Configuration Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose a descriptive VPC name for easy identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Select the region closest to your users for better performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use private networks for better security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Plan your CIDR blocks to avoid IP conflicts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-6 border-t bg-gray-50">
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="vpc-form"
            className="bg-black text-white hover:bg-black/90 transition-colors" 
            disabled={loading}
          >
            {loading ? "Creating..." : "Create VPC"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function VPCSelector({ value, onChange, onCreateNew }: { 
  value: string
  onChange: (value: string) => void
  onCreateNew: () => void
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredVPCs = vpcs.filter(vpc => 
    vpc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vpc.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedVPC = vpcs.find(vpc => vpc.id === value)

  return (
    <div className="mb-5">
      <Label className="block mb-2 font-medium">
        VPC <span className="text-destructive">*</span>
      </Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={selectedVPC ? "text-foreground" : "text-muted-foreground"}>
            {selectedVPC ? `${selectedVPC.name} (${selectedVPC.id})` : "Select VPC"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search VPCs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="p-1">
              <button
                type="button"
                onClick={() => {
                  onCreateNew()
                  setOpen(false)
                }}
                className="w-full flex items-center px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm text-primary font-medium"
              >
                Create new VPC
              </button>
              
              {filteredVPCs.map((vpc) => (
                <button
                  key={vpc.id}
                  type="button"
                  onClick={() => {
                    onChange(vpc.id)
                    setOpen(false)
                    setSearchTerm("")
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{vpc.name}</span>
                    <span className="text-xs text-muted-foreground">{vpc.id} • {vpc.region}</span>
                  </div>
                  {value === vpc.id && <Check className="h-4 w-4" />}
                </button>
              ))}
              
              {filteredVPCs.length === 0 && searchTerm && (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  No VPCs found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Select the VPC where this volume will be available.
      </p>
    </div>
  )
} 