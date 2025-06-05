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

const studioTabs = [
  { value: "all", label: "All Studio" },
  { value: "model", label: "Model Catalog" },
  { value: "finetune", label: "Fine-tuning" },
  { value: "deploy", label: "Deployment" },
  { value: "eval", label: "Evaluation" },
];

const mockModelCatalog = [
  { id: 1, name: "GPT-4", status: "Active", credits: 100 },
  { id: 2, name: "BERT", status: "Completed", credits: 80 },
];
const mockFinetune = [
  { id: 1, name: "GPT-4 Fine-tune", status: "Active", credits: 120 },
  { id: 2, name: "BERT Fine-tune", status: "Completed", credits: 60 },
];
const mockDeploy = [
  { id: 1, name: "GPT-4 Deploy", status: "Active", credits: 90 },
  { id: 2, name: "BERT Deploy", status: "Completed", credits: 70 },
];
const allStudio = [...mockModelCatalog, ...mockFinetune, ...mockDeploy];

function getTotalCredits(data: Array<{ credits?: number }>): number {
  return data.reduce((sum: number, row: { credits?: number }) => sum + (row.credits || 0), 0);
}

export default function BillingUsageStudioPage() {
  const [studioTab, setStudioTab] = useState("all");
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
          <CardTitle>Studio</CardTitle>
          <div className="bg-muted rounded-md px-4 py-2 font-medium text-sm">
            Grand Total Credits Used: {getTotalCredits(allStudio)}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={studioTab} onValueChange={setStudioTab}>
            <TabsList className="mb-4">
              {studioTabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="capitalize">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {/* All Studio */}
            <TabsContent value="all">
              <DataTable
                columns={[
                  { key: "name", label: "Resource Name", sortable: true },
                  { key: "status", label: "Status", sortable: true, render: (value) => (
                    <span className={
                      value === "Active"
                        ? "inline-flex items-center gap-1 text-green-600"
                        : "inline-flex items-center gap-1 text-gray-500"
                    }>
                      <span className={
                        value === "Active"
                          ? "h-2 w-2 rounded-full bg-green-500"
                          : "h-2 w-2 rounded-full bg-gray-400"
                      }></span>
                      {value}
                    </span>
                  ) },
                  { key: "credits", label: "Credits Used", sortable: true },
                  {
                    key: "actions",
                    label: "",
                    render: (_, row) => (
                      <Button variant="link" size="sm" onClick={() => { setModalResource(row); setModalOpen(true); }}><Eye className="mr-1 h-4 w-4" />View Details</Button>
                    ),
                  },
                ]}
                data={allStudio}
                defaultSort={{ column: "name", direction: "asc" }}
              />
              <div className="text-right font-semibold px-2 py-2">Total: {getTotalCredits(allStudio)} credits</div>
            </TabsContent>
            {/* Model Catalog */}
            <TabsContent value="model">
              <DataTable
                columns={[
                  { key: "name", label: "Model Name", sortable: true },
                  { key: "status", label: "Status", sortable: true, render: (value) => (
                    <span className={
                      value === "Active"
                        ? "inline-flex items-center gap-1 text-green-600"
                        : "inline-flex items-center gap-1 text-gray-500"
                    }>
                      <span className={
                        value === "Active"
                          ? "h-2 w-2 rounded-full bg-green-500"
                          : "h-2 w-2 rounded-full bg-gray-400"
                      }></span>
                      {value}
                    </span>
                  ) },
                  { key: "credits", label: "Credits Used", sortable: true },
                  {
                    key: "actions",
                    label: "",
                    render: (_, row) => (
                      <Button variant="link" size="sm" onClick={() => { setModalResource(row); setModalOpen(true); }}><Eye className="mr-1 h-4 w-4" />View Details</Button>
                    ),
                  },
                ]}
                data={mockModelCatalog}
                defaultSort={{ column: "name", direction: "asc" }}
              />
              <div className="text-right font-semibold px-2 py-2">Total: {getTotalCredits(mockModelCatalog)} credits</div>
            </TabsContent>
            {/* Fine-tuning */}
            <TabsContent value="finetune">
              <DataTable
                columns={[
                  { key: "name", label: "Fine-tune Name", sortable: true },
                  { key: "status", label: "Status", sortable: true, render: (value) => (
                    <span className={
                      value === "Active"
                        ? "inline-flex items-center gap-1 text-green-600"
                        : "inline-flex items-center gap-1 text-gray-500"
                    }>
                      <span className={
                        value === "Active"
                          ? "h-2 w-2 rounded-full bg-green-500"
                          : "h-2 w-2 rounded-full bg-gray-400"
                      }></span>
                      {value}
                    </span>
                  ) },
                  { key: "credits", label: "Credits Used", sortable: true },
                  {
                    key: "actions",
                    label: "",
                    render: (_, row) => (
                      <Button variant="link" size="sm" onClick={() => { setModalResource(row); setModalOpen(true); }}><Eye className="mr-1 h-4 w-4" />View Details</Button>
                    ),
                  },
                ]}
                data={mockFinetune}
                defaultSort={{ column: "name", direction: "asc" }}
              />
              <div className="text-right font-semibold px-2 py-2">Total: {getTotalCredits(mockFinetune)} credits</div>
            </TabsContent>
            {/* Deployment */}
            <TabsContent value="deploy">
              <DataTable
                columns={[
                  { key: "name", label: "Deployment Name", sortable: true },
                  { key: "status", label: "Status", sortable: true, render: (value) => (
                    <span className={
                      value === "Active"
                        ? "inline-flex items-center gap-1 text-green-600"
                        : "inline-flex items-center gap-1 text-gray-500"
                    }>
                      <span className={
                        value === "Active"
                          ? "h-2 w-2 rounded-full bg-green-500"
                          : "h-2 w-2 rounded-full bg-gray-400"
                      }></span>
                      {value}
                    </span>
                  ) },
                  { key: "credits", label: "Credits Used", sortable: true },
                  {
                    key: "actions",
                    label: "",
                    render: (_, row) => (
                      <Button variant="link" size="sm" onClick={() => { setModalResource(row); setModalOpen(true); }}><Eye className="mr-1 h-4 w-4" />View Details</Button>
                    ),
                  },
                ]}
                data={mockDeploy}
                defaultSort={{ column: "name", direction: "asc" }}
              />
              <div className="text-right font-semibold px-2 py-2">Total: {getTotalCredits(mockDeploy)} credits</div>
            </TabsContent>
            {/* Evaluation */}
            <TabsContent value="eval">
              <div className="text-muted-foreground">Breakdown and details for Evaluation go here.</div>
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