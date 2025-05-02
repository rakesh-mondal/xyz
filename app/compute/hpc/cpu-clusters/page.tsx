import { PageShell } from "@/components/page-shell"

export default function CPUClustersPage() {
  return (
    <PageShell
      title="CPU Clusters"
      description="Manage your CPU-based HPC clusters"
      tabs={[
        { title: "GPU Clusters", href: "/compute/hpc/gpu-clusters" },
        { title: "CPU Clusters", href: "/compute/hpc/cpu-clusters" },
        { title: "My Clusters", href: "/compute/hpc/my-clusters" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">CPU Clusters</h3>
        <p className="text-sm text-muted-foreground mt-1">Manage your CPU-based HPC clusters and resources</p>
      </div>
    </PageShell>
  )
} 