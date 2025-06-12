"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { VercelTabs } from "@/components/ui/vercel-tabs"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { ActionMenu } from "@/components/action-menu"
import { StatusBadge } from "@/components/status-badge"
import { UsageActionBar } from "@/components/billing/usage-action-bar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Filter } from "lucide-react"
import Link from "next/link"
import type { DateRange } from "react-day-picker"
import type { Column } from "@/components/ui/shadcn-data-table"

// Data for Summary section
const pieData = [
  { name: "Compute", value: 400, color: "#6366f1" },
  { name: "Storage", value: 300, color: "#f59e42" },
  { name: "Networking", value: 300, color: "#10b981" },
  { name: "AI Studio", value: 200, color: "#f43f5e" },
]

const serviceSummary = [
  { name: "Compute", credits: 400, details: "View Details" },
  { name: "Storage", credits: 300, details: "View Details" },
  { name: "Networking", credits: 300, details: "View Details" },
  { name: "AI Studio", credits: 200, details: "View Details" },
]

// Data for Core Infrastructure
const mockCompute = [
  { id: 1, name: "Production-VM-01", type: "VM", status: "Running", credits: 450 },
  { id: 2, name: "Staging-VM-02", type: "VM", status: "Running", credits: 320 },
  { id: 3, name: "Dev-VM-03", type: "VM", status: "Stopped", credits: 180 },
  { id: 4, name: "GPU-VM-01", type: "GPU VM", status: "Running", credits: 750 },
  { id: 5, name: "K8s-Node-01", type: "Kubernetes", status: "Running", credits: 280 },
]
const mockStorage = [
  { id: 1, name: "Prod-Volume-01", type: "SSD", status: "Attached", credits: 120 },
  { id: 2, name: "Backup-Volume-01", type: "HDD", status: "Available", credits: 80 },
  { id: 3, name: "Data-Volume-01", type: "SSD", status: "Attached", credits: 150 },
  { id: 4, name: "Cache-Volume-01", type: "NVMe", status: "Attached", credits: 200 },
  { id: 5, name: "Archive-Volume-01", type: "HDD", status: "Available", credits: 60 },
]
const mockNetwork = [
  { id: 1, name: "Prod-VPC-01", type: "VPC", status: "Active", credits: 90 },
  { id: 2, name: "Prod-Subnet-01", type: "Subnet", status: "Active", credits: 45 },
  { id: 3, name: "Load-Balancer-01", type: "Load Balancer", status: "Active", credits: 120 },
  { id: 4, name: "Security-Group-01", type: "Security Group", status: "Active", credits: 30 },
  { id: 5, name: "VPN-Gateway-01", type: "VPN", status: "Active", credits: 75 },
]
const allInfra = [...mockCompute, ...mockStorage, ...mockNetwork]

// Data for Studio
const mockModelCatalog = [
  { id: 1, name: "GPT-4-32K", status: "Active", credits: 250 },
  { id: 2, name: "Claude-3-Opus", status: "Active", credits: 300 },
  { id: 3, name: "Llama-2-70B", status: "Active", credits: 180 },
  { id: 4, name: "Stable-Diffusion-XL", status: "Active", credits: 150 },
  { id: 5, name: "BERT-Large", status: "Completed", credits: 80 },
]
const mockFinetune = [
  { id: 1, name: "Custom-GPT-Model", status: "Training", credits: 400 },
  { id: 2, name: "Domain-Specific-BERT", status: "Completed", credits: 220 },
  { id: 3, name: "Image-Classifier-V2", status: "Failed", credits: 150 },
]
const mockDeploy = [
  { id: 1, name: "Production-API-v1", status: "Running", credits: 180 },
  { id: 2, name: "Staging-Model-Deploy", status: "Running", credits: 90 },
  { id: 3, name: "Dev-Environment", status: "Stopped", credits: 45 },
]
const mockEval = [
  { id: 1, name: "Model-Performance-Test", status: "Completed", credits: 75 },
  { id: 2, name: "A-B-Testing-Suite", status: "Running", credits: 120 },
  { id: 3, name: "Accuracy-Benchmark", status: "Pending", credits: 60 },
]
const allStudio = [...mockModelCatalog, ...mockFinetune, ...mockDeploy, ...mockEval]

