"use client"

import { PageLayout } from "@/components/page-layout"

export default function CreateClusterPage() {
  return (
    <PageLayout title="Create Cluster" description="Create a new Kubernetes cluster">
      <div className="p-8">
        <h1>Create Cluster - Test Page</h1>
        <p>This is a simplified test page to check if the route works.</p>
      </div>
    </PageLayout>
  )
}