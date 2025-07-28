"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { VercelTabs } from "@/components/ui/vercel-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Server, Play, Square, RotateCcw, Settings, Monitor, Activity, Lock, Unlock } from "lucide-react"
import { CpuPricingCards } from "./cpu/components/pricing-cards"
import { GpuPricingCards } from "./gpu/components/pricing-cards"
import { vmInstances } from "@/lib/data"
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table"
import { StatusBadge } from "@/components/status-badge"
import { ActionMenu } from "@/components/action-menu"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"
import { 
  StopMachineModal, 
  RestartMachineModal, 
  RestartErrorModal, 
  TerminateMachineModal, 
  DeleteProtectionErrorModal,
  EnableDeleteProtectionModal,
  DisableDeleteProtectionModal,
  CreateMachineImageModal,
  RebootMachineModal
} from "@/components/modals/vm-management-modals"

// VM Data and interfaces
interface VirtualMachine {
  id: string
  name: string
  status: "running" | "stopped" | "pending" | "error"
  vcpus: number
  memory: string
  storage: string
  os: string
  region: string
  uptime: string
  ip: string
}

const mockVMs: VirtualMachine[] = [
  {
    id: "vm-001",
    name: "Web Server 01",
    status: "running",
    vcpus: 4,
    memory: "16 GB",
    storage: "100 GB SSD",
    os: "Ubuntu 22.04",
    region: "us-west-1",
    uptime: "15 days",
    ip: "192.168.1.10"
  },
  {
    id: "vm-002",
    name: "Database Server",
    status: "running",
    vcpus: 8,
    memory: "32 GB",
    storage: "500 GB SSD",
    os: "CentOS 8",
    region: "us-west-1",
    uptime: "23 days",
    ip: "192.168.1.20"
  },
  {
    id: "vm-003",
    name: "Development Server",
    status: "stopped",
    vcpus: 2,
    memory: "8 GB",
    storage: "50 GB SSD",
    os: "Ubuntu 22.04",
    region: "us-east-1",
    uptime: "0 days",
    ip: "192.168.1.30"
  },
  {
    id: "vm-004",
    name: "Load Balancer",
    status: "pending",
    vcpus: 2,
    memory: "4 GB",
    storage: "20 GB SSD",
    os: "Alpine Linux",
    region: "us-west-1",
    uptime: "0 days",
    ip: "pending"
  }
]

// Tab content components - CPU VM with simple placeholder
function CpuVmSection() {
  return (
    <div className="space-y-6">
      <CpuPricingCards />
    </div>
  )
}

function GpuVmSection() {
  return (
    <div className="space-y-6">
      <GpuPricingCards />
    </div>
  )
}

