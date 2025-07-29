"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users, Server, Database, Cpu, BarChart3, Plus, ExternalLink, MapPin, BookOpen, Shield, Key, Code, Globe, Brain, FileText } from "lucide-react"
import { CommandPaletteProvider } from "@/components/command/command-palette-provider"
import { AccessBanner } from "@/components/access-control/access-banner"
import { FeatureRestriction } from "@/components/access-control/feature-restriction"
import { Button } from "@/components/ui/button"
import { Stepper, StepperItem, StepperIndicator, StepperTitle, StepperDescription, StepperSeparator, StepperNav, StepperPanel, StepperContent } from '@/components/ui/stepper'
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
import React from "react"
import { StatusBadge } from "@/components/status-badge"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"

// Resource Tables Component
function ResourceTables({ isNewUser = false }: { isNewUser?: boolean }) {
  if (isNewUser) {
    // Mock credit status - in real app this would come from user data
    const hasCredits = false // This would be determined by user's credit balance
    
    const steps = [
      { 
        title: 'Add Credits', 
        description: 'Add credits to start provisioning services', 
        button: 'Add Credits', 
        href: '/billing/add-credits',
        enabled: true, // Always enabled
        tooltip: null,
        icon: CreditCard
      },
      { 
        title: 'Create VPC', 
        description: 'Configure a Virtual Private Cloud to organize and secure your resources', 
        button: 'Create VPC', 
        href: '/networking/vpc',
        enabled: hasCredits,
        tooltip: hasCredits ? null : 'Add credits to your account to create VPCs',
        icon: Globe
      },
      { 
        title: 'Add SSH Key', 
        description: 'Add your SSH Key to create and access your VMs', 
        button: 'Add SSH Key', 
        href: '/settings/ssh-keys',
        enabled: hasCredits,
        tooltip: hasCredits ? null : 'Add credits to your account to manage SSH keys',
        icon: Key
      },
      { 
        title: 'Create Virtual Machine', 
        description: 'Deploy a virtual machine to begin running your applications', 
        button: 'Create VM', 
        href: '/compute/vms/cpu/create',
        enabled: hasCredits,
        tooltip: hasCredits ? null : 'Add credits to your account to create virtual machines',
        icon: Server
      },
    ];

    return (
      <div className="space-y-6">
        <Card className="mb-6">
          <CardContent className="p-6 w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl mx-auto">
              {/* Header with title and View Docs button */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                  <h2 className="text-2xl font-bold mb-2">Set Up Your Cloud Services</h2>
                  <div className="text-base text-muted-foreground">
                    A step-by-step panel to help you configure and launch VM services
                  </div>
                </div>
                <Button variant="outline" asChild className="flex-shrink-0">
                  <Link href="/getting-started/quickstart">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Docs
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const stepButton = (
                    <Button 
                      variant={step.enabled ? "default" : "outline"}
                      size="sm" 
                      className={`w-full ${step.enabled ? '' : 'opacity-60 cursor-not-allowed'}`}
                      disabled={!step.enabled}
                      asChild={step.enabled}
                    >
                      {step.enabled ? (
                        <Link href={step.href}>
                          {step.button}
                        </Link>
                      ) : (
                        <span>{step.button}</span>
                      )}
                    </Button>
                  );

                  return (
                    <div key={index} className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      
                      {step.tooltip ? (
                        <TooltipWrapper content={step.tooltip}>
                          {stepButton}
                        </TooltipWrapper>
                      ) : (
                        stepButton
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  // Mock data for existing users
  const vms = [
    { id: "vm-001", name: "AI-Training-VM", status: "running", vpc: "prod-vpc" },
    { id: "vm-002", name: "Web-Server-01", status: "stopped", vpc: "dev-vpc" },
    { id: "vm-003", name: "DB-Node-1", status: "running", vpc: "prod-vpc" },
  ];
  const vpcs = [
    { name: "prod-vpc", status: "active", description: "Production network for main workloads" },
    { name: "dev-vpc", status: "active", description: "Development environment network" },
    { name: "test-vpc", status: "inactive", description: "Testing and QA network" },
  ];
  const buckets = [
    { id: "bucket-001", name: "ml-datasets", region: "ap-south-1", sizeUsed: "12 GB", status: "active" },
    { id: "bucket-002", name: "logs", region: "us-east-1", sizeUsed: "2 GB", status: "active" },
    { id: "bucket-003", name: "backups", region: "eu-west-1", sizeUsed: "30 GB", status: "active" },
  ];
  // AI Pods mock data
  const aiPods = [
    { name: "VisionPod-01", template: "Image Classification", status: "running" },
    { name: "NLP-Pod-02", template: "Text Generation", status: "stopped" },
    { name: "SpeechPod-03", template: "Speech Recognition", status: "running" },
  ];
  const aiPodColumns = [
    { key: "name", label: "Pod Name", sortable: true, searchable: true, render: (value: string) => <a href="#" className="text-primary font-medium hover:underline">{value}</a> },
    { key: "status", label: "Status", sortable: true, render: (value: string) => <StatusBadge status={value} /> },
    { key: "template", label: "Template", sortable: true },
  ];
  // Table columns
  const vmColumns = [
    { key: "name", label: "Machine Name", sortable: true, searchable: true, render: (value: string, row: any) => <a href="#" className="text-primary font-medium hover:underline">{value}</a> },
    { key: "status", label: "Status", sortable: true, render: (value: string) => <StatusBadge status={value} /> },
    { key: "vpc", label: "VPC", sortable: true },
  ];
  const vpcColumns = [
    { key: "name", label: "Name", sortable: true, searchable: true, render: (value: string, row: any) => <a href="#" className="text-primary font-medium hover:underline">{value}</a> },
    { key: "status", label: "Status", sortable: true, render: (value: string) => <StatusBadge status={value} /> },
    { key: "description", label: "Description", sortable: false },
  ];
  const bucketColumns = [
    { key: "name", label: "Bucket Name", sortable: true, searchable: true, render: (value: string, row: any) => <a href="#" className="text-primary font-medium hover:underline">{value}</a> },
    { key: "status", label: "Status", sortable: true, render: (value: string) => <StatusBadge status={value} /> },
    { key: "region", label: "Region", sortable: true },
    { key: "sizeUsed", label: "Size Used", sortable: true },
  ];

  return (
    <div className="space-y-6">
      {/* Resource Cards in two columns per row */}
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
              searchableColumns={["name", "description"]}
              pageSize={5}
              enableSearch={false}
              enablePagination={false}
            />
          </CardContent>
        </Card>
        {/* AI Pods Table */}
        <Card className="bg-white rounded-lg min-w-0 flex-1 flex flex-col h-full">
          <CardHeader>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              AI Pods
            </h2>
          </CardHeader>
          <CardContent className="p-1 flex-1 w-full flex flex-col">
            <ShadcnDataTable
              columns={aiPodColumns}
              data={aiPods}
              searchableColumns={["name", "template"]}
              pageSize={5}
              enableSearch={false}
              enablePagination={false}
            />
          </CardContent>
        </Card>
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
  );
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
        { name: "CIDR Guidelines", href: "/documentation/cidr" }
      ]
    },
    {
      category: "API Documentation",
      icon: Code,
      color: "bg-purple-100 text-purple-700",
      items: [
        { name: "Models", href: "/documentation/models" },
        { name: "Bhashik", href: "/documentation/bhashik" },
        { name: "Object Storage", href: "/documentation/storage" }
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
  // Determine if the user is the special new user
  const isNewUser = user?.email === "new.user@krutrim.com"
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
        <ResourceTables isNewUser={isNewUser} />

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
