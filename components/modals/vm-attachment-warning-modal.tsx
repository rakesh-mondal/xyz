import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface VMAttachmentWarningModalProps {
  open: boolean
  onClose: () => void
  volumeName: string
  instanceName: string
}

export function VMAttachmentWarningModal({ open, onClose, volumeName, instanceName }: VMAttachmentWarningModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-700">Volume is associated with a VM</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <div>
            The volume <span className="font-bold">{volumeName}</span> is attached with a VM <span className="font-bold">{instanceName}</span>.<br />
            Please detach the volume from the VM before proceeding with this action.
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 