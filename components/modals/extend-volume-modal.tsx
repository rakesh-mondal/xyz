import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ExtendVolumeModalProps {
  open: boolean
  onClose: () => void
  currentSize: number
  onExtend: (newSize: number) => Promise<void>
}

export function ExtendVolumeModal({ open, onClose, currentSize, onExtend }: ExtendVolumeModalProps) {
  const [newSize, setNewSize] = useState(currentSize + 1)
  const [loading, setLoading] = useState(false)

  const handleExtend = async () => {
    setLoading(true)
    await onExtend(newSize)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend Volume</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <label className="block font-bold mb-1">Current Size</label>
            <div>{currentSize} GB</div>
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1" htmlFor="new-size">New Size (GB)*</label>
            <Input
              id="new-size"
              type="number"
              min={currentSize + 1}
              max={2048}
              value={newSize}
              onChange={e => setNewSize(Number(e.target.value))}
            />
            <div className="text-xs text-muted-foreground mt-1">
              New size must be greater than the current size ({currentSize} GB)
            </div>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-4">
            <div className="font-bold mb-1">Warning</div>
            <div>Once you extend the volume, you can't decrease the size later.</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleExtend} disabled={loading || newSize <= currentSize}>
            {loading ? "Extending..." : "Extend Volume"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 