"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Building, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomerTypeSelectionProps {
  userName: string
  selectedType: "individual" | "organization" | null
  onSelectType: (type: "individual" | "organization") => void
  onBack: () => void
  onNext: () => void
}

export function CustomerTypeSelection({
  userName,
  selectedType,
  onSelectType,
  onBack,
  onNext,
}: CustomerTypeSelectionProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    if (!selectedType) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onNext()
    } catch (error) {
      console.error("Error proceeding to next step", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Welcome {userName || ""}!</h2>
        <p className="text-gray-600 mt-2">Please enter billing information. This will be used for your invoicing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Individual Card */}
        <div
          onClick={() => onSelectType("individual")}
          className={cn(
            "border rounded-lg p-6 cursor-pointer transition-all",
            "hover:border-gray-400",
            selectedType === "individual" ? "border-black shadow-sm bg-gray-50" : "border-gray-200",
          )}
        >
          <div className="flex flex-col items-center text-center">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4", "bg-gray-100")}>
              <User className={cn("h-8 w-8", selectedType === "individual" ? "text-black" : "text-gray-600")} />
            </div>
            <h3 className="text-lg font-semibold">Individual</h3>
            <p className="text-gray-600 mt-1">Personal account</p>
          </div>
        </div>

        {/* Organization Card */}
        <div
          onClick={() => onSelectType("organization")}
          className={cn(
            "border rounded-lg p-6 cursor-pointer transition-all",
            "hover:border-gray-400",
            selectedType === "organization" ? "border-black shadow-sm bg-gray-50" : "border-gray-200",
          )}
        >
          <div className="flex flex-col items-center text-center">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4", "bg-gray-100")}>
              <Building className={cn("h-8 w-8", selectedType === "organization" ? "text-black" : "text-gray-600")} />
            </div>
            <h3 className="text-lg font-semibold">Organization</h3>
            <p className="text-gray-600 mt-1">Business account</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedType || isLoading}
          className="px-6 bg-black hover:bg-gray-800 text-white"
        >
          {isLoading ? "Processing..." : "Next"}
        </Button>
      </div>
    </div>
  )
}
