import { PageShell } from "@/components/page-shell"

export default function DataPage() {
  return (
    <PageShell
      title="Data Management"
      description="Manage and organize your data resources"
      tabs={[
        { title: "Datasets", href: "/data/datasets" },
        { title: "Data Processing", href: "/data/processing" },
        { title: "Data Pipelines", href: "/data/pipelines" },
        { title: "Data Governance", href: "/data/governance" },
      ]}
    />
  )
}
