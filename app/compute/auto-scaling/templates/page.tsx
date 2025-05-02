import { PageShell } from "@/components/page-shell"

export default function TemplatesPage() {
  return (
    <PageShell
      title="Auto Scaling Templates"
      description="Manage your auto scaling templates and configurations"
      tabs={[
        { title: "ASG", href: "/compute/auto-scaling/asg" },
        { title: "Templates", href: "/compute/auto-scaling/templates" },
      ]}
    >
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">Auto Scaling Templates</h3>
        <p className="text-sm text-muted-foreground mt-1">Create and manage templates for your auto scaling configurations</p>
      </div>
    </PageShell>
  )
}
