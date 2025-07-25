"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { ArrowRight, Shield, Zap, Globe, CreditCard, X, HelpCircle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

// Modal-optimized DigiLocker verification content
function IdentityVerificationModalContent({ userData, onComplete, onCancel }: { 
  userData: UserData, 
  onComplete: () => void, 
  onCancel: () => void 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const handleDigiLockerVerification = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate DigiLocker connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Call the completion handler
      onComplete()
    } catch (error) {
      console.error("Error with DigiLocker verification:", error)
      setError("DigiLocker verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center py-8 space-y-6">
      <Shield className="mx-auto h-20 w-20 text-blue-600" />
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Connect your DigiLocker</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We'll securely verify your PAN and Aadhaar details through DigiLocker to complete your identity verification instantly.
        </p>
      </div>
      
      {error && (
        <div className="flex items-center justify-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          <X className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <Button
        onClick={handleDigiLockerVerification}
        disabled={isLoading}
        className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-base"
        size="lg"
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Connecting to DigiLocker...
          </>
        ) : (
          "Connect DigiLocker"
        )}
      </Button>
    </div>
  )
}

interface UserData {
  firstName?: string
  lastName?: string
  name?: string
  email: string
  mobile: string
  accountType: "individual" | "organization"
  companyName?: string
  website?: string
  linkedinProfile?: string
  address?: string
  organizationType?: string
  natureOfBusiness?: string
  typeOfWorkload?: string
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
  const router = useRouter()
  
  // Parse name into first and last name if not already separated
  const getNameParts = (fullName: string) => {
    const parts = fullName.trim().split(' ')
    const firstName = parts[0] || ''
    const lastName = parts.slice(1).join(' ') || ''
    return { firstName, lastName }
  }

  const { firstName: defaultFirstName, lastName: defaultLastName } = 
    userData.firstName && userData.lastName 
      ? { firstName: userData.firstName, lastName: userData.lastName }
      : getNameParts(userData.name || '')

  const [formData, setFormData] = useState({
    firstName: userData.firstName || defaultFirstName,
    lastName: userData.lastName || defaultLastName,
    email: userData.email || "",
    mobile: userData.mobile || "",
    accountType: "organization" as const,
    companyName: userData.companyName || "",
    website: userData.website || "",
    linkedinProfile: userData.linkedinProfile || "",
    address: userData.address || "",
    organizationType: userData.organizationType || "",
    natureOfBusiness: userData.natureOfBusiness || "",
    typeOfWorkload: userData.typeOfWorkload || "",
  })

  const [originalData, setOriginalData] = useState({
    firstName: userData.firstName || defaultFirstName,
    lastName: userData.lastName || defaultLastName,
    email: userData.email || "",
    mobile: userData.mobile || "",
    accountType: "organization" as const,
    companyName: userData.companyName || "",
    website: userData.website || "",
    linkedinProfile: userData.linkedinProfile || "",
    address: userData.address || "",
    organizationType: userData.organizationType || "",
    natureOfBusiness: userData.natureOfBusiness || "",
    typeOfWorkload: userData.typeOfWorkload || "",
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [showIdentityVerificationModal, setShowIdentityVerificationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isProfileSaved, setIsProfileSaved] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  // Add state for password change success at the top of the component
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  // Check if form data has changed
  useEffect(() => {
    const isChanged = Object.keys(formData).some(
      key => formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData]
    )
    setHasChanges(isChanged)
  }, [formData, originalData])

  // Check if profile is complete (all required fields filled)
  const isProfileComplete = () => {
    const requiredFields = [
      'firstName',
      'lastName', 
      'email',
      'mobile',
      'companyName',
      'address',
      'organizationType',
      'typeOfWorkload',
      'natureOfBusiness'
    ]
    
    return requiredFields.every(field => {
      const value = formData[field as keyof typeof formData]
      return value && value.trim() !== ''
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSave = () => {
    // Save the form data
    setOriginalData(formData)
    setHasChanges(false)
    
    // Mark profile as saved
    setIsProfileSaved(true)
    
    // Show success modal after saving
    setShowSuccessModal(true)
    
    // You can add API call here to save the data
  }

  const handleCancel = () => {
    // Reset form to original data
    setFormData(originalData)
    setHasChanges(false)
  }

  const handleVerifyIdentity = () => {
    // Save current form data first if there are changes
    if (hasChanges) {
      handleSave()
    }
    
    // Show the identity verification modal
    setShowIdentityVerificationModal(true)
  }

  const handleIdentityVerificationComplete = () => {
    // Update profile status to mark identity as verified
    updateProfileStatus({ 
      basicInfoComplete: true,
      identityVerified: true 
    })
    
    // Close modal
    setShowIdentityVerificationModal(false)
    
    // Complete the profile flow
    if (onComplete) {
      onComplete()
    }
  }

  const handleIdentityVerificationCancel = () => {
    // Close modal without completing verification
    setShowIdentityVerificationModal(false)
  }

  const handleSuccessModalVerifyIdentity = () => {
    // Close success modal and open identity verification modal
    setShowSuccessModal(false)
    setShowIdentityVerificationModal(true)
  }

  const handleSuccessModalClose = () => {
    // Just close the success modal
    setShowSuccessModal(false)
  }

  const benefits = [
    {
      icon: <Zap className="h-5 w-5 text-blue-600" />,
      title: "Compute Power",
      description: "Spin up CPU/GPU instances instantly"
    },
    {
      icon: <Shield className="h-5 w-5 text-green-600" />,
      title: "Secure Storage",
      description: "Reliable block & object storage"
    },
    {
      icon: <Globe className="h-5 w-5 text-purple-600" />,
      title: "AI Suite",
      description: "Pre-trained models and ML tools"
    },
    {
      icon: <CreditCard className="h-5 w-5 text-orange-600" />,
      title: "Smart Billing",
      description: "Real-time usage and cost controls"
    }
  ]

  const organizationTypes = [
    "Company",
    "Partnership",
    "Proprietorship",
    "LLP",
    "Private Limited",
    "Public Limited",
    "Non-Profit",
    "Government",
    "Educational Institution",
    "Startup"
  ]

  const workloadTypes = [
    "Web Development",
    "Mobile App Development",
    "Data Analytics",
    "Machine Learning",
    "AI Research",
    "DevOps",
    "Testing & QA",
    "Enterprise Software",
    "E-commerce",
    "Gaming",
    "Media & Entertainment",
    "Financial Services",
    "Healthcare",
    "Education",
    "Other"
  ]

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main Content - Left Side */}
      <div className="flex-1 space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-5">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="block mb-2 font-medium">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="block mb-2 font-medium">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  />
                </div>
              </div>

              {/* Email and Mobile - Non-editable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="block mb-2 font-medium">
                    <div className="flex items-center gap-2">
                      Email Address <span className="text-destructive">*</span>
                      <TooltipWrapper content="Email address cannot be modified">
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipWrapper>
                    </div>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    className="focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="mobile" className="block mb-2 font-medium">
                    <div className="flex items-center gap-2">
                      Mobile Number <span className="text-destructive">*</span>
                      <TooltipWrapper content="Mobile number cannot be modified">
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipWrapper>
                    </div>
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    className="focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/* Account Type - Non-editable */}
              <div>
                <Label htmlFor="accountType" className="block mb-2 font-medium">
                  <div className="flex items-center gap-2">
                    Account Type <span className="text-destructive">*</span>
                    <TooltipWrapper content="Account type cannot be changed">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipWrapper>
                  </div>
                </Label>
                <Input
                  value="Organisation"
                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-50 cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>

              {/* Organization fields */}
                  {/* Company Name */}
                  <div>
                    <Label htmlFor="companyName" className="block mb-2 font-medium">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      required
                    />
                  </div>

                                     {/* Website and LinkedIn Profile */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="website" className="block mb-2 font-medium">
                         Website
                       </Label>
                       <Input
                         id="website"
                         placeholder="https://yourcompany.com"
                         value={formData.website}
                         onChange={handleChange}
                         className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                       />
                     </div>
                     <div>
                       <Label htmlFor="linkedinProfile" className="block mb-2 font-medium">
                         LinkedIn Profile
                       </Label>
                       <Input
                         id="linkedinProfile"
                         placeholder="https://linkedin.com/in/yourprofile"
                         value={formData.linkedinProfile}
                         onChange={handleChange}
                         className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                       />
                     </div>
                   </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address" className="block mb-2 font-medium">
                      Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address"
                      value={formData.address}
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      rows={3}
                      required
                    />
                  </div>

                                     {/* Organisation Type and Type of Workload */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="organizationType" className="block mb-2 font-medium">
                         Organisation Type <span className="text-destructive">*</span>
                       </Label>
                       <Select 
                         value={formData.organizationType} 
                         onValueChange={(value) => handleSelectChange("organizationType", value)}
                         required
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Select organisation type" />
                         </SelectTrigger>
                         <SelectContent>
                           {organizationTypes.map((type) => (
                             <SelectItem key={type} value={type}>
                               {type}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                     <div>
                       <Label htmlFor="typeOfWorkload" className="block mb-2 font-medium">
                         Type of Workload <span className="text-destructive">*</span>
                       </Label>
                       <Select 
                         value={formData.typeOfWorkload} 
                         onValueChange={(value) => handleSelectChange("typeOfWorkload", value)}
                         required
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Select your workload type" />
                         </SelectTrigger>
                         <SelectContent>
                           {workloadTypes.map((type) => (
                             <SelectItem key={type} value={type}>
                               {type}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                   </div>

                   {/* Nature of Business */}
                   <div>
                     <Label htmlFor="natureOfBusiness" className="block mb-2 font-medium">
                       Nature of Business <span className="text-destructive">*</span>
                     </Label>
                     <Textarea
                       id="natureOfBusiness"
                       placeholder="Describe your business activities and industry"
                       value={formData.natureOfBusiness}
                       onChange={handleChange}
                       className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                       rows={3}
                       required
                     />
                   </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={!hasChanges}
                className="hover:bg-secondary transition-colors"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasChanges}
                className="bg-black text-white hover:bg-black/90 transition-colors"
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Panel - Right Side */}
      <div className="w-full md:w-80 space-y-6">
        {/* Benefits Panel */}
        <div 
          style={{
            borderRadius: '16px',
            border: '4px solid #FFF',
            background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
            boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
            padding: '1.5rem'
          }}
        >
          <div className="pb-4">
            <h3 className="text-base font-semibold">Finish your KYC to get full access</h3>
          </div>
          <div className="space-y-4 mb-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{benefit.title}</h4>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Verify Identity Button */}
          <Button 
            type="button"
            onClick={handleVerifyIdentity}
            disabled={!isProfileComplete() && !isProfileSaved}
            className="w-full bg-black text-white hover:bg-black/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Verify your identity
          </Button>
        </div>
        {/* Change Password Button OUTSIDE the KYC card */}
        <Button
          type="button"
          onClick={() => setShowChangePasswordModal(true)}
          className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100 transition-colors mt-4"
        >
          Change Password
        </Button>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="p-0 bg-white max-w-md w-full overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b">
            <DialogHeader>
              <DialogTitle>Profile Updated Successfully!</DialogTitle>
              <DialogDescription>
                Your profile has been saved. Now verify your identity to unlock full access.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 text-center">
            <div className="space-y-6">
              <Shield className="mx-auto h-16 w-16 text-green-600" />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Profile Successfully Updated</h3>
                <p className="text-gray-600">
                  Great! Your profile information has been saved. Complete your identity verification to access all Krutrim Cloud features.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-6 border-t bg-gray-50">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSuccessModalClose}
                className="flex-1"
              >
                Later
              </Button>
              <Button
                onClick={handleSuccessModalVerifyIdentity}
                className="flex-1 bg-black text-white hover:bg-black/90"
              >
                Verify Identity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Identity Verification Modal */}
      <Dialog open={showIdentityVerificationModal} onOpenChange={setShowIdentityVerificationModal}>
        <DialogContent className="p-0 bg-white max-w-[60vw] max-h-[70vh] w-[60vw] h-auto overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b">
            <DialogHeader>
              <DialogTitle>Identity Verification</DialogTitle>
              <DialogDescription>
                Verify your identity to unlock full access to Krutrim Cloud services
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex gap-6 min-h-0 p-6">
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center">
              <IdentityVerificationModalContent
                userData={formData}
                onComplete={handleIdentityVerificationComplete}
                onCancel={handleIdentityVerificationCancel}
              />
            </div>

            {/* Side Panel - Verification Tips */}
            <div className="w-80 flex-shrink-0">
              <div 
                style={{
                  borderRadius: '16px',
                  border: '4px solid #FFF',
                  background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
                  boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
                  padding: '1.5rem'
                }}
              >
                <div className="pb-4">
                  <h3 className="text-base font-semibold">Verification Tips:</h3>
                </div>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Secure Process</p>
                      <p className="text-xs">Your documents are encrypted and processed securely</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Quick Verification</p>
                      <p className="text-xs">DigiLocker verification is instant</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Globe className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Full Access</p>
                      <p className="text-xs">Unlock all cloud services and features</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Your documents are processed securely</p>
                    <p>• No documents are stored on our servers</p>
                    <p>• Verification completes in seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Need help? Contact our support team for assistance.
              </p>
              <Button
                variant="outline"
                onClick={handleIdentityVerificationCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={showChangePasswordModal} onOpenChange={isOpen => {
        setShowChangePasswordModal(isOpen);
        if (!isOpen) setChangePasswordSuccess(false); // Reset on close
      }}>
        <DialogContent className="p-0 bg-white max-w-md w-full overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new password.
              </DialogDescription>
            </DialogHeader>
          </div>
          {/* Main Content */}
          {changePasswordSuccess ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Password changed successfully!</h3>
              <p className="text-gray-600 mb-6">Your password has been updated.</p>
              <Button
                type="button"
                className="bg-black text-white hover:bg-black/90 px-8"
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setChangePasswordSuccess(false);
                }}
              >
                Close
              </Button>
            </div>
          ) : (
            <form
              className="flex-1 p-6 space-y-5"
              onSubmit={e => {
                e.preventDefault();
                setChangePasswordSuccess(true);
              }}
            >
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-black text-white hover:bg-black/90"
                >
                  Change Password
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 