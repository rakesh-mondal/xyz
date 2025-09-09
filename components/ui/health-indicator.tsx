"use client"

import { cn } from "@/lib/utils"

export type HealthStatus = "healthy" | "mixed" | "unhealthy" | "no-targets"

interface HealthIndicatorProps {
  status: HealthStatus
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

const statusConfig = {
  healthy: {
    color: "bg-green-500",
    label: "All targets healthy",
    textColor: "text-green-600"
  },
  mixed: {
    color: "bg-yellow-500", 
    label: "Some targets unhealthy",
    textColor: "text-orange-600"
  },
  unhealthy: {
    color: "bg-red-500",
    label: "All targets unhealthy", 
    textColor: "text-red-600"
  },
  "no-targets": {
    color: "bg-gray-400",
    label: "No targets",
    textColor: "text-muted-foreground"
  }
}

const sizeConfig = {
  sm: {
    dot: "h-2 w-2",
    text: "text-xs"
  },
  md: {
    dot: "h-2.5 w-2.5", 
    text: "text-sm"
  },
  lg: {
    dot: "h-3 w-3",
    text: "text-base"
  }
}

export function HealthIndicator({ 
  status, 
  size = "md", 
  showLabel = false, 
  className 
}: HealthIndicatorProps) {
  const config = statusConfig[status]
  const sizeStyles = sizeConfig[size]
  
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div 
        className={cn(
          "rounded-full flex-shrink-0",
          config.color,
          sizeStyles.dot
        )}
        aria-label={config.label}
      />
      {showLabel && (
        <span className={cn(
          "font-medium",
          config.textColor,
          sizeStyles.text
        )}>
          {config.label}
        </span>
      )}
    </div>
  )
}

// Helper function to determine overall health status from target groups
export function calculateOverallHealth(targetGroups: any[], operatingStatus?: string): HealthStatus {
  // If operating status is inactive, target groups can never be healthy
  if (operatingStatus === "inactive") {
    return "unhealthy"
  }
  
  if (!targetGroups || targetGroups.length === 0) {
    return "no-targets"
  }
  
  const hasHealthy = targetGroups.some(tg => tg.status === "healthy")
  const hasUnhealthy = targetGroups.some(tg => tg.status === "unhealthy")
  const hasMixed = targetGroups.some(tg => tg.status === "mixed")
  
  // If all are healthy, return healthy
  if (hasHealthy && !hasUnhealthy && !hasMixed) {
    return "healthy"
  }
  
  // If all are unhealthy, return unhealthy
  if (hasUnhealthy && !hasHealthy && !hasMixed) {
    return "unhealthy"
  }
  
  // If there's a mix of statuses, return mixed
  if (hasMixed || (hasHealthy && hasUnhealthy)) {
    return "mixed"
  }
  
  // Default fallback
  return "no-targets"
}
