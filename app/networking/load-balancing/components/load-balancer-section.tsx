"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StatusBadge } from "@/components/status-badge"
import { loadBalancers } from "@/lib/data"
import { ActionMenu } from "@/components/action-menu"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"
import { filterDataForUser, shouldShowEmptyState, getEmptyStateMessage } from "@/lib/demo-data-filter"
import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

// Helper function to calculate target group health summary
const calculateTargetGroupSummary = (targetGroups: any[]) => {
  if (targetGroups.length === 0) {
    return { healthy: 0, mixed: 0, unhealthy: 0, total: 0 }
  }
  
  let healthy = 0
  let mixed = 0
  let unhealthy = 0
  
  targetGroups.forEach(tg => {
    if (tg.status === "healthy") {
      healthy++
    } else if (tg.status === "mixed") {
      mixed++
    } else if (tg.status === "unhealthy") {
      unhealthy++
    }
  })
  
  return { healthy, mixed, unhealthy, total: targetGroups.length }
}

// Helper function to format summary text
const formatSummaryText = (summary: { healthy: number; mixed: number; unhealthy: number; total: number }) => {
  const parts = []
  
  if (summary.healthy > 0) {
    parts.push(`${summary.healthy} healthy`)
  }
  if (summary.mixed > 0) {
    parts.push(`${summary.mixed} mixed`)
  }
  if (summary.unhealthy > 0) {
    parts.push(`${summary.unhealthy} unhealthy`)
  }
  
  return parts.join(", ")
}

