"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Tab {
  title: string
  href: string
}

interface ContentTabsProps {
  tabs: Tab[]
  maxVisibleTabs?: number
}

export function ContentTabs({ tabs, maxVisibleTabs = 5 }: ContentTabsProps) {
  const pathname = usePathname()
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  const visibleTabs = tabs.slice(0, maxVisibleTabs)
  const overflowTabs = tabs.slice(maxVisibleTabs)
  const hasOverflow = overflowTabs.length > 0

  return (
    <div className="border-b">
      <div className="flex">
        {visibleTabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
              pathname === tab.href
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted",
              hoveredTab && hoveredTab !== tab.title ? "opacity-75" : "",
            )}
            onMouseEnter={() => setHoveredTab(tab.title)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {tab.title}
          </Link>
        ))}

        {hasOverflow && (
          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {overflowTabs.map((tab) => (
                <DropdownMenuItem key={tab.href} asChild>
                  <Link href={tab.href} className={cn(pathname === tab.href && "font-medium")}>
                    {tab.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
