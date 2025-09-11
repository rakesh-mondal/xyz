"use client"

import { Badge } from "@/components/ui/badge"
import { type MKSCluster } from "@/lib/mks-data"

interface AddOnsSectionProps {
  cluster: MKSCluster
  onUpdate?: (updatedCluster: MKSCluster) => void
}

export function AddOnsSection({ cluster, onUpdate }: AddOnsSectionProps) {
  const enabledCount = cluster.addOns.filter(addon => addon.isEnabled).length
  const totalCount = cluster.addOns.length

  return (
    <div className="bg-card text-card-foreground border-border border rounded-lg">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">
              Add-ons
            </h3>
            <div className="bg-gray-800 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
              {enabledCount}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        {cluster.addOns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No add-ons available for this cluster.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cluster.addOns.map((addon) => (
              <div 
                key={addon.id} 
                className="border transition-colors rounded-lg bg-card p-4 relative border-border hover:border-gray-300"
              >
                {/* Title and badges on same row */}
                <div className="flex items-center justify-between mb-2 gap-3">
                  <h4 className="text-sm font-medium text-foreground leading-tight">
                    {addon.displayName}
                  </h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge 
                      variant={addon.isEnabled ? "default" : "outline"} 
                      className="text-xs"
                    >
                      {addon.version}
                    </Badge>
                    <Badge 
                      variant={addon.isEnabled ? "default" : "secondary"} 
                      className={`text-xs ${
                        addon.isEnabled 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {addon.isEnabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {addon.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
