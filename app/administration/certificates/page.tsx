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

// Certificate interface
interface Certificate {
  id: string
  certificateName: string
  certificateId: string
  primaryDomain: string
  type: "Generic"
  expirationDate: string
  status: "active" | "expired" | "expiring-soon" | "pending"
  inUse: "Yes" | "No"
  vpc: string
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
    inUse: "Yes",
    vpc: "vpc-prod-001"
  },
  {
    id: "cert-2", 
    certificateName: "staging-ssl-cert",
    certificateId: "cert-stage-67890",
    primaryDomain: "api.staging.com",
    type: "Generic",
    expirationDate: getRelativeDate(15), // 15 days from now - Expiring soon
    status: "expiring-soon",
    inUse: "Yes",
    vpc: "vpc-staging-001"
  },
  {
    id: "cert-3",
    certificateName: "dev-wildcard-cert",
    certificateId: "cert-dev-11111",
    primaryDomain: "*.development.com",
    type: "Generic", 
    expirationDate: getRelativeDate(180), // 180 days from now - Active
    status: "active",
    inUse: "No",
    vpc: "vpc-dev-001"
  },
  {
    id: "cert-4",
    certificateName: "code-signing-cert",
    certificateId: "cert-code-22222",
    primaryDomain: "signing.company.com",
    type: "Generic",
    expirationDate: getRelativeDate(-45), // 45 days ago - Expired
    status: "expired",
    inUse: "No",
    vpc: "vpc-security-001"
  },
  {
    id: "cert-5",
    certificateName: "client-auth-cert",
    certificateId: "cert-client-33333",
    primaryDomain: "client.secure.com",
    type: "Generic", 
    expirationDate: getRelativeDate(25), // 25 days from now - Expiring soon
    status: "active",
    inUse: "Yes",
    vpc: "vpc-prod-001"
  },
  {
    id: "cert-6",
    certificateName: "load-balancer-cert",
    certificateId: "cert-lb-44444",
    primaryDomain: "lb.production.com",
    type: "Generic",
    expirationDate: getRelativeDate(7), // 7 days from now - Expiring soon
    status: "expiring-soon",
    inUse: "Yes",
    vpc: "vpc-prod-001"
  },
  {
    id: "cert-7",
    certificateName: "backup-ssl-cert",
    certificateId: "cert-backup-55555",
    primaryDomain: "backup.company.com",
    type: "Generic",
    expirationDate: getRelativeDate(-10), // 10 days ago - Expired
    status: "expired",
    inUse: "No",
    vpc: "vpc-backup-001"
  },
  {
    id: "cert-8",
    certificateName: "test-environment-cert",
    certificateId: "cert-test-66666",
    primaryDomain: "test.internal.com",
    type: "Generic",
    expirationDate: getRelativeDate(2), // 2 days from now - Expiring soon (critical)
    status: "expiring-soon",
    inUse: "Yes",
    vpc: "vpc-dev-001"
  },
  {
    id: "cert-9",
    certificateName: "monitoring-cert",
    certificateId: "cert-monitor-77777",
    primaryDomain: "monitoring.company.com",
    type: "Generic",
    expirationDate: getRelativeDate(365), // 1 year from now - Active
    status: "active",
    inUse: "Yes",
    vpc: "vpc-monitoring-001"
  },
  {
    id: "cert-10",
    certificateName: "legacy-app-cert",
    certificateId: "cert-legacy-88888",
    primaryDomain: "legacy.oldapp.com",
    type: "Generic",
    expirationDate: getRelativeDate(-120), // 4 months ago - Expired
    status: "expired",
    inUse: "No",
    vpc: "vpc-legacy-001"
  }
]

export default function CertificateManagerPage() {
  const router = useRouter()
  const showEmptyState = shouldShowEmptyState()
  const [certificates] = useState(mockCertificates)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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

  const handleRefresh = () => {
    window.location.reload()
  }

  // Get unique VPCs for filter options
  const vpcOptions = Array.from(new Set(processedCertificates.map(cert => cert.vpc)))
    .map(vpc => ({ value: vpc, label: vpc }))
    .sort((a, b) => a.label.localeCompare(b.label))

  // Add "All VPCs" option at the beginning
  vpcOptions.unshift({ value: "all", label: "All VPCs" })

  const formatExpirationDate = (dateString: string, status: Certificate['status']) => {
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    
    // Color based on status - simple span without wrapper for better alignment
    if (status === 'expired') {
      // Expired - red text
      return <span className="text-red-600 font-medium">{formattedDate}</span>
    } else if (status === 'expiring-soon') {
      // Expiring soon - orange text
      return <span className="text-orange-600 font-medium">{formattedDate}</span>
    } else {
      // Active/pending - black text
      return <span className="text-black">{formattedDate}</span>
    }
  }

  const getStatusBadge = (status: Certificate['status']) => {
    const variants = {
      active: { variant: "default" as const, className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700 cursor-default" },
      expired: { variant: "destructive" as const, className: "hover:bg-destructive hover:text-destructive-foreground cursor-default" },
      "expiring-soon": { variant: "secondary" as const, className: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 hover:text-orange-700 cursor-default" },
      pending: { variant: "outline" as const, className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-700 cursor-default" }
    }
    
    const config = variants[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    )
  }



  // Table columns definition
  const columns = [
    {
      key: "certificateName",
      label: "Certificate Name",
      sortable: true,
      searchable: true,
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
      key: "certificateId", 
      label: "Certificate ID",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="font-mono text-sm text-muted-foreground">
          {value}
        </div>
      ),
    },
    {
      key: "primaryDomain",
      label: "Primary Domain", 
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="font-medium">
          {value}
        </div>
      ),
    },

    {
      key: "expirationDate",
      label: "Expiration Date",
      sortable: true,
      render: (value: string, row: Certificate) => formatExpirationDate(value, row.status),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: Certificate['status']) => getStatusBadge(value),
    },
    {
      key: "vpc",
      label: "VPC",
      sortable: true,
      render: (value: string) => (
        <div className="font-mono text-sm text-muted-foreground">
          {value}
        </div>
      ),
    },
    {
      key: "inUse",
      label: "In Use",
      sortable: true,
      render: (value: Certificate['inUse']) => (
        <Badge variant={value === "Yes" ? "default" : "secondary"} className={
          value === "Yes" 
            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700 cursor-default" 
            : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-700 cursor-default"
        }>
          {value}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
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
        <CreateButton href="/administration/certificates/import" label="Import Certificate" />
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
    </PageShell>
  )
}
