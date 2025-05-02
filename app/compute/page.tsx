import { PageShell } from "@/components/page-shell"

export default function ComputePage() {
  return (
    <PageShell
      title="Compute"
      description="Manage your compute resources and virtual machines"
      tabs={[
        { title: "VMs", href: "/compute/vms" },
        { title: "HPC", href: "/compute/hpc" },
        { title: "Auto Scaling", href: "/compute/auto-scaling" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">Compute Resources</h3>
        <p className="text-sm text-muted-foreground mt-1">Select a tab to manage specific compute resources</p>
      </div>
    </PageShell>
  )
}
