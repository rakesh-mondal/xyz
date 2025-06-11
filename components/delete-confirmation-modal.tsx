"use client"

import { useState } from "react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  resourceName: string
  resourceType: string
  onConfirm: () => void
}

/**
 * @component DeleteConfirmationModal
 * @description A modal dialog that asks for confirmation before deleting a resource
 * @status Active
 * @example
 * <DeleteConfirmationModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   resourceName="production-vpc"
 *   resourceType="VPC"
 *   onConfirm={handleDelete}
 * />
 */
export function DeleteConfirmationModal({
  isOpen,
  onClose,
  resourceName,
  resourceType,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error("Error deleting resource:", error)
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {resourceType.toLowerCase()}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2 text-sm text-muted-foreground">
            Please confirm that you want to delete the following {resourceType.toLowerCase()}:
          </p>
          <div className="rounded-md bg-muted p-3 font-medium">{resourceName}</div>
        </div>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-input hover:bg-secondary transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="hover:scale-105 transition-transform"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
