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
}

export function PageShell({ title, description, tabs, children }: PageShellProps) {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <div className="space-y-6 pt-6">
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

        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>

      {tabs && tabs.length > 0 && <ContentTabs tabs={tabs} />}

      <div className="mt-6">
        {children || (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <h3 className="text-lg font-medium">Content Area</h3>
            <p className="text-sm text-muted-foreground mt-1">This is a placeholder for the {title} content</p>
          </div>
        )}
      </div>
    </div>
  )
}
