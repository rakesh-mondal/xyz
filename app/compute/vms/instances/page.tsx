import { PageShell } from "@/components/page-shell"

export default function MyInstancesPage() {
  return (
    <PageShell
      title="My Instances"
      description="View and manage all your virtual machine instances"
      tabs={[
        { title: "CPU VM", href: "/compute/vms/cpu" },
        { title: "GPU VM", href: "/compute/vms/gpu" },
        { title: "AI Pods", href: "/compute/vms/ai-pods" },
        { title: "My Instances", href: "/compute/vms/instances" },
        { title: "Machine Images", href: "/compute/vms/images" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">My Instances Content</h3>
        <p className="text-sm text-muted-foreground mt-1">This is a placeholder for instance management interface</p>
      </div>
    </PageShell>
  )
} 