import { PageLayout } from "@/components/page-layout"

export default function UsersPage() {
  return (
    <PageLayout title="Users" description="Manage your users">
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Users</h3>
          <p className="text-muted-foreground">This is a placeholder for the Users content</p>
        </div>
      </div>
    </PageLayout>
  )
}
