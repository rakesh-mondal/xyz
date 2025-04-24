import { PageShell } from "@/components/page-shell"

export default function ComputePage() {
  return (
    <PageShell
      title="Compute"
      description="Manage your compute resources and infrastructure"
      tabs={[
        { title: "AI Pods", href: "/compute/ai-pods" },
        { title: "Machines", href: "/compute/machines" },
        { title: "Auto Scaling", href: "/compute/auto-scaling" },
        { title: "Monitoring", href: "/compute/monitoring" },
        { title: "Resources", href: "/compute/resources" }
      ]}
    >
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Compute Overview</h3>
          <p className="text-muted-foreground">This is a placeholder for the Compute resources overview content</p>
        </div>
      </div>
    </PageShell>
  )
}
