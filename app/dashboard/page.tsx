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

// Resource Cards Component
function ResourceCards({ isNewUser = false }: { isNewUser?: boolean }) {
  if (isNewUser) {
    // Mock credit status - in real app this would come from user data
    const hasCredits = false // This would be determined by user's credit balance - set to false to test tooltips
    console.log('hasCredits:', hasCredits); // Debug log
    
    const steps = [
      { 
        title: 'Add Funds to Get Started', 
        description: 'Top up credits to enable cloud service provisioning', 
        button: 'Add Credits', 
        href: '/billing/add-credits',
        enabled: true, // Always enabled
        tooltip: null,
        icon: CreditCard
      },
      { 
        title: 'Configure Your Network', 
        description: 'Create first Virtual Private Cloud (VPC) to organize and isolate workloads', 
        button: 'Create VPC', 
        href: '/networking/vpc',
        enabled: hasCredits,
        tooltip: hasCredits ? null : 'Add credits to activate this service',
        icon: Globe
      },
      { 
        title: 'Secure Access', 
        description: 'Add an SSH key to securely access your virtual machines', 
        button: 'Add SSH Key', 
        href: '/settings/ssh-keys',
        enabled: hasCredits,
        tooltip: hasCredits ? null : 'Add credits to activate this service',
        icon: Key
      },
      { 
        title: 'Provision Your VM', 
        description: 'Deploy a virtual machine and begin using Krutrim Cloud', 
        button: 'Create VM', 
        href: '/compute/vms/cpu/create',
        enabled: hasCredits,
        tooltip: hasCredits ? null : 'Add credits to activate this service',
        icon: Server
      },
    ];
    
    console.log('Steps with tooltips:', steps.map(s => ({ title: s.title, tooltip: s.tooltip, enabled: s.enabled }))); // Debug log

    return (
      <div className="space-y-6">
        <Card 
          style={{
            border: "1px solid rgba(14, 114, 180, 0.2)",
            background: "linear-gradient(263deg, rgba(15, 123, 194, 0.08) 6.86%, rgba(15, 123, 194, 0.02) 96.69%)"
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Set Up Your Cloud Services</h2>
                <p className="text-sm text-gray-600 mt-1">A step-by-step panel to help you configure and launch VM services</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/getting-started/quickstart" className="flex items-center gap-1 font-normal text-foreground">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="-0.5 -0.5 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-4 w-4"
                    strokeWidth="1"
                  >
                    <path d="M14.375 1.9166666666666667H5.75a1.9166666666666667 1.9166666666666667 0 0 0 -1.9166666666666667 1.9166666666666667v15.333333333333334a1.9166666666666667 1.9166666666666667 0 0 0 1.9166666666666667 1.9166666666666667h11.5a1.9166666666666667 1.9166666666666667 0 0 0 1.9166666666666667 -1.9166666666666667V6.708333333333334Z"></path>
                    <path d="M13.416666666666668 1.9166666666666667v3.8333333333333335a1.9166666666666667 1.9166666666666667 0 0 0 1.9166666666666667 1.9166666666666667h3.8333333333333335"></path>
                  </svg>
                  View Docs
                </Link>
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                
                // Special styling for "Add Funds to Get Started" card (index 0)
                if (index === 0) {
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
                    <div key={index} 
                      style={{
                        borderRadius: '16px',
                        border: '4px solid #FFF',
                        background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
                        boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
                        padding: '1.5rem'
                      }}
                      className="flex flex-col h-full"
                    >
                      <div className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="text-base font-semibold">{step.title}</h3>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground mb-4">
                          {step.description}
                        </p>
                        <div className="mt-auto">
                          {step.tooltip ? (
                            <TooltipWrapper content={step.tooltip}>
                              <div className="w-full">
                                {stepButton}
                              </div>
                            </TooltipWrapper>
                          ) : (
                            stepButton
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Regular card styling for other steps
                const colors = [
                  "bg-green-100 text-green-700", 
                  "bg-purple-100 text-purple-700",
                  "bg-orange-100 text-orange-700"
                ];
                const colorClass = colors[(index - 1) % colors.length];
                
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
                  <Card key={index} className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base font-semibold">{step.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                      <div className="mt-auto">
                        {step.tooltip ? (
                          <TooltipWrapper content={step.tooltip}>
                            <div className="w-full">
                              {stepButton}
                            </div>
                          </TooltipWrapper>
                        ) : (
                          stepButton
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mock data for existing users
  const resourceData = {
    virtualMachines: {
      activeVMs: 8,
      totalVMs: 12,
      icon: Server,
      color: "bg-blue-100 text-blue-700",
      href: "/compute/vms"
    },
    blockStorage: {
      totalAllocatedSize: 256,
      volumeCount: 15,
      icon: Database,
      color: "bg-green-100 text-green-700", 
      href: "/storage/block"
    },
    objectStorage: {
      storageUsed: 45.2,
      totalBuckets: 8,
      icon: FileText,
      color: "bg-purple-100 text-purple-700",
      href: "/storage/object"
    },
    aiPods: {
      activePods: 3,
      totalPods: 5,
      icon: Cpu,
      color: "bg-orange-100 text-orange-700",
      href: "/compute/ai-pods"
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        style={{
          border: "1px solid rgba(14, 114, 180, 0.2)",
          background: "linear-gradient(263deg, rgba(15, 123, 194, 0.08) 6.86%, rgba(15, 123, 194, 0.02) 96.69%)"
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Resource Overview</h2>
              <p className="text-sm text-muted-foreground mt-1">Monitor and manage your cloud resources at a glance</p>
            </div>
          </div>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Virtual Machines Card */}
            <Card className="bg-white rounded-lg border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${resourceData.virtualMachines.color}`}>
                    <resourceData.virtualMachines.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-semibold">Virtual Machines</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active VMs</span>
                    <span className="text-lg font-semibold text-gray-900">{resourceData.virtualMachines.activeVMs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total VMs</span>
                    <span className="text-lg font-semibold text-gray-900">{resourceData.virtualMachines.totalVMs}</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={resourceData.virtualMachines.href}>Manage VMs</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Block Storage Card */}
            <Card className="bg-white rounded-lg border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${resourceData.blockStorage.color}`}>
                    <resourceData.blockStorage.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-semibold">Block Storage</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Allocated</span>
                    <span className="text-lg font-semibold text-gray-900">{resourceData.blockStorage.totalAllocatedSize} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Volume Count</span>
                    <span className="text-lg font-semibold text-gray-900">{resourceData.blockStorage.volumeCount}</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={resourceData.blockStorage.href}>Manage Block Storage</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Object Storage Card */}
            <Card className="bg-white rounded-lg border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${resourceData.objectStorage.color}`}>
                    <resourceData.objectStorage.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-semibold">Object Storage</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Storage Used</span>
                    <span className="text-lg font-semibold text-gray-900">{resourceData.objectStorage.storageUsed} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Buckets</span>
                    <span className="text-lg font-semibold text-gray-900">{resourceData.objectStorage.totalBuckets}</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={resourceData.objectStorage.href}>Manage Object Storage</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Pods Card */}
            <Card className="bg-white rounded-lg border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${resourceData.aiPods.color}`}>
                    <resourceData.aiPods.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-semibold">AI Pods</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Pods</span>
                    <span className="text-lg font-semibold text-gray-900">{resourceData.aiPods.activePods}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Pods</span>
                    <span className="text-lg font-semibold text-gray-900">{resourceData.aiPods.totalPods}</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={resourceData.aiPods.href}>Manage AI Pods</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Services Available</h2>
      
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
                    <div key={item.name} className="space-y-1">
                      <Link href={item.href} className="block">
                        <p className="font-medium text-sm hover:underline">{item.name}</p>
                      </Link>
                      <p className="text-xs text-gray-600">{item.description}</p>
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Documentation Hub</h2>
      
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
                    <div key={item.name}>
                      <Link href={item.href} className="block">
                        <p className="text-sm font-medium hover:underline">{item.name}</p>
                      </Link>
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
            <svg width="32" height="32" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.17578 47.3495C2.17578 47.4612 2.23535 47.5644 2.33204 47.6202L42.49 70.8044C42.5867 70.8603 42.7058 70.8603 42.8025 70.8044L77.8653 50.561C77.962 50.5052 78.0216 50.402 78.0216 50.2904V44.654C78.0216 44.5423 77.962 44.4392 77.8653 44.3833L37.7074 21.1991C37.6107 21.1433 37.4916 21.1433 37.3949 21.1991L2.33203 41.4425C2.23534 41.4983 2.17578 41.6015 2.17578 41.7131V47.3495Z" fill="#48B54E" stroke="black" strokeWidth="0.625" strokeMiterlimit="1.5" strokeLinecap="square" strokeLinejoin="round"></path>
              <path d="M77.9465 44.7948C78.096 44.7085 78.096 44.5686 77.9465 44.4823L37.8253 21.3184C37.6759 21.2321 37.4335 21.2321 37.2841 21.3184L2.37984 41.4704C2.23037 41.5567 2.23037 41.6966 2.37984 41.7829L42.501 64.9468C42.6505 65.0331 42.8928 65.0331 43.0423 64.9468L77.9465 44.7948Z" fill="white" stroke="black" strokeWidth="0.625" strokeMiterlimit="1.5" strokeLinecap="square" strokeLinejoin="round"></path>
              <mask id="mask0_4798_11627" maskUnits="userSpaceOnUse" x="2" y="21" width="76" height="44">
                <path d="M37.4491 21.3386L2.41016 41.5684L42.8697 64.9277L77.9086 44.6979L37.4491 21.3386Z" fill="white"></path>
              </mask>
              <g mask="url(#mask0_4798_11627)">
                <path d="M37.4642 21.476L2.64453 41.5791L42.8508 64.7922L77.6705 44.6891L37.4642 21.476Z" fill="#F4F4F4"></path>
                <path d="M18.4381 32.4607L2.64453 41.5791L9.62702 45.6104L25.4206 36.492L18.4381 32.4607Z" fill="#F4F4F4"></path>
                <path d="M42.9478 64.7318L38.9151 62.4035L49.5387 50.4141L58.6427 55.6703L42.9478 64.7318Z" fill="#F4F4F4"></path>
                <path d="M60.4693 54.6213L56.511 52.336L47.7054 38.4764L77.2326 44.943L60.4693 54.6213Z" fill="#F4F4F4"></path>
                <path d="M36.926 21.7836L37.4622 21.474L73.9836 42.5597L46.0883 36.5414L36.926 21.7836Z" fill="#F4F4F4"></path>
                <path d="M38.1645 27.5132L34.708 22.0831L36.8649 20.8379L46.6439 36.1879L46.6684 36.2262L46.7349 36.2403L74.7576 42.1744L78.8663 44.5466L48.2316 38.2612L47.924 38.1981L48.0366 38.375L57.2103 52.7765L57.2219 52.7948L57.2457 52.8085L61.2724 55.1333L59.3914 56.2193L50.6824 51.1911L50.5308 51.1036L50.4366 51.2148L39.7529 63.8354L37.5248 62.5489L48.2547 49.8738L48.3026 49.8171L48.2254 49.7725L40.5453 45.3384L40.437 45.2759L40.3288 45.3384L24.022 54.7531L21.4304 53.2569L37.7372 43.8422L37.8455 43.7797L37.7372 43.7172L27.0525 37.5484L26.9443 37.4859L26.836 37.5484L10.5293 46.9631L8.38701 45.7263L24.6938 36.3116L24.802 36.2491L24.6938 36.1866L17.487 32.0257L17.5125 32.011L18.777 31.2809L21.857 29.5027L38.0509 27.6304L38.2262 27.6101L38.1645 27.5132ZM47.3834 42.1315L47.4526 42.0915L47.4188 42.0385L39.2819 29.2675L39.2367 29.1965L39.1082 29.2113L20.447 31.3685L20.1666 31.4009L20.3688 31.5176L42.9597 44.5605L43.068 44.623L43.1762 44.5605L47.3834 42.1315ZM45.4098 45.85L45.3015 45.9125L45.4098 45.975L52.0578 49.8133L52.3098 49.7203L48.7381 44.1059L48.6555 43.9761L48.4861 44.0739L45.4098 45.85Z" fill="#F5F5F5" stroke="black" strokeWidth="0.25"></path>
              </g>
              <path fillRule="evenodd" clipRule="evenodd" d="M42.8095 45.5149L37.1929 42.8867L29.6499 37.181C27.9342 35.7157 26.8867 33.0321 26.8867 29.4195C26.8867 21.835 31.5101 13.0104 37.1929 9.72656C39.2637 8.53221 41.1902 8.23363 42.8095 8.70258C44.0857 9.07341 48.3718 11.1912 49.3651 11.7119C51.6527 12.9117 53.1155 15.8819 53.1155 20.1464C53.1155 23.759 52.0682 27.6521 50.3525 31.0949L42.8095 45.5149Z" fill="#48B54E" stroke="black" strokeWidth="0.625" strokeMiterlimit="1.5" strokeLinecap="square" strokeLinejoin="round"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M35.2553 39.81C33.5401 38.3465 32.4922 35.6629 32.4922 32.0504C32.4922 24.4659 37.1113 15.6418 42.7991 12.3579C48.4869 9.07405 53.106 12.5646 53.106 20.149C53.106 23.7616 52.0581 27.6552 50.3481 31.0962L42.7991 45.5179L35.2553 39.81Z" fill="white" stroke="black" strokeWidth="0.625" strokeMiterlimit="1.5" strokeLinecap="square" strokeLinejoin="round"></path>
              <path d="M42.8083 31.0605C45.0345 29.7752 46.8391 26.3271 46.8391 23.3588C46.8391 20.3905 45.0345 19.0261 42.8083 20.3114C40.5821 21.5967 38.7773 25.0449 38.7773 28.0132C38.7773 30.9815 40.5821 32.3458 42.8083 31.0605Z" fill="white" stroke="black" strokeWidth="0.625" strokeMiterlimit="1.5" strokeLinecap="square" strokeLinejoin="round"></path>
            </svg>
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
      <div className="space-y-4 flex flex-col min-h-screen pb-12">
        <AccessBanner onCompleteProfile={handleVerifyIdentity} />

        {/* Welcome Message */}
        <div className="mb-2">
          <h2 className="text-3xl font-bold text-gray-900 text-left mb-1">Hey Rakesh,</h2>
          <div className="text-lg text-gray-700 font-normal text-left mb-1">
            {isNewUser ? "Get Started with Krutrim Cloud" : "Welcome back to Krutrim Cloud"}
          </div>
        </div>

        {/* Resource Cards */}
        <ResourceCards isNewUser={isNewUser} />

        {/* Services Available */}
        <div className="pt-2">
          <ServicesAvailable />
        </div>

        {/* Documentation Hub */}
        <div className="pt-2">
          <DocumentationHub />
        </div>

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
