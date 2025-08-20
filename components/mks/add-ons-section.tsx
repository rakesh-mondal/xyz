"use client"

import { Badge } from "@/components/ui/badge"
import { 
  Monitor,
  Network,
  Shield,
  HardDrive,
  GitBranch,
  Package
} from "lucide-react"
import { type MKSCluster } from "@/lib/mks-data"

interface AddOnsSectionProps {
  cluster: MKSCluster
}

export function AddOnsSection({ cluster }: AddOnsSectionProps) {

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

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



  return (
    <div className="bg-card text-card-foreground border-border border rounded-lg">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold">
          Add-ons Configuration
        </h3>
      </div>
      <div className="px-6 pb-6">
        {/* Add-ons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cluster.addOns.map((addon) => (
            <div
              key={addon.id}
              className="p-4 rounded-lg border border-border hover:border-gray-300 transition-colors bg-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(addon.category)}
                  <h4 className="font-medium text-sm">{addon.displayName}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold cursor-default ${getCategoryColor(addon.category)}`}
                  >
                    {capitalizeFirstLetter(addon.category)}
                  </span>
                  {addon.isDefault && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs cursor-default hover:bg-secondary hover:text-secondary-foreground"
                    >
                      Default
                    </Badge>
                  )}
                  <Badge 
                    variant="secondary"
                    className={`text-xs cursor-default ${
                      addon.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800'
                    }`}
                  >
                    {capitalizeFirstLetter(addon.status)}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2 ml-6">
                <div className="text-xs text-muted-foreground">
                  Version: {addon.version}
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
