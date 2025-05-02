import { PageShell } from "@/components/page-shell"

export default function MyClustersPage() {
  return (
    <PageShell
      title="My Clusters"
      description="View and manage your HPC clusters"
      tabs={[
        { title: "GPU Clusters", href: "/compute/hpc/gpu-clusters" },
        { title: "CPU Clusters", href: "/compute/hpc/cpu-clusters" },
        { title: "My Clusters", href: "/compute/hpc/my-clusters" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">My Clusters</h3>
        <p className="text-sm text-muted-foreground mt-1">View and manage all your HPC clusters in one place</p>
      </div>
    </PageShell>
  )
} 