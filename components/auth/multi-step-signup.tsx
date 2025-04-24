"use client"

import { useState, lazy, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { KrutrimLogo } from "@/components/ui/krutrim-logo"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"

// Import the first step eagerly to avoid full-page loading state
import { SignUpForm } from "./sign-up-form"

// Lazy load all other step components
const OTPVerificationForm = lazy(() =>
  import("./otp-verification-form").then((mod) => ({ default: mod.OTPVerificationForm })),
)
const CustomerTypeSelection = lazy(() =>
  import("./customer-type-selection").then((mod) => ({ default: mod.CustomerTypeSelection })),
)
const IndividualBillingForm = lazy(() =>
  import("./individual-billing-form").then((mod) => ({ default: mod.IndividualBillingForm })),
)
const OrganizationBillingForm = lazy(() =>
  import("./organization-billing-form").then((mod) => ({ default: mod.OrganizationBillingForm })),
)
const PaymentValidationForm = lazy(() =>
  import("./payment-validation-form").then((mod) => ({ default: mod.PaymentValidationForm })),
)
const PaymentSuccessScreen = lazy(() =>
  import("./payment-success-screen").then((mod) => ({ default: mod.PaymentSuccessScreen })),
)
const CustomerValidationScreen = lazy(() =>
  import("./customer-validation-screen").then((mod) => ({ default: mod.CustomerValidationScreen })),
)
const DigiLockerConsentScreen = lazy(() =>
  import("./digilocker-consent-screen").then((mod) => ({ default: mod.DigiLockerConsentScreen })),
)
const KYCVerificationScreen = lazy(() =>
  import("./kyc-verification-screen").then((mod) => ({ default: mod.KYCVerificationScreen })),
)
const AddressSelectionScreen = lazy(() =>
  import("./address-selection-screen").then((mod) => ({ default: mod.AddressSelectionScreen })),
)

// Define initial signup steps
const initialSteps = [
  { name: "Signup", status: "current" },
  { name: "Verify", status: "upcoming" },
  { name: "Type", status: "upcoming" },
  { name: "Billing", status: "upcoming" },
  { name: "Payment", status: "upcoming" },
]

// Loading component for Suspense fallback
const LoadingStep = () => (
  <div className="flex justify-center items-center p-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

export function MultiStepSignup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [customerType, setCustomerType] = useState<"individual" | "organization" | null>(null)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
  })
  const [visibleSteps, setVisibleSteps] = useState(initialSteps)
  const [isInValidationPhase, setIsInValidationPhase] = useState(false)
  const router = useRouter()

  const goToNextStep = () => {
    const nextStep = currentStep + 1
    setCurrentStep(nextStep)

    // If moving to the Payment Success screen (step 5), change the visible steps to only show validation steps
    if (nextStep === 5) {
      // Set validation steps with correct initial status
      setVisibleSteps([
        { name: "Validation", status: "upcoming" },
        { name: "KYC", status: "upcoming" },
        { name: "Address", status: "upcoming" },
      ])
      // Set flag to indicate we're in the validation phase but not yet started
      setIsInValidationPhase(false)
    } else if (nextStep === 6) {
      // Moving to Customer Validation step - now we're actively in validation phase
      setVisibleSteps([
        { name: "Validation", status: "current" },
        { name: "KYC", status: "upcoming" },
        { name: "Address", status: "upcoming" },
      ])
      setIsInValidationPhase(true)
    } else if (nextStep === 7) {
      // Moving to KYC step
      setVisibleSteps([
        { name: "Validation", status: "complete" },
        { name: "KYC", status: "current" },
        { name: "Address", status: "upcoming" },
      ])
    } else if (nextStep === 8) {
      // Moving to Address step
      setVisibleSteps([
        { name: "Validation", status: "complete" },
        { name: "KYC", status: "complete" },
        { name: "Address", status: "current" },
      ])
    } else if (nextStep < 5) {
      // For steps before Payment Success, update the regular progress
      const updatedSteps = visibleSteps.map((step, index) => ({
        ...step,
        status: index < nextStep ? "complete" : index === nextStep ? "current" : "upcoming",
      }))
      setVisibleSteps(updatedSteps)
    }
  }

  const goToPreviousStep = () => {
    const prevStep = currentStep - 1
    setCurrentStep(prevStep)

    // If going back from the first validation screen to payment screen
    if (currentStep === 6 && prevStep === 5) {
      // When going back to Payment Success, keep the validation steps visible but all as upcoming
      setVisibleSteps([
        { name: "Validation", status: "upcoming" },
        { name: "KYC", status: "upcoming" },
        { name: "Address", status: "upcoming" },
      ])
      setIsInValidationPhase(false)
    } else if (prevStep === 4) {
      // If going back to Payment screen, restore the original steps
      setVisibleSteps([
        { name: "Signup", status: "complete" },
        { name: "Verify", status: "complete" },
        { name: "Type", status: "complete" },
        { name: "Billing", status: "complete" },
        { name: "Payment", status: "current" },
      ])
    } else if (prevStep < 5) {
      // For steps before Payment Success
      const updatedSteps = visibleSteps.map((step, index) => ({
        ...step,
        status: index < prevStep ? "complete" : index === prevStep ? "current" : "upcoming",
      }))
      setVisibleSteps(updatedSteps)
    } else if (prevStep === 5) {
      // Going back to Payment Success
      setVisibleSteps([
        { name: "Validation", status: "upcoming" },
        { name: "KYC", status: "upcoming" },
        { name: "Address", status: "upcoming" },
      ])
      setIsInValidationPhase(false)
    } else if (prevStep === 6) {
      // Going back to Validation step
      setVisibleSteps([
        { name: "Validation", status: "current" },
        { name: "KYC", status: "upcoming" },
        { name: "Address", status: "upcoming" },
      ])
    } else if (prevStep === 7) {
      // Going back to KYC step
      setVisibleSteps([
        { name: "Validation", status: "complete" },
        { name: "KYC", status: "current" },
        { name: "Address", status: "upcoming" },
      ])
    }
  }

  const goToDashboard = () => {
    localStorage.setItem("needsValidation", "true")
    sessionStorage.setItem("newSignup", "true")
    router.push("/dashboard")
  }

  const handleSignupComplete = (formData: { fullName: string; email: string; mobile: string }) => {
    setUserData({
      name: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
    })
    goToNextStep()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Signup
        return <SignUpForm onNext={handleSignupComplete} />
      case 1: // Verify
        return (
          <Suspense fallback={<LoadingStep />}>
            <OTPVerificationForm
              email={userData.email}
              mobile={userData.mobile}
              onBack={goToPreviousStep}
              onNext={goToNextStep}
            />
          </Suspense>
        )
      case 2: // Type
        return (
          <Suspense fallback={<LoadingStep />}>
            <CustomerTypeSelection
              userName={userData.name}
              selectedType={customerType}
              onSelectType={setCustomerType}
              onBack={goToPreviousStep}
              onNext={goToNextStep}
            />
          </Suspense>
        )
      case 3: // Billing
        return (
          <Suspense fallback={<LoadingStep />}>
            {customerType === "individual" ? (
              <IndividualBillingForm onBack={goToPreviousStep} onNext={goToNextStep} />
            ) : (
              <OrganizationBillingForm onBack={goToPreviousStep} onNext={goToNextStep} />
            )}
          </Suspense>
        )
      case 4: // Payment
        return (
          <Suspense fallback={<LoadingStep />}>
            <PaymentValidationForm onBack={goToPreviousStep} onNext={goToNextStep} />
          </Suspense>
        )
      case 5: // Payment Success
        return (
          <Suspense fallback={<LoadingStep />}>
            <PaymentSuccessScreen onNext={goToNextStep} />
          </Suspense>
        )
      case 6: // Customer Validation
        return (
          <Suspense fallback={<LoadingStep />}>
            <CustomerValidationScreen onNext={goToNextStep} onSkip={goToDashboard} />
          </Suspense>
        )
      case 7: // DigiLocker Consent
        return (
          <Suspense fallback={<LoadingStep />}>
            <DigiLockerConsentScreen onBack={goToPreviousStep} onNext={goToNextStep} />
          </Suspense>
        )
      case 8: // KYC Verification
        return (
          <Suspense fallback={<LoadingStep />}>
            <KYCVerificationScreen onBack={goToPreviousStep} onNext={goToNextStep} />
          </Suspense>
        )
      case 9: // Address Selection
        return (
          <Suspense fallback={<LoadingStep />}>
            <AddressSelectionScreen onBack={goToPreviousStep} onNext={goToDashboard} />
          </Suspense>
        )
      default:
        return <SignUpForm onNext={handleSignupComplete} />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-8">
          <KrutrimLogo width={180} height={60} className="h-12" href={null} />
        </div>

        <div className="w-full mb-6">
          <Stepper value={currentStep} className="w-full">
            {visibleSteps.map((step, index) => {
              // Special handling for validation phase steps
              const isCompleted = currentStep >= 6 && index < currentStep - 6 && isInValidationPhase
              const isCurrent = currentStep >= 6 && index === currentStep - 6 && isInValidationPhase

              // For Payment Success screen (step 5), force all validation steps to NOT be completed
              const forceNotCompleted = currentStep === 5

              return (
                <StepperItem
                  key={step.name}
                  step={index}
                  completed={forceNotCompleted ? false : step.status === "complete" || isCompleted}
                  className="relative flex-1 !flex-col"
                >
                  <StepperTrigger className="flex-col gap-3">
                    <StepperIndicator aria-label={`Step ${index + 1}: ${step.name}`} />
                    <div className="px-2">
                      <StepperTitle>{step.name}</StepperTitle>
                    </div>
                  </StepperTrigger>
                  {index < visibleSteps.length - 1 && (
                    <StepperSeparator className="absolute inset-x-0 left-[calc(50%+0.75rem+0.125rem)] top-3 -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
                  )}
                </StepperItem>
              )
            })}
          </Stepper>
        </div>

        <Card className="mt-6 shadow-sm border-gray-200">
          <CardContent className="p-0">{renderStep()}</CardContent>
        </Card>
      </div>
    </div>
  )
}
