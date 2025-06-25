"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { PageLayout } from "../../../../components/page-layout"
import { DetailSection } from "../../../../components/detail-section"
import { DetailGrid } from "../../../../components/detail-grid"
import { DetailItem } from "../../../../components/detail-item"
import { Button } from "../../../../components/ui/button"
import { getVPC, subnets } from "../../../../lib/data"
import { DeleteConfirmationModal } from "../../../../components/delete-confirmation-modal"
import { ShadcnDataTable } from "../../../../components/ui/shadcn-data-table"
import { StatusBadge } from "../../../../components/status-badge"
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline"

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

  const handleEdit = () => {
    router.push(`/networking/vpc/${vpc.id}/edit`)
  }

  const handleCreateSubnet = () => {
    router.push(`/networking/subnets/create?vpc=${vpc.name}`)
  }

  // Filter subnets that belong to this VPC
  const vpcSubnets = subnets.filter(subnet => subnet.vpcName === vpc.name)

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  // Subnet table columns
  const subnetColumns = [
    {
      key: "name",
      label: "Subnet Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "availabilityZone",
      label: "Availability Zone",
      sortable: true,
    },
    {
      key: "cidrBlock",
      label: "CIDR Block",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "description",
      label: "Description",
      searchable: true,
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
  ]

  const customBreadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/networking", title: "Networking" },
    { href: "/networking/vpc", title: "VPC" },
    { href: `/networking/vpc/${vpc.id}`, title: vpc.name }
  ]

  return (
    <PageLayout title={vpc.name} customBreadcrumbs={customBreadcrumbs} hideViewDocs={true}>
      {/* VPC Basic Information */}
      <div className="mb-6 group" style={{
        borderRadius: '16px',
        border: '4px solid #FFF',
        background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
        boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
        padding: '1.5rem'
      }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-normal text-muted-foreground">VPC Information</h3>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            {vpc.name !== "production-vpc" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <DetailGrid>
          {/* VPC ID, Region, Status, Created On in one row */}
          <div className="col-span-full grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>VPC ID</label>
              <div className="font-normal" style={{ fontSize: '14px' }}>{vpc.id}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Region</label>
              <div className="font-normal" style={{ fontSize: '14px' }}>{vpc.region}</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Status</label>
              <div>
                <StatusBadge status={vpc.status} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Created On</label>
              <div className="font-normal" style={{ fontSize: '14px' }}>{formatDate(vpc.createdOn)}</div>
            </div>
          </div>
          
          {/* Description */}
          <div className="col-span-full">
            <div className="space-y-1">
              <label className="text-sm font-normal text-gray-700" style={{ fontSize: '13px' }}>Description</label>
              <div className="font-normal" style={{ fontSize: '14px' }}>{vpc.description}</div>
            </div>
          </div>
        </DetailGrid>
      </div>

      {/* Subnets Section */}
      <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
        {vpcSubnets.length > 0 ? (
          <DetailSection title={`Subnets (${vpcSubnets.length})`}>
            <ShadcnDataTable
              columns={subnetColumns}
              data={vpcSubnets}
              searchableColumns={["name", "description"]}
              pageSize={10}
              enableSearch={true}
              enableColumnVisibility={false}
              enablePagination={true}
              enableVpcFilter={false}
            />
          </DetailSection>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            {/* SVG Illustration */}
            <div className="mb-6">
              <svg width="215" height="140" viewBox="0 0 215 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="215" height="140" fill="#FFFFFF"></rect>
                <path d="M64 0L64 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
                <path d="M151 0L151 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
                <path d="M215 32H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
                <path d="M215 108H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
                <path d="M215 71H0" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10" strokeDasharray="3 3"></path>
                <path d="M199 0L199 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
                <path d="M16 0L16 140" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
                <path d="M0 16L215 16" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
                <path d="M0 124L215 124" stroke="#EEEFF1" strokeWidth="0.8" strokeMiterlimit="10"></path>
                <path d="M78.6555 76.8751L105.795 63.5757C106.868 63.05 108.132 63.05 109.205 63.5757L136.344 76.8751C137.628 77.5037 138.438 78.7848 138.438 80.1854V90.7764C138.438 92.177 137.628 93.4578 136.344 94.0867L109.205 107.386C108.132 107.912 106.868 107.912 105.795 107.386L78.6555 94.0867C77.3724 93.4581 76.5625 92.177 76.5625 90.7764V80.1854C76.5625 78.7848 77.3724 77.504 78.6555 76.8751Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
                <g opacity="0.6">
                  <path d="M77.8 78.1958L107.5 93.2146L137.2 78.1958" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M107.5 107.445V93.2197" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
                <path d="M78.6555 47.0687L105.795 33.7693C106.868 33.2436 108.132 33.2436 109.205 33.7693L136.344 47.0687C137.628 47.6973 138.438 48.9784 138.438 50.379V60.97C138.438 62.3706 137.628 63.6514 136.344 64.2803L109.205 77.5797C108.132 78.1054 106.868 78.1054 105.795 77.5797L78.6555 64.2803C77.3724 63.6517 76.5625 62.3706 76.5625 60.97V50.379C76.5625 48.9784 77.3724 47.6976 78.6555 47.0687Z" fill="#FFFFFF" stroke="#5C5E63" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
                <g opacity="0.6">
                  <path d="M77.8 48.3943L107.5 63.4133L137.2 48.3943" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M107.5 77.6435V63.4182" stroke="#5C5E63" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
              </svg>
            </div>
            
            <div className="text-center space-y-4 max-w-md">
              <h4 className="text-lg font-medium text-foreground">Subnets</h4>
              <div className="text-muted-foreground">
                <p className="text-sm">
                  Create subnets to organize and isolate your resources within this VPC and control network access to improve security.{' '}
                  <a href="/documentation/subnets" className="text-primary hover:underline">
                    Learn more
                  </a>
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <Button 
                  onClick={handleCreateSubnet}
                  size="sm"
                >
                  Create Subnet
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={vpc.name}
        resourceType="VPC"
        onConfirm={handleDelete}
      />
    </PageLayout>
  )
}
