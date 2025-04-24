/**
 * @component GoogleAuthScreen
 * @description A Google-styled authentication screen for the OAuth flow
 *
 * This component provides a Google-styled account selection interface for users
 * authenticating via Google OAuth. It displays a list of previously used Google
 * accounts and allows the user to select one or add a new account.
 *
 * @status Planned - Not currently in use
 * @plannedFor Authentication system upgrade (Q2 2023)
 *
 * @example
 * // Future implementation in the auth flow
 * import { GoogleAuthScreen } from "@/components/auth/google-auth-screen";
 *
 * // In a route handler or page component
 * export default function GoogleAuthPage() {
 *   return <GoogleAuthScreen />;
 * }
 *
 * @see Related components:
 * - SignInForm
 * - TwoFactorScreen
 * - AuthProvider
 *
 * @todo Integrate with actual Google OAuth API when authentication system is upgraded
 * @todo Implement actual account fetching instead of sample data
 * @todo Add proper error handling for OAuth failures
 */
"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Sample accounts for demonstration
const SAMPLE_ACCOUNTS = [
  {
    email: "john.doe@example.com",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    email: "jane.smith@example.com",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function GoogleAuthScreen() {
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    if (!selectedAccount) return

    setIsLoading(true)

    // Simulate authentication process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to dashboard or two-factor auth
    router.push("/dashboard")
  }

  const handleCancel = () => {
    router.push("/auth/signin")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          {/* Google Logo */}
          <div className="mb-6 flex justify-center">
            <svg className="h-8 w-8" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
          </div>

          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">Sign in with Google</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Choose an account to continue to Krutrim Cloud</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            {SAMPLE_ACCOUNTS.map((account) => (
              <div
                key={account.email}
                className={cn(
                  "flex cursor-pointer items-center justify-between border-b border-gray-200 p-4 last:border-0",
                  selectedAccount === account.email && "bg-gray-50",
                )}
                onClick={() => setSelectedAccount(account.email)}
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={account.avatar || "/placeholder.svg"}
                    alt={account.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.email}</p>
                  </div>
                </div>
                {selectedAccount === account.email && <Check className="h-5 w-5 text-primary" />}
              </div>
            ))}

            <div className="flex cursor-pointer items-center space-x-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Use another account</p>
            </div>
          </div>

          <div className="flex justify-between space-x-4 pt-4">
            <Button variant="outline" onClick={handleCancel} className="flex-1 rounded-full">
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedAccount || isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 rounded-full"
            >
              {isLoading ? "Signing in..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
