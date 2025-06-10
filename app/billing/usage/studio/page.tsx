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
import type { Column } from "@/components/ui/shadcn-data-table";

const studioTabs = [
  { value: "all", label: "All Studio" },
  { value: "model", label: "Model Catalog" },
  { value: "finetune", label: "Fine-tuning" },
  { value: "deploy", label: "Deployment" },
  { value: "eval", label: "Evaluation" },
];

const mockModelCatalog = [
  { id: 1, name: "GPT-4-32K", status: "Active", credits: 250 },
  { id: 2, name: "Claude-3-Opus", status: "Active", credits: 300 },
  { id: 3, name: "Llama-2-70B", status: "Active", credits: 180 },
  { id: 4, name: "Stable-Diffusion-XL", status: "Active", credits: 150 },
  { id: 5, name: "BERT-Large", status: "Completed", credits: 80 },
];

const mockFinetune = [
  { id: 1, name: "GPT-4-Custom-01", status: "Active", credits: 450 },
  { id: 2, name: "Claude-3-Custom-01", status: "Active", credits: 380 },
  { id: 3, name: "Llama-2-Custom-01", status: "Completed", credits: 220 },
  { id: 4, name: "SDXL-Custom-01", status: "Active", credits: 280 },
  { id: 5, name: "BERT-Custom-01", status: "Completed", credits: 150 },
];

const mockDeploy = [
  { id: 1, name: "GPT-4-API-01", status: "Active", credits: 320 },
  { id: 2, name: "Claude-3-API-01", status: "Active", credits: 280 },
  { id: 3, name: "Llama-2-API-01", status: "Active", credits: 180 },
  { id: 4, name: "SDXL-API-01", status: "Active", credits: 150 },
  { id: 5, name: "BERT-API-01", status: "Completed", credits: 90 },
];

const mockEval = [
  { id: 1, name: "GPT-4-Eval-01", status: "Active", credits: 120 },
  { id: 2, name: "Claude-3-Eval-01", status: "Active", credits: 100 },
  { id: 3, name: "Llama-2-Eval-01", status: "Completed", credits: 80 },
  { id: 4, name: "SDXL-Eval-01", status: "Active", credits: 90 },
  { id: 5, name: "BERT-Eval-01", status: "Completed", credits: 60 },
];

const allStudio = [...mockModelCatalog, ...mockFinetune, ...mockDeploy, ...mockEval];

function getTotalCredits(data: Array<{ credits?: number }>): number {
  return data.reduce((sum: number, row: { credits?: number }) => sum + (row.credits || 0), 0);
}

interface StudioItem {
  id: number;
  name: string;
  status: string;
  credits: number;
}

export default function BillingUsageStudioPage() {
  const [studioTab, setStudioTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalResource, setModalResource] = useState<any>(null);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const columns: Column<StudioItem>[] = [
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
      render: (_: unknown, row: StudioItem) => (
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

  const modelCatalogColumns: Column<StudioItem>[] = [
    {
      key: "name",
      label: "Model Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
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
      ),
    },
    {
      key: "credits",
      label: "Credits Used",
      sortable: true,
    },
    {
      key: "actions",
      label: "",
      render: (_: unknown, row: StudioItem) => (
        <Button variant="link" size="sm" className="text-sm" onClick={() => { setModalResource(row); setModalOpen(true); }}>
          <Eye className="mr-1 h-4 w-4" />View Details
        </Button>
      ),
    },
  ];

  const finetuneColumns: Column<StudioItem>[] = [
    {
      key: "name",
      label: "Fine-tune Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
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
      ),
    },
    {
      key: "credits",
      label: "Credits Used",
      sortable: true,
    },
    {
      key: "actions",
      label: "",
      render: (_: unknown, row: StudioItem) => (
        <Button variant="link" size="sm" className="text-sm" onClick={() => { setModalResource(row); setModalOpen(true); }}>
          <Eye className="mr-1 h-4 w-4" />View Details
        </Button>
      ),
    },
  ];

  const deployColumns: Column<StudioItem>[] = [
    {
      key: "name",
      label: "Deployment Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
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
      ),
    },
    {
      key: "credits",
      label: "Credits Used",
      sortable: true,
    },
    {
      key: "actions",
      label: "",
      render: (_: unknown, row: StudioItem) => (
        <Button variant="link" size="sm" className="text-sm" onClick={() => { setModalResource(row); setModalOpen(true); }}>
          <Eye className="mr-1 h-4 w-4" />View Details
        </Button>
      ),
    },
  ];

  const evalColumns: Column<StudioItem>[] = [
    {
      key: "name",
      label: "Evaluation Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
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
      ),
    },
    {
      key: "credits",
      label: "Credits Used",
      sortable: true,
    },
    {
      key: "actions",
      label: "",
      render: (_: unknown, row: StudioItem) => (
        <Button variant="link" size="sm" className="text-sm" onClick={() => { setModalResource(row); setModalOpen(true); }}>
          <Eye className="mr-1 h-4 w-4" />View Details
        </Button>
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
              <ShadcnDataTable
                columns={columns}
                data={allStudio}
                searchableColumns={["name"]}
                defaultSort={{ column: "credits", direction: "desc" }}
                pageSize={5}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(allStudio)} credits</div>
            </TabsContent>
            {/* Model Catalog */}
            <TabsContent value="model">
              <ShadcnDataTable
                columns={modelCatalogColumns}
                data={mockModelCatalog}
                searchableColumns={["name"]}
                defaultSort={{ column: "name", direction: "asc" }}
                pageSize={5}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(mockModelCatalog)} credits</div>
            </TabsContent>
            {/* Fine-tuning */}
            <TabsContent value="finetune">
              <ShadcnDataTable
                columns={finetuneColumns}
                data={mockFinetune}
                searchableColumns={["name"]}
                defaultSort={{ column: "name", direction: "asc" }}
                pageSize={5}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(mockFinetune)} credits</div>
            </TabsContent>
            {/* Deployment */}
            <TabsContent value="deploy">
              <ShadcnDataTable
                columns={deployColumns}
                data={mockDeploy}
                searchableColumns={["name"]}
                defaultSort={{ column: "name", direction: "asc" }}
                pageSize={5}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(mockDeploy)} credits</div>
            </TabsContent>
            {/* Evaluation */}
            <TabsContent value="eval">
              <ShadcnDataTable
                columns={evalColumns}
                data={mockEval}
                searchableColumns={["name"]}
                defaultSort={{ column: "name", direction: "asc" }}
                pageSize={5}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(mockEval)} credits</div>
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