// Data for Solutions
const mockBasic = [
  { id: 1, name: "Basic-AI-Service-01", status: "Active", credits: 120 },
  { id: 2, name: "Basic-NLP-Service-01", status: "Active", credits: 90 },
  { id: 3, name: "Basic-Vision-Service-01", status: "Active", credits: 110 },
  { id: 4, name: "Basic-Speech-Service-01", status: "Completed", credits: 70 },
  { id: 5, name: "Basic-Embedding-Service-01", status: "Active", credits: 85 },
]
const mockDocInt = [
  { id: 1, name: "Invoice-Processing-AI", status: "Active", credits: 200 },
  { id: 2, name: "Contract-Analysis-Tool", status: "Active", credits: 180 },
  { id: 3, name: "Document-Classification", status: "Paused", credits: 90 },
]
const mockIndustrial = [
  { id: 1, name: "Manufacturing-Optimizer", status: "Running", credits: 350 },
  { id: 2, name: "Supply-Chain-AI", status: "Active", credits: 280 },
  { id: 3, name: "Quality-Control-Vision", status: "Active", credits: 150 },
]
const allSolutions = [...mockBasic, ...mockDocInt, ...mockIndustrial]

function getTotalCredits(data: Array<{ credits?: number }>): number {
  return data.reduce((sum: number, row: { credits?: number }) => sum + (row.credits || 0), 0)
}

function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="#22223b"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={13}
      fontWeight={600}
    >
      {percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
    </text>
  )
}

const tabs = [
  { id: "summary", label: "Summary" },
  { id: "core", label: "Core Infrastructure" },
  { id: "studio", label: "Studio" },
  { id: "solutions", label: "Solutions" },
]

