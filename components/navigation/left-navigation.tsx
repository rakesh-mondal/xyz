"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ServerIcon, 
  CpuChipIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  MapIcon, 
  CogIcon, 
  XMarkIcon, 
  HomeIcon, 
  BookOpenIcon, 
  QuestionMarkCircleIcon, 
  ChartBarIcon, 
  CircleStackIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  CubeIcon, 
  GlobeAmericasIcon, 
  KeyIcon, 
  BoltIcon 
} from "@heroicons/react/24/outline"
import { Settings, Activity, HelpCircle, BookOpen, ChevronRight, ChevronLeft, Network, HardDrive, Map, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

interface LeftNavigationProps {
  onClose: () => void
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  exactActive?: boolean
  collapsed?: boolean
  expanded?: string | null
  onExpand?: (href: string) => void
  subItems?: { href: string; label: string; subItems?: { href: string; label: string }[] }[]
  isCategory?: boolean
  expandedSubItem?: string | null
  onSubItemExpand?: (href: string) => void
}

const navigationConfig = {
  home: {
    href: "/",
    icon: <HomeIcon className="h-[18px] w-[18px] text-muted-foreground" />,
    label: "Home",
  },
  coreInfrastructure: {
    href: "/core-infrastructure",
    icon: <ServerIcon className="h-[18px] w-[18px] text-muted-foreground" />,
    label: "Core Infrastructure",
    isCategory: true,
    subItems: [
      {
        href: "/compute",
        label: "Compute",
        subItems: [
          {
            href: "/compute/vms",
            label: "VMs",
            subItems: [
              { href: "/compute/vms/cpu", label: "CPU VM" },
              { href: "/compute/vms/gpu", label: "GPU VM" },
              { href: "/compute/vms/ai-pods", label: "AI Pods" },
              { href: "/compute/vms/instances", label: "My Instances" },
              { href: "/compute/vms/images", label: "Machine Images" },
            ],
          },
          {
            href: "/compute/hpc",
            label: "HPC",
            subItems: [
              { href: "/compute/hpc/gpu-clusters", label: "GPU Clusters" },
              { href: "/compute/hpc/cpu-clusters", label: "CPU Clusters" },
              { href: "/compute/hpc/my-clusters", label: "My Clusters" },
            ],
          },
          {
            href: "/compute/auto-scaling",
            label: "Auto Scaling",
            subItems: [
              { href: "/compute/auto-scaling/asg", label: "ASG" },
              { href: "/compute/auto-scaling/templates", label: "Templates" },
            ],
          },
        ],
      },
      {
        href: "/networking",
        label: "Networking",
        subItems: [
          { href: "/networking/vpc", label: "VPC" },
          { href: "/networking/subnets", label: "Subnets" },
          { href: "/networking/security-groups", label: "Security Groups" },
          { href: "/networking/static-ips", label: "Static IP Addresses" },
        ],
      },
      {
        href: "/storage",
        label: "Storage",
        subItems: [
          {
            href: "/storage/block",
            label: "Block Storage",
            subItems: [
              { href: "/storage/block/volumes", label: "Volumes" },
              { href: "/storage/block/snapshots", label: "Snapshots" },
              { href: "/storage/block/backup", label: "Backup" },
            ],
          },
          {
            href: "/storage/object",
            label: "Object Storage",
            subItems: [
              { href: "/storage/object/buckets", label: "Buckets" },
              { href: "/storage/object/objects", label: "Objects" },
              { href: "/storage/object/properties", label: "Properties" },
            ],
          },
        ],
      },
    ],
  },
  aiStudio: {
    href: "/ai-studio",
    icon: <CpuChipIcon className="h-[18px] w-[18px] text-muted-foreground" />,
    label: "AI Studio",
    isCategory: true,
    subItems: [
      {
        href: "/ai-studio/models",
        label: "Models",
        subItems: [
          { href: "/ai-studio/models/catalog", label: "Model Catalogue" },
          { href: "/ai-studio/models/fine-tuning", label: "Fine-Tuning" },
          { href: "/ai-studio/models/evaluation", label: "Evaluation" },
          { href: "/ai-studio/models/deployments", label: "Deployments" },
          { href: "/ai-studio/models/rag", label: "RAG" },
        ],
      },
      {
        href: "/ai-studio/training",
        label: "Training"
      },
    ],
  },
  aiSolutions: {
    href: "/ai-solutions",
    icon: <CpuChipIcon className="h-[18px] w-[18px] text-muted-foreground" />,
    label: "AI Solutions",
    isCategory: true,
    subItems: [
      {
        href: "/ai-solutions/bhashik",
        label: "Bhashik",
        subItems: [
          { href: "/ai-solutions/bhashik/all-services", label: "All Services" },
          {
            href: "/ai-solutions/bhashik/text-services",
            label: "Text Services",
            subItems: [
              { href: "/ai-solutions/bhashik/text-services/translation", label: "Text Translation" },
              { href: "/ai-solutions/bhashik/text-services/language-detection", label: "Language Detection" },
            ],
          },
          {
            href: "/ai-solutions/bhashik/speech",
            label: "Speech",
            subItems: [
              { href: "/ai-solutions/bhashik/speech/tts", label: "TTS" },
              { href: "/ai-solutions/bhashik/speech/stt", label: "STT" },
            ],
          },
        ],
      },
      {
        href: "/ai-solutions/document-intelligence",
        label: "Document Intelligence",
        subItems: [
          { href: "/ai-solutions/document-intelligence/extract-text", label: "Extract Text" },
          { href: "/ai-solutions/document-intelligence/extract-info", label: "Extract Info" },
        ],
      },
      {
        href: "/ai-solutions/industrial",
        label: "Industrial Solutions",
        subItems: [
          { href: "/ai-solutions/industrial/manufacturing", label: "Industrial Manufacturing" },
          { href: "/ai-solutions/industrial/medical", label: "Medical Imaging" },
        ],
      },
    ],
  },
  maps: {
    href: "/maps",
    icon: <MapIcon className="h-[18px] w-[18px] text-muted-foreground" />,
    label: "Maps",
  },
  administration: {
    href: "/administration",
    icon: <Settings className="h-[18px] w-[18px] text-muted-foreground" />,
    label: "Administration",
    isCategory: true,
    subItems: [
      {
        href: "/administration/projects",
        label: "Projects"
      },
      {
        href: "/administration/iam",
        label: "Identity (IAM)",
        subItems: [
          {
            href: "/administration/iam/users",
            label: "Users",
            subItems: [
              { href: "/administration/iam/users/list", label: "Users List" },
              { href: "/administration/iam/users/invite", label: "Invite New User" },
              { href: "/administration/iam/users/edit", label: "Edit User" },
            ],
          },
          { href: "/administration/iam/groups", label: "User Groups" },
          {
            href: "/administration/iam/roles",
            label: "Roles",
            subItems: [
              { href: "/administration/iam/roles/predefined", label: "Pre-defined Roles" },
              { href: "/administration/iam/roles/definitions", label: "View Role Definitions" },
              { href: "/administration/iam/roles/policy-library", label: "Policy Library" },
              { href: "/administration/iam/roles/custom-policies", label: "Attach Custom Policies" },
            ],
          },
          { href: "/administration/iam/policies", label: "Policies" },
          {
            href: "/administration/iam/config",
            label: "IAM Configurations",
            subItems: [
              { href: "/administration/iam/config/session-timeout", label: "Default Session Timeout" },
              { href: "/administration/iam/config/invite-expiry", label: "Invite Expiry Settings" },
              { href: "/administration/iam/config/password-policy", label: "Password Policy Settings" },
              { href: "/administration/iam/config/mfa", label: "Enable/Disable MFA" },
            ],
          },
        ],
      },
      {
        href: "/administration/kms",
        label: "Key Management System (KMS)",
        subItems: [
          { href: "/administration/kms/storage", label: "Storage" },
          { href: "/administration/kms/models", label: "Models" },
          { href: "/administration/kms/ssh", label: "SSH Key" },
        ],
      },
      { href: "/administration/kcm", label: "KCM" },
      {
        href: "/billing",
        label: "Billing",
        subItems: [
          { href: "/billing/usage", label: "Usage" },
          { href: "/billing/transactions", label: "Transactions" },
        ],
      },
    ],
  },
  monitoring: {
    href: "/monitoring",
    icon: <Activity className="h-[18px] w-[18px] text-muted-foreground" />,
    label: "Monitoring",
  },
  support: {
    href: "/support",
    icon: <HelpCircle className="h-[18px] w-[18px] text-muted-foreground" />,
    label: "Support",
  },
  documentation: {
    href: "/documentation",
    icon: <BookOpen className="h-[18px] w-[18px] text-muted-foreground" />,
    label: "Documentation",
  },
}

const NavItem = ({ href, icon, label, active, exactActive, collapsed, expanded, onExpand, subItems, isCategory, expandedSubItem, onSubItemExpand }: NavItemProps) => {
  const hasSubItems = subItems && subItems.length > 0
  const pathname = usePathname()

  const handleToggleExpand = (e: React.MouseEvent) => {
    if (hasSubItems && onExpand && !isCategory) {
      e.preventDefault()
      onExpand(href)
    }
  }

  const isSubItemActive = (subItemHref: string) => {
    return pathname.startsWith(subItemHref)
  }

  const itemContent = (
    <>
      <div className="flex min-w-[24px] items-center text-foreground/80">{icon}</div>
      {!collapsed && (
        <>
          <span className={cn(
            "flex-1 truncate",
            isCategory 
              ? "text-xs font-semibold uppercase tracking-wider text-muted-foreground/70" 
              : "text-sm font-medium text-foreground/80"
          )}>
            {label}
          </span>
          {hasSubItems && !isCategory && <ChevronRight className={cn("h-4 w-4 transition-transform text-foreground/80", expanded === href && "rotate-90")} />}
        </>
      )}
    </>
  )

  if (isCategory) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          {itemContent}
        </div>
        {!collapsed && hasSubItems && (
          <div className="ml-[1.3rem] mt-1 flex flex-col gap-1 space-y-0.5 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
            {subItems.map((subItem, index) => (
              <div key={index} className="flex flex-col pl-4">
                <button
                  onClick={() => onSubItemExpand?.(subItem.href)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors text-left w-full",
                    (expandedSubItem === subItem.href || isSubItemActive(subItem.href))
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/80 hover:bg-accent/50 hover:text-accent-foreground",
                  )}
                >
                  <span className="flex-1">{subItem.label}</span>
                  {subItem.subItems && <ChevronRight className={cn("h-4 w-4 transition-transform text-foreground/80", expandedSubItem === subItem.href && "rotate-90")} />}
                </button>

                {subItem.subItems && subItem.subItems.length > 0 && expandedSubItem === subItem.href && (
                  <div className="ml-2 mt-1 flex flex-col gap-1 space-y-0.5 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
                    {subItem.subItems.map((tertiaryItem, idx) => (
                      <Link
                        key={idx}
                        href={tertiaryItem.href}
                        className={cn(
                          "rounded-md px-2 py-1.5 text-sm transition-colors ml-4",
                          pathname === tertiaryItem.href
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground/80 hover:bg-accent/50 hover:text-accent-foreground",
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

  const item = hasSubItems ? (
    <button
      onClick={handleToggleExpand}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-left",
        exactActive
          ? "bg-accent text-accent-foreground"
          : "text-foreground/80 hover:bg-accent/50 hover:text-accent-foreground",
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
          ? "bg-accent text-accent-foreground"
          : "text-foreground/80 hover:bg-accent/50 hover:text-accent-foreground",
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
        <div className="ml-[1.3rem] mt-1 flex flex-col gap-1 space-y-0.5 relative">
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
                    : "text-foreground hover:bg-accent/50 hover:text-accent-foreground",
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
                        "rounded-md px-2 py-1.5 text-sm transition-colors ml-4",
                        pathname === tertiaryItem.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent/50 hover:text-accent-foreground",
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

const navConfig = [
  {
    label: "Networking",
    icon: <Network className="mr-2 h-4 w-4" />,
    items: [
      { label: "VPC", href: "/networking/vpc" },
      { label: "Subnets", href: "/networking/subnets" },
      { label: "Security Groups", href: "/networking/security-groups" },
      { label: "Static IP Addresses", href: "/networking/static-ips" },
    ],
  },
  {
    label: "Storage",
    icon: <HardDrive className="mr-2 h-4 w-4" />,
    items: [
      { label: "Block Storage", href: "/storage/block/volumes" },
      { label: "Snapshots", href: "/storage/block/snapshots" },
      { label: "Backup", href: "/storage/block/backup" },
    ],
  },
  {
    label: "Maps",
    icon: <Map className="mr-2 h-4 w-4" />,
    items: [
      { label: "Maps", href: "/maps" },
    ],
  },
  // Add more sections as needed
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-background border-r h-full">
      <Accordion type="multiple" className="w-full">
        {navConfig.map((section) => (
          <AccordionItem value={section.label} key={section.label}>
            <AccordionTrigger>
              {section.icon}
              {section.label}
            </AccordionTrigger>
            <AccordionContent>
              {section.items.map((item) => (
                <Button
                  asChild
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start mb-1"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  )
}

export function LeftNavigation({ onClose }: LeftNavigationProps) {
  const pathname = usePathname()
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [expandedSubItem, setExpandedSubItem] = useState<string | null>(null)

  // Determine which section should be expanded based on the current path
  useEffect(() => {
    // Keep Core Infrastructure expanded for compute-related paths
    if (pathname.startsWith("/compute")) {
      setExpandedItem("/core-infrastructure")
      // Keep Compute expanded when in compute section
      setExpandedSubItem("/compute")
    } else if (pathname.startsWith("/ai-studio")) {
      setExpandedItem("/ai-studio")
    } else if (pathname.startsWith("/ai-solutions")) {
      setExpandedItem("/ai-solutions")
    } else if (pathname.startsWith("/administration")) {
      setExpandedItem("/administration")
    }
  }, [pathname])

  const handleExpand = (href: string) => {
    // Don't collapse if we're in the compute section
    if (pathname.startsWith("/compute") && href === "/core-infrastructure") {
      return
    }
    setExpandedItem(expandedItem === href ? null : href)
  }

  const handleSubItemExpand = (href: string) => {
    // Toggle Compute submenu
    if (href === "/compute") {
      setExpandedSubItem(expandedSubItem === href ? null : href)
      return
    }
    // Don't collapse VMs submenu when in VMs section
    if (pathname.startsWith("/compute/vms") && href === "/compute/vms") {
      return
    }
    setExpandedSubItem(expandedSubItem === href ? null : href)
  }

  const isActive = (path: string) => {
    // For Home menu item, consider both root path and dashboard path as active
    if (path === "/") {
      return pathname === "/" || pathname === "/dashboard"
    }
    // For compute section, check if path starts with the given path
    if (path === "/compute") {
      return pathname.startsWith("/compute")
    }
    if (path === "/compute/vms") {
      return pathname.startsWith("/compute/vms")
    }
    return pathname === path
  }

  const isExactActive = (path: string) => {
    // For Home menu item, consider both root path and dashboard path as active
    if (path === "/") {
      return pathname === "/" || pathname === "/dashboard"
    }
    // For compute section, check if path starts with the given path
    if (path === "/compute") {
      return pathname === "/compute"
    }
    if (path === "/compute/vms") {
      return pathname === "/compute/vms"
    }
    return pathname === path
  }

  return (
    <div className="flex h-screen flex-col border-r bg-background">
      {/* Mobile close button - only visible on mobile */}
      <div className="flex items-center justify-end px-4 py-2 lg:hidden">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main navigation items */}
      <div className="flex-1 overflow-y-auto py-3 px-3">
        <div className="flex flex-col gap-1.5">
          {/* Home */}
          <NavItem
            href={navigationConfig.home.href}
            icon={navigationConfig.home.icon}
            label={navigationConfig.home.label}
            exactActive={isExactActive(navigationConfig.home.href)}
            active={isActive(navigationConfig.home.href)}
          />

          <div className="my-1 border-t" />

          {/* Core Infrastructure */}
          <NavItem
            href={navigationConfig.coreInfrastructure.href}
            icon={navigationConfig.coreInfrastructure.icon}
            label={navigationConfig.coreInfrastructure.label}
            exactActive={isExactActive(navigationConfig.coreInfrastructure.href)}
            active={isActive(navigationConfig.coreInfrastructure.href)}
            expanded={expandedItem}
            onExpand={handleExpand}
            subItems={navigationConfig.coreInfrastructure.subItems}
            isCategory={navigationConfig.coreInfrastructure.isCategory}
            expandedSubItem={expandedSubItem}
            onSubItemExpand={handleSubItemExpand}
          />

          <div className="my-1 border-t" />

          {/* AI Studio */}
          <NavItem
            href={navigationConfig.aiStudio.href}
            icon={navigationConfig.aiStudio.icon}
            label={navigationConfig.aiStudio.label}
            exactActive={isExactActive(navigationConfig.aiStudio.href)}
            active={isActive(navigationConfig.aiStudio.href)}
            expanded={expandedItem}
            onExpand={handleExpand}
            subItems={navigationConfig.aiStudio.subItems}
            isCategory={navigationConfig.aiStudio.isCategory}
            expandedSubItem={expandedSubItem}
            onSubItemExpand={handleSubItemExpand}
          />

          {/* AI Solutions */}
          <NavItem
            href={navigationConfig.aiSolutions.href}
            icon={navigationConfig.aiSolutions.icon}
            label={navigationConfig.aiSolutions.label}
            exactActive={isExactActive(navigationConfig.aiSolutions.href)}
            active={isActive(navigationConfig.aiSolutions.href)}
            expanded={expandedItem}
            onExpand={handleExpand}
            subItems={navigationConfig.aiSolutions.subItems}
            isCategory={navigationConfig.aiSolutions.isCategory}
            expandedSubItem={expandedSubItem}
            onSubItemExpand={handleSubItemExpand}
          />

          {/* Maps */}
          <NavItem
            href={navigationConfig.maps.href}
            icon={navigationConfig.maps.icon}
            label={navigationConfig.maps.label}
            exactActive={isExactActive(navigationConfig.maps.href)}
            active={isActive(navigationConfig.maps.href)}
          />

          <div className="my-1 border-t" />

          {/* Administration */}
          <NavItem
            href={navigationConfig.administration.href}
            icon={navigationConfig.administration.icon}
            label={navigationConfig.administration.label}
            exactActive={isExactActive(navigationConfig.administration.href)}
            active={isActive(navigationConfig.administration.href)}
            expanded={expandedItem}
            onExpand={handleExpand}
            subItems={navigationConfig.administration.subItems}
            isCategory={navigationConfig.administration.isCategory}
            expandedSubItem={expandedSubItem}
            onSubItemExpand={handleSubItemExpand}
          />

          {/* Monitoring */}
          <NavItem
            href={navigationConfig.monitoring.href}
            icon={navigationConfig.monitoring.icon}
            label={navigationConfig.monitoring.label}
            exactActive={isExactActive(navigationConfig.monitoring.href)}
            active={isActive(navigationConfig.monitoring.href)}
          />
        </div>
      </div>

      {/* Bottom navigation items */}
      <div className="mt-auto border-t px-3">
        <div className="py-2.5 flex flex-col gap-1.5">
          {/* Support */}
          <NavItem
            href={navigationConfig.support.href}
            icon={navigationConfig.support.icon}
            label={navigationConfig.support.label}
            exactActive={isExactActive(navigationConfig.support.href)}
            active={isActive(navigationConfig.support.href)}
          />

          {/* Documentation */}
          <NavItem
            href={navigationConfig.documentation.href}
            icon={navigationConfig.documentation.icon}
            label={navigationConfig.documentation.label}
            exactActive={isExactActive(navigationConfig.documentation.href)}
            active={isActive(navigationConfig.documentation.href)}
          />
        </div>
      </div>
    </div>
  )
}

export default LeftNavigation;