function GpuBaremetalSection() {
  return (
    <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
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
          <h4 className="text-lg font-medium text-foreground">No GPU Baremetal Servers Found</h4>
          <div className="text-muted-foreground">
            <p className="text-sm">
              Deploy dedicated GPU servers with full hardware access for high-performance computing and AI workloads.{' '}
              <a href="/documentation/gpu-baremetal" className="text-primary hover:underline">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button 
              onClick={() => window.location.href = '/compute/vms/gpu-baremetal/create'}
              size="sm"
            >
              Deploy GPU Server
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MyInstancesSection() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [restartErrorModalOpen, setRestartErrorModalOpen] = useState(false);
  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const [deleteProtectionErrorModalOpen, setDeleteProtectionErrorModalOpen] = useState(false);
  const [enableProtectionModalOpen, setEnableProtectionModalOpen] = useState(false);
  const [disableProtectionModalOpen, setDisableProtectionModalOpen] = useState(false);
  const [createImageModalOpen, setCreateImageModalOpen] = useState(false);
  const [rebootModalOpen, setRebootModalOpen] = useState(false);
  
  // Loading states
  const [isStoppingMachine, setIsStoppingMachine] = useState(false);
  const [isRestartingMachine, setIsRestartingMachine] = useState(false);
  const [isTerminatingMachine, setIsTerminatingMachine] = useState(false);
  const [isTogglingProtection, setIsTogglingProtection] = useState(false);
  const [isCreatingImage, setIsCreatingImage] = useState(false);
  const [isRebootingMachine, setIsRebootingMachine] = useState(false);
  
  const [selectedVM, setSelectedVM] = useState<any>(null);

  // Delete Protection Toggle Handler
  const handleDeleteProtectionToggle = (vm: any) => {
    setSelectedVM(vm);
    if (vm.deleteProtection) {
      setDisableProtectionModalOpen(true);
    } else {
      setEnableProtectionModalOpen(true);
    }
  };

  // Stop Machine Handler
  const handleStopMachine = (vm: any) => {
    setSelectedVM(vm);
    setStopModalOpen(true);
  };

  // Restart Machine Handler
  const handleRestartMachine = (vm: any) => {
    setSelectedVM(vm);
    setRestartModalOpen(true);
  };

  // Terminate Machine Handler  
  const handleTerminateMachine = (vm: any) => {
    setSelectedVM(vm);
    if (vm.deleteProtection) {
      setDeleteProtectionErrorModalOpen(true);
    } else {
      setTerminateModalOpen(true);
    }
  };

  // Create Machine Image Handler
  const handleCreateMachineImage = (vm: any) => {
    setSelectedVM(vm);
    setCreateImageModalOpen(true);
  };

  // Reboot Machine Handler
  const handleRebootMachine = (vm: any) => {
    setSelectedVM(vm);
    setRebootModalOpen(true);
  };

  // Stop Machine Confirm
  const handleStopConfirm = async () => {
    setIsStoppingMachine(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Machine stopped successfully",
        description: `${selectedVM?.name} has been stopped.`
      });
      setStopModalOpen(false);
      setSelectedVM(null);
    } catch (error) {
      toast({
        title: "Failed to stop machine",
        description: "Please try again later."
      });
    } finally {
      setIsStoppingMachine(false);
    }
  };

  // Restart Machine Confirm
  const handleRestartConfirm = async () => {
    setIsRestartingMachine(true);
    try {
      // Simulate API call with potential failure
      await new Promise(resolve => setTimeout(resolve, 2000));
      const shouldFail = Math.random() < 0.3; // 30% chance of failure for demo
      
      if (shouldFail) {
        setRestartModalOpen(false);
        setRestartErrorModalOpen(true);
      } else {
        toast({
          title: "Machine restarted successfully",
          description: `${selectedVM?.name} has been restarted.`
        });
        setRestartModalOpen(false);
        setSelectedVM(null);
      }
    } catch (error) {
      setRestartModalOpen(false);
      setRestartErrorModalOpen(true);
    } finally {
      setIsRestartingMachine(false);
    }
  };

  // Restart Try Again
  const handleRestartTryAgain = () => {
    setRestartErrorModalOpen(false);
    setRestartModalOpen(true);
  };

  // Terminate Machine Confirm
  const handleTerminateConfirm = async () => {
    setIsTerminatingMachine(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Machine terminated successfully",
        description: `${selectedVM?.name} has been terminated.`
      });
      setTerminateModalOpen(false);
      setSelectedVM(null);
    } catch (error) {
      toast({
        title: "Failed to terminate machine",
        description: "Please try again later."
      });
    } finally {
      setIsTerminatingMachine(false);
    }
  };

  // Enable Delete Protection Confirm
  const handleEnableProtectionConfirm = async () => {
    setIsTogglingProtection(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Delete protection enabled",
        description: `${selectedVM?.name} is now protected from deletion.`
      });
      setEnableProtectionModalOpen(false);
      setSelectedVM(null);
    } catch (error) {
      toast({
        title: "Failed to enable delete protection",
        description: "Please try again later."
      });
    } finally {
      setIsTogglingProtection(false);
    }
  };

  // Disable Delete Protection Confirm
  const handleDisableProtectionConfirm = async () => {
    setIsTogglingProtection(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Delete protection disabled",
        description: `${selectedVM?.name} can now be deleted.`
      });
      setDisableProtectionModalOpen(false);
      setSelectedVM(null);
    } catch (error) {
      toast({
        title: "Failed to disable delete protection",
        description: "Please try again later."
      });
    } finally {
      setIsTogglingProtection(false);
    }
  };

  // Create Machine Image Confirm
  const handleCreateImageConfirm = async (imageName: string) => {
    setIsCreatingImage(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      toast({
        title: "Machine image created successfully",
        description: `"${imageName}" has been created from ${selectedVM?.name}.`
      });
      setCreateImageModalOpen(false);
      setSelectedVM(null);
    } catch (error) {
      toast({
        title: "Failed to create machine image",
        description: "Please try again later."
      });
    } finally {
      setIsCreatingImage(false);
    }
  };

  // Reboot Machine Confirm
  const handleRebootConfirm = async () => {
    setIsRebootingMachine(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Machine rebooted successfully",
        description: `${selectedVM?.name} has been rebooted.`
      });
      setRebootModalOpen(false);
      setSelectedVM(null);
    } catch (error) {
      toast({
        title: "Failed to reboot machine",
        description: "Please try again later."
      });
    } finally {
      setIsRebootingMachine(false);
    }
  };

  // Regular Delete Handler (for backward compatibility)
  const handleDeleteClick = (vm: any) => {
    if (vm.deleteProtection) {
      setSelectedVM(vm);
      setDeleteProtectionErrorModalOpen(true);
    } else {
      setSelectedVM(vm);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    setTimeout(() => {
      toast({
        title: "Machine deleted successfully",
        description: `${selectedVM?.name} has been deleted.`
      });
      setDeleteModalOpen(false);
      setSelectedVM(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedVM(null);
  };

  const handleRefresh = () => {
    console.log("🔄 Refreshing VM data at:", new Date().toLocaleTimeString());
    toast({
      title: "Data refreshed",
      description: "VM instances have been updated."
    });
  };

  // Close all modals
  const closeAllModals = () => {
    setStopModalOpen(false);
    setRestartModalOpen(false);
    setRestartErrorModalOpen(false);
    setTerminateModalOpen(false);
    setDeleteProtectionErrorModalOpen(false);
    setEnableProtectionModalOpen(false);
    setDisableProtectionModalOpen(false);
    setCreateImageModalOpen(false);
    setRebootModalOpen(false);
    setSelectedVM(null);
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      searchable: true,
      render: (value: any, row: any) => (
        <a
          href={`/compute/vms/instances/${row.id}`}
          className="text-primary font-medium hover:underline leading-5"
        >
          {row.name}
        </a>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: any) => (
        <span className="leading-5">{value}</span>
      ),
    },
    {
      key: "flavour",
      label: "Flavour",
      sortable: true,
      render: (value: any) => (
        <span className="leading-5">{value}</span>
      ),
    },
    {
      key: "vpc",
      label: "VPC",
      sortable: true,
      render: (value: any) => (
        <span className="leading-5">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: any) => <StatusBadge status={value} />,
    },
    {
      key: "fixedIp",
      label: "Fixed IP",
      render: (value: any) => (
        <TooltipWrapper content="Copy Fixed IP">
          <span
            className="underline cursor-pointer"
            onClick={e => {e.stopPropagation(); navigator.clipboard.writeText(value)}}
          >
            {value}
          </span>
        </TooltipWrapper>
      ),
    },
    {
      key: "publicIp",
      label: "Public IP",
      render: (value: any) => (
        <TooltipWrapper content="Copy Public IP">
          <span
            className="underline cursor-pointer"
            onClick={e => {e.stopPropagation(); navigator.clipboard.writeText(value)}}
          >
            {value}
          </span>
        </TooltipWrapper>
      ),
    },
    {
      key: "createdOn",
      label: "Created On",
      sortable: true,
      render: (value: any) => {
        const date = new Date(value);
        return (
          <div className="text-muted-foreground leading-5">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: "deleteProtection",
      label: "Delete Protection",
      render: (value: any, row: any) => (
        <TooltipWrapper content={value ? "Disable delete protection" : "Enable delete protection"}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProtectionToggle(row);
            }}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            {value ? (
              <Lock className="w-4 h-4 text-red-600" />
            ) : (
              <Unlock className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </TooltipWrapper>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (value: any, row: any) => {
        // Determine available actions based on VM status
        const isRunning = row.status === "Active";
        const isStopped = row.status === "Stopped";
        const isRestarting = row.status === "Restarting";
        
        return (
          <div className="flex justify-end">
            <VMActionMenu
              vm={row}
              isRunning={isRunning}
              isStopped={isStopped}
              isRestarting={isRestarting}
              onStop={() => handleStopMachine(row)}
              onRestart={() => handleRestartMachine(row)}
              onTerminate={() => handleTerminateMachine(row)}
              onCreateImage={() => handleCreateMachineImage(row)}
              onReboot={() => handleRebootMachine(row)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ShadcnDataTable columns={columns} data={vmInstances} onRefresh={handleRefresh} />
      
      {/* All VM Management Modals */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        resourceName={selectedVM?.name}
        resourceType="VM Instance"
      />
      
      <StopMachineModal
        open={stopModalOpen}
        onClose={closeAllModals}
        onConfirm={handleStopConfirm}
        machineName={selectedVM?.name || ""}
        isLoading={isStoppingMachine}
      />
      
      <RestartMachineModal
        open={restartModalOpen}
        onClose={closeAllModals}
        onConfirm={handleRestartConfirm}
        machineName={selectedVM?.name || ""}
        isLoading={isRestartingMachine}
      />
      
      <RestartErrorModal
        open={restartErrorModalOpen}
        onClose={closeAllModals}
        onTryAgain={handleRestartTryAgain}
        machineName={selectedVM?.name || ""}
      />
      
      <TerminateMachineModal
        open={terminateModalOpen}
        onClose={closeAllModals}
        onConfirm={handleTerminateConfirm}
        machineName={selectedVM?.name || ""}
        isLoading={isTerminatingMachine}
      />
      
      <DeleteProtectionErrorModal
        open={deleteProtectionErrorModalOpen}
        onClose={closeAllModals}
        machineName={selectedVM?.name || ""}
      />
      
      <EnableDeleteProtectionModal
        open={enableProtectionModalOpen}
        onClose={closeAllModals}
        onConfirm={handleEnableProtectionConfirm}
        machineName={selectedVM?.name || ""}
        isLoading={isTogglingProtection}
      />
      
      <DisableDeleteProtectionModal
        open={disableProtectionModalOpen}
        onClose={closeAllModals}
        onConfirm={handleDisableProtectionConfirm}
        machineName={selectedVM?.name || ""}
        isLoading={isTogglingProtection}
      />
      
      <CreateMachineImageModal
        open={createImageModalOpen}
        onClose={closeAllModals}
        onConfirm={handleCreateImageConfirm}
        machineName={selectedVM?.name || ""}
        isLoading={isCreatingImage}
      />
      
      <RebootMachineModal
        open={rebootModalOpen}
        onClose={closeAllModals}
        onConfirm={handleRebootConfirm}
        machineName={selectedVM?.name || ""}
        isLoading={isRebootingMachine}
      />
    </>
  );
}

// Enhanced Action Menu Component for VMs
interface VMActionMenuProps {
  vm: any;
  isRunning: boolean;
  isStopped: boolean;
  isRestarting: boolean;
  onStop: () => void;
  onRestart: () => void;
  onTerminate: () => void;
  onCreateImage: () => void;
  onReboot: () => void;
}

function VMActionMenu({ 
  vm, 
  isRunning, 
  isStopped, 
  isRestarting, 
  onStop, 
  onRestart, 
  onTerminate,
  onCreateImage,
  onReboot
}: VMActionMenuProps) {
  return (
    <ActionMenu
      viewHref={`/compute/vms/instances/${vm.id}`}
      editHref={`/compute/vms/instances/${vm.id}/edit`}
      resourceName={vm.name}
      resourceType="VM Instance"
      deleteLabel="Terminate Machine"
      onCustomDelete={onTerminate}
      // Show Stop action only for running VMs
      {...(isRunning && { onStop: onStop })}
      // Show Restart action only for stopped VMs
      {...(isStopped && { onRestart: onRestart })}
      // Show Reboot action for running VMs
      {...(isRunning && { onReboot: onReboot })}
      // Create Image action available for all VMs
      onCreateImage={onCreateImage}
    />
  );
}

const tabs = [
  { id: "cpu", label: "CPU VMs" },
  { id: "gpu", label: "GPU VMs" },
  { id: "gpu-baremetal", label: "GPU Baremetal" },
  { id: "instances", label: "My Instances" },
]

export default function VMsPage() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Determine active tab from URL, but don't change URL on tab change
  const getActiveTabFromPath = () => {
    if (pathname.includes('/cpu')) return "cpu"
    if (pathname.includes('/gpu')) return "gpu" 
    if (pathname.includes('/gpu-baremetal')) return "gpu-baremetal"
    if (pathname.includes('/instances')) return "instances"
    return "cpu" // default to cpu
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath())

  // Handle tab change without URL navigation to prevent refreshes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // Don't navigate - just change the local state
  }

  // Update active tab when URL changes (for direct navigation)
  useEffect(() => {
    setActiveTab(getActiveTabFromPath())
  }, [pathname])

  // Get title and description based on active tab
  const getPageInfo = () => {
    switch (activeTab) {
      case "cpu":
        return { title: "CPU Virtual Machines", description: "Create and manage CPU-based virtual machines" }
      case "gpu":
        return { title: "GPU Virtual Machines", description: "Create and manage GPU-accelerated virtual machines" }
      case "ai-pods":
        return { title: "AI Pods", description: "Manage specialized AI compute pods for machine learning workloads" }
      case "instances":
        return { title: "My Instances", description: "View and manage all your virtual machine instances" }
      case "images":
        return { title: "Machine Images", description: "Manage your virtual machine images and templates" }
      default:
        return { title: "Virtual Machines", description: "Manage your virtual machine resources" }
    }
  }

  const { title, description } = getPageInfo()

  return (
    <TooltipProvider>
      <PageLayout title={title} description={description}>
        <div className="space-y-6">
          <VercelTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            size="lg"
          />

          {activeTab === "cpu" && <CpuVmSection />}
          {activeTab === "gpu" && <GpuVmSection />}
          {activeTab === "gpu-baremetal" && <GpuBaremetalSection />}
          {activeTab === "instances" && <MyInstancesSection />}
        </div>
      </PageLayout>
    </TooltipProvider>
  )
} 