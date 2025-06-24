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
import { ArrowDownTrayIcon, CalendarIcon, ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import type { DateRange } from "react-day-picker"
import type { Column } from "@/components/ui/shadcn-data-table"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

// Data for Summary section
const pieData = [
  { name: "Compute", value: 1291.5, color: "#6366f1" },
  { name: "Storage", value: 3.168, color: "#f59e42" },
  { name: "Network", value: 0.008, color: "#10b981" },
  { name: "Model Catalogue", value: 29.805, color: "#f43f5e" },
  { name: "Finetuning", value: 20.75, color: "#a21caf" },
  { name: "Deployment", value: 2972.5, color: "#eab308" },
  { name: "Evaluation", value: 14.608, color: "#0ea5e9" },
  { name: "Bhashik", value: 17900, color: "#f87171" },
  { name: "DIS", value: 43810, color: "#22d3ee" },
  { name: "Industrial Solutions", value: 1051.32, color: "#a3e635" },
]

const serviceSummary = [
  { name: "Compute", credits: 1291.5 },
  { name: "Storage", credits: 3.168 },
  { name: "Network", credits: 0.008 },
  { name: "Model Catalogue", credits: 29.805 },
  { name: "Finetuning", credits: 20.75 },
  { name: "Deployment", credits: 2972.5 },
  { name: "Evaluation", credits: 14.608 },
  { name: "Bhashik", credits: 17900 },
  { name: "DIS", credits: 43810 },
  { name: "Industrial Solutions", credits: 1051.32 },
  { name: "Total", credits: 67093.659 },
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
  { id: "studio", label: "AI Studio" },
  { id: "solutions", label: "AI Solutions" },
]

// Add default date range
const defaultDateRange: DateRange = {
  from: new Date(new Date().setDate(new Date().getDate() - 30)), // 30 days ago
  to: new Date() // today
}

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
  const [date, setDate] = useState<DateRange | undefined>(defaultDateRange)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalResource, setModalResource] = useState<any>(null)
  
  // State for nested tabs
  const [coreTab, setCoreTab] = useState("compute")
  const [studioTab, setStudioTab] = useState("model")
  const [solutionsTab, setSolutionsTab] = useState("bhashik")

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  useEffect(() => {
    setActiveTab(getActiveTabFromPath())
  }, [pathname])

  // Summary Section Component
  const SummarySection = () => {
    const totalAvailableCredits = 69187.32; // Updated to show desired remaining credits
    const totalUsedCredits = 67093.659;
    const remainingCredits = totalAvailableCredits - totalUsedCredits;
    
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
        label: "Total Credits used",
        sortable: true,
        searchable: true,
        render: (value: number) => <div className="text-sm">₹{value.toLocaleString(undefined, { minimumFractionDigits: 3 })}</div>,
      },
    ]
    return (
          <Card>
            <CardHeader>
          <h3 className="text-xl font-semibold leading-none tracking-tight">Billing Overview by Service</h3>
            </CardHeader>
            <CardContent>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
              {/* Credits Information - Enhanced Cards Layout */}
              <div className="flex flex-col md:flex-row items-center gap-8 flex-1 justify-center">
                {/* Total Credits Used */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6 w-full md:w-auto min-w-[280px] text-center hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">↗</span>
                    </div>
                    <div className="text-lg font-semibold text-black">Total Credits Used</div>
                  </div>
                  <div className="text-3xl font-bold text-black mb-2">₹{totalUsedCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-sm text-black bg-red-100 rounded-full px-3 py-1 inline-block">
                    {((totalUsedCredits / (totalUsedCredits + remainingCredits)) * 100).toFixed(1)}% of total credits
                  </div>
                </div>
                
                {/* Remaining Balance */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 w-full md:w-auto min-w-[280px] text-center hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">₹</span>
                    </div>
                    <div className="text-lg font-semibold text-black">Remaining Balance</div>
                  </div>
                  <div className="text-3xl font-bold text-black mb-2">
                    ₹{remainingCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-black bg-green-100 rounded-full px-3 py-1 inline-block">
                    Available for use
                  </div>
                </div>
              </div>
              {/* Divider */}
              <div className="hidden md:block h-32 border-l border-gray-200 mx-6" />
              {/* Distribution Pie Chart with legend on the right, including totals */}
              <div className="flex flex-1 justify-start items-center pl-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-semibold mb-2">Distribution</div>
                    <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                          label={false}
                        stroke="none"
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                        <Tooltip formatter={(value: number, name: string) => [`₹${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  </div>
                  {/* Legend to the right of the chart, with two columns */}
                  <div className="ml-6 flex flex-col items-start gap-2 mt-0">
                    {pieData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-6 min-w-[200px]">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }}></span>
                        <span className="text-xs font-medium text-muted-foreground w-36 whitespace-nowrap">{entry.name}</span>
                        <span className="text-xs font-semibold text-gray-900 text-right w-20">₹{entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </div>
          </CardContent>
        </Card>
    )
  }

  // Core Infrastructure Section Component
  const CoreInfrastructureSection = () => {
    const coreTabs = [
      { id: "compute", label: "Compute" },
      { id: "storage", label: "Storage" },
      { id: "network", label: "Network" },
    ];

    // Data for each tab (updated to match VPC structure)
    const computeData = [
      { name: "Machine1", type: "GPU VM", flavor: "A100-NVLINK-1x", time: "10 hrs 15 mins", rate: "₹105 per hour", credits: 1076.25 },
      { name: "Machine2", type: "CPU VM", flavor: "CPU-2x-8GB", time: "10 hrs 15 mins", rate: "₹6.00 per hour", credits: 61.50 },
      { name: "Machine3", type: "AI Pods", flavor: "A100-NVLINK-Tiny", time: "10 hrs 15 mins", rate: "₹15 per hour", credits: 153.75 },
    ];
    const computeTotal = 1291.50;

    const storageData = [
      { name: "Test 1", type: "Volume disk in Pods", time: "10 hrs 15mins", size: "10 GB", rate: "₹ 0.0058/GB/Hr", credits: 0.5945 },
      { name: "Test 2", type: "Container disk in Pods", time: "10 hrs 15mins", size: "10 GB", rate: "₹ 0.0058/GB/Hr", credits: 0.5945 },
      { name: "Test 3", type: "Object Storage", time: "10 hrs 15mins", size: "10 GB", rate: "₹1.61/GB/Month", credits: 0.2292 },
      { name: "Test 4", type: "Volumes", time: "10 hrs 15mins", size: "10 GB", rate: "₹5.95/GB/Month", credits: 0.8470 },
      { name: "Test 5", type: "Snapshot", time: "10 hrs 15mins", size: "10 GB", rate: "₹4.25/GB/Month", credits: 0.6050 },
      { name: "Test 6", type: "Backup", time: "10 hrs 15mins", size: "10 GB", rate: "₹2.09/GB/Month", credits: 0.2975 },
    ];
    const storageTotal = 3.168;

    const networkData = [
      { name: "VPC_1", type: "VPC", time: "10 hrs", rate: "₹0.28 /VPC/Month", credits: 0.004 },
      { name: "192.1.1.1", type: "IP Address", time: "10 hrs", rate: "₹0.28 /IP Address/Month", credits: 0.004 },
    ];
    const networkTotal = 0.008;

    // Render table for each tab
    const renderTable = () => {
      if (coreTab === "compute") {
        return (
          <div className="rounded-md border mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md">Machine name</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Type of service</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Flavour</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Total used time</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Rate</th>
                  <th className="px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md">Total credits used</th>
                </tr>
              </thead>
              <tbody>
                {computeData.map((row, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-gray-50/40">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.type}</td>
                    <td className="px-3 py-2">{row.flavor}</td>
                    <td className="px-3 py-2">{row.time}</td>
                    <td className="px-3 py-2">{row.rate}</td>
                    <td className="px-3 py-2 text-right">₹{row.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="rounded-bl-md"></td><td></td><td></td><td></td><td></td>
                  <td className="px-3 py-2 text-right align-middle font-bold rounded-br-md">Total&nbsp;&nbsp;&nbsp;₹{computeTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (coreTab === "storage") {
        return (
          <div className="rounded-md border mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md">Name</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Storage Type</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Total used time</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Average Size</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Rate</th>
                  <th className="px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md">Total credits used</th>
                </tr>
              </thead>
              <tbody>
                {storageData.map((row, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-gray-50/40">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.type}</td>
                    <td className="px-3 py-2">{row.time}</td>
                    <td className="px-3 py-2">{row.size}</td>
                    <td className="px-3 py-2">{row.rate}</td>
                    <td className="px-3 py-2 text-right">₹{row.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="rounded-bl-md"></td><td></td><td></td><td></td><td></td>
                  <td className="px-3 py-2 text-right align-middle font-bold rounded-br-md">Total&nbsp;&nbsp;&nbsp;₹{storageTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (coreTab === "network") {
        return (
          <div className="rounded-md border mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md">Name</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Service type</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Total used time</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Rate</th>
                  <th className="px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md">Total credits used</th>
                </tr>
              </thead>
              <tbody>
                {networkData.map((row, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-gray-50/40">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.type}</td>
                    <td className="px-3 py-2">{row.time}</td>
                    <td className="px-3 py-2">{row.rate}</td>
                    <td className="px-3 py-2 text-right">₹{row.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="rounded-bl-md"></td><td></td><td></td><td></td>
                  <td className="px-3 py-2 text-right align-middle font-bold rounded-br-md">Total&nbsp;&nbsp;&nbsp;₹{networkTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      return null;
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Infrastructure Costs</CardTitle>
        </CardHeader>
        <CardContent>
            <VercelTabs
              tabs={coreTabs}
              activeTab={coreTab}
              onTabChange={setCoreTab}
              size="md"
              className="mb-4"
            />
          {renderTable()}
        </CardContent>
      </Card>
    );
  }

  // Studio Section Component
  const StudioSection = () => {
    const studioTabs = [
      { id: "model", label: "Model Catalogue" },
      { id: "finetune", label: "Fine Tuning" },
      { id: "deploy", label: "Deployment" },
      { id: "eval", label: "Evaluation" },
    ];

    // Data for each tab (updated to match VPC structure)
    const modelData = [
      { name: "Phi 4 Reasoning plus", inputOutput: "Input", unit: "Token", usedUnit: "1000", rate: "₹5.00 per 1M token", credits: 0.01 },
      { name: "Phi 4 Reasoning plus", inputOutput: "Output", unit: "Token", usedUnit: "1000000", rate: "₹29.00 per 1M token", credits: 29.00 },
      { name: "Speecht5-TTS", inputOutput: "Output", unit: "Minute of output audio", usedUnit: "10", rate: "₹0.04 per minute of output audio", credits: 0.40 },
      { name: "Whisper-large-v3", inputOutput: "Input", unit: "Minute of input audio", usedUnit: "10", rate: "₹0.04 per minute of input audio", credits: 0.40 },
    ];
    const modelTotal = 29.81;

    const finetuneData = [
      { jobName: "Job 1", model: "Llama-3-70B", unit: "Token", usedUnit: "100000", rate: "₹207.50 per 1M Token", credits: 20.75 },
    ];
    const finetuneTotal = 20.75;

    const deployData = [
      { name: "Model 1", flavour: "MaaS-H100-80GB-1-Node", time: "10 Hrs 15 mins", rate: "₹290.00 per hour", credits: 2972.50 },
    ];
    const deployTotal = 2972.50;

    const evalData = [
      { evaluationName: "Main", model: "Llama 3.1 70B", inputOutput: "Input", unit: "Token", usedUnit: "100000", rate: "₹73.04 per 1 M Token", credits: 7.304 },
      { evaluationName: "Main", model: "Llama 3.1 70B", inputOutput: "Output", unit: "Token", usedUnit: "100000", rate: "₹73.04 per 1 M Token", credits: 7.304 },
    ];
    const evalTotal = 14.61;

    // Render table for each tab
    const renderTable = () => {
      if (studioTab === "model") {
        return (
          <div className="rounded-md border mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md">Model</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Input/Output</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Unit</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Used Unit</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Rate</th>
                  <th className="px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md">Total Credit used</th>
                </tr>
              </thead>
              <tbody>
                {modelData.map((row, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-gray-50/40">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.inputOutput}</td>
                    <td className="px-3 py-2">{row.unit}</td>
                    <td className="px-3 py-2">{row.usedUnit}</td>
                    <td className="px-3 py-2">{row.rate}</td>
                    <td className="px-3 py-2 text-right">₹{row.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="rounded-bl-md"></td><td></td><td></td><td></td><td></td>
                  <td className="px-3 py-2 text-right align-middle font-bold rounded-br-md">Total&nbsp;&nbsp;&nbsp;₹{modelTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (studioTab === "finetune") {
        return (
          <div className="rounded-md border mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md">Job name</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Model</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Unit</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Used Unit</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Rate</th>
                  <th className="px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md">Total Credit used</th>
                </tr>
              </thead>
              <tbody>
                {finetuneData.map((row, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-gray-50/40">
                    <td className="px-3 py-2">{row.jobName}</td>
                    <td className="px-3 py-2">{row.model}</td>
                    <td className="px-3 py-2">{row.unit}</td>
                    <td className="px-3 py-2">{row.usedUnit}</td>
                    <td className="px-3 py-2">{row.rate}</td>
                    <td className="px-3 py-2 text-right">₹{row.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="rounded-bl-md"></td><td></td><td></td><td></td><td></td>
                  <td className="px-3 py-2 text-right align-middle font-bold rounded-br-md">Total&nbsp;&nbsp;&nbsp;₹{finetuneTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (studioTab === "deploy") {
        return (
          <div className="rounded-md border mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md">Name</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Flavour</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Total used time</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Rate</th>
                  <th className="px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md">Total credits used</th>
                </tr>
              </thead>
              <tbody>
                {deployData.map((row, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-gray-50/40">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.flavour}</td>
                    <td className="px-3 py-2">{row.time}</td>
                    <td className="px-3 py-2">{row.rate}</td>
                    <td className="px-3 py-2 text-right">₹{row.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="rounded-bl-md"></td><td></td><td></td><td></td>
                  <td className="px-3 py-2 text-right align-middle font-bold rounded-br-md">Total&nbsp;&nbsp;&nbsp;₹{deployTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (studioTab === "eval") {
        return (
          <div className="rounded-md border mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md">Evaluation Name</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Model</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Input/Output</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Unit</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Used Unit</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Rate</th>
                  <th className="px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md">Total Credit used</th>
                </tr>
              </thead>
              <tbody>
                {evalData.map((row, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-gray-50/40">
                    <td className="px-3 py-2">{row.evaluationName}</td>
                    <td className="px-3 py-2">{row.model}</td>
                    <td className="px-3 py-2">{row.inputOutput}</td>
                    <td className="px-3 py-2">{row.unit}</td>
                    <td className="px-3 py-2">{row.usedUnit}</td>
                    <td className="px-3 py-2">{row.rate}</td>
                    <td className="px-3 py-2 text-right">{row.credits.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="rounded-bl-md"></td><td></td><td></td><td></td><td></td><td></td>
                  <td className="px-3 py-2 text-right align-middle font-bold rounded-br-md">Total&nbsp;&nbsp;&nbsp;₹{evalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      return null;
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Model Development Charges</CardTitle>
        </CardHeader>
        <CardContent>
            <VercelTabs
              tabs={studioTabs}
              activeTab={studioTab}
              onTabChange={setStudioTab}
              size="md"
            className="mb-4"
          />
          {renderTable()}
        </CardContent>
      </Card>
    );
  }

  // AI Solutions Section Component
  const SolutionsSection = () => {
    const solutionsTabs = [
      { id: "bhashik", label: "Bhashik" },
      { id: "dis", label: "DIS" },
      { id: "industrial", label: "Industrial Solution" },
    ];

    // Data for each tab (updated to match VPC structure)
    const bhashikData = [
      { service: "Text to Speech", unit: "Per 1M input character", unitsUsed: "10", rate: "₹266 Per 1M input character", credits: 2660.00 },
      { service: "Text to Speech Translate", unit: "Per 1M input character", unitsUsed: "10", rate: "₹1262 Per 1M input character", credits: 12620.00 },
      { service: "Speech to text", unit: "per hour of input audio", unitsUsed: "10", rate: "₹24 per hour of input audio", credits: 240.00 },
      { service: "Speech to text long form", unit: "per hour of input audio", unitsUsed: "10", rate: "₹24 per hour of input audio", credits: 240.00 },
      { service: "Speech to text translate", unit: "per hour of input audio", unitsUsed: "10", rate: "₹24 per hour of input audio", credits: 240.00 },
      { service: "Speech to text translate long form", unit: "per hour of input audio", unitsUsed: "10", rate: "₹24 per hour of input audio", credits: 240.00 },
      { service: "Speech to speech translate", unit: "per hour of input audio", unitsUsed: "10", rate: "₹166 per hour of input audio", credits: 1660.00 },
    ];
    const bhashikTotal = 17900.00;

    const disData = [
      { service: "DocIntelligenceText Extraction- document", unit: "per 1000 pages", unitsUsed: "10", rate: "₹100 per 1000 pages", credits: 1000.00 },
      { service: "DocIntelligenceText extraction- OCR", unit: "per 1000 pages", unitsUsed: "10", rate: "₹398 per 1000 pages", credits: 3980.00 },
      { service: "DocIntelligenceExtract information- document", unit: "per 1000 pages", unitsUsed: "10", rate: "₹1726 per 1000 pages", credits: 17260.00 },
      { service: "DocIntelligenceExtract information- OCR", unit: "per 1000 pages", unitsUsed: "10", rate: "₹1726 per 1000 pages", credits: 17260.00 },
      { service: "DocIntelligenceDocument Summarisation- document", unit: "per 1000 pages", unitsUsed: "10", rate: "₹166 per 1000 pages", credits: 1660.00 },
      { service: "DocIntelligenceDocument Summarisation- OCR", unit: "per 1000 pages", unitsUsed: "10", rate: "₹531 per 1000 pages", credits: 5310.00 },
      { service: "DocIntelligencePII Masking- document", unit: "per 1000 pages", unitsUsed: "10", rate: "₹232 per 1000 pages", credits: 2320.00 },
    ];
    const disTotal = 43810.00;

    const industrialData = [
      { notebookName: "Test 1", podStorage: "Pod", flavour: "A100-NVLINK-Standard-1x", rate: "₹ 105 per hour", totalUsedUnit: "1", totalUsedTime: "10 hrs", credits: 1050.00 },
      { notebookName: "Test 1", podStorage: "Storage", flavour: "Container Disk", rate: "₹ 0.006 Per GB Per Hour", totalUsedUnit: "10 GB", totalUsedTime: "10 hrs", credits: 0.60 },
      { notebookName: "Test 1", podStorage: "Storage", flavour: "Volume Disk", rate: "₹ 0.006 Per GB Per Hour", totalUsedUnit: "10 GB", totalUsedTime: "12 hrs", credits: 0.72 },
    ];
    const industrialTotal = 1051.32;

    // Render table for each tab
    const renderTable = () => {
      if (solutionsTab === "bhashik") {
        return (
          <div className="rounded-md border mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md">Service</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Unit</th>
                  <th className="px-3 py-2 text-center text-muted-foreground font-medium">Units used</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Rate</th>
                  <th className="px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md">Total credits used</th>
                </tr>
              </thead>
              <tbody>
                {bhashikData.map((row, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-gray-50/40">
                    <td className="px-3 py-2">{row.service}</td>
                    <td className="px-3 py-2">{row.unit}</td>
                    <td className="px-3 py-2 text-center">{row.unitsUsed}</td>
                    <td className="px-3 py-2">{row.rate}</td>
                    <td className="px-3 py-2 text-right">₹{row.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="rounded-bl-md"></td><td></td><td></td><td></td>
                  <td className="px-3 py-2 text-right align-middle font-bold rounded-br-md">Total&nbsp;&nbsp;&nbsp;₹{bhashikTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (solutionsTab === "dis") {
        return (
          <div className="rounded-md border mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md">Service</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Unit</th>
                  <th className="px-3 py-2 text-center text-muted-foreground font-medium">Units used</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Rate</th>
                  <th className="px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md">Total credits used</th>
                </tr>
              </thead>
              <tbody>
                {disData.map((row, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-gray-50/40">
                    <td className="px-3 py-2">{row.service}</td>
                    <td className="px-3 py-2">{row.unit}</td>
                    <td className="px-3 py-2 text-center">{row.unitsUsed}</td>
                    <td className="px-3 py-2">{row.rate}</td>
                    <td className="px-3 py-2 text-right">₹{row.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="rounded-bl-md"></td><td></td><td></td><td></td>
                  <td className="px-3 py-2 text-right align-middle font-bold rounded-br-md">Total&nbsp;&nbsp;&nbsp;₹{disTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      if (solutionsTab === "industrial") {
        return (
          <div className="rounded-md border mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium rounded-tl-md">Notebook name</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Pod/Storage</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Flavour</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Rate</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Total used unit</th>
                  <th className="px-3 py-2 text-left text-muted-foreground font-medium">Total used time</th>
                  <th className="px-3 py-2 text-right text-muted-foreground font-medium rounded-tr-md">Total credits used</th>
                </tr>
              </thead>
              <tbody>
                {industrialData.map((row, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-gray-50/40">
                    <td className="px-3 py-2">{row.notebookName}</td>
                    <td className="px-3 py-2">{row.podStorage}</td>
                    <td className="px-3 py-2">{row.flavour}</td>
                    <td className="px-3 py-2">{row.rate}</td>
                    <td className="px-3 py-2">{row.totalUsedUnit}</td>
                    <td className="px-3 py-2">{row.totalUsedTime}</td>
                    <td className="px-3 py-2 text-right">₹{row.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="rounded-bl-md"></td><td></td><td></td><td></td><td></td><td></td>
                  <td className="px-3 py-2 text-right align-middle font-bold rounded-br-md">Total&nbsp;&nbsp;&nbsp;₹{industrialTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      return null;
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Deployed AI Charges</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
            <VercelTabs
              tabs={solutionsTabs}
              activeTab={solutionsTab}
              onTabChange={setSolutionsTab}
              size="md"
            className="mb-4"
          />
          {renderTable()}
        </CardContent>
      </Card>
    );
  }

  // Header actions for billing
  const headerActions = (
    <>
      <Button variant="outline">
        <ArrowDownTrayIcon className="mr-1 h-4 w-4" />
        Export
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              "Pick a date range"
            )}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Link href="/billing/add-credits">
        <Button variant="default">Add Credits</Button>
      </Link>
    </>
  )

  return (
    <PageLayout 
      title="Usage Metrics" 
      description="Track resource usage and billing information"
      headerActions={headerActions}
    >
      <div className="space-y-6">
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
