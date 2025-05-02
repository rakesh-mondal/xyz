import { PageShell } from "@/components/page-shell"
import { redirect } from "next/navigation"

export default function VMsPage() {
  // Redirect to the first tab by default
  redirect("/compute/vms/cpu")

  return (
    <PageShell
      title="Virtual Machines"
      description="Manage your virtual machine resources"
      tabs={[
        { title: "CPU VM", href: "/compute/vms/cpu" },
        { title: "GPU VM", href: "/compute/vms/gpu" },
        { title: "AI Pods", href: "/compute/vms/ai-pods" },
        { title: "My Instances", href: "/compute/vms/instances" },
        { title: "Machine Images", href: "/compute/vms/images" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">VM Resources</h3>
        <p className="text-sm text-muted-foreground mt-1">Select a tab to manage specific VM resources</p>
      </div>
    </PageShell>
  )
} 