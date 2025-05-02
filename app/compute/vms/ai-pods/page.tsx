import { PageShell } from "@/components/page-shell"

export default function AIPodsPage() {
  return (
    <PageShell
      title="AI Pods"
      description="Manage specialized AI compute pods for machine learning workloads"
      tabs={[
        { title: "CPU VM", href: "/compute/vms/cpu" },
        { title: "GPU VM", href: "/compute/vms/gpu" },
        { title: "AI Pods", href: "/compute/vms/ai-pods" },
        { title: "My Instances", href: "/compute/vms/instances" },
        { title: "Machine Images", href: "/compute/vms/images" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">AI Pods Content</h3>
        <p className="text-sm text-muted-foreground mt-1">This is a placeholder for AI Pods management interface</p>
      </div>
    </PageShell>
  )
} 