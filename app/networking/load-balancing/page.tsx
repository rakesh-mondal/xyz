import { PageShell } from "@/components/page-shell"

export default function LoadBalancingPage() {
  return (
    <PageShell
      title="Load Balancing"
      description="Configure load balancing for your applications"
      tabs={[
        { title: "Load Balancer", href: "/networking/load-balancing/balancer" },
        { title: "Target Groups", href: "/networking/load-balancing/target-groups" },
      ]}
    />
  )
}
