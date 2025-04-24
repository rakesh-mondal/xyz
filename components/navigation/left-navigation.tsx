"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Server, Brain, ChevronRight, ChevronLeft, Map, Settings, X, Home, BookOpen, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { KrutrimLogo } from "@/components/ui/krutrim-logo"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LeftNavigationProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onClose: () => void
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  exactActive?: boolean
  collapsed?: boolean
  expanded?: boolean
  onExpand?: (href: string) => void
  subItems?: { href: string; label: string; subItems?: { href: string; label: string }[] }[]
}

const NavItem = ({ href, icon, label, active, exactActive, collapsed, expanded, onExpand, subItems }: NavItemProps) => {
  const hasSubItems = subItems && subItems.length > 0
  const pathname = usePathname()

  const handleToggleExpand = (e: React.MouseEvent) => {
    if (hasSubItems && onExpand) {
      e.preventDefault()
      onExpand(href)
    }
  }

  const itemContent = (
    <>
      <div className="flex min-w-[24px] items-center">{icon}</div>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {hasSubItems && <ChevronRight className={cn("h-4 w-4 transition-transform", expanded && "rotate-90")} />}
        </>
      )}
    </>
  )

  const item = hasSubItems ? (
    <button
      onClick={handleToggleExpand}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-left",
        exactActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
      )}
    >
      {itemContent}
    </button>
  ) : (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        exactActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
      )}
    >
      {itemContent}
    </Link>
  )

  return (
    <div className="flex flex-col">
      {collapsed ? (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{item}</TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        item
      )}

      {!collapsed && expanded && hasSubItems && (
        <div className="ml-6 mt-1 flex flex-col gap-1 space-y-0.5 relative">
          {/* Vertical line for tree structure */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

          {subItems.map((subItem, index) => (
            <div key={index} className="flex flex-col pl-4">
              <Link
                href={subItem.href}
                className={cn(
                  "rounded-md px-2 py-1.5 text-sm transition-colors",
                  pathname === subItem.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                )}
              >
                {subItem.label}
              </Link>

              {subItem.subItems && subItem.subItems.length > 0 && (
                <div className="ml-2 mt-1 flex flex-col gap-1 space-y-0.5 relative">
                  {/* Vertical line for nested tree structure */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

                  {subItem.subItems.map((tertiaryItem, idx) => (
                    <Link
                      key={idx}
                      href={tertiaryItem.href}
                      className={cn(
                        "rounded-md px-2 py-1 text-sm transition-colors ml-4",
                        pathname === tertiaryItem.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                      )}
                    >
                      {tertiaryItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function LeftNavigation({ collapsed, onToggleCollapse, onClose }: LeftNavigationProps) {
  const pathname = usePathname()
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  // Determine which section should be expanded based on the current path
  useEffect(() => {
    if (
      pathname.startsWith("/compute") ||
      pathname.startsWith("/storage") ||
      pathname.startsWith("/network") ||
      pathname.startsWith("/infrastructure")
    ) {
      setExpandedItem("/infrastructure")
    } else if (
      pathname.startsWith("/model-catalogue") ||
      pathname.startsWith("/fine-tuning") ||
      pathname.startsWith("/deployment") ||
      pathname.startsWith("/evaluation") ||
      pathname.startsWith("/bhashik") ||
      pathname.startsWith("/dis") ||
      pathname.startsWith("/ai-studio")
    ) {
      setExpandedItem("/ai-studio")
    } else if (
      pathname.startsWith("/billing") ||
      pathname.startsWith("/key-management") ||
      pathname.startsWith("/iam") ||
      pathname.startsWith("/administration")
    ) {
      setExpandedItem("/administration")
    } else {
      setExpandedItem(null)
    }
  }, [pathname])

  const handleExpand = (href: string) => {
    setExpandedItem(expandedItem === href ? null : href)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const isExactActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="flex h-screen flex-col border-r bg-background">
      {/* Header with logo and collapse button */}
      <div className={cn("flex h-16 items-center border-b px-4", collapsed ? "justify-center" : "justify-between")}>
        <div className={collapsed ? "flex items-center justify-center" : "flex items-center gap-2"}>
          <KrutrimLogo width={collapsed ? 40 : 120} height={40} />
        </div>

        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="hidden lg:flex">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main navigation items */}
      <div className={cn("flex-1 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
        <div className="flex flex-col gap-2">
          {/* Home */}
          <NavItem
            href="/dashboard"
            icon={<Home className="h-5 w-5" />}
            label="Home"
            exactActive={isExactActive("/dashboard")}
            active={isActive("/dashboard")}
            collapsed={collapsed}
          />

          {!collapsed && <div className="my-2 border-t" />}

          {/* Core Infrastructure */}
          <NavItem
            href="/infrastructure"
            icon={<Server className="h-5 w-5" />}
            label="Core Infrastructure"
            exactActive={isExactActive("/infrastructure")}
            active={isActive("/infrastructure")}
            collapsed={collapsed}
            expanded={expandedItem === "/infrastructure"}
            onExpand={handleExpand}
            subItems={[
              {
                href: "/compute",
                label: "Compute",
                subItems: [
                  { href: "/compute/machines", label: "Virtual Machines" },
                  { href: "/compute/ai-pods", label: "AI Pods" },
                ],
              },
              {
                href: "/storage",
                label: "Storage",
                subItems: [
                  { href: "/storage/block", label: "Block Storage" },
                  { href: "/storage/object", label: "Object Storage" },
                ],
              },
              {
                href: "/network",
                label: "Network",
                subItems: [
                  { href: "/network/vpc", label: "VPC" },
                  { href: "/network/security-groups", label: "Security Groups" },
                ],
              },
            ]}
          />

          {/* AI Studio */}
          <NavItem
            href="/ai-studio"
            icon={<Brain className="h-5 w-5" />}
            label="AI Studio"
            exactActive={isExactActive("/ai-studio")}
            active={isActive("/ai-studio")}
            collapsed={collapsed}
            expanded={expandedItem === "/ai-studio"}
            onExpand={handleExpand}
            subItems={[
              { href: "/model-catalogue", label: "Model Catalogue" },
              { href: "/fine-tuning", label: "Fine-tuning" },
              { href: "/deployment", label: "Deployment" },
              { href: "/evaluation", label: "Evaluation" },
              { href: "/bhashik", label: "Bhashik" },
              { href: "/dis", label: "DIS" },
            ]}
          />

          {/* Ola Maps */}
          <NavItem
            href="/ola-maps"
            icon={<Map className="h-5 w-5" />}
            label="Ola Maps"
            exactActive={isExactActive("/ola-maps")}
            active={isActive("/ola-maps")}
            collapsed={collapsed}
          />

          {!collapsed && <div className="my-2 border-t" />}

          {/* Administration */}
          <NavItem
            href="/administration"
            icon={<Settings className="h-5 w-5" />}
            label="Administration"
            exactActive={isExactActive("/administration")}
            active={isActive("/administration")}
            collapsed={collapsed}
            expanded={expandedItem === "/administration"}
            onExpand={handleExpand}
            subItems={[
              { href: "/billing", label: "Billing and Usage" },
              { href: "/key-management", label: "Key Management System" },
              { href: "/iam", label: "IAM" },
            ]}
          />
        </div>
      </div>

      {/* Bottom navigation items */}
      <div className={cn("mt-auto border-t", collapsed ? "px-2" : "px-3")}>
        <div className="py-3 flex flex-col gap-2">
          {/* Documentation */}
          <NavItem
            href="/documentation"
            icon={<BookOpen className="h-5 w-5" />}
            label="Documentation"
            exactActive={isExactActive("/documentation")}
            active={isActive("/documentation")}
            collapsed={collapsed}
          />

          {/* Support */}
          <NavItem
            href="/support"
            icon={<HelpCircle className="h-5 w-5" />}
            label="Support"
            exactActive={isExactActive("/support")}
            active={isActive("/support")}
            collapsed={collapsed}
          />
        </div>
      </div>
    </div>
  )
}
