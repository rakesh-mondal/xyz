"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users, Server, Database, Cpu, BarChart3, Plus, ExternalLink, MapPin, BookOpen, Shield, Key, Code, Globe, Brain, FileText } from "lucide-react"
import { CommandPaletteProvider } from "@/components/command/command-palette-provider"
import { AccessBanner } from "@/components/access-control/access-banner"
import { FeatureRestriction } from "@/components/access-control/feature-restriction"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IdentityVerificationModal } from "@/components/modals/identity-verification-modal"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { useEffect } from "react"
import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"

// Resource Tables Component
function ResourceTables() {
  // Mock data for existing users
  const vms = [
    { id: "vm-001", name: "AI-Training-VM", status: "running", vpc: "prod-vpc" },
    { id: "vm-002", name: "Web-Server-01", status: "stopped", vpc: "dev-vpc" },
    { id: "vm-003", name: "DB-Node-1", status: "running", vpc: "prod-vpc" },
  ]
  const vpcs = [
    { id: "vpc-001", name: "prod-vpc", status: "active" },
    { id: "vpc-002", name: "dev-vpc", status: "active" },
    { id: "vpc-003", name: "test-vpc", status: "inactive" },
  ]
  const buckets = [
    { id: "bucket-001", name: "ml-datasets", region: "ap-south-1", sizeUsed: "12 GB", status: "active" },
    { id: "bucket-002", name: "logs", region: "us-east-1", sizeUsed: "2 GB", status: "active" },
    { id: "bucket-003", name: "backups", region: "eu-west-1", sizeUsed: "30 GB", status: "active" },
  ]

  // Table columns
  const vmColumns = [
    { key: "name", label: "Machine Name", sortable: true, searchable: true, render: (value: string, row: any) => <a href="#" className="text-primary font-medium hover:underline">{value}</a> },
    { key: "status", label: "Status", sortable: true, render: (value: string) => <Badge variant={value === 'running' ? 'default' : 'secondary'}>{value}</Badge> },
    { key: "vpc", label: "VPC", sortable: true },
  ]
  const vpcColumns = [
    { key: "name", label: "Name", sortable: true, searchable: true, render: (value: string, row: any) => <a href="#" className="text-primary font-medium hover:underline">{value}</a> },
    { key: "id", label: "ID", sortable: true, render: (value: string) => <span className="font-mono text-sm">{value}</span> },
    { key: "status", label: "Status", sortable: true, render: (value: string) => <Badge variant={value === 'active' ? 'default' : 'secondary'}>{value}</Badge> },
  ]
  const bucketColumns = [
    { key: "name", label: "Bucket Name", sortable: true, searchable: true, render: (value: string, row: any) => <a href="#" className="text-primary font-medium hover:underline">{value}</a> },
    { key: "region", label: "Region", sortable: true },
    { key: "sizeUsed", label: "Size Used", sortable: true },
    { key: "status", label: "Status", sortable: true, render: (value: string) => <Badge variant={value === 'active' ? 'default' : 'secondary'}>{value}</Badge> },
  ]

  // Billing summary with chart (mock data)
  function BillingSummaryWithChart() {
    // Usage Metrics style mock data
    const totalAvailableCredits = 69187.32;
    const totalUsedCredits = 67093.66;
    const remainingCredits = totalAvailableCredits - totalUsedCredits;
    const chartData = [
      { label: "DIS", value: 43810 },
      { label: "Bhashik", value: 17900 },
      { label: "Deployment", value: 2973 },
      { label: "Compute", value: 1292 },
      { label: "Industrial Solutions", value: 1051 },
      { label: "Model Catalogue", value: 30 },
      { label: "Finetuning", value: 21 },
      { label: "Evaluation", value: 15 },
      { label: "Storage", value: 3 },
      { label: "Network", value: 0 },
    ]
    return (
      <Card className="mb-6">
        <CardContent className="w-full flex flex-col lg:flex-row gap-8 items-stretch justify-between">
        {/* Remaining Balance Card - Usage Metrics style */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 w-full max-w-xs">
          <div style={{
            borderRadius: '16px',
            border: '4px solid #FFF',
            background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
            boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
            padding: '1.5rem',
            width: '100%',
            minWidth: '220px',
            textAlign: 'center',
          }}>
            <div className="mb-3">
              <div className="text-lg text-muted-foreground">Remaining Balance</div>
            </div>
            <div className="text-3xl font-bold text-black mb-2">
              ₹{remainingCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-black bg-green-100 rounded-full px-3 py-1 inline-block">
              Available for use
            </div>
          </div>
        </div>
        {/* Divider for large screens */}
        <div className="hidden lg:block h-80 border-l border-gray-200 mx-4" />
        {/* Total Credits Used and Bar Chart */}
        <div className="flex-1 w-full flex flex-col justify-between">
          <div className="flex flex-col items-start mb-4 mt-4">
            <span className="text-sm text-muted-foreground">Total Credits Used</span>
            <span className="text-2xl font-bold text-gray-900 mt-1">₹{totalUsedCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="space-y-2 mt-2">
            {chartData.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="w-40 text-sm text-gray-700 flex-shrink-0">{item.label}</span>
                <div className="flex-1 bg-gray-100 rounded h-4 relative">
                  <div
                    className="bg-blue-500 h-4 rounded"
                    style={{ width: `${(item.value / totalUsedCredits) * 100}%`, minWidth: item.value > 0 ? 24 : 0 }}
                  ></div>
                  {item.value > 0 && (
                    <span className="absolute right-2 top-0 text-sm text-gray-900 font-medium h-4 flex items-center">₹{item.value.toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Billing Summary with Chart */}
      <BillingSummaryWithChart />

      {/* Resource Cards in one row, responsive */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-stretch">
        {/* Virtual Machines Table */}
        <Card className="bg-white rounded-lg min-w-0 flex-1 flex flex-col h-full">
          <CardHeader>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Server className="h-5 w-5" />
              Virtual Machines
            </h2>
          </CardHeader>
          <CardContent className="p-1 flex-1 w-full flex flex-col">
            <ShadcnDataTable
              columns={vmColumns}
              data={vms}
              searchableColumns={["name"]}
              pageSize={5}
              enableSearch={false}
              enablePagination={false}
            />
          </CardContent>
        </Card>
        {/* Virtual Private Network Table */}
        <Card className="bg-white rounded-lg min-w-0 flex-1 flex flex-col h-full">
          <CardHeader>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Virtual Private Network
            </h2>
          </CardHeader>
          <CardContent className="p-1 flex-1 w-full flex flex-col">
            <ShadcnDataTable
              columns={vpcColumns}
              data={vpcs}
              searchableColumns={["name", "id"]}
              pageSize={5}
              enableSearch={false}
              enablePagination={false}
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 grid-cols-1 items-stretch mt-6">
        {/* Object Storage Table */}
        <Card className="bg-white rounded-lg min-w-0 flex-1 flex flex-col h-full">
          <CardHeader>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Object Storage
            </h2>
          </CardHeader>
          <CardContent className="p-1 flex-1 w-full flex flex-col">
            <ShadcnDataTable
              columns={bucketColumns}
              data={buckets}
              searchableColumns={["name", "region"]}
              pageSize={5}
              enableSearch={false}
              enablePagination={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Services Available Component
function ServicesAvailable() {
  const services = [
    {
      category: "Compute",
      icon: Server,
      color: "bg-blue-100 text-blue-700",
      items: [
        { name: "Virtual Machines", href: "/compute/vms", description: "Launch and manage virtual machines" },
        { name: "AI Pods", href: "/compute/ai-pods", description: "Deploy AI workloads on specialized infrastructure" }
      ]
    },
    {
      category: "Storage",
      icon: Database,
      color: "bg-green-100 text-green-700",
      items: [
        { name: "Object Storage", href: "/storage/object", description: "Create and manage buckets" },
        { name: "Block Storage", href: "/storage/block", description: "Volumes, snapshots, backups" }
      ]
    },
    {
      category: "Networking",
      icon: Globe,
      color: "bg-purple-100 text-purple-700",
      items: [
        { name: "VPC", href: "/networking/vpc", description: "Virtual Private Cloud" },
        { name: "Subnets", href: "/networking/subnets", description: "Network segmentation" },
        { name: "Security Groups", href: "/networking/security-groups", description: "Firewall rules" }
      ]
    },
    {
      category: "AI Solutions",
      icon: Brain,
      color: "bg-orange-100 text-orange-700",
      items: [
        { name: "Models", href: "/models", description: "AI model management" },
        { name: "Bhashik", href: "/bhashik", description: "Speech and text services" },
        { name: "Document Intelligence", href: "/doc-intelligence", description: "Document processing" }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Services Available</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Card key={service.category}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${service.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{service.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {service.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={item.href}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Documentation Hub Component
function DocumentationHub() {
  const docs = [
    {
      category: "Core Infrastructure",
      icon: Server,
      color: "bg-blue-100 text-blue-700",
      items: [
        { name: "Virtual Private Cloud", href: "/documentation/vpc" },
        { name: "Virtual Machines", href: "/documentation/vms" },
        { name: "GPU Baremetals", href: "/documentation/gpu" },
        { name: "Object Storage", href: "/documentation/storage" },
        { name: "Security Groups", href: "/documentation/security" }
      ]
    },
    {
      category: "Access and Security",
      icon: Shield,
      color: "bg-green-100 text-green-700",
      items: [
        { name: "SSH Keys", href: "/documentation/ssh" },
        { name: "SDK Reference", href: "/documentation/sdk" },
        { name: "CIDR Guidelines", href: "/documentation/cidr" },
        { name: "API Documentation", href: "/documentation/api" }
      ]
    },
    {
      category: "API Documentation",
      icon: Code,
      color: "bg-purple-100 text-purple-700",
      items: [
        { name: "Models", href: "/documentation/models" },
        { name: "Bhashik", href: "/documentation/bhashik" },
        { name: "Document Intelligence", href: "/documentation/doc-intelligence" }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Documentation Hub</h2>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {docs.map((doc) => {
          const Icon = doc.icon
          return (
            <Card key={doc.category}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${doc.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{doc.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {doc.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.name}</p>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={item.href}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Ola Maps Banner Component
function OlaMapsBanner() {
  return (
    <Card className="border-0" style={{ background: 'linear-gradient(265deg, #E0F2E0 0%, #F0F7F0 100%)' }}>
      <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 py-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore Ola Maps</h3>
            <p className="text-gray-700">Integrate location intelligence into your apps with developer-friendly SDKs and APIs</p>
          </div>
        </div>
        <Button asChild size="lg">
          <Link href="/maps" className="flex items-center gap-2">
            Start with Ola Maps
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false)
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false)

  const handleVerifyIdentity = () => {
    setIsIdentityModalOpen(true)
  }

  const handleIdentityVerificationComplete = () => {
    toast({
      title: "Identity Verification Complete",
      description: "Your identity has been verified successfully. You now have full access to all Krutrim Cloud services."
    })
  }

  // Get first name fallback
  const firstName = user?.firstName || user?.name?.split(" ")[0] || "there"

  return (
    <CommandPaletteProvider>
      <div className="space-y-6 flex flex-col min-h-screen pb-12">
        <AccessBanner onCompleteProfile={handleVerifyIdentity} />

        {/* Welcome Message */}
        <div className="mb-2">
          <h2 className="text-3xl font-bold text-gray-900 text-left mb-1">Hey Rakesh,</h2>
          <div className="text-lg text-gray-700 font-normal text-left mb-1">Welcome back to Krutrim Cloud</div>
        </div>

        {/* Resource Tables */}
        <ResourceTables />

        {/* Services Available */}
        <ServicesAvailable />

        {/* Documentation Hub */}
        <DocumentationHub />

        {/* Ola Maps Banner */}
        <OlaMapsBanner />

        {/* Identity Verification Modal */}
        {user && (
          <IdentityVerificationModal
            isOpen={isIdentityModalOpen}
            onClose={() => setIsIdentityModalOpen(false)}
            onComplete={handleIdentityVerificationComplete}
            userData={{
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              name: user.name || '',
              email: user.email || '',
              mobile: user.mobile || '',
              accountType: user.accountType || 'individual',
              companyName: user.companyName || ''
            }}
          />
        )}

        {/* Spacer to push banner to bottom */}
        <div className="flex-1" />

        {/* Corporate Enquiry Banner */}
        <Card className="w-full max-w-4xl mx-auto mb-16 border-0" style={{ background: 'linear-gradient(265deg, #E0E7FF 0%, #F0F7FF 100%)' }}>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
            <div className="text-base md:text-lg font-medium text-gray-900">Need help with enterprise deployments, custom solutions, or pricing?</div>
            <Button variant="default" size="default" onClick={() => setIsEnterpriseModalOpen(true)}>
              Contact Us &rarr;
            </Button>
          </CardContent>
        </Card>

        {/* Enterprise Query Modal */}
        <AlertDialog open={isEnterpriseModalOpen} onOpenChange={setIsEnterpriseModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Enterprise Query Form</AlertDialogTitle>
              <AlertDialogDescription>
                Fill out the form and our team will get in touch with you for enterprise solutions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" defaultValue={user?.name || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2" defaultValue={user?.email || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="Tell us about your requirements..." />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Submit</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CommandPaletteProvider>
  )
}
