"use client";
import React, { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Filter, MoreHorizontal } from "lucide-react";
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

const solutionsTabs = [
  { value: "all", label: "All Solutions" },
  { value: "basic", label: "Basic" },
  { value: "docint", label: "Document Intelligence" },
  { value: "industrial", label: "Industrial Solutions" },
];

const mockBasic = [
  { id: 1, name: "Basic-AI-Service-01", status: "Active", credits: 120 },
  { id: 2, name: "Basic-NLP-Service-01", status: "Active", credits: 90 },
  { id: 3, name: "Basic-Vision-Service-01", status: "Active", credits: 110 },
  { id: 4, name: "Basic-Speech-Service-01", status: "Completed", credits: 70 },
  { id: 5, name: "Basic-Embedding-Service-01", status: "Active", credits: 85 },
];
const mockDocInt = [
  { id: 1, name: "Doc-Extraction-01", status: "Active", credits: 180 },
  { id: 2, name: "Doc-Classification-01", status: "Active", credits: 150 },
  { id: 3, name: "Doc-Summarization-01", status: "Active", credits: 200 },
  { id: 4, name: "Doc-Translation-01", status: "Completed", credits: 120 },
  { id: 5, name: "Doc-QA-01", status: "Active", credits: 160 },
];
const mockIndustrial = [
  { id: 1, name: "Manufacturing-AI-01", type: "Pod", status: "Active", credits: 450 },
  { id: 2, name: "Healthcare-AI-01", type: "Pod", status: "Active", credits: 380 },
  { id: 3, name: "Retail-AI-01", type: "Pod", status: "Active", credits: 320 },
  { id: 4, name: "Finance-AI-01", type: "Pod", status: "Active", credits: 400 },
  { id: 5, name: "Logistics-AI-01", type: "Pod", status: "Completed", credits: 280 },
];
const allSolutions = [...mockBasic, ...mockDocInt, ...mockIndustrial];

function getTotalCredits(data: Array<{ credits?: number }>): number {
  return data.reduce((sum: number, row: { credits?: number }) => sum + (row.credits || 0), 0);
}

interface SolutionsItem {
  id: number;
  name: string;
  status: string;
  credits: number;
}

export default function BillingUsageSolutionsPage() {
  const [solutionsTab, setSolutionsTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalResource, setModalResource] = useState<any>(null);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const columns: Column<SolutionsItem>[] = [
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
      render: (_: unknown, row: SolutionsItem) => (
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
              <ShadcnDataTable
                columns={columns}
                data={allSolutions}
                searchableColumns={["name"]}
                defaultSort={{ column: "credits", direction: "desc" }}
                pageSize={5}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(allSolutions)} credits</div>
            </TabsContent>
            {/* Basic */}
            <TabsContent value="basic">
              <ShadcnDataTable
                columns={[
                  {
                    key: "name",
                    label: "Service Name",
                    sortable: true,
                    searchable: true,
                    render: (value: string) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "status",
                    label: "Status",
                    sortable: true,
                    render: (value: string) => (
                      <span className={
                        value === "Active"
                          ? "inline-flex items-center gap-1 text-green-600 text-sm"
                          : "inline-flex items-center gap-1 text-gray-500 text-sm"
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
                data={mockBasic}
                defaultSort={{ column: "name", direction: "asc" }}
                pageSize={10}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(mockBasic)} credits</div>
            </TabsContent>
            {/* Document Intelligence */}
            <TabsContent value="docint">
              <ShadcnDataTable
                columns={[
                  {
                    key: "name",
                    label: "Service Name",
                    sortable: true,
                    searchable: true,
                    render: (value: string) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "status",
                    label: "Status",
                    sortable: true,
                    render: (value: string) => (
                      <span className={
                        value === "Active"
                          ? "inline-flex items-center gap-1 text-green-600 text-sm"
                          : "inline-flex items-center gap-1 text-gray-500 text-sm"
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
                data={mockDocInt}
                defaultSort={{ column: "name", direction: "asc" }}
                pageSize={10}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(mockDocInt)} credits</div>
            </TabsContent>
            {/* Industrial Solutions */}
            <TabsContent value="industrial">
              <ShadcnDataTable
                columns={[
                  {
                    key: "name",
                    label: "Service Name",
                    sortable: true,
                    searchable: true,
                    render: (value: string) => (
                      <div className="text-sm">{value}</div>
                    ),
                  },
                  {
                    key: "status",
                    label: "Status",
                    sortable: true,
                    render: (value: string) => (
                      <span className={
                        value === "Active"
                          ? "inline-flex items-center gap-1 text-green-600 text-sm"
                          : "inline-flex items-center gap-1 text-gray-500 text-sm"
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
                data={mockIndustrial}
                defaultSort={{ column: "name", direction: "asc" }}
                pageSize={10}
                enableSearch={true}
                enableColumnVisibility={false}
                enablePagination={false}
              />
              <div className="text-right font-semibold px-2 py-2 text-sm">Total: {getTotalCredits(mockIndustrial)} credits</div>
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