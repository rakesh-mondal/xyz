"use client"

import { Badge } from "@/components/ui/badge"
import { type MKSCluster } from "@/lib/mks-data"
import { CheckCircle2, XCircle } from "lucide-react"

interface AddOnsSectionProps {
  cluster: MKSCluster
  onUpdate?: (updatedCluster: MKSCluster) => void
}

export function AddOnsSection({ cluster, onUpdate }: AddOnsSectionProps) {
  const enabledCount = cluster.addOns.filter(addon => addon.isEnabled).length
  const totalCount = cluster.addOns.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">
            Add-ons
          </h3>
          <Badge variant="secondary" className="text-sm">
            {enabledCount}/{totalCount} active
          </Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        {cluster.addOns.map((addon) => (
          <div 
            key={addon.id} 
            className="flex items-start gap-4 py-3 px-1 hover:bg-muted/30 rounded-lg transition-colors"
          >
            {/* Status indicator */}
            <div className="flex-shrink-0 mt-0.5">
              {addon.isEnabled ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground">
                  {addon.displayName}
                </h4>
                <div className="flex items-center gap-2">
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                {addon.description}
              </p>
            </div>
          </div>
        ))}

        {cluster.addOns.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No add-ons available for this cluster.</p>
          </div>
        )}
      </div>
    </div>
  )
}
