"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

import { type MKSCluster, availableNodeFlavors } from "@/lib/mks-data"

interface NodePoolsSectionProps {
  cluster: MKSCluster
}

export function NodePoolsSection({ cluster }: NodePoolsSectionProps) {

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  const getFlavorDetails = (flavorId: string) => {
    return availableNodeFlavors.find(f => f.id === flavorId)
  }

  return (
    <div className="bg-card text-card-foreground border-border border rounded-lg">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold">
          Node Pools
        </h3>
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
              
              return (
                <div key={pool.id} className="border border-border hover:border-gray-300 transition-colors rounded-lg bg-card p-4 relative">
                  {/* Header with name and badges */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate mb-1">{pool.name}</h4>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isDefault && (
                        <Badge variant="secondary" className="text-xs h-5 cursor-default hover:bg-secondary hover:text-secondary-foreground">
                          Default
                        </Badge>
                      )}
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

                  {/* Compact info grid */}
                  <div className="space-y-2.5 text-xs">
                    {/* Instance Type */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Instance Type</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="font-mono text-xs h-5">
                          {pool.flavor}
                        </Badge>
                        {flavorDetails && (
                          <span className="text-muted-foreground text-xs">
                            {flavorDetails.vcpus} vCPUs, {flavorDetails.memory}GB RAM
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Node Counts */}
                    <div className="py-1">
                      <Label className="text-xs text-muted-foreground">Node Counts</Label>
                      <div className="mt-2 grid grid-cols-3 gap-3">
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

                    {/* Disk Size and Created Date on same row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Disk Size</Label>
                        <div className="mt-1">{pool.diskSize} GB</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Created</Label>
                        <div className="text-xs mt-1">
                          {new Date(pool.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Labels */}
                    {Object.keys(pool.labels).length > 0 && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Labels</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(pool.labels).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}={value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Taints */}
                    {pool.taints.length > 0 && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Taints</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pool.taints.map((taint, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {taint}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

          </div>
        )}
      </div>
    </div>
  )
}
