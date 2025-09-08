"use client"

import { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { CreateButton } from "@/components/create-button"
import { EmptyState } from "@/components/ui/empty-state"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoreVertical, Eye, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { shouldShowEmptyState, getEmptyStateMessage } from "@/lib/demo-data-filter"
import { useRouter } from "next/navigation"
import { DeleteCertificateModal } from "@/components/modals/delete-certificate-modal"
import { UpdateCertificateModal } from "@/components/modals/update-certificate-modal"
import { toast } from "@/hooks/use-toast"

// Custom Update Icon Component
const UpdateIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 12 12" 
    className={className}
  >
    <title>cloud-upload-2</title>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" stroke="currentColor">
      <line x1="6" y1="11.25" x2="6" y2="6"></line>
      <path d="m10.767,7.215c.3-.412.483-.916.483-1.465,0-1.381-1.119-2.5-2.5-2.5-.243,0-.473.046-.695.11-.485-1.51-1.884-2.61-3.555-2.61C2.429.75.75,2.429.75,4.5c0,.847.292,1.62.765,2.248"></path>
      <polyline points="3.5 8.25 6 5.75 8.5 8.25"></polyline>
    </g>
  </svg>
)

// Certificate interface
interface Certificate {
  id: string
  certificateName: string
  certificateId: string
  primaryDomain: string
  type: "Generic"
  expirationDate: string
  status: "active" | "expired" | "expiring-soon" | "pending"
  resourcesAttached: number
  vpc: string
  tags: { [key: string]: string }
}

// Helper function to get relative dates
const getRelativeDate = (daysFromNow: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString()
}

// Mock certificate data with realistic relative dates
const mockCertificates: Certificate[] = [
  {
    id: "cert-1",
    certificateName: "production-ssl-cert",
    certificateId: "cert-prod-12345",
    primaryDomain: "api.production.com",
    type: "Generic",
    expirationDate: getRelativeDate(95), // 95 days from now - Active
    status: "active",
    resourcesAttached: 5,
    vpc: "vpc-prod-001",
    tags: {
      "Environment": "Production",
      "Team": "Platform"
    }
  },
  {
    id: "cert-2", 
    certificateName: "staging-ssl-cert",
    certificateId: "cert-stage-67890",
    primaryDomain: "api.staging.com",
    type: "Generic",
    expirationDate: getRelativeDate(15), // 15 days from now - Expiring soon
    status: "expiring-soon",
    resourcesAttached: 3,
    vpc: "vpc-staging-001",
    tags: {
      "Environment": "Staging",
      "Team": "Platform"
    }
  },
  {
    id: "cert-3",
    certificateName: "dev-wildcard-cert",
    certificateId: "cert-dev-11111",
    primaryDomain: "*.development.com",
    type: "Generic", 
    expirationDate: getRelativeDate(180), // 180 days from now - Active
    status: "active",
    resourcesAttached: 0,
    vpc: "vpc-dev-001",
    tags: {
      "Environment": "Development",
      "Team": "Platform"
    }
  },
  {
    id: "cert-4",
    certificateName: "code-signing-cert",
    certificateId: "cert-code-22222",
    primaryDomain: "signing.company.com",
    type: "Generic",
    expirationDate: getRelativeDate(-45), // 45 days ago - Expired
    status: "expired",
    resourcesAttached: 0,
    vpc: "vpc-security-001",
    tags: {
      "Environment": "Production",
      "Team": "Security"
    }
  },
  {
    id: "cert-5",
    certificateName: "client-auth-cert",
    certificateId: "cert-client-33333",
    primaryDomain: "client.secure.com",
    type: "Generic", 
    expirationDate: getRelativeDate(25), // 25 days from now - Expiring soon
    status: "active",
    resourcesAttached: 2,
    vpc: "vpc-prod-001",
    tags: {
      "Environment": "Production",
      "Team": "Security"
    }
  },
  {
    id: "cert-6",
    certificateName: "load-balancer-cert",
    certificateId: "cert-lb-44444",
    primaryDomain: "lb.production.com",
    type: "Generic",
    expirationDate: getRelativeDate(7), // 7 days from now - Expiring soon
    status: "expiring-soon",
    resourcesAttached: 8,
    vpc: "vpc-prod-001",
    tags: {
      "Environment": "Production",
      "Team": "Platform"
    }
  },
  {
    id: "cert-7",
    certificateName: "backup-ssl-cert",
    certificateId: "cert-backup-55555",
    primaryDomain: "backup.company.com",
    type: "Generic",
    expirationDate: getRelativeDate(-10), // 10 days ago - Expired
    status: "expired",
    resourcesAttached: 0,
    vpc: "vpc-backup-001",
    tags: {
      "Environment": "Production",
      "Team": "Backup"
    }
  },
  {
    id: "cert-8",
    certificateName: "test-environment-cert",
    certificateId: "cert-test-66666",
    primaryDomain: "test.internal.com",
    type: "Generic",
    expirationDate: getRelativeDate(2), // 2 days from now - Expiring soon (critical)
    status: "expiring-soon",
    resourcesAttached: 1,
    vpc: "vpc-dev-001",
    tags: {
      "Environment": "Testing",
      "Team": "QA"
    }
  },
  {
    id: "cert-9",
    certificateName: "monitoring-cert",
    certificateId: "cert-monitor-77777",
    primaryDomain: "monitoring.company.com",
    type: "Generic",
    expirationDate: getRelativeDate(365), // 1 year from now - Active
    status: "active",
    resourcesAttached: 12,
    vpc: "vpc-monitoring-001",
    tags: {
      "Environment": "Production",
      "Team": "Monitoring"
    }
  },
  {
    id: "cert-10",
    certificateName: "legacy-app-cert",
    certificateId: "cert-legacy-88888",
    primaryDomain: "legacy.oldapp.com",
    type: "Generic",
    expirationDate: getRelativeDate(-120), // 4 months ago - Expired
    status: "expired",
    resourcesAttached: 0,
    vpc: "vpc-legacy-001",
    tags: {
      "Environment": "Production",
      "Team": "Legacy"
    }
  }
]

