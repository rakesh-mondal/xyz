import { PageShell } from "@/components/page-shell"

export default function AutoScalingPage() {
  return (
    <PageShell
      title="Auto Scaling"
      description="Configure automatic scaling for your resources"
      tabs={[
        { title: "Groups", href: "/compute/auto-scaling/groups" },
        { title: "Templates", href: "/compute/auto-scaling/templates" },
      ]}
    />
  )
}
