"use client"

import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Globe, Edit, Trash2, Shield } from "lucide-react"
import { DetailGrid } from "@/components/detail-grid"
import { useState, use } from "react"

interface CertificateDetails {
  id: string
  certificateName: string
  certificateId: string
  primaryDomain: string
  type: "Generic" | "F5"
  expirationDate: string
  issueDate: string
  status: "active" | "expired" | "expiring-soon" | "pending"
  inUse: "Yes" | "No"
  issuer: string
  serialNumber: string
  fingerprint: string
  keySize: string
  signatureAlgorithm: string
  alternativeNames: string[]
  description?: string
}

export default function CertificateDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const resolvedParams = use(params)

  // Mock certificate data - in real app would fetch based on params.id
  const certificate: CertificateDetails = {
    id: resolvedParams.id,
    certificateName: "production-ssl-cert",
    certificateId: "cert-prod-12345",
    primaryDomain: "api.production.com",
    type: "Generic",
    expirationDate: "2024-06-15T00:00:00Z",
    issueDate: "2023-06-15T00:00:00Z",
    status: "active",
    inUse: "Yes",
    issuer: "Let's Encrypt Authority X3",
    serialNumber: "03:B2:C4:DE:F6:8A:12:34:56:78:9A:BC:DE:F0:12:34",
    fingerprint: "SHA256: 12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC:DE:F0:12:34:56:78:9A:BC",
    keySize: "2048 bits",
    signatureAlgorithm: "SHA256withRSA",
    alternativeNames: ["api.production.com", "www.api.production.com"],
    description: "SSL certificate for production API endpoints"
  }

  const handleEdit = () => {
    // Navigate to edit page
    console.log("Edit certificate:", certificate.id)
  }

  const handleDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatExpirationDate = (dateString: string, status: CertificateDetails['status']) => {
    const formattedDate = formatDate(dateString)
    
    // Color based on status
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

  const getStatusBadge = (status: CertificateDetails['status']) => {
    const variants = {
      active: { variant: "default" as const, className: "bg-green-100 text-green-700 border-green-200" },
      expired: { variant: "destructive" as const, className: "" },
      "expiring-soon": { variant: "secondary" as const, className: "bg-orange-100 text-orange-700 border-orange-200" },
      pending: { variant: "outline" as const, className: "bg-blue-100 text-blue-700 border-blue-200" }
    }
    
    const config = variants[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    )
  }

  const customBreadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/administration", title: "Administration" },
    { href: "/administration/certificates", title: "Certificate Manager" },
    { href: `/administration/certificates/${resolvedParams.id}`, title: certificate.certificateName }
  ]

  return (
    <PageLayout 
      title={certificate.certificateName} 
      customBreadcrumbs={customBreadcrumbs} 
      hideViewDocs={true}
    >
      {/* Certificate Basic Information */}
      <div className="mb-6 group relative" style={{
        borderRadius: '16px',
        border: '4px solid #FFF',
        background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
        boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
        padding: '1.5rem'
      }}>
        {/* Overlay Edit/Delete Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <DetailGrid>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Certificate ID</span>
            </div>
            <p className="font-mono text-sm">{certificate.certificateId}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Primary Domain</span>
            </div>
            <p className="font-medium">{certificate.primaryDomain}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">Type</span>
            </div>
            <div className="text-sm">
              {certificate.type}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
            </div>
            {getStatusBadge(certificate.status)}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">Expiration</span>
            </div>
            <div>
              {formatExpirationDate(certificate.expirationDate, certificate.status)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">In Use</span>
            </div>
            <Badge variant={certificate.inUse === "Yes" ? "default" : "secondary"} className={
              certificate.inUse === "Yes" 
                ? "bg-green-100 text-green-700 border-green-200" 
                : "bg-gray-100 text-gray-700 border-gray-200"
            }>
              {certificate.inUse}
            </Badge>
          </div>
        </DetailGrid>

        {certificate.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-muted-foreground">{certificate.description}</p>
          </div>
        )}
      </div>

      {/* Detailed Certificate Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Certificate Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Certificate Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Issuer</Label>
              <p className="font-medium">{certificate.issuer}</p>
            </div>
            
            <div>
              <Label>Serial Number</Label>
              <p className="font-mono text-sm">{certificate.serialNumber}</p>
            </div>
            
            <div>
              <Label>Key Size</Label>
              <p className="text-sm">{certificate.keySize}</p>
            </div>
            
            <div>
              <Label>Signature Algorithm</Label>
              <p className="text-sm">{certificate.signatureAlgorithm}</p>
            </div>

            <div>
              <Label>Issue Date</Label>
              <div>
                <span className="text-sm">{formatDate(certificate.issueDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Names & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Domain Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Subject Alternative Names</Label>
              <div className="mt-2 space-y-1">
                {certificate.alternativeNames.map((name, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-1">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label>Fingerprint (SHA256)</Label>
              <p className="font-mono text-xs break-all bg-gray-50 p-2 rounded mt-1">
                {certificate.fingerprint}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

// Helper Label component
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-medium text-muted-foreground">
      {children}
    </span>
  )
}
