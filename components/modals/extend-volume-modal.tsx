import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowUpIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"

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
    if (newSize <= currentSize) return
    
    setLoading(true)
    try {
      await onExtend(newSize)
      onClose()
    } catch (error) {
      console.error("Error extending volume:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpIcon className="h-5 w-5" />
            Extend Volume
          </DialogTitle>
          <DialogDescription>
            Increase the size of your volume. This operation cannot be reversed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Current Size</Label>
            <div className="text-sm font-medium text-muted-foreground">
              {currentSize} GB
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-size">New Size (GB) *</Label>
            <Input
              id="new-size"
              type="number"
              min={currentSize + 1}
              max={2048}
              value={newSize}
              onChange={(e) => setNewSize(Number(e.target.value))}
            />
            <div className="text-xs text-muted-foreground">
              Must be greater than current size ({currentSize} GB). Maximum: 2048 GB
            </div>
          </div>
          
          <Alert>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Once you extend the volume, you cannot decrease the size later.
            </AlertDescription>
          </Alert>
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
            onClick={handleExtend}
            disabled={loading || newSize <= currentSize}
          >
            {loading ? "Extending..." : "Extend Volume"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 