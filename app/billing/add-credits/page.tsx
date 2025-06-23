"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter as DialogFooterUI } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";







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
  const [customAmount, setCustomAmount] = useState("");
  const [address, setAddress] = useState(mockAddress);
  const [editAddress, setEditAddress] = useState(false);
  const [orderSummary, setOrderSummary] = useState({ credits: 0, price: 0 });
  const router = useRouter();

  // Update order summary when custom amount changes
  React.useEffect(() => {
    if (customAmount) {
      const amount = parseInt(customAmount, 10) || 0;
      setOrderSummary({ credits: amount, price: amount });
    } else {
      setOrderSummary({ credits: 0, price: 0 });
    }
  }, [customAmount]);

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

              {/* Custom Amount */}
              <div>
                <div className="font-medium mb-2">Enter amount</div>
                <Input
                  type="number"
                  min={1}
                  placeholder="₹1000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="max-w-xs"
                />
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
                  <span>Total Cost</span>
                  <span className="font-bold text-primary">₹{orderSummary.price}</span>
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