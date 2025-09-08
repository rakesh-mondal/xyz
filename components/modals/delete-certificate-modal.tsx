"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { Shield, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Certificate {
  id: string
  certificateName: string
  resourcesAttached: number
}

interface DeleteCertificateModalProps {
  open: boolean
  onClose: () => void
  certificate: Certificate | null
  onConfirm: () => Promise<void>
}

export function DeleteCertificateModal({ 
  open, 
  onClose, 
  certificate, 
  onConfirm 
}: DeleteCertificateModalProps) {
  const [certificateName, setCertificateName] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const isConfirmationValid = certificate && certificateName === certificate.certificateName

  useEffect(() => {
    if (open && certificate) {
      setCertificateName("")
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open, certificate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertificateName(e.target.value)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    toast({
      title: "Pasting is not allowed",
      description: "For security reasons, you must type the certificate name manually.",
      variant: "destructive",
    })
  }

  const handleConfirm = async () => {
    if (!isConfirmationValid) return

    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error("Error deleting certificate:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isConfirmationValid && !isDeleting) {
      handleConfirm()
    }
  }

  if (!certificate) return null

  const isInUse = certificate.resourcesAttached > 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md" 
        style={{ 
          boxShadow: 'rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px' 
        }}
      >
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-base font-semibold text-black pr-8">
            {isInUse ? "Cannot Delete Certificate" : "Please enter the certificate name to confirm deletion"}
          </DialogTitle>
          <hr className="border-border" />
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {isInUse 
              ? "This certificate is currently in use and cannot be deleted."
              : "Are you sure you want to delete this certificate?"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          <div className="p-3 bg-muted rounded-md">
            <Label className="text-xs text-muted-foreground">Certificate Name:</Label>
            <div className="font-mono font-medium text-sm mt-1">{certificate.certificateName}</div>
          </div>
          
          {isInUse ? (
            // Show instructions for certificates in use
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Certificate in Use:</strong> This certificate cannot be deleted because it is currently associated with one or more Krutrim resources.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-md">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">To delete this certificate:</h4>
                  <ul className="text-sm text-gray-700 space-y-2 list-disc list-outside ml-4">
                    <li>Navigate to the resources using this certificate</li>
                    <li>Disassociate the certificate from all associated Krutrim resources</li>
                    <li>Verify the certificate is no longer in use</li>
                    <li>Return here to delete the certificate</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            // Show normal deletion flow for certificates not in use
            <>
              <div className="space-y-2">
                <Label htmlFor="certificate-name">Type certificate name to confirm *</Label>
                <Input
                  id="certificate-name"
                  ref={inputRef}
                  value={certificateName}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  onKeyDown={handleKeyDown}
                  placeholder={`Type "${certificate.certificateName}" to confirm`}
                  className="font-mono"
                  autoComplete="off"
                />
                <p className="text-xs text-muted-foreground">
                  Pasting is disabled. You must type the certificate name manually.
                </p>
              </div>

              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> This will permanently delete certificate "{certificate.certificateName}". 
                  This action cannot be undone.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
        
        <DialogFooter className="flex gap-3 sm:justify-end" style={{ paddingTop: '.5rem' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-20"
            disabled={isDeleting}
          >
            {isInUse ? "Close" : "Cancel"}
          </Button>
          {!isInUse && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              className="min-w-32"
              disabled={!isConfirmationValid || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm deletion"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
