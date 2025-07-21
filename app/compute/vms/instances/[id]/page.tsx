"use client"

import { useParams } from "next/navigation";
import { vmInstances } from "@/lib/data";
import { Edit, Trash2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { PageLayout } from "@/components/page-layout"
import { DetailSection } from "@/components/detail-section"
import { DetailGrid } from "@/components/detail-grid"
import { DetailItem } from "@/components/detail-item"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function VMInstanceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const vm = vmInstances.find((v) => v.id === id);

  if (!vm) {
    return <div className="p-8 text-center text-gray-500">Instance not found</div>;
  }

  // Format created date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  // Breadcrumbs
  const customBreadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/compute", title: "Compute" },
    { href: "/compute/vms", title: "Virtual Machines" },
    { href: `/compute/vms/instances/${vm.id}`, title: vm.name }
  ]

  return (
    <PageLayout title={vm.name} customBreadcrumbs={customBreadcrumbs} hideViewDocs={true}>
      <div className="mb-6 group relative" style={{
        borderRadius: '16px',
        border: '4px solid #FFF',
        background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
        boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
        padding: '1.5rem'
      }}>
        {/* Overlay Edit/Delete Buttons (text-only per rules) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/compute/vms/instances/${vm.id}/edit`)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
            aria-label="Edit VM Instance"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* open delete modal here if needed */}}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 shadow-sm"
            aria-label="Delete VM Instance"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <DetailGrid>
          <DetailItem label="Instance ID" value={vm.id} />
          <DetailItem label="Type" value={vm.type} />
          <DetailItem label="Flavour" value={vm.flavour} />
          <DetailItem label="VPC" value={vm.vpc} />
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
            <StatusBadge status={vm.status} />
          </div>
          <DetailItem label="Fixed IP" value={vm.fixedIp} />
          <DetailItem label="Public IP" value={vm.publicIp} />
          <DetailItem label="Created On" value={formatDate(vm.createdOn)} />
          <DetailItem label="Delete Protection" value={vm.deleteProtection ? "Enabled" : "Disabled"} />
        </DetailGrid>
      </div>
    </PageLayout>
  );
} 