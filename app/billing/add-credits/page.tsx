"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter as DialogFooterUI } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

const creditPackages = [
  { label: "Small", credits: 100, price: 10 },
  { label: "Medium", credits: 500, price: 45 },
  { label: "Large", credits: 2000, price: 160 },
];

const paymentMethods = [
  { id: "card1", label: "Visa **** 1234" },
  { id: "card2", label: "Mastercard **** 5678" },
];

const usageData = [
  { month: "Jan", used: 120 },
  { month: "Feb", used: 90 },
  { month: "Mar", used: 150 },
  { month: "Apr", used: 80 },
  { month: "May", used: 110 },
];

const recentTransactions = [
  { id: 1, date: "2024-05-01", amount: 45, credits: 500 },
  { id: 2, date: "2024-04-15", amount: 10, credits: 100 },
  { id: 3, date: "2024-03-20", amount: 160, credits: 2000 },
];

const mockAddress = {
  name: "Rakesh Mondal",
  line1: "123 Main St",
  line2: "Suite 400",
  city: "Bangalore",
  state: "KA",
  zip: "560001",
  country: "India",
};

export default function AddCreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>("Medium");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [address, setAddress] = useState(mockAddress);
  const [editAddress, setEditAddress] = useState(false);
  const [orderSummary, setOrderSummary] = useState({ credits: 500, price: 45 });
  const router = useRouter();
  const [balanceDate, setBalanceDate] = useState<DateRange | undefined>(undefined);

  // Update order summary when package or custom amount changes
  React.useEffect(() => {
    if (customAmount) {
      const credits = parseInt(customAmount, 10) || 0;
      setOrderSummary({ credits, price: credits * 0.09 });
      setSelectedPackage(null);
    } else if (selectedPackage) {
      const pkg = creditPackages.find((p) => p.label === selectedPackage);
      if (pkg) setOrderSummary({ credits: pkg.credits, price: pkg.price });
    }
  }, [selectedPackage, customAmount]);

  return (
    <PageShell
      title="Add Credits"
      description="Purchase additional credits to continue using Krutrim Cloud services."
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              {/* Removed CardTitle here, as PageShell provides the title */}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Credit Packages */}
              <div>
                <div className="font-medium mb-2">Choose a package</div>
                <div className="flex gap-4">
                  {creditPackages.map((pkg) => (
                    <button
                      key={pkg.label}
                      className={`border rounded-lg px-6 py-4 flex-1 text-left transition-all ${selectedPackage === pkg.label ? "border-primary bg-primary/10" : "border-muted bg-background"}`}
                      onClick={() => { setSelectedPackage(pkg.label); setCustomAmount(""); }}
                    >
                      <div className="font-semibold text-lg">{pkg.label}</div>
                      <div className="text-muted-foreground">{pkg.credits} credits</div>
                      <div className="mt-2 font-bold text-primary">₹{pkg.price}</div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Custom Amount */}
              <div>
                <div className="font-medium mb-2">Or enter custom credits.</div>
                <Input
                  type="number"
                  min={1}
                  placeholder="Enter credits"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="max-w-xs"
                />
                {customAmount && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    Estimated cost: <span className="font-semibold">₹{(parseInt(customAmount, 10) * 0.09).toFixed(2)}</span>
                  </div>
                )}
              </div>
              {/* Payment Method */}
              <div>
                <div className="font-medium mb-2">Payment Method</div>
                <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((pm) => (
                      <SelectItem key={pm.id} value={pm.id}>{pm.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Billing Address */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Billing Address</span>
                  <Button variant="link" size="sm" onClick={() => setEditAddress(true)}>Edit</Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>{address.name}</div>
                  <div>{address.line1}{address.line2 ? ", " + address.line2 : ""}</div>
                  <div>{address.city}, {address.state} {address.zip}</div>
                  <div>{address.country}</div>
                </div>
              </div>
              {/* Order Summary */}
              <div className="border-t pt-4 mt-4">
                <div className="font-semibold mb-2">Order Summary</div>
                <div className="flex justify-between">
                  <span>Credits</span>
                  <span>{orderSummary.credits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Cost</span>
                  <span className="font-bold text-primary">₹{orderSummary.price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button variant="default">Purchase Credits</Button>
            </CardFooter>
          </Card>
        </div>
        {/* Side Panel */}
        <div className="w-full md:w-80 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mb-2">
                <div className="text-lg font-bold">1,250 credits</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="balance-date-range"
                      variant="outline"
                      className="min-w-[200px] justify-start text-left font-normal rounded-md h-9 px-3"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {balanceDate?.from ? (
                        balanceDate.to ? (
                          <>
                            {format(balanceDate.from, "LLL dd, y")} - {format(balanceDate.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(balanceDate.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={balanceDate?.from}
                      selected={balanceDate}
                      onSelect={setBalanceDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData} barCategoryGap={40}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0AEC0' }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 14, background: '#fff', border: '1px solid #E2E8F0', color: '#222' }} cursor={{ fill: '#F1F5F9', opacity: 0.5 }} />
                    <Bar dataKey="used" fill="#222" radius={[6, 6, 0, 0]} barSize={16} opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recentTransactions.map((tx) => (
                  <li key={tx.id} className="flex justify-between text-sm">
                    <span>{tx.date}</span>
                    <span className="text-muted-foreground">+{tx.credits} credits</span>
                    <span className="font-medium">₹{tx.amount}</span>
                  </li>
                ))}
              </ul>
              <Button variant="link" size="sm" className="mt-2 px-0" onClick={() => router.push("/billing/transactions")}>View all transactions</Button>
            </CardContent>
          </Card>
        </div>
        {/* Edit Address Dialog */}
        <Dialog open={editAddress} onOpenChange={setEditAddress}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Billing Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} placeholder="Name" />
              <Input value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} placeholder="Address Line 1" />
              <Input value={address.line2} onChange={e => setAddress({ ...address, line2: e.target.value })} placeholder="Address Line 2" />
              <Input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="City" />
              <Input value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} placeholder="State" />
              <Input value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} placeholder="ZIP Code" />
              <Input value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} placeholder="Country" />
            </div>
            <DialogFooterUI>
              <Button variant="outline" onClick={() => setEditAddress(false)}>Cancel</Button>
              <Button variant="default" onClick={() => setEditAddress(false)}>Save</Button>
            </DialogFooterUI>
          </DialogContent>
        </Dialog>
      </div>
    </PageShell>
  );
} 