"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"
import { MKSCluster, getNextK8sVersion } from "@/lib/mks-data"

interface ClusterUpgradeModalProps {
  cluster: MKSCluster | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (clusterId: string, newVersion: string) => void
}

export function ClusterUpgradeModal({ cluster, isOpen, onClose, onConfirm }: ClusterUpgradeModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  
  if (!cluster) return null
  
  const nextVersion = getNextK8sVersion(cluster.k8sVersion)
  const canUpgrade = nextVersion !== null
  const isLatestVersion = cluster.k8sVersion === '1.33.0'
  
  const handleUpgrade = async () => {
    if (!nextVersion) return
    
    setIsUpgrading(true)
    try {
      await onConfirm(cluster.id, nextVersion)
      onClose()
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setIsUpgrading(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {canUpgrade ? (
              <CheckCircle className="h-5 w-5 text-blue-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {canUpgrade ? 'Upgrade Kubernetes Cluster' : 'No Upgrade Available'}
          </DialogTitle>
          <DialogDescription>
            {canUpgrade 
              ? `Upgrade ${cluster.name} to a newer Kubernetes version`
              : `${cluster.name} is already on the latest supported version`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Version Info */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Current Version:</span>
            <Badge variant="secondary" className="font-mono">
              v{cluster.k8sVersion}
            </Badge>
          </div>
          
          {/* Upgrade Path or No Upgrade Message */}
          {canUpgrade ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-900">Upgrade to:</span>
              <Badge variant="default" className="font-mono bg-blue-600">
                v{nextVersion}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-sm font-medium text-red-900">No upgrade available</span>
              <Badge variant="destructive" className="font-mono">
                Latest version
              </Badge>
            </div>
          )}
          
          {/* Specific Message for Latest Version */}
          {isLatestVersion && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to upgrade. Your cluster has the latest supported Kubernetes version on Krutrim.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Warning for Upgradable Clusters */}
          {canUpgrade && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Upgrading Kubernetes version may affect workloads due to API deprecations. 
                Ensure your applications are compatible before upgrading.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Info for Upgradable Clusters */}
          {canUpgrade && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium">What happens during upgrade?</p>
                <ul className="mt-1 space-y-1 text-blue-800">
                  <li>• Cluster will be temporarily unavailable</li>
                  <li>• Workloads will be rescheduled</li>
                  <li>• API server will be updated</li>
                  <li>• Node pools will be upgraded sequentially</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {canUpgrade && (
            <Button 
              onClick={handleUpgrade} 
              disabled={isUpgrading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpgrading ? 'Starting Upgrade...' : 'Start Upgrade'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
