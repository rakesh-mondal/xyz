import { PageShell } from "@/components/page-shell"
import { redirect } from "next/navigation"

export default function HPCPage() {
  // Redirect to the first tab by default
  redirect("/compute/hpc/gpu-clusters")

  return (
    <PageShell
      title="High Performance Computing"
      description="Manage your HPC clusters and resources"
      tabs={[
        { title: "GPU Clusters", href: "/compute/hpc/gpu-clusters" },
        { title: "CPU Clusters", href: "/compute/hpc/cpu-clusters" },
        { title: "My Clusters", href: "/compute/hpc/my-clusters" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">HPC Resources</h3>
        <p className="text-sm text-muted-foreground mt-1">Select a tab to manage specific HPC resources</p>
      </div>
    </PageShell>
  )
} 