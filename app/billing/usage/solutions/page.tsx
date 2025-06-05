"use client";
import React, { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UsageActionBar } from "@/components/billing/usage-action-bar";
import type { DateRange } from "react-day-picker";
import Link from "next/link";

const solutionsTabs = [
  { value: "all", label: "All Solutions" },
  { value: "basic", label: "Basic" },
  { value: "docint", label: "Document Intelligence" },
  { value: "industrial", label: "Industrial Solutions" },
];

const mockBasic = [
  { id: 1, name: "Basic Service 1", status: "Active", credits: 50 },
  { id: 2, name: "Basic Service 2", status: "Completed", credits: 30 },
];
const mockDocInt = [
  { id: 1, name: "Doc AI 1", status: "Active", credits: 70 },
  { id: 2, name: "Doc AI 2", status: "Completed", credits: 40 },
];
const mockIndustrial = [
  { id: 1, name: "Industrial Pod 1", type: "Pod", status: "Active", credits: 90 },
  { id: 2, name: "Industrial Storage 1", type: "Storage", status: "Completed", credits: 60 },
];
const allSolutions = [...mockBasic, ...mockDocInt, ...mockIndustrial];

function getTotalCredits(data: Array<{ credits?: number }>): number {
  return data.reduce((sum: number, row: { credits?: number }) => sum + (row.credits || 0), 0);
}

export default function BillingUsageSolutionsPage() {
  const [solutionsTab, setSolutionsTab] = useState("all");
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
          <div className="flex flex-col gap-1">
            <CardTitle>Solutions</CardTitle>
          </div>
          <div className="bg-muted rounded-md px-4 py-2 font-medium text-sm ml-2">
            Grand Total Credits Used: {getTotalCredits(allSolutions)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Tabs value={solutionsTab} onValueChange={setSolutionsTab}>
              <TabsList>
                {solutionsTabs.map((t) => (
                  <TabsTrigger key={t.value} value={t.value} className="capitalize">
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />Filter</Button>
          </div>
          <Tabs value={solutionsTab} onValueChange={setSolutionsTab}>
            {/* All Solutions */}
            <TabsContent value="all">
              <DataTable
                columns={[
                  { key: "name", label: "Resource Name", sortable: true },
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
                data={allSolutions}
                defaultSort={{ column: "name", direction: "asc" }}
              />
              <div className="text-right font-semibold px-2 py-2">Total: {getTotalCredits(allSolutions)} credits</div>
            </TabsContent>
            {/* Basic */}
            <TabsContent value="basic">
              <DataTable
                columns={[
                  { key: "name", label: "Basic Name", sortable: true },
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
                data={mockBasic}
                defaultSort={{ column: "name", direction: "asc" }}
              />
              <div className="text-right font-semibold px-2 py-2">Total: {getTotalCredits(mockBasic)} credits</div>
            </TabsContent>
            {/* Document Intelligence */}
            <TabsContent value="docint">
              <DataTable
                columns={[
                  { key: "name", label: "Document Name", sortable: true },
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
                data={mockDocInt}
                defaultSort={{ column: "name", direction: "asc" }}
              />
              <div className="text-right font-semibold px-2 py-2">Total: {getTotalCredits(mockDocInt)} credits</div>
            </TabsContent>
            {/* Industrial Solutions */}
            <TabsContent value="industrial">
              <DataTable
                columns={[
                  { key: "name", label: "Resource Name", sortable: true },
                  { key: "type", label: "Type", sortable: true, render: (value) => (
                    <span className={
                      value === "Pod"
                        ? "inline-flex items-center gap-1 text-blue-600"
                        : "inline-flex items-center gap-1 text-orange-600"
                    }>
                      <span className={
                        value === "Pod"
                          ? "h-2 w-2 rounded-full bg-blue-500"
                          : "h-2 w-2 rounded-full bg-orange-500"
                      }></span>
                      {value}
                    </span>
                  ) },
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
                data={mockIndustrial}
                defaultSort={{ column: "name", direction: "asc" }}
              />
              <div className="text-right font-semibold px-2 py-2">Total: {getTotalCredits(mockIndustrial)} credits</div>
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
                    {modalResource.type && <div><span className="font-semibold">Type:</span> {modalResource.type}</div>}
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