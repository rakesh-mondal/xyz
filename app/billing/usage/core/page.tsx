"use client";
import React, { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UsageActionBar } from "@/components/billing/usage-action-bar";
import type { DateRange } from "react-day-picker";
import Link from "next/link";
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActionMenu } from "@/components/action-menu"
import { StatusBadge } from "@/components/status-badge"
import type { Column } from "@/components/ui/shadcn-data-table";

interface CoreInfrastructureItem {
  id: number;
  name: string;
  type: string;
  status: string;
  credits: number;
}

const coreTabs = [
  { value: "all", label: "All Infrastructure" },
  { value: "compute", label: "Compute" },
  { value: "storage", label: "Storage" },
  { value: "network", label: "Network" },
];

const mockCompute = [
  { id: 1, name: "Production-VM-01", type: "VM", status: "Running", credits: 450 },
  { id: 2, name: "Staging-VM-02", type: "VM", status: "Running", credits: 320 },
  { id: 3, name: "Dev-VM-03", type: "VM", status: "Stopped", credits: 180 },
  { id: 4, name: "GPU-VM-01", type: "GPU VM", status: "Running", credits: 750 },
  { id: 5, name: "K8s-Node-01", type: "Kubernetes", status: "Running", credits: 280 },
];
const mockStorage = [
  { id: 1, name: "Prod-Volume-01", type: "SSD", status: "Attached", credits: 120 },
  { id: 2, name: "Backup-Volume-01", type: "HDD", status: "Available", credits: 80 },
  { id: 3, name: "Data-Volume-01", type: "SSD", status: "Attached", credits: 150 },
  { id: 4, name: "Cache-Volume-01", type: "NVMe", status: "Attached", credits: 200 },
  { id: 5, name: "Archive-Volume-01", type: "HDD", status: "Available", credits: 60 },
];
const mockNetwork = [
  { id: 1, name: "Prod-VPC-01", type: "VPC", status: "Active", credits: 90 },
  { id: 2, name: "Prod-Subnet-01", type: "Subnet", status: "Active", credits: 45 },
  { id: 3, name: "Load-Balancer-01", type: "Load Balancer", status: "Active", credits: 120 },
  { id: 4, name: "Security-Group-01", type: "Security Group", status: "Active", credits: 30 },
  { id: 5, name: "VPN-Gateway-01", type: "VPN", status: "Active", credits: 75 },
];
const allInfra = [...mockCompute, ...mockStorage, ...mockNetwork];

function getTotalCredits(data: Array<{ credits?: number }>): number {
  return data.reduce((sum: number, row: { credits?: number }) => sum + (row.credits || 0), 0);
}