export default function LoadBalancerSection() {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLoadBalancer, setSelectedLoadBalancer] = useState<any>(null)
  const [expandedTargetGroups, setExpandedTargetGroups] = useState<Set<string>>(new Set())

  // Helper function to toggle target group expansion
  const toggleTargetGroupExpansion = (loadBalancerId: string) => {
    setExpandedTargetGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(loadBalancerId)) {
        newSet.delete(loadBalancerId)
      } else {
        newSet.add(loadBalancerId)
      }
      return newSet
    })
  }

  // Filter data based on user type for demo
  const filteredLoadBalancers = filterDataForUser(loadBalancers)
  const showEmptyState = shouldShowEmptyState() && filteredLoadBalancers.length === 0

  const loadBalancerIcon = (
    <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-72">
      <rect width="300" height="200" fill="white"/>
      
      {/* Load Balancer central icon */}
      <rect x="125" y="75" width="50" height="50" rx="8" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2"/>
      <text x="150" y="95" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">LB</text>
      <text x="150" y="107" textAnchor="middle" fill="white" fontSize="8">ALB</text>
      
      {/* Incoming traffic from top */}
      <circle cx="150" cy="30" r="8" fill="#2196F3"/>
      <text x="150" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">↓</text>
      <line x1="150" y1="45" x2="150" y2="75" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)"/>
      
      {/* Target instances */}
      <rect x="60" y="140" width="35" height="25" rx="4" fill="#E3F2FD" stroke="#1976D2" strokeWidth="1"/>
      <text x="77.5" y="155" textAnchor="middle" fill="#1976D2" fontSize="8">VM1</text>
      
      <rect x="110" y="140" width="35" height="25" rx="4" fill="#E3F2FD" stroke="#1976D2" strokeWidth="1"/>
      <text x="127.5" y="155" textAnchor="middle" fill="#1976D2" fontSize="8">VM2</text>
      
      <rect x="155" y="140" width="35" height="25" rx="4" fill="#E3F2FD" stroke="#1976D2" strokeWidth="1"/>
      <text x="172.5" y="155" textAnchor="middle" fill="#1976D2" fontSize="8">VM3</text>
      
      <rect x="205" y="140" width="35" height="25" rx="4" fill="#E3F2FD" stroke="#1976D2" strokeWidth="1"/>
      <text x="222.5" y="155" textAnchor="middle" fill="#1976D2" fontSize="8">VM4</text>
      
      {/* Connection lines from LB to targets */}
      <line x1="135" y1="125" x2="77.5" y2="140" stroke="#666" strokeWidth="1.5"/>
      <line x1="145" y1="125" x2="127.5" y2="140" stroke="#666" strokeWidth="1.5"/>
      <line x1="155" y1="125" x2="172.5" y2="140" stroke="#666" strokeWidth="1.5"/>
      <line x1="165" y1="125" x2="222.5" y2="140" stroke="#666" strokeWidth="1.5"/>
      
      {/* Health check indicators */}
      <circle cx="67" cy="132" r="3" fill="#4CAF50"/>
      <circle cx="117" cy="132" r="3" fill="#4CAF50"/>
      <circle cx="162" cy="132" r="3" fill="#4CAF50"/>
      <circle cx="212" cy="132" r="3" fill="#FF9800"/>
      
      {/* Arrow marker definition */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
        </marker>
      </defs>
      
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="300" height="200" fill="url(#grid)" opacity="0.3"/>
    </svg>
  )

  const handleDeleteClick = (loadBalancer: any) => {
    setSelectedLoadBalancer(loadBalancer)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedLoadBalancer) return
    
    // In a real app, this would delete the load balancer via API
    console.log("Deleting Load Balancer:", selectedLoadBalancer.name)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success toast
    toast({
      title: "Load balancer deleted successfully",
      description: `Load Balancer "${selectedLoadBalancer.name}" deleted successfully`,
    })
    
    // Close modal and clear selection
    setIsDeleteModalOpen(false)
    setSelectedLoadBalancer(null)
    
    // In a real app, you would refresh the data here
    // For now, we'll just reload the page
    window.location.reload()
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/networking/load-balancing/balancer/${row.id}`}
          className="text-primary font-medium hover:underline leading-5"
        >
          {value}
        </a>
      ),
    },
    {
      key: "type",
      label: "Type",
      searchable: true,
      render: (value: string) => (
        <div className="leading-5 capitalize">{value}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "targetGroupHealth",
      label: "Target Group Health",
      render: (value: string, row: any) => {
        const targetGroups = row.targetGroupsDetails || []
        const isExpanded = expandedTargetGroups.has(row.id)
        
        // Handle no target groups case
        if (targetGroups.length === 0) {
          return <span className="text-muted-foreground text-sm">No target groups</span>
        }
        
        // Calculate summary
        const summary = calculateTargetGroupSummary(targetGroups)
        const summaryText = formatSummaryText(summary)
        
        // Determine overall health color
        let summaryColor = "text-muted-foreground"
        if (summary.unhealthy === 0 && summary.mixed === 0) {
          summaryColor = "text-green-600" // All healthy
        } else if (summary.healthy === 0) {
          summaryColor = "text-red-600" // No healthy ones
        } else {
          summaryColor = "text-orange-600" // Mixed
        }
        
        return (
          <div className="space-y-1">
            {/* Summary Row - Always visible */}
            <div 
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleTargetGroupExpansion(row.id)}
            >
              <ChevronRight 
                className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : 'rotate-0'
                }`} 
              />
              <div className="text-sm">
                <div className="font-medium">{summary.total} Target Group{summary.total !== 1 ? 's' : ''}</div>
                <div className={`text-xs ${summaryColor}`}>
                  {summaryText || "All configured"}
                </div>
              </div>
            </div>
            
            {/* Expanded Details */}
            {isExpanded && (
              <div className="pl-4 space-y-1 border-l-2 border-muted animate-in slide-in-from-top-2 duration-200">
                {targetGroups.map((tg: any) => {
                  const healthText = tg.totalTargets === 0 
                    ? "No targets" 
                    : `${tg.healthyTargets}/${tg.totalTargets} healthy`
                  
                  let healthColor = "text-muted-foreground"
                  if (tg.status === "healthy") {
                    healthColor = "text-green-600"
                  } else if (tg.status === "unhealthy") {
                    healthColor = "text-red-600"
                  } else if (tg.status === "mixed") {
                    healthColor = "text-orange-600"
                  }
                  
                  return (
                    <div key={tg.id} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-muted-foreground">{tg.name}</span>
                      <span className={healthColor}>{healthText}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      },
    },
    {
      key: "ipAddresses",
      label: "IP Addresses",
      render: (value: string[]) => (
        <div className="leading-5">
          {value.length > 0 ? (
            value.length > 2 ? (
              <div className="space-y-1">
                <div>{value.slice(0, 2).join(", ")}</div>
                <div className="text-xs text-muted-foreground">+{value.length - 2} more</div>
              </div>
            ) : (
              value.join(", ")
            )
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="text-muted-foreground leading-5">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Action",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref={`/networking/load-balancing/balancer/${row.id}`}
            editHref={`/networking/load-balancing/balancer/${row.id}/edit`}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType="Load Balancer"
          />
        </div>
      ),
    },
  ]

  // Add actions property to each load balancer row for DataTable
  const dataWithActions = filteredLoadBalancers.map((lb) => ({ ...lb, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div>
      {showEmptyState ? (
        <Card className="mt-8">
          <CardContent>
            <EmptyState
              {...getEmptyStateMessage('load-balancer')}
              icon={loadBalancerIcon}
              onAction={() => window.location.href = '/networking/load-balancing/balancer/create'}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={["name", "type"]}
          pageSize={10}
          enableSearch={true}
          enableColumnVisibility={false}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableVpcFilter={true}
          vpcOptions={[
            { value: "all", label: "All VPCs" },
            { value: "production-vpc", label: "production-vpc" },
            { value: "development-vpc", label: "development-vpc" },
            { value: "staging-vpc", label: "staging-vpc" },
          ]}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedLoadBalancer(null)
        }}
        resourceName={selectedLoadBalancer?.name || ""}
        resourceType="Load Balancer"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
