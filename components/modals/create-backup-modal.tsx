import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderIcon } from "@heroicons/react/24/outline"

interface CreateBackupModalProps {
  open: boolean
  onClose: () => void
  volumes: string[]
  onCreate: (data: { volume: string; name: string; description: string }) => Promise<void>
}

export function CreateBackupModal({ open, onClose, volumes, onCreate }: CreateBackupModalProps) {
  const [volume, setVolume] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!volume || !name) return
    
    setLoading(true)
    try {
      await onCreate({ volume, name, description })
      onClose()
      // Reset form
      setVolume("")
      setName("")
      setDescription("")
    } catch (error) {
      console.error("Error creating backup:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5" />
            Create Instant Backup
          </DialogTitle>
          <DialogDescription>
            Create a backup of your volume data for data protection and recovery purposes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="volume">Volume *</Label>
            <Select value={volume} onValueChange={setVolume}>
              <SelectTrigger>
                <SelectValue placeholder="Select volume" />
              </SelectTrigger>
              <SelectContent>
                {volumes.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Backup Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter backup name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter backup description (optional)"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={loading || !volume || !name}
          >
            {loading ? "Creating..." : "Create Backup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 