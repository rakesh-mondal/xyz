"use client"
import { useState, useRef } from "react"

import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { vpcs } from "@/lib/data"

export default function CreateVolumePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVpc, setSelectedVpc] = useState("")
  const [volumeType, setVolumeType] = useState("hnss")
  const [source, setSource] = useState("none")
  const [selectedSnapshot, setSelectedSnapshot] = useState("")
  const [selectedMachineImage, setSelectedMachineImage] = useState("")
  const [selectedVolume, setSelectedVolume] = useState("")
  const [size, setSize] = useState([100])
  const [tags, setTags] = useState([{ key: "", value: "" }])
  
  // Advanced settings state
  const [snapshotPolicies, setSnapshotPolicies] = useState<any[]>([])
  const [backupPolicies, setBackupPolicies] = useState<any[]>([])
  
  // Refs for form fields
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  // Mock data for source options
  const snapshots = [
    { value: "snap-11111", label: "web-server-snapshot (snap-11111) - 50GB - 2024-01-15" },
    { value: "snap-22222", label: "database-snapshot (snap-22222) - 120GB - 2024-01-10" }
  ]

  const machineImages = [
    { value: "ami-11111", label: "Ubuntu 22.04 LTS (ami-11111)" },
    { value: "ami-22222", label: "CentOS 8 (ami-22222)" }
  ]

  const otherVolumes = [
    { value: "vol-11111", label: "web-server-volume (vol-11111) - 100GB" },
    { value: "vol-22222", label: "database-volume (vol-22222) - 200GB" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const name = nameRef.current?.value.trim() || ""
    
    // Validate required fields based on source selection
    if (!name || !selectedVpc) {
      setError("Please fill all required fields.")
      setLoading(false)
      return
    }

    // Validate source-specific requirements
    if (source === "snapshot" && !selectedSnapshot) {
      setError("Please select a snapshot.")
      setLoading(false)
      return
    }

    if (source === "machine-image" && !selectedMachineImage) {
      setError("Please select a machine image.")
      setLoading(false)
      return
    }

    if (source === "volume" && !selectedVolume) {
      setError("Please select a volume.")
      setLoading(false)
      return
    }
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      window.location.href = "/storage/block"
    } catch (err) {
      setError("Failed to create volume. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    setTags([...tags, { key: "", value: "" }])
  }

  const updateTag = (index: number, field: 'key' | 'value', value: string) => {
    const newTags = [...tags]
    newTags[index][field] = value
    setTags(newTags)
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const calculatePrice = () => {
    const pricePerGB = 0.10
    const totalPrice = size[0] * pricePerGB
    return totalPrice.toFixed(2)
  }

  const addSnapshotPolicy = () => {
    setSnapshotPolicies([...snapshotPolicies, {
      id: Date.now(),
      name: "",
      maxSnapshots: 5,
      frequency: "daily"
    }])
  }

  const addBackupPolicy = () => {
    setBackupPolicies([...backupPolicies, {
      id: Date.now(),
      name: "",
      maxBackups: 5,
      incremental: false,
      frequency: "daily"
    }])
  }

  const handleSourceChange = (newSource: string) => {
    setSource(newSource)
    // Clear previously selected values when source changes
    setSelectedSnapshot("")
    setSelectedMachineImage("")
    setSelectedVolume("")
  }

  return (
    <PageLayout
      title="Create Volume"
      description="Provision a new block storage volume for your cloud resources."
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
                
                {/* Basic Configuration */}
                <div className="mb-8">
                  <div className="mb-5">
                    <Label htmlFor="volume-name" className="block mb-2 font-medium">
                      Volume Name <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="volume-name" 
                      ref={nameRef} 
                      placeholder="Enter volume name" 
                      required 
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Only alphanumeric characters, hyphens, and underscores allowed.
                    </p>
                  </div>
                  
                  <div className="mb-5">
                    <Label htmlFor="description" className="block mb-2 font-medium">
                      Description
                    </Label>
                    <Textarea 
                      id="description" 
                      ref={descriptionRef} 
                      placeholder="Enter description" 
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                    />
                  </div>
                  
                  {/* VPC Selection */}
                  <div className="mb-5">
                    <Label htmlFor="vpc" className="block mb-2 font-medium">
                      VPC <span className="text-destructive">*</span>
                    </Label>
                    <Select value={selectedVpc} onValueChange={setSelectedVpc} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select VPC" />
                      </SelectTrigger>
                      <SelectContent>
                        {vpcs.map((vpc) => (
                          <SelectItem key={vpc.id} value={vpc.id}>
                            {vpc.name} ({vpc.id}) - {vpc.region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div>
                      <Label htmlFor="volume-type" className="block mb-2 font-medium">
                        Volume Type <span className="text-destructive">*</span>
                      </Label>
                      <Select value={volumeType} onValueChange={setVolumeType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select volume type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hnss">High-speed NVME SSD storage (HNSS)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">xxx MBPS Throughput</p>
                    </div>

                    <div>
                      <Label htmlFor="source" className="block mb-2 font-medium">
                        Source <span className="text-destructive">*</span>
                      </Label>
                      <Select value={source} onValueChange={handleSourceChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (create empty volume)</SelectItem>
                          <SelectItem value="snapshot">Snapshot</SelectItem>
                          <SelectItem value="machine-image">Machine Image</SelectItem>
                          <SelectItem value="volume">Other Volume</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Conditional Source Dropdowns */}
                  {source === "snapshot" && (
                    <div className="mb-5">
                      <Label htmlFor="snapshot-select" className="block mb-2 font-medium">
                        Snapshots <span className="text-destructive">*</span>
                      </Label>
                      {snapshots.length > 0 ? (
                        <Select value={selectedSnapshot} onValueChange={setSelectedSnapshot} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a snapshot" />
                          </SelectTrigger>
                          <SelectContent>
                            {snapshots.map((snapshot) => (
                              <SelectItem key={snapshot.value} value={snapshot.value}>
                                {snapshot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="space-y-2">
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="No snapshots available" />
                            </SelectTrigger>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = "/storage/block/snapshots"}
                          >
                            Create Snapshot
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {source === "machine-image" && (
                    <div className="mb-5">
                      <Label htmlFor="machine-image-select" className="block mb-2 font-medium">
                        Machine Images <span className="text-destructive">*</span>
                      </Label>
                      {machineImages.length > 0 ? (
                        <Select value={selectedMachineImage} onValueChange={setSelectedMachineImage} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a machine image" />
                          </SelectTrigger>
                          <SelectContent>
                            {machineImages.map((image) => (
                              <SelectItem key={image.value} value={image.value}>
                                {image.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="space-y-2">
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="No machine images available" />
                            </SelectTrigger>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = "/compute/machines/images"}
                          >
                            Upload Machine Image
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {source === "volume" && (
                    <div className="mb-5">
                      <Label htmlFor="volume-select" className="block mb-2 font-medium">
                        Other Volumes <span className="text-destructive">*</span>
                      </Label>
                      {otherVolumes.length > 0 ? (
                        <Select value={selectedVolume} onValueChange={setSelectedVolume} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a volume" />
                          </SelectTrigger>
                          <SelectContent>
                            {otherVolumes.map((volume) => (
                              <SelectItem key={volume.value} value={volume.value}>
                                {volume.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="space-y-2">
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="No volumes available" />
                            </SelectTrigger>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = "/storage/block/volumes"}
                          >
                            Create Volume
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Size Selection */}
                  <Card className="mb-5">
                    <CardContent className="pt-4">
                      <Label htmlFor="size" className="block mb-3 font-medium">
                        Size (GB) <span className="text-destructive">*</span>
                      </Label>
                      
                      <div className="space-y-4">
                        {/* Quick Presets + Custom Input Row */}
                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground mb-2 block">Quick Select</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { size: 20, label: "20GB" },
                                { size: 100, label: "100GB" },
                                { size: 500, label: "500GB" },
                                { size: 1000, label: "1TB" }
                              ].map((preset) => (
                                <Button
                                  key={preset.size}
                                  type="button"
                                  variant={size[0] === preset.size ? "default" : "outline"}
                                  size="sm"
                                  className={`h-9 text-xs font-medium ${
                                    size[0] === preset.size ? "bg-primary text-primary-foreground" : ""
                                  }`}
                                  onClick={() => setSize([preset.size])}
                                >
                                  {preset.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="w-28">
                            <Label className="text-xs text-muted-foreground mb-2 block">Custom</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={size[0]}
                                onChange={(e) => {
                                  const value = Math.max(4, Math.min(2048, Number(e.target.value) || 4))
                                  setSize([value])
                                }}
                                className="w-full h-9 text-xs text-center pr-8"
                                min={4}
                                max={2048}
                              />
                              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">GB</span>
                            </div>
                          </div>
                        </div>

                        {/* Slider */}
                        <div className="space-y-2">
                          <Slider
                            value={size}
                            onValueChange={setSize}
                            max={2048}
                            min={4}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>4 GB</span>
                            <span>2048 GB</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-sm font-medium">{size[0]} GB Selected</span>
                              <span className="text-xs text-muted-foreground px-2 py-0.5 bg-white rounded">
                                {size[0] <= 50 ? "Development" : size[0] <= 200 ? "Small App" : size[0] <= 800 ? "Production" : "Enterprise"}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-primary">₹{calculatePrice()}/mo</div>
                              <div className="text-xs text-muted-foreground">₹{(Number(calculatePrice()) * 12).toFixed(2)}/year</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <div className="mb-5">
                    <Label className="block mb-2 font-medium">Tags</Label>
                    <div className="space-y-3">
                      {tags.map((tag, index) => (
                        <div key={index} className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Key"
                            value={tag.key}
                            onChange={(e) => updateTag(index, 'key', e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Input
                              placeholder="Value"
                              value={tag.value}
                              onChange={(e) => updateTag(index, 'value', e.target.value)}
                            />
                            {tags.length > 1 ? (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeTag(index)}
                              >
                                Remove
                              </Button>
                            ) : (
                              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                                Add Tag
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="advanced">
                      <AccordionTrigger>Advanced Settings</AccordionTrigger>
                      <AccordionContent className="space-y-6">
                        {/* Snapshot Policies */}
                        <div>
                          <Label className="block mb-2 font-medium">Snapshot Policies</Label>
                          {snapshotPolicies.length > 0 ? (
                            <div className="space-y-4 mb-4">
                              {snapshotPolicies.map((policy, index) => (
                                <Card key={policy.id}>
                                  <CardContent className="pt-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Snapshot name (suffix)</Label>
                                        <Input placeholder="Enter suffix" />
                                      </div>
                                      <div>
                                        <Label>Maximum snapshots allowed</Label>
                                        <Select defaultValue="5">
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {Array.from({length: 10}, (_, i) => (
                                              <SelectItem key={i+1} value={String(i+1)}>{i+1}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="block mb-2">Scheduler</Label>
                                      <div className="grid grid-cols-1 gap-4">
                                        <div>
                                          <Label>Once every</Label>
                                          <Select defaultValue="daily">
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="30-minutes">30 Minutes</SelectItem>
                                              <SelectItem value="hourly">Hour</SelectItem>
                                              <SelectItem value="daily">Day</SelectItem>
                                              <SelectItem value="monthly">Month</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <div className="mb-3">
                                <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                                  <rect width="80" height="50" fill="#FFFFFF"/>
                                  <rect x="15" y="15" width="50" height="20" fill="none" stroke="#E5E7EB" strokeWidth="2" rx="3"/>
                                  <path d="M22 22H58" stroke="#E5E7EB" strokeWidth="1.5"/>
                                  <path d="M22 28H48" stroke="#E5E7EB" strokeWidth="1.5"/>
                                  <circle cx="19" cy="25" r="1.5" fill="#E5E7EB"/>
                                </svg>
                              </div>
                              <h4 className="font-medium text-sm mb-2">No Snapshot Policies</h4>
                              <p className="text-xs text-muted-foreground mb-3">
                                No snapshot policies configured. Add policies to automate volume snapshot creation and management.
                              </p>
                              <Button type="button" variant="outline" size="sm" onClick={addSnapshotPolicy}>
                                Add Snapshot Policy
                              </Button>
                            </div>
                          )}
                          {snapshotPolicies.length > 0 && (
                            <Button type="button" variant="outline" size="sm" onClick={addSnapshotPolicy}>
                              Add Snapshot Policy
                            </Button>
                          )}
                        </div>

                        {/* Backup Policies */}
                        <div>
                          <Label className="block mb-2 font-medium">Backup Policies</Label>
                          {backupPolicies.length > 0 ? (
                            <div className="space-y-4 mb-4">
                              {backupPolicies.map((policy, index) => (
                                <Card key={policy.id}>
                                  <CardContent className="pt-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Backup name (suffix)</Label>
                                        <Input placeholder="Enter suffix" />
                                      </div>
                                      <div>
                                        <Label>Max Backups Allowed</Label>
                                        <Select defaultValue="5">
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {Array.from({length: 10}, (_, i) => (
                                              <SelectItem key={i+1} value={String(i+1)}>{i+1}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Switch />
                                      <Label>Incremental</Label>
                                    </div>
                                    <div>
                                      <Label className="block mb-2">Scheduler</Label>
                                      <div className="grid grid-cols-1 gap-4">
                                        <div>
                                          <Label>Once every</Label>
                                          <Select defaultValue="daily">
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="30-minutes">30 Minutes</SelectItem>
                                              <SelectItem value="hourly">Hour</SelectItem>
                                              <SelectItem value="daily">Day</SelectItem>
                                              <SelectItem value="monthly">Month</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <div className="mb-3">
                                <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                                  <rect width="80" height="50" fill="#FFFFFF"/>
                                  <rect x="15" y="15" width="50" height="20" fill="none" stroke="#E5E7EB" strokeWidth="2" rx="3"/>
                                  <path d="M22 22H58" stroke="#E5E7EB" strokeWidth="1.5"/>
                                  <path d="M22 28H48" stroke="#E5E7EB" strokeWidth="1.5"/>
                                  <circle cx="19" cy="25" r="1.5" fill="#E5E7EB"/>
                                </svg>
                              </div>
                              <h4 className="font-medium text-sm mb-2">No Backup Policies</h4>
                              <p className="text-xs text-muted-foreground mb-3">
                                No backup policies configured. Add policies to provide automated data protection and recovery options.
                              </p>
                              <Button type="button" variant="outline" size="sm" onClick={addBackupPolicy}>
                                Add Backup Policy
                              </Button>
                            </div>
                          )}
                          {backupPolicies.length > 0 && (
                            <Button type="button" variant="outline" size="sm" onClick={addBackupPolicy}>
                              Add Backup Policy
                            </Button>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => window.location.href = "/storage/block"}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Volume"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex-shrink-0 space-y-6">
          {/* Configuration Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-normal">Configuration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose size based on your application needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>HNSS provides high-performance storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Consider backup policies for data protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Tags help organize and track resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use advanced settings for automated management</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
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
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">₹{calculatePrice()}</span>
                  <span className="text-sm text-muted-foreground">per month</span>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>• Volume ({size[0]} GB): ₹{calculatePrice()}/month</p>
                  <p>• Storage type: HNSS</p>
                  <p>• Additional charges may apply for snapshots and backups</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 