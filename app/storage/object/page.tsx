"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { StatusBadge } from "@/components/status-badge"
import { ActionMenu } from "@/components/action-menu"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"

// Mock data for object storage buckets
const mockBuckets = [
  {
    id: "bucket-001",
    name: "user-uploads",
    region: "us-east-1",
    size: "1.2 GB",
    createdOn: "2024-01-15T10:30:00Z",
    status: "success",
  },
  {
    id: "bucket-002", 
    name: "static-assets",
    region: "us-west-2",
    size: "584 MB",
    createdOn: "2024-01-20T14:22:00Z",
    status: "success",
  },
  {
    id: "bucket-003",
    name: "backup-data",
    region: "eu-west-1",
    size: "5.7 GB",
    createdOn: "2024-02-01T09:15:00Z",
    status: "updating",
  },
  {
    id: "bucket-004",
    name: "logs-archive",
    region: "us-east-1",
    size: "312 MB",
    createdOn: "2024-02-10T16:45:00Z",
    status: "success",
  },
]

export default function ObjectStoragePage() {
  const [selectedBucket, setSelectedBucket] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { toast } = useToast()

  const handleDeleteClick = (bucket: any) => {
    setSelectedBucket(bucket)
    setIsDeleteModalOpen(true)
  }

  const handleCopyURL = (bucket: any) => {
    const bucketURL = `https://${bucket.name}.s3.${bucket.region}.amazonaws.com`
    navigator.clipboard.writeText(bucketURL)
    toast({
      title: "URL copied to clipboard",
      description: `Bucket URL for ${bucket.name} has been copied.`,
    })
  }

  const handleEditBucket = (bucket: any) => {
    // Navigate to edit bucket page
    window.location.href = `/storage/object/${bucket.id}/edit`
  }

  const handleAddRule = (bucket: any) => {
    // Navigate to add rule page
    window.location.href = `/storage/object/${bucket.id}/rules/create`
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBucket) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Bucket deleted successfully",
        description: `${selectedBucket.name} has been deleted.`,
      })

      // In a real app, you would refresh the data here
      console.log(`Deleting bucket: ${selectedBucket.name}`)
      
      setIsDeleteModalOpen(false)
      setSelectedBucket(null)
    } catch (error) {
      toast({
        title: "Failed to delete bucket",
        description: "An error occurred while deleting the bucket.",
        variant: "destructive",
      })
    }
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => {
        // Only show link for buckets with "success" status
        if (row.status === "success") {
          return (
            <a
              href={`/storage/object/${row.id}`}
              className="text-primary font-medium hover:underline leading-5"
            >
              {value}
            </a>
          );
        }
        // For "updating" status, just show plain text
        return <div className="font-medium leading-5">{value}</div>;
      },
    },
    {
      key: "region",
      label: "Region",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "size",
      label: "Size",
      sortable: true,
      render: (value: string) => (
        <div className="leading-5">{value}</div>
      ),
    },
    {
      key: "createdOn",
      label: "Creation Date",
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
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "actions",
      label: "Action",
      align: "right" as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <ActionMenu
            onCopyURL={() => handleCopyURL(row)}
            onEditBucket={() => handleEditBucket(row)}
            onAddRule={() => handleAddRule(row)}
            onCustomDelete={() => handleDeleteClick(row)}
            resourceName={row.name}
            resourceType="Bucket"
            deleteLabel="Delete Bucket"
          />
        </div>
      ),
    },
  ]

  // Add actions property to each bucket row for DataTable
  const dataWithActions = mockBuckets.map((bucket) => ({ ...bucket, actions: null }))

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <PageLayout 
      title="Object Storage" 
      description="Manage your object storage buckets and files"
      headerActions={
        <Button>
          Create Bucket
        </Button>
      }
    >
      <div className="space-y-6">
        <ShadcnDataTable
          columns={columns}
          data={dataWithActions}
          searchableColumns={["name", "region"]}
          defaultSort={{ column: "createdOn", direction: "desc" }}
          enableSearch={true}
          enablePagination={true}
          onRefresh={handleRefresh}
        />
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={selectedBucket?.name || ""}
        resourceType="Bucket"
        onConfirm={handleDeleteConfirm}
      />
    </PageLayout>
  )
}
