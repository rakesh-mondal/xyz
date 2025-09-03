"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { VercelTabs } from "@/components/ui/vercel-tabs"
import { Button } from "@/components/ui/button"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { StatusBadge } from "@/components/status-badge"
import { ActionMenu } from "@/components/action-menu"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"
import { filterDataForUser, shouldShowEmptyState, getEmptyStateMessage } from "@/lib/demo-data-filter"
import { autoScalingGroups, autoScalingTemplates, type AutoScalingGroup, type AutoScalingTemplate } from "@/lib/data"
import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { MoreVertical, Trash2, Eye, Edit } from "lucide-react"

// Auto Scaling Groups Section
function AutoScalingGroupsSection() {
  const [selectedASG, setSelectedASG] = useState<AutoScalingGroup | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { toast } = useToast()

  // Filter data based on user access
  const filteredASGs = filterDataForUser(autoScalingGroups, "asg")
  const showEmptyState = shouldShowEmptyState(filteredASGs, "asg")

  const handleDelete = (asg: AutoScalingGroup) => {
    setSelectedASG(asg)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedASG) {
      toast({
        title: "Auto Scaling Group deleted",
        description: `${selectedASG.name} has been deleted successfully.`,
      })
      setIsDeleteModalOpen(false)
      setSelectedASG(null)
    }
  }

  const handleEdit = (asg: AutoScalingGroup) => {
    toast({
      title: "Edit Auto Scaling Group",
      description: `Editing ${asg.name}...`,
    })
  }

  const handlePause = (asg: AutoScalingGroup) => {
    toast({
      title: "Auto Scaling Group paused",
      description: `${asg.name} has been paused.`,
    })
  }

  const handleStart = (asg: AutoScalingGroup) => {
    toast({
      title: "Auto Scaling Group started",
      description: `${asg.name} has been started.`,
    })
  }

  const handleViewDetails = (asg: AutoScalingGroup) => {
    toast({
      title: "View Details",
      description: `Viewing details for ${asg.name}...`,
    })
  }

  const handleSettings = (asg: AutoScalingGroup) => {
    toast({
      title: "Settings",
      description: `Opening settings for ${asg.name}...`,
    })
  }

  // Table columns configuration
  const columns = [
    {
      key: "name",
      label: "ASG Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: AutoScalingGroup) => (
        <div className="font-medium">{value}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <StatusBadge status={value} />
      ),
    },
    {
      key: "instanceType",
      label: "Instance Type",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">{value}</div>
      ),
    },
    {
      key: "desiredCapacity",
      label: "Desired Capacity",
      sortable: true,
      render: (value: number, row: AutoScalingGroup) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">
            Min: {row.minCapacity} | Max: {row.maxCapacity}
          </div>
        </div>
      ),
    },
    {
      key: "vpc",
      label: "VPC",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="text-sm">{value}</div>
      ),
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm text-muted-foreground">
          {new Date(value).toLocaleString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (value: any, row: AutoScalingGroup) => {
        const asg = row
        
        return (
          <div className="flex justify-end">
            <ActionMenu
              customActions={[
                {
                  label: "View",
                  icon: <Eye className="mr-2 h-4 w-4" />,
                  onClick: () => handleViewDetails(asg),
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="mr-2 h-4 w-4" />,
                  onClick: () => handleDelete(asg),
                  variant: "destructive",
                },
              ]}
              resourceName={asg.name}
              resourceType="Auto Scaling Group"
            />
          </div>
        )
      },
    },
  ]

  const dataWithActions = filteredASGs

  const handleRefresh = () => {
    window.location.reload()
  }

  // Get unique VPCs for filter options
  const vpcOptions = Array.from(new Set(filteredASGs.map(asg => asg.vpc)))
    .map(vpc => ({ value: vpc, label: vpc }))

  // Add "All VPCs" option at the beginning
  vpcOptions.unshift({ value: "all", label: "All VPCs" })

  return (
    <div>
      {showEmptyState ? (
        <Card className="mt-8">
          <CardContent>
            <EmptyState
              {...getEmptyStateMessage('asg')}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={["name", "vpc"]}
          defaultSort={{ column: "createdOn", direction: "desc" }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableVpcFilter={true}
          vpcOptions={vpcOptions}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={selectedASG?.name || ""}
        resourceType="Auto Scaling Group"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

// Templates Section
function TemplatesSection() {
  const [selectedTemplate, setSelectedTemplate] = useState<AutoScalingTemplate | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { toast } = useToast()

  // Filter data based on user access
  const filteredTemplates = filterDataForUser(autoScalingTemplates, "template")
  const showEmptyState = shouldShowEmptyState(filteredTemplates, "template")

  const handleDelete = (template: AutoScalingTemplate) => {
    setSelectedTemplate(template)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedTemplate) {
      toast({
        title: "Template deleted",
        description: `${selectedTemplate.name} has been deleted successfully.`,
      })
      setIsDeleteModalOpen(false)
      setSelectedTemplate(null)
    }
  }

  const handleEdit = (template: AutoScalingTemplate) => {
    toast({
      title: "Edit Template",
      description: `Editing ${template.name}...`,
    })
  }

  const handleViewDetails = (template: AutoScalingTemplate) => {
    toast({
      title: "View Details",
      description: `Viewing details for ${template.name}...`,
    })
  }

  const handleClone = (template: AutoScalingTemplate) => {
    toast({
      title: "Template Cloned",
      description: `${template.name} has been cloned.`,
    })
  }

  // Table columns for templates
  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      ),
    },
    {
      key: "description",
      label: "Description",
      searchable: true,
      render: (value: string) => (
        <div className="text-sm text-muted-foreground max-w-xs truncate">
          {value}
        </div>
      ),
    },
    {
      key: "version",
      label: "Version",
      sortable: true,
      render: (value: number, row: AutoScalingTemplate) => (
        <div className="flex flex-col items-start">
          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            row.isLatest ? 'bg-gray-900 text-white' : 'bg-blue-100 text-blue-800'
          }`}>
            V{value}
          </div>
          {row.isLatest && (
            <div className="text-xs text-muted-foreground mt-1">Latest Version</div>
          )}
        </div>
      ),
    },
    {
      key: "instanceType",
      label: "Instance Type",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">{value}</div>
      ),
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      render: (value: string) => (
        <div className="text-sm text-muted-foreground">
          {new Date(value).toLocaleString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (value: any, row: AutoScalingTemplate) => {
        const template = row
        
        return (
          <div className="flex justify-end">
            <ActionMenu
              customActions={[
                {
                  label: "View",
                  icon: <Eye className="mr-2 h-4 w-4" />,
                  onClick: () => handleViewDetails(template),
                },
                {
                  label: "Edit",
                  icon: <Edit className="mr-2 h-4 w-4" />,
                  onClick: () => handleEdit(template),
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="mr-2 h-4 w-4" />,
                  onClick: () => handleDelete(template),
                  variant: "destructive",
                },
              ]}
              resourceName={template.name}
              resourceType="Template"
            />
          </div>
        )
      },
    },
  ]

  const dataWithActions = filteredTemplates

  const handleRefresh = () => {
    window.location.reload()
  }

  // No VPC filter needed for templates

  return (
    <div>
      {showEmptyState ? (
        <Card className="mt-8">
          <CardContent>
            <EmptyState
              title="No Templates Yet"
              description="Create your first auto scaling template to standardize your instance configurations and make it easier to launch consistent auto scaling groups."
              actionText="Create Your First Template"
              onAction={() => {
                toast({
                  title: "Create Template",
                  description: "Opening template creation wizard...",
                })
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={["name", "description"]}
          defaultSort={{ column: "createdOn", direction: "desc" }}
          pageSize={10}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={selectedTemplate?.name || ""}
        resourceType="Template"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

const tabs = [
  { id: "asg", label: "Auto Scaling Groups" },
  { id: "templates", label: "Templates" },
]

export default function AutoScalingPage() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Determine active tab from URL, but don't change URL on tab change
  const getActiveTabFromPath = () => {
    if (pathname.includes('/templates')) return "templates"
    return "asg" // default to asg
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath())

  // Handle tab change without URL navigation to prevent refreshes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // Don't navigate - just change the local state
  }

  // Update active tab when URL changes (for direct navigation)
  useEffect(() => {
    setActiveTab(getActiveTabFromPath())
  }, [pathname])

  // Get title and description based on active tab
  const getPageInfo = () => {
    switch (activeTab) {
      case "asg":
        return { 
          title: "Auto Scaling Groups", 
          description: "Create and manage auto scaling groups for your compute resources."
        }
      case "templates":
        return { 
          title: "Auto Scaling Templates", 
          description: "Create and manage templates for your auto scaling configurations."
        }
      default:
        return { 
          title: "Auto Scaling Groups", 
          description: "Create and manage auto scaling groups for your compute resources."
        }
    }
  }

  // Get dynamic button info based on active tab
  const getHeaderActions = () => {
    switch (activeTab) {
      case "asg":
        return (
          <Button onClick={() => {
            router.push("/compute/auto-scaling/create")
          }}>
            Create Auto Scaling Group
          </Button>
        )
      case "templates":
        return (
          <Button onClick={() => {
            // Handle create template
            console.log("Create Template clicked")
          }}>
            Create Template
          </Button>
        )
      default:
        return (
          <Button onClick={() => {
            router.push("/compute/auto-scaling/create")
          }}>
            Create Auto Scaling Group
          </Button>
        )
    }
  }

  const { title, description } = getPageInfo()

  return (
    <PageLayout 
      title={title} 
      description={description}
      headerActions={getHeaderActions()}
    >
      <div className="space-y-6">
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          size="lg"
        />

        {activeTab === "asg" && <AutoScalingGroupsSection />}
        {activeTab === "templates" && <TemplatesSection />}
      </div>
    </PageLayout>
  )
}