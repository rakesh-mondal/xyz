"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  DollarSign, 
  Server, 
  Cpu, 
  MemoryStick, 
  HardDrive
} from "lucide-react"
import { type MKSCluster, availableNodeFlavors } from "@/lib/mks-data"

interface CostEstimationProps {
  cluster: MKSCluster
}

export function CostEstimation({ cluster }: CostEstimationProps) {
  // Mock pricing data (in a real implementation, this would come from pricing API)
  const pricing = {
    controlPlane: {
      perHour: 0.50, // $0.50 per hour
      perMonth: 0.50 * 24 * 30 // $360 per month
    },
    nodePools: {
      't3.medium': { perHour: 0.0416, perMonth: 30.00 },
      't3.large': { perHour: 0.0832, perMonth: 60.00 },
      'm5.large': { perHour: 0.096, perMonth: 69.12 },
      'm5.xlarge': { perHour: 0.192, perMonth: 138.24 },
      'c5.large': { perHour: 0.085, perMonth: 61.20 },
      'c5.xlarge': { perHour: 0.17, perMonth: 122.40 },
      'r5.large': { perHour: 0.126, perMonth: 90.72 },
      'r5.xlarge': { perHour: 0.252, perMonth: 181.44 }
    }
  }

  const calculateNodePoolCosts = () => {
    return cluster.nodePools.map(pool => {
      const flavorPricing = pricing.nodePools[pool.flavor as keyof typeof pricing.nodePools]
      if (!flavorPricing) return { pool, cost: 0, monthlyCost: 0 }

      const hourlyCost = flavorPricing.perHour * pool.desiredCount
      const monthlyCost = flavorPricing.perMonth * pool.desiredCount

      return {
        pool,
        cost: hourlyCost,
        monthlyCost
      }
    })
  }

  const nodePoolCosts = calculateNodePoolCosts()
  const totalNodePoolCost = nodePoolCosts.reduce((sum, item) => sum + item.cost, 0)
  const totalNodePoolMonthlyCost = nodePoolCosts.reduce((sum, item) => sum + item.monthlyCost, 0)
  
  const totalHourlyCost = pricing.controlPlane.perHour + totalNodePoolCost
  const totalMonthlyCost = pricing.controlPlane.perMonth + totalNodePoolMonthlyCost

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const getFlavorDetails = (flavorId: string) => {
    return availableNodeFlavors.find(f => f.id === flavorId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Cost Estimation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Cost Display */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalMonthlyCost)}
          </div>
          <div className="text-sm text-muted-foreground">per month</div>
          <div className="text-lg font-semibold text-gray-700 mt-1">
            {formatCurrency(totalHourlyCost)}/hr
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Cost Breakdown</h4>
          
          {/* Control Plane */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Control Plane</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{formatCurrency(pricing.controlPlane.perMonth)}/mo</div>
              <div className="text-xs text-muted-foreground">{formatCurrency(pricing.controlPlane.perHour)}/hr</div>
            </div>
          </div>

          {/* Node Pools */}
          {nodePoolCosts.map((item) => {
            const flavorDetails = getFlavorDetails(item.pool.flavor)
            return (
              <div key={item.pool.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-sm font-medium">{item.pool.name}</span>
                    <div className="text-xs text-muted-foreground">
                      {item.pool.desiredCount} × {item.pool.flavor}
                      {flavorDetails && (
                        <span className="ml-1">
                          ({flavorDetails.vcpus}vCPU, {flavorDetails.memory}GB)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatCurrency(item.monthlyCost)}/mo</div>
                  <div className="text-xs text-muted-foreground">{formatCurrency(item.cost)}/hr</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
