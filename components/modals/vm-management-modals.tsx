"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExclamationTriangleIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline"

// Stop Machine Modal
interface StopMachineModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  machineName: string
  isLoading?: boolean
}

export function StopMachineModal({ open, onClose, onConfirm, machineName, isLoading = false }: StopMachineModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}>
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            Are you sure you want to stop the machine?
          </DialogTitle>
          <hr className="border-border" />
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <Alert>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              This will stop the machine. We can't guarantee the availability of a VM when you restart the machine. If all our machines are booked out, you will have to wait till machines gets freed up.
            </AlertDescription>
          </Alert>
          <div className="rounded-md bg-muted p-3 font-medium">{machineName}</div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-20"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="min-w-20"
            disabled={isLoading}
          >
            {isLoading ? "Stopping..." : "Stop Machine"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Restart Machine Modal
interface RestartMachineModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  machineName: string
  isLoading?: boolean
}

export function RestartMachineModal({ open, onClose, onConfirm, machineName, isLoading = false }: RestartMachineModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}>
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            Restart Machine
          </DialogTitle>
          <hr className="border-border" />
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to restart this machine?
          </p>
          <div className="rounded-md bg-muted p-3 font-medium">{machineName}</div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-20"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="min-w-20"
            disabled={isLoading}
          >
            {isLoading ? "Restarting..." : "Restart Machine"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Restart Error Modal
interface RestartErrorModalProps {
  open: boolean
  onClose: () => void
  onTryAgain: () => void
  machineName: string
}

export function RestartErrorModal({ open, onClose, onTryAgain, machineName }: RestartErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}>
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            Machine can't be restarted
          </DialogTitle>
          <hr className="border-border" />
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              Machine can't be restarted due unavailability of machines. Please try again later.
            </AlertDescription>
          </Alert>
          <div className="rounded-md bg-muted p-3 font-medium">{machineName}</div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-20"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onTryAgain}
            className="min-w-20"
          >
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Terminate Machine Modal
interface TerminateMachineModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  machineName: string
  isLoading?: boolean
}

export function TerminateMachineModal({ open, onClose, onConfirm, machineName, isLoading = false }: TerminateMachineModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}>
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            Are you sure you want to terminate the machine?
          </DialogTitle>
          <hr className="border-border" />
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              All your workloads will be deleted and you won't be able to retrieve it back. The attached volumes will be freed up.
            </AlertDescription>
          </Alert>
          <div className="rounded-md bg-muted p-3 font-medium">{machineName}</div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-20"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="min-w-20"
            disabled={isLoading}
          >
            {isLoading ? "Terminating..." : "Terminate Machine"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Delete Protection Error Modal
interface DeleteProtectionErrorModalProps {
  open: boolean
  onClose: () => void
  machineName: string
}

export function DeleteProtectionErrorModal({ open, onClose, machineName }: DeleteProtectionErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}>
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            Unable to terminate the machine as delete protection is enabled
          </DialogTitle>
          <hr className="border-border" />
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <Alert>
            <LockClosedIcon className="h-4 w-4" />
            <AlertDescription>
              Please disable the delete protection before terminating the machine.
            </AlertDescription>
          </Alert>
          <div className="rounded-md bg-muted p-3 font-medium">{machineName}</div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
          <Button
            type="button"
            onClick={onClose}
            className="min-w-20"
          >
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Enable Delete Protection Modal
interface EnableDeleteProtectionModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  machineName: string
  isLoading?: boolean
}

export function EnableDeleteProtectionModal({ open, onClose, onConfirm, machineName, isLoading = false }: EnableDeleteProtectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}>
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            Enable Deletion Protection?
          </DialogTitle>
          <hr className="border-border" />
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            This will prevent the machine from being deleted. Are you sure you want to continue?
          </p>
          <div className="rounded-md bg-muted p-3 font-medium">{machineName}</div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-20"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="min-w-20"
            disabled={isLoading}
          >
            {isLoading ? "Enabling..." : "Enable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Disable Delete Protection Modal
interface DisableDeleteProtectionModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  machineName: string
  isLoading?: boolean
}

export function DisableDeleteProtectionModal({ open, onClose, onConfirm, machineName, isLoading = false }: DisableDeleteProtectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}>
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            Disable Deletion Protection?
          </DialogTitle>
          <hr className="border-border" />
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            This will allow the machine to be deleted. Are you sure you want to continue?
          </p>
          <div className="rounded-md bg-muted p-3 font-medium">{machineName}</div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-20"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="min-w-20"
            disabled={isLoading}
          >
            {isLoading ? "Disabling..." : "Disable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Create Machine Image Modal
interface CreateMachineImageModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (imageName: string) => void
  machineName: string
  isLoading?: boolean
}

export function CreateMachineImageModal({ open, onClose, onConfirm, machineName, isLoading = false }: CreateMachineImageModalProps) {
  const [imageName, setImageName] = useState("");

  const handleConfirm = () => {
    if (imageName.trim()) {
      onConfirm(imageName.trim());
    }
  };

  const handleClose = () => {
    setImageName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}>
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            Create Machine Image
          </DialogTitle>
          <hr className="border-border" />
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Create a machine image from: <strong>{machineName}</strong>
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="image-name" className="text-sm font-medium">
              Machine Image Name
            </Label>
            <Input
              id="image-name"
              type="text"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Enter machine image name"
              className="w-full"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="min-w-20"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="min-w-20"
            disabled={isLoading || !imageName.trim()}
          >
            {isLoading ? "Creating..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Reboot Machine Modal
interface RebootMachineModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  machineName: string
  isLoading?: boolean
}

export function RebootMachineModal({ open, onClose, onConfirm, machineName, isLoading = false }: RebootMachineModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' }}>
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            Are you sure you want to reboot the machine?
          </DialogTitle>
          <hr className="border-border" />
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <Alert>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              This will temporarily interrupt your current session. Please ensure that no active workloads are running.
            </AlertDescription>
          </Alert>
          <div className="rounded-md bg-muted p-3 font-medium">{machineName}</div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-20"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="min-w-20"
            disabled={isLoading}
          >
            {isLoading ? "Rebooting..." : "Reboot now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 