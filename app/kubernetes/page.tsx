import { PageShell } from "@/components/page-shell"

export default function KubernetesPage() {
  return (
    <PageShell
      title="Kubernetes"
      description="Manage your Kubernetes clusters and configurations"
      tabs={[
        { title: "Manage Kubernetes", href: "/kubernetes/manage" },
        { title: "Kubernetes Configuration Manager", href: "/kubernetes/config-manager" },
      ]}
    />
  )
}
