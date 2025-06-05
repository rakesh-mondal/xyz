"use client"

import { PageShell } from "@/components/page-shell"
import { CreateButton } from "../../../components/create-button"
import { StatusBadge } from "../../../components/status-badge"
import { securityGroups } from "../../../lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { ActionMenu } from "../../../components/action-menu"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function SecurityGroupListPage() {
  const [sortBy, setSortBy] = useState<"name" | "createdOn">("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const handleSort = (col: "name" | "createdOn") => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortBy(col)
      setSortDir("asc")
    }
  }
  const sortedSecurityGroups = [...securityGroups].sort((a, b) => {
    let aVal: string | Date = a[sortBy]
    let bVal: string | Date = b[sortBy]
    if (sortBy === "createdOn") {
      aVal = new Date(a.createdOn)
      bVal = new Date(b.createdOn)
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1
    return 0
  })
  return (
    <PageShell
      title="Security Groups"
      description="Define and manage security groups to control inbound and outbound traffic for your cloud resources."
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">VPC:</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px] border-input">
              <SelectValue placeholder="All VPCs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All VPCs</SelectItem>
              <SelectItem value="production-vpc">production-vpc</SelectItem>
              <SelectItem value="development-vpc">development-vpc</SelectItem>
              <SelectItem value="staging-vpc">staging-vpc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CreateButton href="/networking/security-groups/create" label="Create Security Group" />
      </div>
      <div className="overflow-hidden bg-card text-card-foreground border-border border rounded-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm cursor-pointer select-none" onClick={() => handleSort("name")}>Security Group Name {sortBy === "name" && (sortDir === "asc" ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />)}</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">VPC</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm cursor-pointer select-none" onClick={() => handleSort("createdOn")}>Created On {sortBy === "createdOn" && (sortDir === "asc" ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />)}</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Status</th>
              <th className="text-left px-5 py-2.5 bg-muted border-b border-border font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSecurityGroups.map((sg) => (
              <tr key={sg.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-5 py-2.5 border-b border-border">
                  <a
                    href={`/networking/security-groups/${sg.id}`}
                    className="text-primary underline font-medium hover:no-underline"
                  >
                    {sg.name}
                  </a>
                </td>
                <td className="px-5 py-2.5 border-b border-border">{sg.vpcName}</td>
                <td className="px-5 py-2.5 border-b border-border">{sg.createdOn}</td>
                <td className="px-5 py-2.5 border-b border-border">
                  <StatusBadge status={sg.status} />
                </td>
                <td className="px-5 py-2.5 border-b border-border">
                  <ActionMenu
                    viewHref={`/networking/security-groups/${sg.id}`}
                    editHref={`/networking/security-groups/${sg.id}/edit`}
                    deleteHref={`/networking/security-groups/${sg.id}/delete`}
                    resourceName={sg.name}
                    resourceType="Security Group"
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
