"use client"

import { Badge } from "@/components/ui/badge"
import { type MKSCluster } from "@/lib/mks-data"

interface AddOnsSectionProps {
  cluster: MKSCluster
}

export function AddOnsSection({ cluster }: AddOnsSectionProps) {



  return (
    <div className="bg-card text-card-foreground border-border border rounded-lg">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold">
          Add-ons
        </h3>
      </div>
      <div className="px-6 pb-6">
        {/* Add-ons Grid */}
        <div className="grid grid-cols-2 gap-4">
          {cluster.addOns.map((addon) => (
            <div key={addon.id} className="p-4 border rounded-lg relative">
              <Badge variant="outline" className="absolute top-3 right-3 text-xs font-medium">
                {addon.version}
              </Badge>
              <div className="space-y-1 pr-16">
                <div className="text-sm font-medium leading-none">
                  {addon.displayName}
                </div>
                <p className="text-sm text-muted-foreground">
                  {addon.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
