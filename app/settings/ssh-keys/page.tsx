import { PageLayout } from "@/components/page-layout"

export default function SshKeysPage() {
  return (
    <PageLayout title="SSH Keys" description="Manage your SSH keys">
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">SSH Keys</h3>
          <p className="text-muted-foreground">This is a placeholder for the SSH Keys content</p>
        </div>
      </div>
    </PageLayout>
  )
}
