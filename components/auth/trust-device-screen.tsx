"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, CheckCircle, XCircle, Laptop } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { KrutrimLogo } from "@/components/ui/krutrim-logo"

export function TrustDeviceScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState({
    browser: "Unknown Browser",
    os: "Unknown OS",
    device: "Unknown Device",
  })

  useEffect(() => {
    // Get basic browser and device info
    const userAgent = window.navigator.userAgent
    const browsers = [
      { name: "Chrome", value: "Chrome" },
      { name: "Firefox", value: "Firefox" },
      { name: "Safari", value: "Safari" },
      { name: "Edge", value: "Edg" },
      { name: "Opera", value: "Opera" },
    ]

    const os = [
      { name: "Windows", value: "Windows" },
      { name: "Mac OS", value: "Mac" },
      { name: "iOS", value: "iPhone" },
      { name: "Android", value: "Android" },
      { name: "Linux", value: "Linux" },
    ]

    const browser = browsers.find((b) => userAgent.includes(b.value))?.name || "Unknown Browser"
    const osName = os.find((o) => userAgent.includes(o.value))?.name || "Unknown OS"
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)

    setDeviceInfo({
      browser,
      os: osName,
      device: isMobile ? "Mobile Device" : "Desktop Computer",
    })
  }, [])

  const handleTrustDevice = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to dashboard
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDontTrust = () => {
    // Redirect to dashboard without setting trust
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          {/* Krutrim Logo */}
          <div className="mb-6 flex justify-center">
            <KrutrimLogo width={180} height={60} className="h-12" />
          </div>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-krutrim-green/10 p-3">
                <Shield className="h-8 w-8 text-krutrim-green" />
              </div>
            </div>
            <CardTitle className="text-center text-xl">Trust this device?</CardTitle>
            <CardDescription className="text-center">
              You won't need to enter a verification code when signing in from this device for the next 60 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Laptop className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Device Information</h3>
                </div>
                <ul className="space-y-1 text-sm">
                  <li>
                    <span className="text-muted-foreground">Browser:</span> {deviceInfo.browser}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Operating System:</span> {deviceInfo.os}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Device Type:</span> {deviceInfo.device}
                  </li>
                </ul>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Only trust devices that you use regularly and that only you have access to.</p>
                <p>For shared or public devices, we recommend not trusting the device.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              className="w-full bg-[#212121] hover:bg-[#212121]/90"
              onClick={handleTrustDevice}
              disabled={isLoading}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isLoading ? "Processing..." : "Yes, trust this device"}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleDontTrust}>
              <XCircle className="mr-2 h-4 w-4" />
              No, don't trust
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
