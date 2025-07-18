import { PageLayout } from "@/components/page-layout"

export default function GpuResourcesPage() {
  return (
    <PageLayout title="GPU Resources" description="Manage your GPU resources for AI workloads">
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">GPU Resources</h3>
          <p className="text-muted-foreground">This is a placeholder for the GPU Resources content</p>
        </div>
      </div>
    </PageLayout>
  )
}
