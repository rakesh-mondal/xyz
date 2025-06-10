"use client"

import React from "react"

import type { ReactNode } from "react"
import { ContentTabs } from "@/components/navigation/content-tabs"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { generateBreadcrumbs } from "@/lib/generate-breadcrumbs"

interface PageShellProps {
  title: string
  description?: string
  tabs?: Array<{
    title: string
    href: string
  }>
  children?: ReactNode
  headerActions?: ReactNode
}

export function PageShell({ title, description, tabs, children, headerActions }: PageShellProps) {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>{crumb.title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-2 mt-2 sm:mt-0">{headerActions}</div>}
        </div>
      </div>
      {tabs && tabs.length > 0 && <ContentTabs tabs={tabs} />}
      <div className="mt-6">{children}</div>
    </div>
  )
}
