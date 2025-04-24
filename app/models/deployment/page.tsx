import { PageLayout } from "@/components/page-layout"

export default function ModelDeploymentPage() {
  return (
    <PageLayout title="Model Deployment" description="Deploy your AI models to production">
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Model Deployment</h3>
          <p className="text-muted-foreground">This is a placeholder for the Model Deployment content</p>
        </div>
      </div>
    </PageLayout>
  )
}
