"use client"

import { ReactNode } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { FeatureRestriction } from "@/components/access-control/feature-restriction"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface DashboardSectionProps {
  section: string
  requiredAccess?: 'limited' | 'full'
  children: ReactNode
  feature?: string
  className?: string
  showOverlay?: boolean
}

function RedirectToSignup() {
  const router = useRouter()
  
  // Auto-redirect to signup for unauthenticated users
  if (typeof window !== 'undefined') {
    router.push('/auth/signin')
  }
  
  return (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed">
      <p className="text-gray-600">Redirecting to sign in...</p>
    </div>
  )
}

function RestrictedFeatureCard({ section }: { section: string }) {
  const router = useRouter()
  
  const handleCompleteProfile = () => {
    router.push('/dashboard/profile-completion')
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-[2px] z-10 rounded-md border border-gray-200 border-dashed">
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {section} Requires Profile Completion
            </h3>
            <p className="text-xs text-gray-600 mb-4 max-w-sm">
              Complete your profile to unlock {section.toLowerCase()} features and access all services.
            </p>
            <Button 
              onClick={handleCompleteProfile}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white text-xs"
            >
              Complete Profile
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
      <div className="opacity-30 pointer-events-none">
        {/* Placeholder content to maintain layout */}
        <div className="p-6 bg-white rounded-lg border">
          <div className="h-24 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  )
}

function FullAccessSection({ section, children }: { section: string; children: ReactNode }) {
  return <>{children}</>
}

export function DashboardSection({ 
  section, 
  requiredAccess = 'limited', 
  children, 
  feature,
  className,
  showOverlay = true
}: DashboardSectionProps) {
  const { accessLevel } = useAuth()
  
  // Handle unauthenticated users
  if (accessLevel === 'none') {
    return <RedirectToSignup />
  }
  
  // Handle feature-specific access control using existing FeatureRestriction
  if (feature) {
    return (
      <FeatureRestriction 
        feature={feature}
        showOverlay={showOverlay}
        fallback={<RestrictedFeatureCard section={section} />}
      >
        <div className={className}>
          {children}
        </div>
      </FeatureRestriction>
    )
  }
  
  // Handle direct access level checking
  if (requiredAccess === 'full' && accessLevel === 'limited') {
    return <RestrictedFeatureCard section={section} />
  }
  
  return <FullAccessSection section={section}>{children}</FullAccessSection>
}

// Higher-order component for wrapping sections
export function withDashboardAccess<T extends {}>(
  WrappedComponent: React.ComponentType<T>,
  section: string,
  options?: {
    requiredAccess?: 'limited' | 'full'
    feature?: string
    showOverlay?: boolean
  }
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const DashboardAccessComponent = (props: T) => {
    return (
      <DashboardSection
        section={section}
        requiredAccess={options?.requiredAccess}
        feature={options?.feature}
        showOverlay={options?.showOverlay}
      >
        <WrappedComponent {...props} />
      </DashboardSection>
    )
  }

  DashboardAccessComponent.displayName = `withDashboardAccess(${displayName})`
  return DashboardAccessComponent
} 