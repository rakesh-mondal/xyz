"use client";
import React, { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { ShadcnDataTable } from "@/components/ui/shadcn-data-table";
import { UsageActionBar } from "@/components/billing/usage-action-bar";
import Link from "next/link";

const pieData = [
  { name: "Compute", value: 400, color: "#6366f1" },
  { name: "Storage", value: 300, color: "#f59e42" },
  { name: "Networking", value: 300, color: "#10b981" },
  { name: "AI Studio", value: 200, color: "#f43f5e" },
];

function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#22223b"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={13}
      fontWeight={600}
    >
      {percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
    </text>
  );
}

const serviceSummary = [
  { name: "Compute", credits: 400, details: "View Details" },
  { name: "Storage", credits: 300, details: "View Details" },
  { name: "Networking", credits: 300, details: "View Details" },
  { name: "AI Studio", credits: 200, details: "View Details" },
];

export default function BillingUsageSummaryPage() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Credits Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,200</div>
            <div className="text-muted-foreground">in selected period</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-60">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    stroke="none"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, fontSize: 14 }}
                    formatter={(value, name) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {pieData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }}></span>
                    <span className="text-sm font-medium text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Service Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ShadcnDataTable
            columns={[
              {
                key: "name",
                label: "Service",
                sortable: true,
                searchable: true,
                render: (value) => (
                  <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{value}</span>
                ),
              },
              {
                key: "credits",
                label: "Credits Used",
                sortable: true,
              },
              {
                key: "details",
                label: "",
                render: (value) => (
                  <Button variant="link" size="sm">{value}</Button>
                ),
              },
            ]}
            data={serviceSummary}
            searchableColumns={["name"]}
            defaultSort={{ column: "credits", direction: "desc" }}
            pageSize={5}
            enableSearch={false}
            enableColumnVisibility={false}
            enablePagination={false}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
} 