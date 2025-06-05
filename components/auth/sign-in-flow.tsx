"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SignInForm } from "./sign-in-form"
import { TwoFactorForm } from "./two-factor-form"
import { TrustDeviceDialog } from "./trust-device-dialog"

type AuthStep = "signin" | "2fa" | "trust-device" | "complete"

export function SignInFlow() {
  const router = useRouter()
  const [authStep, setAuthStep] = useState<AuthStep>("signin")
  const [email, setEmail] = useState("")

  // Authentication helper functions
  const setUserAuthData = (email: string) => {
    try {
      const userInfo = {
        name: email.split('@')[0],
        email: email,
        mobile: "",
        accountType: "individual",
        signinCompletedAt: new Date().toISOString()
      }
      document.cookie = `user_data=${JSON.stringify(userInfo)}; path=/; max-age=86400`
      console.log('User auth data set successfully for sign-in flow')
    } catch (error) {
      console.error('Error setting user auth data:', error)
    }
  }

  const setAccessLevel = (level: 'full' = 'full') => {
    try {
      console.log('Setting access level for sign-in flow:', level)
      localStorage.setItem('accessLevel', level)
      
      const authToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      document.cookie = `auth-token=${authToken}; path=/; max-age=86400`
      
      const profileStatus = {
        basicInfoComplete: true,
        identityVerified: true,
        paymentSetupComplete: true
      }
      document.cookie = `user_profile_status=${JSON.stringify(profileStatus)}; path=/; max-age=86400`
      
      console.log('Access level set successfully for sign-in flow')
    } catch (error) {
      console.error('Error setting access level:', error)
    }
  }

  // Handle completion of the sign-in step
  const handleSignInComplete = (userEmail: string) => {
    setEmail(userEmail)
    setAuthStep("2fa")
  }

  // Handle completion of the 2FA step
  const handleTwoFactorComplete = () => {
    setAuthStep("trust-device")
  }

  // Handle the trust device decision
  const handleTrustDevice = (trust: boolean) => {
    try {
      // In a real app, you would save this preference to the user's account
      console.log(`User chose to ${trust ? "trust" : "not trust"} this device`)
      setAuthStep("complete")

      // Set authentication data before navigation
      console.log('Setting authentication data for sign-in flow')
      setUserAuthData(email)
      setAccessLevel('full')
      
      // Navigate to dashboard
      console.log('Navigating to dashboard...')
      router.push("/dashboard")
    } catch (error) {
      console.error('Error in trust device handler:', error)
      // Fallback navigation
      window.location.href = "/dashboard"
    }
  }

  return (
    <div>
      {authStep === "signin" && <SignInForm />}

      {authStep === "2fa" && (
        <TwoFactorForm email={email} onComplete={handleTwoFactorComplete} onBack={() => setAuthStep("signin")} />
      )}

      {authStep === "trust-device" && <TrustDeviceDialog onConfirm={(trust) => handleTrustDevice(trust)} />}
    </div>
  )
}
