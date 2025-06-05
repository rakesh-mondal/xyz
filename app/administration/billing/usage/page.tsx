"use client";
import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";

const mockSummary = {
  totalCredits: 1234,
  change: 12.5,
  chartData: [
    { name: "Core Infrastructure", value: 482, color: "#6366f1" },
    { name: "Studio", value: 605, color: "#10b981" },
    { name: "Solutions", value: 147, color: "#f59e42" },
  ],
  table: [
    {
      name: "Core Infrastructure",
      credits: 482,
      percent: 39.1,
      change: 5.2,
    },
    { name: "Studio", credits: 605, percent: 49.0, change: 18.7 },
    { name: "Solutions", credits: 147, percent: 11.9, change: 8.9 },
  ],
};

const quickActions = [
  { label: "Export Report", variant: "outline" },
  { label: "Add Credits", variant: "default" },
  { label: "Billing Support", variant: "secondary" },
];

export default function BillingUsagePage() {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [openAccordion, setOpenAccordion] = useState(["summary"]);

  return (
    <Tabs defaultValue="usage-statistics" className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList>
          <TabsTrigger value="credit-balance">Credit Balance</TabsTrigger>
          <TabsTrigger value="add-credits">Add Credits</TabsTrigger>
          <TabsTrigger value="usage-statistics">Usage Statistics</TabsTrigger>
        </TabsList>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {date ? date.from ? date.from.toLocaleDateString() : "Select Date Range" : "Select Date Range"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="range" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
      <TabsContent value="usage-statistics">
        <Accordion
          type="multiple"
          value={openAccordion}
          onValueChange={setOpenAccordion}
          className="mb-6"
        >
          <AccordionItem value="summary">
            <AccordionTrigger className="text-lg font-semibold bg-muted px-4 rounded-t-md">
              Summary
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>Total Credits Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-2">
                      {mockSummary.totalCredits.toLocaleString()}
                    </div>
                    <div className="text-green-600 font-medium mb-4">
                      +{mockSummary.change}% vs previous period
                    </div>
                    {/* Placeholder for line chart */}
                    <div className="h-24 bg-muted rounded flex items-center justify-center text-muted-foreground">
                      Usage trend chart
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-1 flex flex-col items-center justify-center">
                  <CardHeader>
                    <CardTitle>Credit Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={mockSummary.chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          label
                        >
                          {mockSummary.chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Service Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service Name</TableHead>
                          <TableHead>Credits Used</TableHead>
                          <TableHead>% of Total</TableHead>
                          <TableHead>Change vs Previous</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockSummary.table.map((row) => (
                          <TableRow key={row.name} className="cursor-pointer hover:bg-accent" onClick={() => setOpenAccordion([row.name.toLowerCase().replace(/ /g, "-")])}>
                            <TableCell className="font-medium text-primary underline">{row.name}</TableCell>
                            <TableCell>{row.credits}</TableCell>
                            <TableCell>{row.percent}%</TableCell>
                            <TableCell className="text-green-600 font-medium">+{row.change}%</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold">
                          <TableCell>Total</TableCell>
                          <TableCell>{mockSummary.totalCredits.toLocaleString()}</TableCell>
                          <TableCell>100%</TableCell>
                          <TableCell className="text-green-600 font-medium">+{mockSummary.change}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="core-infrastructure">
            <AccordionTrigger className="text-lg font-semibold bg-muted px-4">Core Infrastructure</AccordionTrigger>
            <AccordionContent>
              <div className="p-4 text-muted-foreground">Detailed Core Infrastructure usage goes here.</div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="studio">
            <AccordionTrigger className="text-lg font-semibold bg-muted px-4">Studio</AccordionTrigger>
            <AccordionContent>
              <div className="p-4 text-muted-foreground">Detailed Studio usage goes here.</div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="solutions">
            <AccordionTrigger className="text-lg font-semibold bg-muted px-4">Solutions</AccordionTrigger>
            <AccordionContent>
              <div className="p-4 text-muted-foreground">Detailed Solutions usage goes here.</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Card className="mt-6">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
            <div className="font-semibold text-lg mb-2 md:mb-0">Quick Actions</div>
            <div className="flex gap-2 flex-wrap">
              {quickActions.map((action) => (
                <Button key={action.label} variant={action.variant as any}>
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      {/* Placeholder for other tabs */}
      <TabsContent value="credit-balance">
        <div className="p-8 text-muted-foreground">Credit Balance details coming soon.</div>
      </TabsContent>
      <TabsContent value="add-credits">
        <div className="p-8 text-muted-foreground">Add Credits functionality coming soon.</div>
      </TabsContent>
    </Tabs>
  );
} 