"use client"

import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { staticIPs } from "../../../lib/data"
import { ActionMenu } from "../../../components/action-menu"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function StaticIPListPage() {
  const [sortBy, setSortBy] = useState<"address" | "subnetName">("address")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const handleSort = (col: "address" | "subnetName") => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortBy(col)
      setSortDir("asc")
    }
  }
  const sortedStaticIPs = [...staticIPs].sort((a, b) => {
    let aVal: string = a[sortBy]
    let bVal: string = b[sortBy]
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1
    return 0
  })
  return (
    <PageShell
      title="Static IP Addresses"
      description="Reserve and manage static IP addresses for your cloud resources. Assign IPs to VMs and other services as needed."
    >
      <div className="flex justify-end mb-4">
        <CreateButton href="/networking/static-ips/create" label="Reserve IP Address" />
      </div>
      <div className="overflow-hidden bg-card text-card-foreground border-border border rounded-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm cursor-pointer select-none" onClick={() => handleSort("address")}>IP Address {sortBy === "address" && (sortDir === "asc" ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />)}</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm cursor-pointer select-none" onClick={() => handleSort("subnetName")}>Subnet Name {sortBy === "subnetName" && (sortDir === "asc" ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />)}</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Type</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Access Type</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Assigned VM</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStaticIPs.map((ip) => (
              <tr key={ip.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-5 py-2.5 border-b border-border">{ip.address}</td>
                <td className="px-5 py-2.5 border-b border-border">{ip.subnetName}</td>
                <td className="px-5 py-2.5 border-b border-border">
                  <StatusBadge status={ip.type} />
                </td>
                <td className="px-5 py-2.5 border-b border-border">
                  <StatusBadge status={ip.accessType} />
                </td>
                <td className="px-5 py-2.5 border-b border-border">
                  {ip.assignedVM || <span className="italic text-muted-foreground">Not assigned</span>}
                </td>
                <td className="px-5 py-2.5 border-b border-border">
                  <ActionMenu
                    viewHref={`/networking/static-ips/${ip.id}`}
                    editHref={`/networking/static-ips/${ip.id}/edit`}
                    deleteHref={`/networking/static-ips/${ip.id}/delete`}
                    resourceName={ip.address}
                    resourceType="Static IP"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  )
}
