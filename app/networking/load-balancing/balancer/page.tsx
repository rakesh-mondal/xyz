import { PageLayout } from "@/components/page-layout"

export default function LoadBalancerPage() {
  return (
    <PageLayout title="Load Balancer" description="Configure your load balancer">
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Load Balancer</h3>
          <p className="text-muted-foreground">This is a placeholder for the Load Balancer content</p>
        </div>
      </div>
    </PageLayout>
  )
}
