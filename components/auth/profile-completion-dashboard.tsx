"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"

// Import section components
import { BasicInfoSection } from "./profile-sections/basic-info-section"
import { IdentityVerificationSection } from "./profile-sections/identity-verification-section"

interface ProfileSection {
  id: string
  title: string
  status: 'completed' | 'in-progress' | 'pending'
  component: React.ComponentType<any>
  required: boolean
}

interface UserData {
  name: string
  email: string
  mobile: string
  accountType: "individual" | "organization"
  companyName?: string
}

interface ProfileCompletionDashboardProps {
  userData: UserData
  onComplete?: () => void
  onSkip?: () => void
}

export function ProfileCompletionDashboard({ 
  userData, 
  onComplete, 
  onSkip 
}: ProfileCompletionDashboardProps) {
  const { updateProfileStatus } = useAuth()
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [sectionsStatus, setSectionsStatus] = useState({
    'basic-info': 'completed' as const,
    'identity-verification': 'pending' as const,
  })

  const profileSections: ProfileSection[] = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      status: sectionsStatus['basic-info'],
      component: BasicInfoSection,
      required: true
    },
    {
      id: 'identity-verification',
      title: 'Identity Verification',
      status: sectionsStatus['identity-verification'],
      component: IdentityVerificationSection,
      required: true
    }
  ]

  // Calculate completion percentage
  const completedSections = profileSections.filter(section => section.status === 'completed').length
  const totalSections = profileSections.length
  const completionPercentage = Math.round((completedSections / totalSections) * 100)

  const getStatusIcon = (status: ProfileSection['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: ProfileSection['status']) => {
    const variants = {
      completed: "bg-green-100 text-green-800 border-green-200",
      'in-progress': "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-gray-100 text-gray-600 border-gray-200"
    }

    const labels = {
      completed: "Complete",
      'in-progress': "In Progress",
      pending: "Pending"
    }

    return (
      <Badge variant="outline" className={cn("text-xs font-medium", variants[status])}>
        {labels[status]}
      </Badge>
    )
  }

  const handleSectionComplete = (sectionId: string) => {
    setSectionsStatus(prev => ({
      ...prev,
      [sectionId]: 'completed'
    }))
    setCurrentSection(null)

    // Update profile status in auth provider
    if (sectionId === 'identity-verification') {
      updateProfileStatus({ identityVerified: true })
    }

    // Check if all sections are completed
    const updatedStatus = { ...sectionsStatus, [sectionId]: 'completed' as const }
    const allCompleted = Object.values(updatedStatus).every(status => status === 'completed')
    
    if (allCompleted && onComplete) {
      // Update all profile completion status
      updateProfileStatus({ 
        basicInfoComplete: true,
        identityVerified: true
      })
      
      // Force refresh access level and add delay for state sync
      setTimeout(() => {
        onComplete()
      }, 150)
    }
  }

  const handleSectionStart = (sectionId: string) => {
    setSectionsStatus(prev => ({
      ...prev,
      [sectionId]: 'in-progress'
    }))
    setCurrentSection(sectionId)
  }

  const renderSection = (section: ProfileSection) => {
    const Component = section.component
    return (
      <Component
        userData={userData}
        onComplete={() => handleSectionComplete(section.id)}
        onCancel={() => setCurrentSection(null)}
      />
    )
  }

  // If a section is currently being edited
  if (currentSection) {
    const section = profileSections.find(s => s.id === currentSection)
    if (section) {
      return renderSection(section)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-600">
          Finish setting up your account to unlock all Krutrim Cloud features
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Profile Completion</CardTitle>
            <Badge variant="outline" className="text-sm font-semibold">
              {completionPercentage}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="mb-4" />
          <div className="text-sm text-gray-600">
            {completedSections} of {totalSections} sections completed
          </div>
        </CardContent>
      </Card>

      {/* Profile Sections */}
      <div className="space-y-6">
        {profileSections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(section.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {section.id === 'basic-info' && "Your account information from signup"}
                      {section.id === 'identity-verification' && "Verify your identity for enhanced security"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(section.status)}
                  
                  {section.status === 'pending' && (
                    <Button
                      onClick={() => handleSectionStart(section.id)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Start
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {section.status === 'completed' && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentSection(section.id)}
                    >
                      Edit
                    </Button>
                  )}

                  {section.status === 'in-progress' && (
                    <Button
                      onClick={() => setCurrentSection(section.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        {completionPercentage === 100 ? (
          <Button
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Complete Setup
          </Button>
        ) : (
          onSkip && (
            <Button
              variant="outline"
              onClick={onSkip}
              className="px-8"
            >
              Skip for Now
            </Button>
          )
        )}
      </div>

      {/* Benefits Reminder */}
      {completionPercentage < 100 && (
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Complete your profile to unlock:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
              <div>• Full compute and storage access</div>
              <div>• Priority technical support</div>
              <div>• Advanced security features</div>
              <div>• Enterprise-grade SLA</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 