import { PageShell } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"

const tabs = [
  { title: "Volumes", href: "/storage/block/volumes" },
  { title: "Snapshots", href: "/storage/block/snapshots" },
  { title: "Backup", href: "/storage/block/backup" },
]

const mockSnapshots = [
  {
    id: "snap-1",
    name: "Snapshot 1",
    volume: "Production Volume",
    status: "completed",
    size: "500 GB",
    createdOn: "2023-01-15",
  },
]

export default function BlockStorageSnapshotsPage() {
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
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Snapshot Name</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Volume</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Status</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Size</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Created On</th>
            </tr>
          </thead>
          <tbody>
            {mockSnapshots.map((snap) => (
              <tr key={snap.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-5 py-2.5 border-b border-border">{snap.name}</td>
                <td className="px-5 py-2.5 border-b border-border">{snap.volume}</td>
                <td className="px-5 py-2.5 border-b border-border">
                  <StatusBadge status={snap.status} />
                </td>
                <td className="px-5 py-2.5 border-b border-border">{snap.size}</td>
                <td className="px-5 py-2.5 border-b border-border">{snap.createdOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  )
} 