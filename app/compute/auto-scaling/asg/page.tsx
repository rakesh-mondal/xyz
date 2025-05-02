import { PageShell } from "@/components/page-shell"

export default function ASGPage() {
  return (
    <PageShell
      title="Auto Scaling Groups"
      description="Manage your auto scaling groups and configurations"
      tabs={[
        { title: "ASG", href: "/compute/auto-scaling/asg" },
        { title: "Templates", href: "/compute/auto-scaling/templates" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">Auto Scaling Groups</h3>
        <p className="text-sm text-muted-foreground mt-1">Create and manage auto scaling groups for your resources</p>
      </div>
    </PageShell>
  )
} 