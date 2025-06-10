import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users, Server, Database, Cpu, BarChart3 } from "lucide-react"
import { CommandPaletteProvider } from "@/components/command/command-palette-provider"
import { AccessBanner } from "@/components/access-control/access-banner"
import { FeatureRestriction } from "@/components/access-control/feature-restriction"
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card"
import { AllowedServicesSection } from "@/components/dashboard/allowed-services-section"
import { DashboardSection } from "@/components/dashboard/dashboard-section"

// Full access dashboard layout
function FullAccessDashboard() {
  return (
    <>
      {/* Existing dashboard content for full access users */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹5,000</div>
            <p className="text-xs text-muted-foreground">+₹1,000 from last month</p>
          </CardContent>
        </Card>

        <FeatureRestriction feature="compute">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Resources</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 since yesterday</p>
            </CardContent>
          </Card>
        </FeatureRestriction>

        <FeatureRestriction feature="storage">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">256 GB</div>
              <p className="text-xs text-muted-foreground">+12 GB from last week</p>
            </CardContent>
          </Card>
        </FeatureRestriction>

        <FeatureRestriction feature="compute">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42%</div>
              <p className="text-xs text-muted-foreground">-8% from average</p>
            </CardContent>
          </Card>
        </FeatureRestriction>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <FeatureRestriction feature="infrastructure">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
              <CardDescription>Your resource usage over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <BarChart3 className="h-16 w-16 text-muted" />
                <span className="ml-2 text-muted-foreground">Usage chart will appear here</span>
              </div>
            </CardContent>
          </Card>
        </FeatureRestriction>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your recent activities on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-blue-100">
                  <Server className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-xs text-muted-foreground">Welcome to Krutrim Cloud</p>
                </div>
              </div>

              <FeatureRestriction feature="compute" showOverlay={false}>
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-blue-100">
                    <Server className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">VM Instance Created</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </FeatureRestriction>

              <FeatureRestriction feature="storage" showOverlay={false}>
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-green-100">
                    <Database className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Storage Bucket Created</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </FeatureRestriction>

              <FeatureRestriction feature="advanced-ai" showOverlay={false}>
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-purple-100">
                    <Activity className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Model Training Started</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </FeatureRestriction>

              <FeatureRestriction feature="billing" showOverlay={false}>
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-orange-100">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Credits Added</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </FeatureRestriction>

              <FeatureRestriction feature="team-management" showOverlay={false}>
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-red-100">
                    <Users className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Team Member Added</p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
              </FeatureRestriction>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Limited access dashboard layout
function LimitedAccessDashboard() {
  return (
    <>
      {/* ProfileCompletionCard removed for now */}

      {/* Basic Credits Card - Always accessible */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹5,000</div>
            <p className="text-xs text-muted-foreground">+₹1,000 from last month</p>
          </CardContent>
        </Card>

        {/* Restricted Resource Cards with overlay */}
        <DashboardSection section="Compute Resources" feature="compute">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Resources</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Complete profile to access</p>
            </CardContent>
          </Card>
        </DashboardSection>

        <DashboardSection section="Storage" feature="storage">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Complete profile to access</p>
            </CardContent>
          </Card>
        </DashboardSection>

        <DashboardSection section="Infrastructure" feature="infrastructure">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Complete profile to access</p>
            </CardContent>
          </Card>
        </DashboardSection>
      </div>

      {/* Allowed Services Section */}
      <AllowedServicesSection />
    </>
  )
}

export default function DashboardPage() {
  return (
    <CommandPaletteProvider>
      <div className="space-y-6">
        <AccessBanner />

        <div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">Last updated: 5 minutes ago</span>
            </div>
          </div>
        </div>

        {/* Conditional rendering based on access level */}
        <DashboardSection section="Dashboard Content" requiredAccess="limited">
          <LimitedAccessDashboard />
        </DashboardSection>


      </div>
    </CommandPaletteProvider>
  )
}
