import { PageLayout } from "@/components/page-layout"

export default function DnsPage() {
  return (
    <PageLayout title="DNS Management" description="Manage your DNS settings and records">
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">DNS Management</h3>
          <p className="text-muted-foreground">This is a placeholder for the DNS Management content</p>
        </div>
      </div>
    </PageLayout>
  )
}
