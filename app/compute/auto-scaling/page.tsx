import { PageShell } from "@/components/page-shell"
import { redirect } from "next/navigation"

export default function AutoScalingPage() {
  // Redirect to the first tab by default
  redirect("/compute/auto-scaling/asg")

  return (
    <PageShell
      title="Auto Scaling"
      description="Manage your auto scaling resources"
      tabs={[
        { title: "ASG", href: "/compute/auto-scaling/asg" },
        { title: "Templates", href: "/compute/auto-scaling/templates" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">Auto Scaling Resources</h3>
        <p className="text-sm text-muted-foreground mt-1">Select a tab to manage specific auto scaling resources</p>
      </div>
    </PageShell>
  )
}
