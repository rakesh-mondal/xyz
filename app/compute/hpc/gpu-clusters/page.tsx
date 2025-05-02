import { PageShell } from "@/components/page-shell"

export default function GPUClustersPage() {
  return (
    <PageShell
      title="GPU Clusters"
      description="Manage your GPU-accelerated HPC clusters"
      tabs={[
        { title: "GPU Clusters", href: "/compute/hpc/gpu-clusters" },
        { title: "CPU Clusters", href: "/compute/hpc/cpu-clusters" },
        { title: "My Clusters", href: "/compute/hpc/my-clusters" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">GPU Clusters</h3>
        <p className="text-sm text-muted-foreground mt-1">Manage your GPU-accelerated HPC clusters and resources</p>
      </div>
    </PageShell>
  )
} 