export default function BillingUsageCorePage() {
  const [coreTab, setCoreTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalResource, setModalResource] = useState<any>(null);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const columns: Column<CoreInfrastructureItem>[] = [
    {
      key: "name",
      label: "Service",
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="font-medium text-sm">{value}</div>
      ),
    },
    {
      key: "credits",
      label: "Credits Used",
      sortable: true,
      searchable: true,
      render: (value: number) => (
        <div className="text-sm">{value}</div>
      ),
    },
    {
      key: "actions",
      label: "Action",
      align: "right",
      render: (_: unknown, row: CoreInfrastructureItem) => (
        <div className="flex justify-end">
          <ActionMenu
            viewHref="#"
            onEdit={() => { setModalResource(row); setModalOpen(true); }}
            resourceName={row.name}
            resourceType="Resource"
          />
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title="Usage Metrics"
      description="Track resource usage and billing information"
      tabs={[
        { title: "Summary", href: "/billing/usage/summary" },
        { title: "Core Infrastructure", href: "/billing/usage/core" },
        { title: "Studio", href: "/billing/usage/studio" },
        { title: "Solutions", href: "/billing/usage/solutions" },
      ]}
      headerActions={
        <>
          <Button variant="secondary">Billing Support</Button>
          <Link href="/billing/add-credits">
            <Button variant="default">Add Credits</Button>
          </Link>
        </>
      }
    >
      <UsageActionBar date={date} setDate={setDate} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Core Infrastructure</CardTitle>
          <div className="bg-muted rounded-md px-4 py-2 font-medium text-sm">
            {coreTab === "all" && <>Grand Total Credits Used: {getTotalCredits(allInfra)}</>}
            {coreTab === "compute" && <>Total Compute Credits: {getTotalCredits(mockCompute)}</>}
            {coreTab === "storage" && <>Total Storage Credits: {getTotalCredits(mockStorage)}</>}
            {coreTab === "network" && <>Total Network Credits: {getTotalCredits(mockNetwork)}</>}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={coreTab} onValueChange={setCoreTab}>
            <TabsList className="mb-4">
              {coreTabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="capitalize">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all">
              <ShadcnDataTable
                columns={columns}
                data={allInfra}
                searchableColumns={["name"]}
                defaultSort={{ column: "credits", direction: "desc" }}
                pageSize={5}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(allInfra)} credits</div>
            </TabsContent>
            <TabsContent value="compute">
              <ShadcnDataTable
                columns={[
                  {
                    key: "name",
                    label: "Compute Name",
                    sortable: true,
                    searchable: true,
                    render: (value: string) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "type",
                    label: "Type",
                    sortable: true,
                    render: (value: string) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "status",
                    label: "Status",
                    sortable: true,
                    render: (value: string) => <StatusBadge status={value} />,
                  },
                  {
                    key: "credits",
                    label: "Credits Used",
                    sortable: true,
                    render: (value: number) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "actions",
                    label: "Action",
                    align: "right" as const,
                    render: (_: any, row: any) => (
                      <div className="flex justify-end">
                        <ActionMenu
                          viewHref="#"
                          onEdit={() => { setModalResource(row); setModalOpen(true); }}
                          resourceName={row.name}
                          resourceType="Resource"
                        />
                      </div>
                    ),
                  },
                ]}
                data={mockCompute}
                defaultSort={{ column: "name", direction: "asc" }}
                pageSize={10}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(mockCompute)} credits</div>
            </TabsContent>
            <TabsContent value="storage">
              <ShadcnDataTable
                columns={[
                  {
                    key: "name",
                    label: "Storage Name",
                    sortable: true,
                    searchable: true,
                    render: (value: string) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "type",
                    label: "Type",
                    sortable: true,
                    render: (value: string) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "status",
                    label: "Status",
                    sortable: true,
                    render: (value: string) => <StatusBadge status={value} />,
                  },
                  {
                    key: "credits",
                    label: "Credits Used",
                    sortable: true,
                    render: (value: number) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "actions",
                    label: "Action",
                    align: "right" as const,
                    render: (_: any, row: any) => (
                      <div className="flex justify-end">
                        <ActionMenu
                          viewHref="#"
                          onEdit={() => { setModalResource(row); setModalOpen(true); }}
                          resourceName={row.name}
                          resourceType="Resource"
                        />
                      </div>
                    ),
                  },
                ]}
                data={mockStorage}
                defaultSort={{ column: "name", direction: "asc" }}
                pageSize={10}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(mockStorage)} credits</div>
            </TabsContent>
            <TabsContent value="network">
              <ShadcnDataTable
                columns={[
                  {
                    key: "name",
                    label: "Network Name",
                    sortable: true,
                    searchable: true,
                    render: (value: string) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "type",
                    label: "Type",
                    sortable: true,
                    render: (value: string) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "status",
                    label: "Status",
                    sortable: true,
                    render: (value: string) => <StatusBadge status={value} />,
                  },
                  {
                    key: "credits",
                    label: "Credits Used",
                    sortable: true,
                    render: (value: number) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "actions",
                    label: "Action",
                    align: "right" as const,
                    render: (_: any, row: any) => (
                      <div className="flex justify-end">
                        <ActionMenu
                          viewHref="#"
                          onEdit={() => { setModalResource(row); setModalOpen(true); }}
                          resourceName={row.name}
                          resourceType="Resource"
                        />
                      </div>
                    ),
                  },
                ]}
                data={mockNetwork}
                defaultSort={{ column: "name", direction: "asc" }}
                pageSize={10}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(mockNetwork)} credits</div>
            </TabsContent>
          </Tabs>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resource Details</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {modalResource ? (
                  <div className="space-y-2">
                    <div><span className="font-semibold">Name:</span> {modalResource.name}</div>
                    <div><span className="font-semibold">Type:</span> {modalResource.type}</div>
                    <div><span className="font-semibold">Status:</span> {modalResource.status}</div>
                    <div><span className="font-semibold">Credits Used:</span> {modalResource.credits}</div>
                  </div>
                ) : null}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModalOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </PageShell>
  );
} 