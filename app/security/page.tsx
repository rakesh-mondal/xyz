import { PageShell } from "@/components/page-shell"

export default function SecurityPage() {
  return (
    <PageShell
      title="Security & Compliance"
      description="Manage security settings and compliance"
      tabs={[
        { title: "Identity & Access Management", href: "/security/iam" },
        { title: "Encryption", href: "/security/encryption" },
        { title: "Audit Logs", href: "/security/audit" },
        { title: "Compliance Center", href: "/security/compliance" },
      ]}
    />
  )
}
