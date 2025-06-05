import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteVolumeModalProps {
  open: boolean
  onClose: () => void
  volumeName: string
  onConfirm: () => Promise<void>
}

export function DeleteVolumeModal({ open, onClose, volumeName, onConfirm }: DeleteVolumeModalProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Volume
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <div>
            Are you sure you want to delete the volume <span className="font-bold">{volumeName}</span>?<br />
            This action cannot be undone.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Confirm Deletion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 