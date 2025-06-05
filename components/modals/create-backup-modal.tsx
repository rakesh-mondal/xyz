import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
    setLoading(true)
    await onCreate({ volume, name, description })
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Instant Backup</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="block font-bold mb-1" htmlFor="volume">Volume*</label>
            <select
              id="volume"
              className="w-full border rounded p-2"
              value={volume}
              onChange={e => setVolume(e.target.value)}
            >
              <option value="">Select Volume</option>
              {volumes.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1" htmlFor="name">Backup Name*</label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter backup name" />
          </div>
          <div>
            <label className="block font-bold mb-1" htmlFor="description">Description</label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter description" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading || !volume || !name}>
            {loading ? "Creating..." : "Create Backup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 