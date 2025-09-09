"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { type MKSCluster, availableNodeFlavors } from "@/lib/mks-data"
import { NodePoolUpgradeModal } from "./node-pool-upgrade-modal"

interface NodePoolsSectionProps {
  cluster: MKSCluster
}

export function NodePoolsSection({ cluster }: NodePoolsSectionProps) {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  const getFlavorDetails = (flavorId: string) => {
    return availableNodeFlavors.find(f => f.id === flavorId)
  }

  // Check if node pool version is behind cluster version
  const isNodePoolOutdated = (nodePoolVersion: string, clusterVersion: string) => {
    // Simple version comparison - in real implementation, use semver or similar
    return nodePoolVersion !== clusterVersion && nodePoolVersion < clusterVersion
  }

  // Check if any node pools need upgrading
  const hasOutdatedNodePools = cluster.nodePools.some(pool => 
    isNodePoolOutdated(pool.k8sVersion, cluster.k8sVersion)
  )

  const handleNodePoolUpgradeConfirm = async (selectedNodePoolIds: string[], targetVersion: string) => {
    // In a real implementation, this would call the API to upgrade node pools
    console.log('Upgrading node pools:', selectedNodePoolIds, 'to version:', targetVersion)
    setIsUpgradeModalOpen(false)
  }

  return (
    <TooltipProvider>
      <div className="bg-card text-card-foreground border-border border rounded-lg">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                Node Pools
              </h3>
              <div className="bg-gray-800 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
                {cluster.nodePools.length}
              </div>
            </div>
            {hasOutdatedNodePools && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Upgrade Node Pools
              </Button>
            )}
          </div>
        </div>
      <div className="px-6 pb-6">
        {cluster.nodePools.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No node pools configured yet.</p>
            <p className="text-sm">Node pools will appear here once configured.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cluster.nodePools.map((pool) => {
              const flavorDetails = getFlavorDetails(pool.flavor)
              const isDefault = pool.name === 'prod-workers' || pool.name === 'staging-workers' || pool.name === 'dev-workers'
              const isOutdated = isNodePoolOutdated(pool.k8sVersion, cluster.k8sVersion)
              
              return (
                <div key={pool.id} className="border border-border hover:border-gray-300 transition-colors rounded-lg bg-card p-4 relative">
                  {/* Header with pool name and status badges */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{pool.name}</h4>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs h-5 cursor-default ${
                          pool.status === 'active' 
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800' 
                            : 'hover:bg-secondary hover:text-secondary-foreground'
                        }`}
                      >
                        {capitalizeFirstLetter(pool.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Fields in specified order */}
                  <div className="space-y-3 text-xs">
                    {/* 1) Instance type (flavour, vcpu count and ram) */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Instance Type</Label>
                      <div className="mt-1">
                        {flavorDetails ? (
                          <span className="text-sm">
                            {flavorDetails.vcpus} vCPUs, {flavorDetails.memory}GB RAM
                          </span>
                        ) : (
                          <span className="text-sm">{pool.flavor}</span>
                        )}
                      </div>
                    </div>

                    {/* 2) Disk Size and K8s Version in same row */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Disk Size */}
                      <div>
                        <Label className="text-xs text-muted-foreground">Disk Size</Label>
                        <div className="mt-1">{pool.diskSize} GB</div>
                      </div>

                      {/* K8s Version */}
                      <div>
                        <Label className="text-xs text-muted-foreground">K8s Version</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs font-mono">
                            v{pool.k8sVersion}
                          </Badge>
                          {isOutdated && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsUpgradeModalOpen(true)}
                              className="text-xs h-6 px-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                            >
                              Upgrade
                            </Button>
                          )}
                        </div>
                        {isOutdated && (
                          <div className="text-xs text-orange-600 mt-1">
                            Cluster: v{cluster.k8sVersion}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3) Node counts (min, desired, max) */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Node Counts</Label>
                      <div className="flex items-center gap-6 mt-2">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Min</div>
                          <div className="font-semibold text-lg">{pool.minCount}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Desired</div>
                          <div className="font-semibold text-lg">{pool.desiredCount}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Max</div>
                          <div className="font-semibold text-lg">{pool.maxCount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

          </div>
        )}
      </div>
      </div>

      {/* Node Pool Upgrade Modal */}
      <NodePoolUpgradeModal
        cluster={cluster}
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onConfirm={handleNodePoolUpgradeConfirm}
      />
    </TooltipProvider>
  )
}
