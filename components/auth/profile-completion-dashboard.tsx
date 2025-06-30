"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Zap, Globe, CreditCard } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

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
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    mobile: userData.mobile || "",
    accountType: userData.accountType || "individual",
    companyName: userData.companyName || "",
  })

  const [originalData, setOriginalData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    mobile: userData.mobile || "",
    accountType: userData.accountType || "individual",
    companyName: userData.companyName || "",
  })

  const [hasChanges, setHasChanges] = useState(false)

  // Check if form data has changed
  useEffect(() => {
    const isChanged = Object.keys(formData).some(
      key => formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData]
    )
    setHasChanges(isChanged)
  }, [formData, originalData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // You can add API call here to save the data
  }

  const handleCancel = () => {
    // Reset form to original data
    setFormData(originalData)
    setHasChanges(false)
  }

  const handleVerifyIdentity = () => {
    // Update profile status
    updateProfileStatus({ 
      basicInfoComplete: true 
    })
    
    // Proceed to identity verification
    if (onComplete) {
      onComplete()
    }
  }

  const benefits = [
    {
      icon: <Zap className="h-5 w-5 text-blue-600" />,
      title: "Compute Resources",
      description: "Access to CPU and GPU instances"
    },
    {
      icon: <Shield className="h-5 w-5 text-green-600" />,
      title: "Storage Solutions",
      description: "Block and object storage services"
    },
    {
      icon: <Globe className="h-5 w-5 text-purple-600" />,
      title: "Advanced AI",
      description: "AI models and machine learning tools"
    },
    {
      icon: <CreditCard className="h-5 w-5 text-orange-600" />,
      title: "Billing Features",
      description: "Usage tracking and billing management"
    }
  ]

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main Content - Left Side */}
      <div className="flex-1 space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <Label htmlFor="name" className="block mb-2 font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="block mb-2 font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <Label htmlFor="mobile" className="block mb-2 font-medium">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                />
              </div>

              {/* Account Type */}
              <div>
                <Label htmlFor="accountType" className="block mb-2 font-medium">
                  Account Type <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.accountType} 
                  onValueChange={(value) => handleSelectChange("accountType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Company Name (conditional) */}
              {formData.accountType === "organization" && (
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
              )}
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
            <h3 className="text-base font-semibold">Complete your profile to unlock:</h3>
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
            onClick={handleVerifyIdentity}
            className="w-full bg-black text-white hover:bg-black/90 transition-colors"
          >
            Verify your identity
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 