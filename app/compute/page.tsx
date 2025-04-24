import { PageShell } from "@/components/page-shell"

export default function ComputePage() {
  return (
    <PageShell
      title="Compute & Scaling"
      description="Manage your compute resources and scaling options"
      tabs={[
        { title: "Machines", href: "/compute/machines" },
        { title: "AI Pods", href: "/compute/ai-pods" },
        { title: "Auto Scaling", href: "/compute/auto-scaling" },
      ]}
    />
  )
}
