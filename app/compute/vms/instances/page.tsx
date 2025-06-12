"use client"

import { redirect } from "next/navigation"

export default function MyInstancesPage() {
  // Redirect to main VMs page with My Instances tab
  redirect("/compute/vms")
} 