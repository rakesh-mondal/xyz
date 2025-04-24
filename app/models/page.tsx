import { PageShell } from "@/components/page-shell"

export default function ModelsPage() {
  return (
    <PageShell
      title="AI Models"
      description="Browse, train, and deploy AI models"
      tabs={[
        { title: "Model Library", href: "/models/library" },
        { title: "Model Training", href: "/models/training" },
        { title: "Model Deployment", href: "/models/deployment" },
        { title: "Model Monitoring", href: "/models/monitoring" },
      ]}
    />
  )
}
