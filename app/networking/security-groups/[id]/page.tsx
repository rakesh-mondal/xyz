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
import { ShadcnDataTable } from "../../../../components/ui/shadcn-data-table"

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
        rightContent={
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
              {sg.inboundRules.length > 0 ? (
                <ShadcnDataTable
                  columns={[
                    {
                      key: "protocol",
                      label: "Protocol",
                      sortable: true,
                      render: (value: string) => (
                        <StatusBadge status={value} />
                      ),
                    },
                    {
                      key: "portRange",
                      label: "Port Range",
                      sortable: true,
                      render: (value: string) => (
                        <div className="text-sm">{value}</div>
                      ),
                    },
                    {
                      key: "remoteIpPrefix",
                      label: "Remote IP Prefix",
                      sortable: true,
                      render: (value: string) => (
                        <div className="text-sm">{value}</div>
                      ),
                    },
                    {
                      key: "description",
                      label: "Description",
                      sortable: true,
                      render: (value: string) => (
                        <div className="text-sm">{value || "-"}</div>
                      ),
                    },
                  ]}
                  data={sg.inboundRules}
                  pageSize={10}
                  enableSearch={true}
                  enableColumnVisibility={false}
                  enablePagination={false}
                />
              ) : (
                <div className="p-8 text-center text-muted-foreground italic text-sm">
                  No rules defined. All traffic is blocked by default.
                </div>
              )}
            </TabsContent>

            <TabsContent value="outbound">
              {sg.outboundRules.length > 0 ? (
                <ShadcnDataTable
                  columns={[
                    {
                      key: "protocol",
                      label: "Protocol",
                      sortable: true,
                      render: (value: string) => (
                        <StatusBadge status={value} />
                      ),
                    },
                    {
                      key: "portRange",
                      label: "Port Range",
                      sortable: true,
                      render: (value: string) => (
                        <div className="text-sm">{value}</div>
                      ),
                    },
                    {
                      key: "remoteIpPrefix",
                      label: "Remote IP Prefix",
                      sortable: true,
                      render: (value: string) => (
                        <div className="text-sm">{value}</div>
                      ),
                    },
                    {
                      key: "description",
                      label: "Description",
                      sortable: true,
                      render: (value: string) => (
                        <div className="text-sm">{value || "-"}</div>
                      ),
                    },
                  ]}
                  data={sg.outboundRules}
                  pageSize={10}
                  enableSearch={true}
                  enableColumnVisibility={false}
                  enablePagination={false}
                />
              ) : (
                <div className="p-8 text-center text-muted-foreground italic text-sm">
                  No rules defined. All traffic is blocked by default.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DetailSection>
      </div>
    </div>
  )
}
