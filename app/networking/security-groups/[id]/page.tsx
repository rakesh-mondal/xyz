import { notFound } from "next/navigation"
import { Breadcrumbs } from "../../../../components/breadcrumbs"
import { PageHeader } from "../../../../components/page-header"
import { DetailSection } from "../../../../components/detail-section"
import { DetailGrid } from "../../../../components/detail-grid"
import { DetailItem } from "../../../../components/detail-item"
import { Button } from "../../../../components/ui/button"
import { getSecurityGroup } from "../../../../lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { StatusBadge } from "../../../../components/status-badge"

export default function SecurityGroupDetailsPage({ params }: { params: { id: string } }) {
  const sg = getSecurityGroup(params.id)

  if (!sg) {
    notFound()
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { name: "Networking", href: "/networking" },
          { name: "Security Groups", href: "/networking/security-groups" },
          { name: sg.name },
        ]}
      />

      <PageHeader
        title={sg.name}
        status={sg.status}
        actions={
          <div className="flex gap-4">
            <Button variant="outline" className="border-input hover:bg-secondary transition-colors">
              Edit
            </Button>
            <Button variant="outline" className="border-input hover:bg-secondary transition-colors">
              Delete
            </Button>
          </div>
        }
      />

      <div className="bg-card text-card-foreground border-border border rounded-lg shadow-sm p-6 mb-6">
        <DetailSection title="Overview">
          <DetailGrid>
            <DetailItem label="Security Group Name" value={sg.name} />
            <DetailItem label="VPC" value={sg.vpcName} />
            <DetailItem label="Created On" value={sg.createdOn} />
            <DetailItem label="Status" value={sg.status} />
            {sg.description && <DetailItem label="Description" value={sg.description} />}
          </DetailGrid>
        </DetailSection>
      </div>

      <div className="bg-card text-card-foreground border-border border rounded-lg shadow-sm p-6">
        <DetailSection title="">
          <Tabs defaultValue="inbound">
            <TabsList className="border-b border-border w-full justify-start mb-5">
              <TabsTrigger
                value="inbound"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold"
              >
                Inbound Rules
              </TabsTrigger>
              <TabsTrigger
                value="outbound"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold"
              >
                Outbound Rules
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbound">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-5 bg-muted border-b border-border font-semibold text-sm">Protocol</th>
                    <th className="text-left p-5 bg-muted border-b border-border font-semibold text-sm">Port Range</th>
                    <th className="text-left p-5 bg-muted border-b border-border font-semibold text-sm">
                      Remote IP Prefix
                    </th>
                    <th className="text-left p-5 bg-muted border-b border-border font-semibold text-sm">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {sg.inboundRules.length > 0 ? (
                    sg.inboundRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-5 border-b border-border">
                          <StatusBadge status={rule.protocol} />
                        </td>
                        <td className="p-5 border-b border-border">{rule.portRange}</td>
                        <td className="p-5 border-b border-border">{rule.remoteIpPrefix}</td>
                        <td className="p-5 border-b border-border">{rule.description || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground italic">
                        No rules defined. All traffic is blocked by default.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="outbound">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-5 bg-muted border-b border-border font-semibold text-sm">Protocol</th>
                    <th className="text-left p-5 bg-muted border-b border-border font-semibold text-sm">Port Range</th>
                    <th className="text-left p-5 bg-muted border-b border-border font-semibold text-sm">
                      Remote IP Prefix
                    </th>
                    <th className="text-left p-5 bg-muted border-b border-border font-semibold text-sm">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {sg.outboundRules.length > 0 ? (
                    sg.outboundRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-5 border-b border-border">
                          <StatusBadge status={rule.protocol} />
                        </td>
                        <td className="p-5 border-b border-border">{rule.portRange}</td>
                        <td className="p-5 border-b border-border">{rule.remoteIpPrefix}</td>
                        <td className="p-5 border-b border-border">{rule.description || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground italic">
                        No rules defined. All traffic is blocked by default.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </DetailSection>
      </div>
    </div>
  )
}
