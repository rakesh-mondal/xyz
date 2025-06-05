"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "../../../../components/breadcrumbs"
import { PageHeader } from "../../../../components/page-header"
import { DetailSection } from "../../../../components/detail-section"
import { DetailGrid } from "../../../../components/detail-grid"
import { DetailItem } from "../../../../components/detail-item"
import { Button } from "../../../../components/ui/button"
import { getVPC } from "../../../../lib/data"
import { DeleteConfirmationModal } from "../../../../components/delete-confirmation-modal"

export default function VPCDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const vpc = getVPC(params.id)

  if (!vpc) {
    notFound()
  }

  const handleDelete = () => {
    // In a real app, this would delete the VPC
    console.log("Deleting VPC:", vpc.name)
    router.push("/networking/vpc")
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Networking", href: "/networking" },
          { name: "Virtual Private Cloud", href: "/networking/vpc" },
          { name: vpc.name },
        ]}
      />

      <PageHeader
        title={vpc.name}
        status={vpc.status}
        actions={
          vpc.name !== "production-vpc" ? (
            <Button
              variant="outline"
              className="border-input hover:bg-secondary transition-colors hover:scale-105"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete VPC
            </Button>
          ) : null
        }
      />

      <div className="bg-card text-card-foreground border-border border rounded-lg shadow-sm p-6 mb-6">
        <DetailSection title="VPC">
          <DetailGrid>
            <DetailItem label="VPC Name" value={vpc.name} />
            <DetailItem label="Status" value={vpc.status} />
            <DetailItem label="Region" value={vpc.region} />
            <DetailItem label="Created On" value={vpc.createdOn} />
            {vpc.description && <DetailItem label="Description" value={vpc.description} />}
          </DetailGrid>
        </DetailSection>
      </div>

      <div className="bg-card text-card-foreground border-border border rounded-lg shadow-sm p-6">
        <DetailSection title="Network">
          <DetailGrid>
            <DetailItem label="Network Name" value={vpc.networkName} />
            <DetailItem label="Router Name" value={`${vpc.name}-router`} />
            <DetailItem label="Description" value="Main production network" />
          </DetailGrid>
        </DetailSection>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={vpc.name}
        resourceType="VPC"
        onConfirm={handleDelete}
      />
    </div>
  )
}
