"use client";
import React, { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UsageActionBar } from "@/components/billing/usage-action-bar";
import type { DateRange } from "react-day-picker";
import Link from "next/link";

const coreTabs = [
  { value: "all", label: "All Infrastructure" },
  { value: "compute", label: "Compute" },
  { value: "storage", label: "Storage" },
  { value: "network", label: "Network" },
];

const mockCompute = [
  { id: 1, name: "VM-1", type: "VM", status: "Running", credits: 120 },
  { id: 2, name: "VM-2", type: "VM", status: "Stopped", credits: 80 },
];
const mockStorage = [
  { id: 1, name: "Volume-1", type: "SSD", status: "Attached", credits: 60 },
  { id: 2, name: "Volume-2", type: "HDD", status: "Available", credits: 40 },
];
const mockNetwork = [
  { id: 1, name: "VPC-1", type: "VPC", status: "Active", credits: 30 },
  { id: 2, name: "Subnet-1", type: "Subnet", status: "Active", credits: 20 },
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
          <Link href="/billing/add-credits">
            <Button variant="default">Add Credits</Button>
          </Link>
          <Button variant="secondary">Billing Support</Button>
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
              <DataTable
                columns={[
                  { key: "name", label: "Resource Name", sortable: true },
                  { key: "type", label: "Type", sortable: true },
                  { key: "status", label: "Status", sortable: true },
                  { key: "credits", label: "Credits Used", sortable: true },
                  {
                    key: "actions",
                    label: "",
                    render: (_, row) => (
                      <Button variant="link" size="sm" onClick={() => { setModalResource(row); setModalOpen(true); }}><Eye className="mr-1 h-4 w-4" />View Details</Button>
                    ),
                  },
                ]}
                data={allInfra}
                defaultSort={{ column: "name", direction: "asc" }}
              />
            </TabsContent>
            <TabsContent value="compute">
              <DataTable
                columns={[
                  { key: "name", label: "Compute Name", sortable: true },
                  { key: "type", label: "Type", sortable: true },
                  { key: "status", label: "Status", sortable: true },
                  { key: "credits", label: "Credits Used", sortable: true },
                  {
                    key: "actions",
                    label: "",
                    render: (_, row) => (
                      <Button variant="link" size="sm" onClick={() => { setModalResource(row); setModalOpen(true); }}><Eye className="mr-1 h-4 w-4" />View Details</Button>
                    ),
                  },
                ]}
                data={mockCompute}
                defaultSort={{ column: "name", direction: "asc" }}
              />
            </TabsContent>
            <TabsContent value="storage">
              <DataTable
                columns={[
                  { key: "name", label: "Storage Name", sortable: true },
                  { key: "type", label: "Type", sortable: true },
                  { key: "status", label: "Status", sortable: true },
                  { key: "credits", label: "Credits Used", sortable: true },
                  {
                    key: "actions",
                    label: "",
                    render: (_, row) => (
                      <Button variant="link" size="sm" onClick={() => { setModalResource(row); setModalOpen(true); }}><Eye className="mr-1 h-4 w-4" />View Details</Button>
                    ),
                  },
                ]}
                data={mockStorage}
                defaultSort={{ column: "name", direction: "asc" }}
              />
            </TabsContent>
            <TabsContent value="network">
              <DataTable
                columns={[
                  { key: "name", label: "Network Name", sortable: true },
                  { key: "type", label: "Type", sortable: true },
                  { key: "status", label: "Status", sortable: true },
                  { key: "credits", label: "Credits Used", sortable: true },
                  {
                    key: "actions",
                    label: "",
                    render: (_, row) => (
                      <Button variant="link" size="sm" onClick={() => { setModalResource(row); setModalOpen(true); }}><Eye className="mr-1 h-4 w-4" />View Details</Button>
                    ),
                  },
                ]}
                data={mockNetwork}
                defaultSort={{ column: "name", direction: "asc" }}
              />
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