export default function UsageMetricsPage() {
  const pathname = usePathname()
  
  // State for main tabs
  const getActiveTabFromPath = () => {
    if (pathname.includes('/summary')) return "summary"
    if (pathname.includes('/core')) return "core"
    if (pathname.includes('/studio')) return "studio"
    if (pathname.includes('/solutions')) return "solutions"
    return "summary"
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath())
  const [date, setDate] = useState<DateRange | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalResource, setModalResource] = useState<any>(null)
  
  // State for nested tabs
  const [coreTab, setCoreTab] = useState("all")
  const [studioTab, setStudioTab] = useState("all")
  const [solutionsTab, setSolutionsTab] = useState("all")

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  useEffect(() => {
    setActiveTab(getActiveTabFromPath())
  }, [pathname])

  // Summary Section Component
  const SummarySection = () => {
    const columns: Column<any>[] = [
      {
        key: "name",
        label: "Service",
        sortable: true,
        searchable: true,
        render: (value: string) => <div className="font-medium text-sm">{value}</div>,
      },
      {
        key: "credits",
        label: "Credits Used",
        sortable: true,
        searchable: true,
        render: (value: number) => <div className="text-sm">{value}</div>,
      },
      {
        key: "actions",
        label: "Action",
        align: "right" as const,
        render: (_: unknown, row: any) => (
          <div className="flex justify-end">
            <ActionMenu
              viewHref="#"
              onEdit={() => { setModalResource(row); setModalOpen(true) }}
              resourceName={row.name}
              resourceType="Resource"
            />
          </div>
        ),
      },
    ]

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Credits Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,200</div>
              <div className="text-muted-foreground">in selected period</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-60">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      labelLine={false}
                      label={renderCustomizedLabel}
                      stroke="none"
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 8, fontSize: 14 }}
                      formatter={(value, name) => [value, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }}></span>
                      <span className="text-sm font-medium text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Service Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ShadcnDataTable
              columns={columns}
              data={serviceSummary}
              searchableColumns={["name"]}
              defaultSort={{ column: "credits", direction: "desc" }}
              pageSize={5}
              enableSearch={true}
              enableColumnVisibility={false}
              enablePagination={false}
              onRefresh={() => window.location.reload()}
              enableAutoRefresh={false}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Core Infrastructure Section Component
  const CoreInfrastructureSection = () => {
    const coreTabs = [
      { id: "all", label: "All Infrastructure" },
      { id: "compute", label: "Compute" },
      { id: "storage", label: "Storage" },
      { id: "network", label: "Network" },
    ]

    const columns: Column<any>[] = [
      {
        key: "name",
        label: "Service",
        sortable: true,
        searchable: true,
        render: (value: string) => <div className="font-medium text-sm">{value}</div>,
      },
      {
        key: "credits",
        label: "Credits Used",
        sortable: true,
        searchable: true,
        render: (value: number) => <div className="text-sm">{value}</div>,
      },
      {
        key: "actions",
        label: "Action",
        align: "right" as const,
        render: (_: unknown, row: any) => (
          <div className="flex justify-end">
            <ActionMenu
              viewHref="#"
              onEdit={() => { setModalResource(row); setModalOpen(true) }}
              resourceName={row.name}
              resourceType="Resource"
            />
          </div>
        ),
      },
    ]

    const getDataForTab = () => {
      switch (coreTab) {
        case "compute": return mockCompute
        case "storage": return mockStorage
        case "network": return mockNetwork
        default: return allInfra
      }
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Core Infrastructure</CardTitle>
          <div className="bg-muted rounded-md px-4 py-2 font-medium text-sm">
            {coreTab === "all" && <>Grand Total Credits Used: {getTotalCredits(allInfra)}</>}
            {coreTab === "compute" && <>Total Compute Credits: {getTotalCredits(mockCompute)}</>}
            {coreTab === "storage" && <>Total Storage Credits: {getTotalCredits(mockStorage)}</>}
            {coreTab === "network" && <>Total Network Credits: {getTotalCredits(mockNetwork)}</>}
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <VercelTabs
              tabs={coreTabs}
              activeTab={coreTab}
              onTabChange={setCoreTab}
              size="md"
              className="mb-4"
            />
            
            <ShadcnDataTable
              columns={[
                ...columns.slice(0, 1),
                ...(coreTab !== "all" ? [{
                  key: "type",
                  label: "Type",
                  sortable: true,
                  render: (value: string) => <div className="text-sm">{value}</div>,
                }, {
                  key: "status",
                  label: "Status",
                  sortable: true,
                  render: (value: string) => <StatusBadge status={value} />,
                }] : []),
                ...columns.slice(1)
              ]}
              data={getDataForTab()}
              searchableColumns={["name"]}
              defaultSort={{ column: "credits", direction: "desc" }}
              pageSize={5}
              enableSearch={true}
              enableColumnVisibility={false}
              enablePagination={false}
            />
            <div className="text-right font-semibold px-2 py-2 text-sm">
              Total: {getTotalCredits(getDataForTab())} credits
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Studio Section Component
  const StudioSection = () => {
    const studioTabs = [
      { id: "all", label: "All Studio" },
      { id: "model", label: "Model Catalog" },
      { id: "finetune", label: "Fine-tuning" },
      { id: "deploy", label: "Deployment" },
      { id: "eval", label: "Evaluation" },
    ]

    const columns: Column<any>[] = [
      {
        key: "name",
        label: "Service",
        sortable: true,
        searchable: true,
        render: (value: string) => <div className="font-medium text-sm">{value}</div>,
      },
      {
        key: "credits",
        label: "Credits Used",
        sortable: true,
        searchable: true,
        render: (value: number) => <div className="text-sm">{value}</div>,
      },
      {
        key: "actions",
        label: "Action",
        align: "right" as const,
        render: (_: unknown, row: any) => (
          <div className="flex justify-end">
            <ActionMenu
              viewHref="#"
              onEdit={() => { setModalResource(row); setModalOpen(true) }}
              resourceName={row.name}
              resourceType="Resource"
            />
          </div>
        ),
      },
    ]

    const getDataForTab = () => {
      switch (studioTab) {
        case "model": return mockModelCatalog
        case "finetune": return mockFinetune
        case "deploy": return mockDeploy
        case "eval": return mockEval
        default: return allStudio
      }
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Studio</CardTitle>
          <div className="bg-muted rounded-md px-4 py-2 font-medium text-sm">
            Grand Total Credits Used: {getTotalCredits(allStudio)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <VercelTabs
              tabs={studioTabs}
              activeTab={studioTab}
              onTabChange={setStudioTab}
              size="md"
            />
          </div>

          <ShadcnDataTable
            columns={[
              ...columns.slice(0, 1),
              ...(studioTab !== "all" ? [{
                key: "status",
                label: "Status",
                sortable: true,
                render: (value: string) => <StatusBadge status={value} />,
              }] : []),
              ...columns.slice(1)
            ]}
            data={getDataForTab()}
            searchableColumns={["name"]}
            defaultSort={{ column: "credits", direction: "desc" }}
            pageSize={5}
            enableSearch={true}
            enableColumnVisibility={false}
            enablePagination={false}
          />
          <div className="text-right font-semibold px-2 py-2 text-sm">
            Total: {getTotalCredits(getDataForTab())} credits
          </div>
        </CardContent>
      </Card>
    )
  }

  // Solutions Section Component
  const SolutionsSection = () => {
    const solutionsTabs = [
      { id: "all", label: "All Solutions" },
      { id: "basic", label: "Basic" },
      { id: "docint", label: "Document Intelligence" },
      { id: "industrial", label: "Industrial Solutions" },
    ]

    const columns: Column<any>[] = [
      {
        key: "name",
        label: "Service",
        sortable: true,
        searchable: true,
        render: (value: string) => <div className="font-medium text-sm">{value}</div>,
      },
      {
        key: "credits",
        label: "Credits Used",
        sortable: true,
        searchable: true,
        render: (value: number) => <div className="text-sm">{value}</div>,
      },
      {
        key: "actions",
        label: "Action",
        align: "right" as const,
        render: (_: unknown, row: any) => (
          <div className="flex justify-end">
            <ActionMenu
              viewHref="#"
              onEdit={() => { setModalResource(row); setModalOpen(true) }}
              resourceName={row.name}
              resourceType="Resource"
            />
          </div>
        ),
      },
    ]

    const getDataForTab = () => {
      switch (solutionsTab) {
        case "basic": return mockBasic
        case "docint": return mockDocInt
        case "industrial": return mockIndustrial
        default: return allSolutions
      }
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Solutions</CardTitle>
          </div>
          <div className="bg-muted rounded-md px-4 py-2 font-medium text-sm ml-2">
            Grand Total Credits Used: {getTotalCredits(allSolutions)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <VercelTabs
              tabs={solutionsTabs}
              activeTab={solutionsTab}
              onTabChange={setSolutionsTab}
              size="md"
            />
            <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />Filter</Button>
          </div>
          
          <ShadcnDataTable
            columns={[
              ...columns.slice(0, 1),
              ...(solutionsTab !== "all" ? [{
                key: "status",
                label: "Status",
                sortable: true,
                render: (value: string) => <StatusBadge status={value} />,
              }] : []),
              ...columns.slice(1)
            ]}
            data={getDataForTab()}
            searchableColumns={["name"]}
            defaultSort={{ column: "credits", direction: "desc" }}
            pageSize={5}
            enableSearch={true}
            enableColumnVisibility={false}
            enablePagination={false}
          />
          <div className="text-right font-semibold px-2 py-2 text-sm">
            Total: {getTotalCredits(getDataForTab())} credits
          </div>
        </CardContent>
      </Card>
    )
  }

  // Header actions for billing
  const headerActions = (
    <>
      <Button variant="secondary">Billing Support</Button>
      <Link href="/billing/add-credits">
        <Button variant="default">Add Credits</Button>
      </Link>
    </>
  )

  return (
    <PageLayout title="Usage Metrics" description="Track resource usage and billing information">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end gap-2">
          {headerActions}
        </div>
        
        {/* Usage Action Bar */}
        <UsageActionBar date={date} setDate={setDate} />
        
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          size="lg"
        />

        {activeTab === "summary" && <SummarySection />}
        {activeTab === "core" && <CoreInfrastructureSection />}
        {activeTab === "studio" && <StudioSection />}
        {activeTab === "solutions" && <SolutionsSection />}

        {/* Modal for resource details */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resource Details</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {modalResource ? (
                <div className="space-y-2">
                  <div><span className="font-semibold">Name:</span> {modalResource.name}</div>
                  {modalResource.type && <div><span className="font-semibold">Type:</span> {modalResource.type}</div>}
                  {modalResource.status && <div><span className="font-semibold">Status:</span> {modalResource.status}</div>}
                  <div><span className="font-semibold">Credits Used:</span> {modalResource.credits}</div>
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  )
}
