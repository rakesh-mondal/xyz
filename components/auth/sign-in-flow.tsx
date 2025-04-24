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
    // In a real app, you would save this preference to the user's account
    console.log(`User chose to ${trust ? "trust" : "not trust"} this device`)
    setAuthStep("complete")

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div>
      {authStep === "signin" && <SignInForm onComplete={handleSignInComplete} />}

      {authStep === "2fa" && (
        <TwoFactorForm email={email} onComplete={handleTwoFactorComplete} onBack={() => setAuthStep("signin")} />
      )}

      {authStep === "trust-device" && <TrustDeviceDialog onConfirm={(trust) => handleTrustDevice(trust)} />}
    </div>
  )
}
