"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  User, 
  Shield, 
  CreditCard,
  Clock,
  Star
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

export function ProfileCompletionCard() {
  const { user, accessLevel } = useAuth()
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  if (!user || accessLevel === 'full') {
    return null
  }

  const getCompletionData = () => {
    const { basicInfoComplete, identityVerified, paymentSetupComplete } = user.profileStatus
    
    const steps = [
      {
        id: 'basic',
        label: 'Basic Information',
        description: 'Account setup completed',
        completed: basicInfoComplete,
        icon: User,
        required: true
      },
      {
        id: 'identity',
        label: 'Identity Verification',
        description: 'Verify your identity for security',
        completed: identityVerified,
        icon: Shield,
        required: true
      },
      {
        id: 'payment',
        label: 'Payment Method',
        description: 'Setup payment for paid services',
        completed: paymentSetupComplete,
        icon: CreditCard,
        required: true
      }
    ]

    const completedCount = steps.filter(step => step.completed).length
    const percentage = Math.round((completedCount / steps.length) * 100)
    const nextStep = steps.find(step => !step.completed)

    return {
      steps,
      completedCount,
      totalSteps: steps.length,
      percentage,
      nextStep
    }
  }

  const { steps, completedCount, totalSteps, percentage, nextStep } = getCompletionData()

  const handleCompleteProfile = () => {
    router.push('/dashboard/profile-completion')
  }

  const getProgressColor = () => {
    if (percentage >= 100) return "bg-green-500"
    if (percentage >= 67) return "bg-blue-500"
    if (percentage >= 33) return "bg-amber-500"
    return "bg-gray-400"
  }

  return (
    <Card 
      className="border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-blue-50 hover:border-primary/50 transition-all duration-200 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCompleteProfile}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Star className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Complete Your Profile</CardTitle>
              <CardDescription className="text-sm">
                Unlock all features and get full access to Krutrim Cloud
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={percentage === 100 ? "default" : "secondary"}
            className={`${percentage === 100 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"} text-xs font-medium`}
          >
            {completedCount}/{totalSteps} Complete
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profile completion</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <div className="relative">
            <Progress value={percentage} className="h-2" />
            <div className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${getProgressColor()}`} 
                 style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {/* Steps Overview */}
        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                  step.completed 
                    ? "bg-green-100 text-green-600" 
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${step.completed ? "text-green-800" : "text-gray-700"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Next Step Highlight */}
        {nextStep && (
          <div className="mt-4 p-3 bg-white/50 border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Next Step</span>
            </div>
            <p className="text-sm text-gray-700">{nextStep.label}</p>
            <p className="text-xs text-muted-foreground">{nextStep.description}</p>
          </div>
        )}

        {/* CTA Button */}
        <Button 
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
          onClick={handleCompleteProfile}
        >
          <span>{nextStep ? `Complete ${nextStep.label}` : 'Complete Profile'}</span>
          <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
        </Button>

        {/* Benefits Preview */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-muted-foreground mb-2">Unlock with profile completion:</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">Compute Resources</Badge>
            <Badge variant="outline" className="text-xs">Storage Solutions</Badge>
            <Badge variant="outline" className="text-xs">Advanced AI</Badge>
            <Badge variant="outline" className="text-xs">Priority Support</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 