import { PageShell } from "@/components/page-shell"

export default function NetworkingPage() {
  return (
    <PageShell
      title="Networking"
      description="Manage your network infrastructure"
      tabs={[
        { title: "Network Security", href: "/networking/security" },
        { title: "Load Balancing", href: "/networking/load-balancing" },
        { title: "DNS Management", href: "/networking/dns" },
      ]}
    />
  )
}