export default function CertificateManagerPage() {
  const router = useRouter()
  const showEmptyState = shouldShowEmptyState()
  const [certificates] = useState(mockCertificates)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  // Function to determine if a certificate is expiring soon (within 30 days)
  const isExpiringSoon = (expirationDate: string): boolean => {
    const expDate = new Date(expirationDate)
    const now = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(now.getDate() + 30)
    
    return expDate > now && expDate <= thirtyDaysFromNow
  }

  // Update certificate statuses based on expiration dates
  const processedCertificates = certificates.map(cert => {
    const now = new Date()
    const expDate = new Date(cert.expirationDate)
    
    let status: Certificate['status']
    if (expDate < now) {
      status = 'expired'
    } else if (isExpiringSoon(cert.expirationDate)) {
      status = 'expiring-soon'
    } else {
      status = 'active'
    }
    
    return { ...cert, status }
  })

  const filteredCertificates = processedCertificates

  const handleViewDetails = (certificate: Certificate) => {
    router.push(`/administration/certificates/${certificate.id}`)
  }

  const handleDeleteCertificate = (certificate: Certificate) => {
    // Always open the delete modal - it will show appropriate content based on usage
    setSelectedCertificate(certificate)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    // Mock delete operation
    if (selectedCertificate) {
      console.log("Deleting certificate:", selectedCertificate.certificateName)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedCertificate(null)
  }

  const handleUpdateCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    setIsUpdateModalOpen(true)
  }

  const handleUpdateConfirm = async (data: { certificateName: string; tags: { [key: string]: string } }) => {
    // Mock update operation
    if (selectedCertificate) {
      console.log("Updating certificate:", selectedCertificate.certificateName, "with data:", data)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false)
    setSelectedCertificate(null)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  // Get unique VPCs for filter options
  const vpcOptions = Array.from(new Set(processedCertificates.map(cert => cert.vpc)))
    .map(vpc => ({ value: vpc, label: vpc }))
    .sort((a, b) => a.label.localeCompare(b.label))

  // Add "All VPCs" option at the beginning
  vpcOptions.unshift({ value: "all", label: "All VPCs" })






  // Table columns definition
  const columns = [
    {
      key: "certificateName",
      label: "Certificate Name",
      sortable: true,
      searchable: true,
      width: "25%",
      render: (value: string, row: Certificate) => (
        <a
          href={`/administration/certificates/${row.id}`}
          className="text-primary font-medium hover:underline leading-5"
        >
          {value}
        </a>
      ),
    },
    {
      key: "primaryDomain",
      label: "Primary Domain", 
      sortable: true,
      searchable: true,
      width: "25%",
      render: (value: string) => (
        <div className="font-medium">
          {value}
        </div>
      ),
    },

    {
      key: "expirationDate",
      label: "Expiration Date & Status",
      sortable: true,
      width: "20%",
      render: (value: string, row: Certificate) => {
        const formattedDate = new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
        
        const statusText = row.status.charAt(0).toUpperCase() + row.status.slice(1).replace('-', ' ')
        
        return (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="cursor-help flex items-center gap-2 hover:bg-gray-50 px-1 py-0.5 rounded">
                  {/* Status dot */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    row.status === 'expired' 
                      ? 'bg-red-600' 
                      : row.status === 'expiring-soon' 
                        ? 'bg-amber-500' 
                        : 'bg-green-600'
                  }`} />
                  
                  {/* Date */}
                  {row.status === 'expired' ? (
                    <span className="text-red-700 font-medium">{formattedDate}</span>
                  ) : row.status === 'expiring-soon' ? (
                    <span className="text-amber-700 font-medium">{formattedDate}</span>
                  ) : (
                    <span className="text-green-700 font-medium">{formattedDate}</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="z-50">
                <p className="text-sm">Status: {statusText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },

    {
      key: "resourcesAttached",
      label: "Resources Attached",
      sortable: true,
      align: "center" as const,
      width: "15%",
      render: (value: number) => (
        <div className="text-center">
          {value > 0 ? (
            <Badge variant="default" className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-700 cursor-default font-mono">
              {value}
            </Badge>
          ) : (
            <span className="text-gray-500 font-mono">0</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      width: "15%",
      render: (value: any, row: Certificate) => (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(row)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateCertificate(row)}>
                <UpdateIcon className="mr-2 h-4 w-4" />
                Update Certificate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteCertificate(row)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  // Certificate icon for empty state
  const certificateIcon = (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="30" width="120" height="140" rx="8" fill="#F8F9FA" stroke="#E5E7EB" strokeWidth="2"/>
      <rect x="60" y="50" width="80" height="4" fill="#D1D5DB"/>
      <rect x="60" y="65" width="60" height="3" fill="#D1D5DB"/>
      <rect x="60" y="80" width="70" height="3" fill="#D1D5DB"/>
      <circle cx="100" cy="120" r="20" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M90 120L98 128L110 112" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="70" y="150" width="60" height="3" fill="#D1D5DB"/>
    </svg>
  )

  return (
    <PageShell
      title="Certificate Manager"
      description="Import and manage all your SSL/TLS certificates"
      headerActions={
        <CreateButton href="/administration/certificates/import" label="Upload Certificate" />
      }
    >
      {showEmptyState ? (
        <Card className="mt-8">
          <CardContent>
            <EmptyState
              {...getEmptyStateMessage('certificates')}
              onAction={() => window.location.href = '/administration/certificates/import'}
              icon={certificateIcon}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable 
          columns={columns} 
          data={filteredCertificates}
          searchableColumns={["certificateName", "primaryDomain", "certificateId"]}
          pageSize={10}
          enableSearch={true}
          enableColumnVisibility={false}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableAutoRefresh={true}
          enableVpcFilter={true}
          vpcOptions={vpcOptions}
          enableStatusFilter={false}
          searchPlaceholder="Search Certificate by name"
        />
      )}

      {/* Delete Certificate Modal */}
      <DeleteCertificateModal
        open={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        certificate={selectedCertificate}
        onConfirm={handleDeleteConfirm}
      />

      {/* Update Certificate Modal */}
      <UpdateCertificateModal
        open={isUpdateModalOpen}
        onClose={handleUpdateModalClose}
        certificate={selectedCertificate}
        onConfirm={handleUpdateConfirm}
      />
    </PageShell>
  )
}
