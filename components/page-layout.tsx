import { PageShell } from "@/components/page-shell"
import type { ReactNode } from "react"

interface PageLayoutProps {
  title: string
  description?: string
  tabs?: Array<{
    title: string
    href: string
  }>
  children?: ReactNode
  headerActions?: ReactNode
}

export function PageLayout({ title, description, tabs, children, headerActions }: PageLayoutProps) {
  return (
    <PageShell title={title} description={description} tabs={tabs} headerActions={headerActions}>
      {children}
    </PageShell>
  )
}
