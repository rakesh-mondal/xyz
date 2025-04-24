"use client"

import Link from "next/link"
import { Bell, User, Settings, Globe, CreditCard, Menu, ChevronDown, BarChart2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"
import { LogoutButton } from "@/components/auth/logout-button"
import { GlobalSearch } from "@/components/search/global-search"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"

interface TopHeaderProps {
  onMenuClick?: () => void
  isMobile?: boolean
}

interface User {
  name: string
  email: string
}

export function TopHeader({ onMenuClick, isMobile }: TopHeaderProps) {
  const { user } = useAuth() as { user: User | null }

  // Sample regions for the region selector
  const regions = [
    { id: "in-blr", name: "Bengaluru" },
    { id: "in-hyd", name: "Hyderabad" },
  ]

  // Sample usage data
  const usageData = {
    total: 5000,
    used: 3200,
    remaining: 1800,
    breakdown: [
      { name: "Compute", used: 1500, total: 2000 },
      { name: "Storage", used: 1000, total: 2000 },
      { name: "Network", used: 700, total: 1000 },
    ],
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - Mobile menu button and search */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}

          <div className="w-[500px]">
            <GlobalSearch />
          </div>
        </div>

        {/* Right side - Region selector, notifications, help, and user profile */}
        <div className="flex items-center gap-3">
          {/* Credits display */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 h-9 px-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">₹5,000 credits</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Credits Overview</h4>
                    <span className="text-sm text-muted-foreground">₹{usageData.remaining} remaining</span>
                  </div>
                  <Progress value={(usageData.used / usageData.total) * 100} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Used: ₹{usageData.used}</span>
                    <span className="text-muted-foreground">Total: ₹{usageData.total}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Usage Breakdown</h4>
                  {usageData.breakdown.map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground">₹{item.used} / ₹{item.total}</span>
                      </div>
                      <Progress value={(item.used / item.total) * 100} className="h-1" />
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    View Detailed Usage
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Region selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 h-9 px-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="max-w-[120px] truncate text-sm">{regions[0].name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Select Region</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {regions.map((region) => (
                <DropdownMenuItem key={region.id} className="cursor-pointer py-2">
                  <div className="flex flex-col">
                    <span className="text-sm">{region.name}</span>
                    <span className="text-xs text-muted-foreground">{region.id}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start">
                  <div className="font-medium">VM Deployment Complete</div>
                  <div className="text-xs text-muted-foreground">Your VM instance is now running</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start">
                  <div className="font-medium">Billing Alert</div>
                  <div className="text-xs text-muted-foreground">You've used 80% of your credits</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start">
                  <div className="font-medium">Maintenance Scheduled</div>
                  <div className="text-xs text-muted-foreground">Scheduled maintenance on June 15</div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="w-full cursor-pointer text-center text-sm">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Krutrim User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@krutrim.ai"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
