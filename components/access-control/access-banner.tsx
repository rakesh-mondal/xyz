"use client"

import { AlertCircle, ArrowRight, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"
import { getRequiredStepsForUpgrade } from "@/lib/access-control"
import { useRouter } from "next/navigation"

interface AccessBannerProps {
  onCompleteProfile?: () => void
  className?: string
}

export function AccessBanner({ onCompleteProfile, className }: AccessBannerProps) {
  const { user, accessLevel } = useAuth()
  const router = useRouter()

  // Don't show banner for full access users
  if (accessLevel === 'full') return null

  const handleCompleteProfile = () => {
    if (onCompleteProfile) {
      onCompleteProfile()
    } else {
      router.push('/dashboard/profile-completion')
    }
  }

  const getProfileCompletionPercentage = () => {
    if (!user) return 0
    
    const { basicInfoComplete, identityVerified, paymentSetupComplete } = user.profileStatus
    const completed = [basicInfoComplete, identityVerified, paymentSetupComplete].filter(Boolean).length
    return Math.round((completed / 3) * 100)
  }

  const getRequiredSteps = () => {
    if (!user) return []
    
    const steps: string[] = []
    if (!user.profileStatus.identityVerified) {
      steps.push('Identity verification')
    }
    if (!user.profileStatus.paymentSetupComplete) {
      steps.push('Payment setup')
    }
    return steps
  }

  const requiredSteps = getRequiredSteps()
  const completionPercentage = getProfileCompletionPercentage()

  if (accessLevel === 'limited') {
    return (
      <Alert className={`mb-4 border-amber-200 bg-amber-50 ${className}`}>
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900">
          Complete your profile to unlock all features
          <Badge variant="outline" className="ml-2 text-xs bg-amber-100 text-amber-800">
            {completionPercentage}% Complete
          </Badge>
        </AlertTitle>
        <AlertDescription className="text-amber-800">
          <div className="mt-2">
            <p className="mb-3">
              You have access to documentation and cost tools. Complete {requiredSteps.join(' and ').toLowerCase()} for full access to compute, storage, and billing features.
            </p>
            
            {requiredSteps.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-medium text-amber-700">Remaining steps:</span>
                {requiredSteps.map((step, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-white/50 text-amber-700 border-amber-300">
                    {step}
                  </Badge>
                ))}
              </div>
            )}
            
            <Button 
              onClick={handleCompleteProfile}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Complete Profile
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (accessLevel === 'none') {
    return (
      <Alert className={`mb-4 border-red-200 bg-red-50 ${className}`}>
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-900">Account Setup Required</AlertTitle>
        <AlertDescription className="text-red-800">
          <div className="mt-2">
            <p className="mb-3">
              Please complete your account setup to access Krutrim Cloud features. You'll need to verify your identity and add a payment method.
            </p>
            <Button 
              onClick={handleCompleteProfile}
              variant="secondary"
            >
              Complete Setup
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

// Compact version for smaller spaces
export function AccessBannerCompact({ onCompleteProfile, className }: AccessBannerProps) {
  const { user, accessLevel } = useAuth()
  const router = useRouter()

  if (accessLevel === 'full') return null

  const handleCompleteProfile = () => {
    if (onCompleteProfile) {
      onCompleteProfile()
    } else {
      router.push('/dashboard/profile-completion')
    }
  }

  const getProfileCompletionPercentage = () => {
    if (!user) return 0
    
    const { basicInfoComplete, identityVerified, paymentSetupComplete } = user.profileStatus
    const completed = [basicInfoComplete, identityVerified, paymentSetupComplete].filter(Boolean).length
    return Math.round((completed / 3) * 100)
  }

  if (accessLevel === 'limited') {
    return (
      <div className={`flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm ${className}`}>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <span className="text-amber-800 font-medium">
            Profile {getProfileCompletionPercentage()}% complete
          </span>
          <span className="text-amber-700">• Unlock all features</span>
        </div>
        <Button 
          onClick={handleCompleteProfile}
          variant="secondary"
          size="sm"
          className="text-xs"
        >
          Complete
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg text-sm ${className}`}>
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <span className="text-red-800 font-medium">Setup required</span>
      </div>
      <Button 
        onClick={handleCompleteProfile}
        variant="secondary"
        size="sm"
        className="text-xs"
      >
        Setup
        <ArrowRight className="ml-1 h-3 w-3" />
      </Button>
    </div>
  )
} 