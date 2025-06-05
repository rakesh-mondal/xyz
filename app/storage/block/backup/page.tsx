import { PageShell } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"

const tabs = [
  { title: "Volumes", href: "/storage/block/volumes" },
  { title: "Snapshots", href: "/storage/block/snapshots" },
  { title: "Backup", href: "/storage/block/backup" },
]

const mockBackups = [
  {
    id: "backup-1",
    name: "Backup 1",
    volume: "Dev Volume",
    status: "available",
    size: "200 GB",
    createdOn: "2023-02-20",
  },
]

export default function BlockStorageBackupPage() {
  return (
    <PageShell
      title="Block Storage"
      description="Provision, manage, and attach block storage volumes to your cloud resources."
      tabs={tabs}
    >
      <div className="overflow-hidden bg-card text-card-foreground border-border border rounded-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Backup Name</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Volume</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Status</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Size</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Created On</th>
            </tr>
          </thead>
          <tbody>
            {mockBackups.map((backup) => (
              <tr key={backup.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-5 py-2.5 border-b border-border">{backup.name}</td>
                <td className="px-5 py-2.5 border-b border-border">{backup.volume}</td>
                <td className="px-5 py-2.5 border-b border-border">
                  <StatusBadge status={backup.status} />
                </td>
                <td className="px-5 py-2.5 border-b border-border">{backup.size}</td>
                <td className="px-5 py-2.5 border-b border-border">{backup.createdOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  )
} 