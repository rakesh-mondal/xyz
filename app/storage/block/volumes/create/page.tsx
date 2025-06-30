"use client"
import { useState, useRef, useEffect } from "react"

import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { HelpCircle, ChevronDown, Check, Search } from "lucide-react"
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
  const [showCreateVpcModal, setShowCreateVpcModal] = useState(false)
  const [showCreateSnapshotModal, setShowCreateSnapshotModal] = useState(false)
  
  // Advanced settings state
  const [snapshotPolicies, setSnapshotPolicies] = useState<any[]>([])
  const [backupPolicies, setBackupPolicies] = useState<any[]>([])
  
  // Refs for form fields
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  // Mock data
  const snapshots: Array<{ value: string; label: string }> = [] // Mock empty snapshots
  const machineImages: Array<{ value: string; label: string }> = [] // Mock empty machine images  
  const otherVolumes = [
    { value: "vol-11111", label: "web-server-volume (vol-11111)" },
    { value: "vol-22222", label: "database-volume (vol-22222)" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const name = nameRef.current?.value.trim() || ""
    const description = descriptionRef.current?.value.trim() || ""
    
    if (!name || !selectedVpc) {
      setError("Please fill all required fields.")
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
      frequency: "daily",
      dayOfWeek: "monday",
      dayOfMonth: 1
    }])
  }

  const addBackupPolicy = () => {
    setBackupPolicies([...backupPolicies, {
      id: Date.now(),
      name: "",
      maxBackups: 5,
      incremental: false,
      frequency: "daily",
      dayOfWeek: "monday",
      dayOfMonth: 1
    }])
  }

  return (
    <TooltipProvider>
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
                    
                                                              <VPCSelector 
                       value={selectedVpc} 
                       onChange={setSelectedVpc} 
                       onCreateNew={() => setShowCreateVpcModal(true)}
                     />

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
                         <Select value={source} onValueChange={setSource} required>
                           <SelectTrigger>
                             <SelectValue placeholder="Select source" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="none">None</SelectItem>
                             <SelectItem value="snapshots">Snapshots</SelectItem>
                             <SelectItem value="machine-images">Machine Images</SelectItem>
                             <SelectItem value="other-volumes">Other volumes</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                     </div>

                    {/* Conditional Source Dropdowns */}
                    {source === "snapshots" && (
                      <SnapshotSelector 
                        value={selectedSnapshot} 
                        onChange={setSelectedSnapshot} 
                        onCreateNew={() => setShowCreateSnapshotModal(true)}
                      />
                    )}

                    {source === "machine-images" && (
                      <div className="mb-5">
                        <Label htmlFor="machine-images-select" className="block mb-2 font-medium">
                          Machine Images <span className="text-destructive">*</span>
                        </Label>
                        {machineImages.length > 0 ? (
                          <Select value={selectedMachineImage} onValueChange={setSelectedMachineImage} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a machine image" />
                            </SelectTrigger>
                            <SelectContent>
                              {machineImages.map((image: any) => (
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
                                <SelectValue placeholder="No Machine Images created" />
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

                    {source === "other-volumes" && (
                      <div className="mb-5">
                        <Label htmlFor="other-volumes-select" className="block mb-2 font-medium">
                          Other volumes <span className="text-destructive">*</span>
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
                  </div>
                </form>
              </CardContent>
              <div className="flex justify-end gap-4 px-6 pb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-secondary transition-colors"
                  onClick={() => window.location.href = "/storage/block"}
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
                  <div className="text-2xl font-bold">₹{calculatePrice()}</div>
                  <p className="text-sm text-muted-foreground">per month</p>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>• Volume ({size[0]} GB): ₹{calculatePrice()}/month</p>
                    <p>• Storage type: HNSS</p>
                    <p>• Additional charges may apply for snapshots and backups</p>
                  </div>
                </div>
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
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose a descriptive volume name for easy identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>HNSS provides high-performance storage for demanding workloads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use tags for cost tracking and resource organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Configure backup policies to protect your data</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create VPC Modal */}
        <Dialog open={showCreateVpcModal} onOpenChange={setShowCreateVpcModal}>
          <DialogContent className="p-0 bg-white max-w-[80vw] max-h-[85vh] w-[80vw] h-[85vh] overflow-hidden flex flex-col">
            <CreateVPCModalContent onClose={() => setShowCreateVpcModal(false)} />
          </DialogContent>
        </Dialog>

        {/* Create Snapshot Modal */}
        <Dialog open={showCreateSnapshotModal} onOpenChange={setShowCreateSnapshotModal}>
          <DialogContent className="p-0 bg-white max-w-[65vw] max-h-[80vh] w-[65vw] h-[80vh] overflow-hidden flex flex-col">
            <CreateSnapshotModalContent onClose={() => setShowCreateSnapshotModal(false)} />
          </DialogContent>
        </Dialog>
      </PageLayout>
    </TooltipProvider>
  )
}

function VPCSelector({ value, onChange, onCreateNew }: { 
  value: string
  onChange: (value: string) => void
  onCreateNew: () => void
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredVPCs = vpcs.filter(vpc => 
    vpc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vpc.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedVPC = vpcs.find(vpc => vpc.id === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="mb-5">
      <Label className="block mb-2 font-medium">
        VPC <span className="text-destructive">*</span>
      </Label>
      <div className="relative" ref={dropdownRef}>
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
        Select the VPC where you want to create this volume.
      </p>
    </div>
  )
}

function SnapshotSelector({ value, onChange, onCreateNew }: { 
  value: string
  onChange: (value: string) => void
  onCreateNew: () => void
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Mock snapshots data - can be replaced with real data
  const snapshotsData = [
    { id: "snap-11111", name: "web-server-snapshot", size: "50GB", created: "2024-01-15" },
    { id: "snap-22222", name: "database-snapshot", size: "120GB", created: "2024-01-10" }
  ]

  const filteredSnapshots = snapshotsData.filter(snapshot => 
    snapshot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snapshot.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedSnapshot = snapshotsData.find(snapshot => snapshot.id === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="mb-5">
      <Label className="block mb-2 font-medium">
        Snapshots <span className="text-destructive">*</span>
      </Label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={selectedSnapshot ? "text-foreground" : "text-muted-foreground"}>
            {selectedSnapshot ? `${selectedSnapshot.name} (${selectedSnapshot.id})` : "Select Snapshot"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search snapshots..."
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
                Create new Snapshot
              </button>
              
              {filteredSnapshots.map((snapshot) => (
                <button
                  key={snapshot.id}
                  type="button"
                  onClick={() => {
                    onChange(snapshot.id)
                    setOpen(false)
                    setSearchTerm("")
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{snapshot.name}</span>
                    <span className="text-xs text-muted-foreground">{snapshot.id} • {snapshot.size} • {snapshot.created}</span>
                  </div>
                  {value === snapshot.id && <Check className="h-4 w-4" />}
                </button>
              ))}
              
              {filteredSnapshots.length === 0 && searchTerm && (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  No snapshots found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Select a snapshot to create volume from.
      </p>
    </div>
  )
}

function CreateSnapshotModalContent({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    snapshotName: "",
    description: "",
    sourceVolume: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    onClose()
  }

  return (
    <>
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b">
        <h2 className="text-2xl font-semibold">Create Snapshot</h2>
        <p className="text-muted-foreground mt-1">Create a point-in-time snapshot of your volume</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 min-h-0 p-6">
        {/* Form Section */}
        <div className="flex-1 overflow-y-auto" style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}>
          <form id="snapshot-form" onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="snapshotName">
                    Snapshot Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="snapshotName"
                    name="snapshotName"
                    value={formData.snapshotName}
                    onChange={handleChange}
                    placeholder="Enter snapshot name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="sourceVolume">
                    Source Volume <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.sourceVolume} 
                    onValueChange={(value) => handleSelectChange('sourceVolume', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vol-11111">web-server-volume (vol-11111)</SelectItem>
                      <SelectItem value="vol-22222">database-volume (vol-22222)</SelectItem>
                      <SelectItem value="vol-33333">storage-volume (vol-33333)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex-shrink-0 flex flex-col min-h-0">
          <div className="overflow-y-auto space-y-6" style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}>
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
                  <div className="text-2xl font-bold">₹0.05</div>
                  <p className="text-sm text-muted-foreground">per GB per month</p>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>• Snapshot storage: ₹0.05/GB/month</p>
                    <p>• Incremental snapshots for efficiency</p>
                    <p>• No charges for snapshot creation</p>
                  </div>
                </div>
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
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose descriptive names for easy identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Snapshots are incremental and space-efficient</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Regular snapshots help with data recovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>First snapshot captures full data, subsequent ones are incremental</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-6 border-t bg-gray-50">
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="snapshot-form"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Snapshot"}
          </Button>
        </div>
      </div>
    </>
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
        <h2 className="text-2xl font-semibold">Create Virtual Private Cloud</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6 min-h-0 p-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2" style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}>
            <div className="space-y-6">
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
          </div>
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