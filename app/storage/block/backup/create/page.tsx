"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { HelpCircle } from "lucide-react"

// Mock data for block storage volumes (copy from block/page.tsx for design mode)
const mockVolumes = [
  { id: "vol-001", name: "web-server-root", size: "50", type: "High-speed NVME SSD Storage (HNSS)", status: "attached" },
  { id: "vol-002", name: "database-storage", size: "200", type: "High-speed NVME SSD Storage (HNSS)", status: "attached" },
  { id: "vol-003", name: "backup-volume", size: "500", type: "High-speed NVME SSD Storage (HNSS)", status: "available" },
  { id: "vol-004", name: "temp-processing", size: "100", type: "High-speed NVME SSD Storage (HNSS)", status: "attached" },
  { id: "vol-005", name: "logs-storage", size: "80", type: "High-speed NVME SSD Storage (HNSS)", status: "creating" },
  { id: "vol-006", name: "app-server-data", size: "150", type: "High-speed NVME SSD Storage (HNSS)", status: "attached" },
  { id: "vol-007", name: "cache-volume", size: "75", type: "High-speed NVME SSD Storage (HNSS)", status: "attached" },
  { id: "vol-008", name: "staging-root", size: "40", type: "High-speed NVME SSD Storage (HNSS)", status: "attached" },
  { id: "vol-009", name: "analytics-storage", size: "300", type: "High-speed NVME SSD Storage (HNSS)", status: "available" },
]

// Dummy backup data for numbering logic
const mockBackups = [
  { id: "bkp-001", name: "backup-volume-1", volumeId: "vol-003", type: "Primary" },
  { id: "bkp-002", name: "backup-volume-2", volumeId: "vol-003", type: "Incremental" },
  { id: "bkp-003", name: "web-server-root-1", volumeId: "vol-001", type: "Primary" },
]

const MAX_BACKUPS = 5

export default function CreateBackupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    backupName: "",
    size: "",
    volumeId: "",
    type: "Volume",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [summaryData, setSummaryData] = useState<any>(null)

  // Helper to get next backup number for a volume
  function getNextBackupNumber(volumeId: string) {
    const backups = mockBackups.filter(b => b.volumeId === volumeId)
    if (backups.length === 0) return 1
    // Find highest number in backup names for this volume
    const nums = backups.map(b => {
      const match = b.name.match(/(\d+)$/)
      return match ? parseInt(match[1], 10) : 1
    })
    const maxNum = Math.max(...nums)
    return Math.min(maxNum + 1, MAX_BACKUPS)
  }

  // Helper to determine if this is a primary backup
  function isPrimaryBackup(volumeId: string) {
    const backups = mockBackups.filter(b => b.volumeId === volumeId)
    return backups.length === 0
  }

  // Handle form field changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }
  function handleSelectChange(id: string, value: string) {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  // Handle form submit (simulate backup creation)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate backup creation and show summary
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSummary(true)
      setSummaryData({ ...formData })
    }, 1200)
  }

  // Get selected volume details
  const selectedVolume = mockVolumes.find(v => v.id === formData.volumeId)
  const nextBackupNumber = formData.volumeId ? getNextBackupNumber(formData.volumeId) : 1
  const isPrimary = formData.volumeId ? isPrimaryBackup(formData.volumeId) : true
  const autoBackupName = selectedVolume ? `${selectedVolume.name}-${nextBackupNumber}` : ""

  return (
    <PageLayout
      title="Create Backup"
      description="Create a new backup for your block storage volume."
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form id="backup-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="volumeId" className="block mb-2 font-medium">
                        Volume Name <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.volumeId} onValueChange={v => handleSelectChange("volumeId", v)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select volume" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockVolumes.map(v => (
                            <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="backupName" className="block mb-2 font-medium">
                        Backup Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="backupName"
                        placeholder="Auto-generated or enter custom name"
                        value={formData.backupName || autoBackupName}
                        onChange={handleChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Default: <span className="font-mono">{autoBackupName}</span>
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="size" className="block mb-2 font-medium">
                        Size (GB) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="size"
                        type="number"
                        min={1}
                        placeholder="Enter backup size"
                        value={formData.size}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  {/* Right column */}
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="type" className="block mb-2 font-medium">
                        Type <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.type} onValueChange={v => handleSelectChange("type", v)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Volume">Volume</SelectItem>
                          <SelectItem value="VM">VM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="block mb-2 font-medium flex items-center gap-1">
                        Primary
                        <TooltipWrapper content={<span>
                          Is this backup the primary (first or instant) backup for the selected volume/VM?
                        </span>}>
                          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipWrapper>
                      </Label>
                      <Input
                        value={isPrimary ? "Yes (Primary)" : "No (Incremental)"}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        The first backup for a volume or instant backup is always primary (number 1). Subsequent backups are incremental.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 px-6 pb-6">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-secondary transition-colors"
                onClick={() => router.push("/storage/block")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-black text-white hover:bg-black/90 transition-colors hover:scale-105"
                form="backup-form"
                disabled={isSubmitting || !formData.volumeId || !formData.size}
              >
                {isSubmitting ? "Creating..." : "Create Backup"}
              </Button>
            </CardFooter>
          </Card>
          {/* Show summary after submit (design mode) */}
          {showSummary && (
            <Card className="border-green-500 border-2">
              <CardHeader>
                <CardTitle>Backup Created (Mock)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div><b>Backup Name:</b> {summaryData.backupName || autoBackupName}</div>
                  <div><b>Volume:</b> {selectedVolume?.name}</div>
                  <div><b>Size:</b> {summaryData.size} GB</div>
                  <div><b>Type:</b> {summaryData.type}</div>
                  <div><b>Primary:</b> {isPrimary ? "Yes" : "No"}</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => router.push("/storage/block")}>Back to Block Storage</Button>
              </CardFooter>
            </Card>
          )}
        </div>
        {/* Side Panel */}
        <div className="w-full md:w-80 space-y-6">
          {/* Configuration Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-normal">Configuration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose a descriptive backup name for easy identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Select the correct volume to back up</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Primary backups are the first for a volume; others are incremental</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Maximum {MAX_BACKUPS} backups per volume; older incremental backups are rotated</span>
                </li>
              </ul>
            </CardContent>
          </Card>

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
                <div className="text-2xl font-bold">₹0.00</div>
                <p className="text-sm text-muted-foreground">
                  Backup creation is free in design mode. Pricing will be shown here in production.
                </p>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>• Backup: ₹0.00 (mock)</p>
                  <p>• Storage charges may apply</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 