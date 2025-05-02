import { PageShell } from "@/components/page-shell"

export default function GPUVMPage() {
  return (
    <PageShell
      title="GPU Virtual Machines"
      description="Create and manage GPU-accelerated virtual machines"
      tabs={[
        { title: "CPU VM", href: "/compute/vms/cpu" },
        { title: "GPU VM", href: "/compute/vms/gpu" },
        { title: "AI Pods", href: "/compute/vms/ai-pods" },
        { title: "My Instances", href: "/compute/vms/instances" },
        { title: "Machine Images", href: "/compute/vms/images" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">GPU VM Content</h3>
        <p className="text-sm text-muted-foreground mt-1">This is a placeholder for GPU VM management interface</p>
      </div>
    </PageShell>
  )
} 