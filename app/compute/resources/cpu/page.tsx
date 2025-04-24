import { PageLayout } from "@/components/page-layout"

export default function CpuResourcesPage() {
  return (
    <PageLayout title="CPU Resources" description="Manage your CPU resources for general computing">
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">CPU Resources</h3>
          <p className="text-muted-foreground">This is a placeholder for the CPU Resources content</p>
        </div>
      </div>
    </PageLayout>
  )
}
