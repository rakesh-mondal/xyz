"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Package, 
  Edit, 
  Save, 
  X, 
  AlertTriangle, 
  CheckCircle,
  Monitor,
  Network,
  Shield,
  HardDrive,
  GitBranch,
  Info
} from "lucide-react"
import { type MKSCluster, type MKSAddOn } from "@/lib/mks-data"

interface AddOnsSectionProps {
  cluster: MKSCluster
  onUpdate: (updatedCluster: MKSCluster) => void
}

export function AddOnsSection({ cluster, onUpdate }: AddOnsSectionProps) {
  // Add-ons editing state
  const [isAddOnsEditing, setIsAddOnsEditing] = useState(false)
  const [addOnsChanges, setAddOnsChanges] = useState<Record<string, boolean>>({})
  const [hasAddOnsChanges, setHasAddOnsChanges] = useState(false)
  
  // Add-ons confirmation modal state
  const [isAddOnsConfirmOpen, setIsAddOnsConfirmOpen] = useState(false)
  const [pendingAddOnsChanges, setPendingAddOnsChanges] = useState<Record<string, boolean>>({})

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'monitoring':
        return <Monitor className="h-4 w-4" />
      case 'networking':
        return <Network className="h-4 w-4" />
      case 'security':
        return <Shield className="h-4 w-4" />
      case 'storage':
        return <HardDrive className="h-4 w-4" />
      case 'development':
        return <GitBranch className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'monitoring':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'networking':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'security':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'storage':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'development':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Start add-ons editing
  const startAddOnsEditing = () => {
    const initialChanges: Record<string, boolean> = {}
    cluster.addOns.forEach(addon => {
      initialChanges[addon.id] = addon.isEnabled
    })
    setAddOnsChanges(initialChanges)
    setIsAddOnsEditing(true)
  }

  // Save add-ons changes
  const saveAddOnsChanges = () => {
    // Show confirmation modal for add-ons changes
    const removedAddOns = cluster.addOns.filter(addon => 
      addon.isEnabled && !addOnsChanges[addon.id]
    )
    const addedDefaultAddOns = cluster.addOns.filter(addon => 
      !addon.isEnabled && addOnsChanges[addon.id] && addon.isDefault
    )

    if (removedAddOns.length > 0 || addedDefaultAddOns.length > 0) {
      setPendingAddOnsChanges(addOnsChanges)
      setIsAddOnsConfirmOpen(true)
    } else {
      // No conflicts, save directly
      applyAddOnsChanges(addOnsChanges)
    }
  }

  // Apply add-ons changes after confirmation
  const applyAddOnsChanges = (changes: Record<string, boolean>) => {
    const updatedAddOns = cluster.addOns.map(addon => ({
      ...addon,
      isEnabled: changes[addon.id] ?? addon.isEnabled
    }))

    const updatedCluster = {
      ...cluster,
      addOns: updatedAddOns
    }

    onUpdate(updatedCluster)
    setHasAddOnsChanges(false)
    setIsAddOnsEditing(false)
    setIsAddOnsConfirmOpen(false)
  }

  // Cancel add-ons changes
  const cancelAddOnsChanges = () => {
    setAddOnsChanges({})
    setHasAddOnsChanges(false)
    setIsAddOnsEditing(false)
  }

  // Handle add-on toggle
  const handleAddOnToggle = (addonId: string, enabled: boolean) => {
    setAddOnsChanges(prev => ({
      ...prev,
      [addonId]: enabled
    }))
    setHasAddOnsChanges(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add-ons Configuration
          </CardTitle>
          <div className="flex items-center gap-2">
            {isAddOnsEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={cancelAddOnsChanges}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={saveAddOnsChanges}
                  disabled={!hasAddOnsChanges}
                  className="bg-black text-white hover:bg-black/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={startAddOnsEditing} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Add-ons
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Enable or disable add-ons for your cluster. Some add-ons are required for basic functionality.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add-ons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cluster.addOns.map((addon) => (
            <div
              key={addon.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isAddOnsEditing 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(addon.category)}
                  <div>
                    <h4 className="font-medium text-sm">{addon.displayName}</h4>
                    <Badge 
                      className={`text-xs border ${getCategoryColor(addon.category)}`}
                    >
                      {addon.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {addon.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                  <Switch
                    checked={isAddOnsEditing ? (addOnsChanges[addon.id] ?? addon.isEnabled) : addon.isEnabled}
                    onCheckedChange={(enabled) => {
                      if (isAddOnsEditing) {
                        handleAddOnToggle(addon.id, enabled)
                      }
                    }}
                    disabled={!isAddOnsEditing || !addon.isEditable}
                  />
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {addon.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Version: {addon.version}</span>
                <span className={`px-2 py-1 rounded ${
                  addon.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {addon.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Mode Warnings */}
        {isAddOnsEditing && (
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Edit Mode:</strong> Toggle add-ons ON/OFF as needed. Default add-ons are essential 
                for cluster functionality. Disabling them may require manual replacement.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>

      {/* Add-ons Confirmation Modal */}
      <Dialog open={isAddOnsConfirmOpen} onOpenChange={setIsAddOnsConfirmOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Add-ons Changes</DialogTitle>
            <DialogDescription>
              Please review the following changes and confirm to proceed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {(() => {
              const removedAddOns = cluster.addOns.filter(addon => 
                addon.isEnabled && !pendingAddOnsChanges[addon.id]
              )
              const addedDefaultAddOns = cluster.addOns.filter(addon => 
                !addon.isEnabled && pendingAddOnsChanges[addon.id] && addon.isDefault
              )

              return (
                <>
                  {removedAddOns.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Removed Add-ons ({removedAddOns.length}):</strong>
                        <ul className="mt-2 space-y-1">
                          {removedAddOns.map(addon => (
                            <li key={addon.id} className="text-sm">
                              • {addon.displayName} - {addon.description}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2 text-sm">
                          You will need to manually add analogous add-ons if you need similar functionality.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {addedDefaultAddOns.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Added Default Add-ons ({addedDefaultAddOns.length}):</strong>
                        <ul className="mt-2 space-y-1">
                          {addedDefaultAddOns.map(addon => (
                            <li key={addon.id} className="text-sm">
                              • {addon.displayName} - {addon.description}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2 text-sm">
                          You may need to remove any conflicting add-ons you have manually declared in your cluster to avoid conflicts.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )
            })()}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOnsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => applyAddOnsChanges(pendingAddOnsChanges)}
              className="bg-black text-white hover:bg-black/90"
            >
              Confirm Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
