"use client"

import { Badge } from "@/components/ui/badge"
import { type MKSCluster } from "@/lib/mks-data"

interface AddOnsSectionProps {
  cluster: MKSCluster
  onUpdate?: (updatedCluster: MKSCluster) => void
}

export function AddOnsSection({ cluster, onUpdate }: AddOnsSectionProps) {

  return (
    <div className="bg-card text-card-foreground border-border border rounded-lg">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">
              Add-ons
            </h3>
            <div className="bg-gray-800 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
              {cluster.addOns.filter(addon => addon.isEnabled).length}
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="px-6 pb-6 space-y-6">
        {/* Add-ons */}
        <div className="grid grid-cols-2 gap-4">
          {cluster.addOns.map((addon) => (
            <div 
              key={addon.id} 
              className={`p-4 border rounded-lg relative ${
                addon.isEnabled 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Checkbox positioned on the left */}
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  addon.isEnabled 
                    ? 'border-primary bg-primary' 
                    : 'border-gray-300'
                }`}>
                  {addon.isEnabled && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                
                {/* Title and version on the same line */}
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <div className="text-sm font-medium leading-none">
                    {addon.displayName}
                  </div>
                  <Badge variant="outline" className="text-xs font-medium ml-2">
                    {addon.version}
                  </Badge>
                </div>
              </div>
              
              {/* Description on separate line */}
              <div className="mt-2 ml-8">
                <p className="text-sm text-muted-foreground">
                  {addon.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {cluster.addOns.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No add-ons available for this cluster.</p>
          </div>
        )}
      </div>

    </div>
  )
}
