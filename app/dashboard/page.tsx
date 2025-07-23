"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users, Server, Database, Cpu, BarChart3 } from "lucide-react"
import { CommandPaletteProvider } from "@/components/command/command-palette-provider"
import { AccessBanner } from "@/components/access-control/access-banner"
import { FeatureRestriction } from "@/components/access-control/feature-restriction"

import { AllowedServicesSection } from "@/components/dashboard/allowed-services-section"
import { DashboardSection } from "@/components/dashboard/dashboard-section"
import { IdentityVerificationModal } from "@/components/modals/identity-verification-modal"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { useEffect } from "react"

// Full access dashboard layout
function FullAccessDashboard() {
  return (
    <>
      {/* Existing dashboard content for full access users */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      {/* Basic Credits Card - Always accessible */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      </div>

      {/* Allowed Services Section */}
      <AllowedServicesSection />
    </>
  )
  }

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false)
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false)

  const handleVerifyIdentity = () => {
    setIsIdentityModalOpen(true)
  }

  const handleIdentityVerificationComplete = () => {
    toast({
      title: "Identity Verification Complete",
      description: "Your identity has been verified successfully. You now have full access to all Krutrim Cloud services."
    })
  }

  // Get first name fallback
  const firstName = user?.firstName || user?.name?.split(" ")[0] || "there"

  return (
    <CommandPaletteProvider>
      <div className="space-y-6 flex flex-col min-h-screen pb-12">
        <AccessBanner onCompleteProfile={handleVerifyIdentity} />

        {/* Welcome Message (now plain text, styled like Available Services) */}
        <div className="mb-2">
          <h2 className="text-3xl font-bold text-gray-900 text-left mb-1">Hey Rakesh,</h2>
          <div className="text-lg text-gray-700 font-normal text-left mb-1">Welcome back to Krutrim Cloud</div>
        </div>

        {/* Conditional rendering based on access level */}
        <DashboardSection section="Dashboard Content" requiredAccess="limited">
          <LimitedAccessDashboard />
        </DashboardSection>

        {/* Identity Verification Modal */}
        {user && (
          <IdentityVerificationModal
            isOpen={isIdentityModalOpen}
            onClose={() => setIsIdentityModalOpen(false)}
            onComplete={handleIdentityVerificationComplete}
            userData={{
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              name: user.name || '',
              email: user.email || '',
              mobile: user.mobile || '',
              accountType: user.accountType || 'individual',
              companyName: user.companyName || ''
            }}
          />
        )}

        {/* Spacer to push banner to bottom */}
        <div className="flex-1" />

        {/* Corporate Enquiry Banner using Card with blueish gradient and extra bottom spacing */}
        <Card className="w-full max-w-4xl mx-auto mb-16 border-0" style={{ background: 'linear-gradient(265deg, #E0E7FF 0%, #F0F7FF 100%)' }}>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
            <div className="text-base md:text-lg font-medium text-gray-900">Need help with enterprise deployments, custom solutions, or pricing?</div>
            <Button variant="default" size="default" onClick={() => setIsEnterpriseModalOpen(true)}>
              Contact Us &rarr;
            </Button>
          </CardContent>
        </Card>

        {/* Enterprise Query Modal using AlertDialog */}
        <AlertDialog open={isEnterpriseModalOpen} onOpenChange={setIsEnterpriseModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Enterprise Query Form</AlertDialogTitle>
              <AlertDialogDescription>
                Fill out the form and our team will get in touch with you for enterprise solutions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" defaultValue={user?.name || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2" defaultValue={user?.email || ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="Tell us about your requirements..." />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Submit</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CommandPaletteProvider>
  )
}
