"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CreditCard, QrCode, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentValidationFormProps {
  onBack: () => void
  onNext: () => void
}

export function PaymentValidationForm({ onBack, onNext }: PaymentValidationFormProps) {
  const [selectedGateway, setSelectedGateway] = useState<"card" | "upi">("card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    saveCard: false,
  })
  const [errors, setErrors] = useState<{
    cardNumber?: string
    expiryDate?: string
    cvv?: string
    nameOnCard?: string
    general?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, saveCard: checked }))
  }

  const validateForm = () => {
    const newErrors: {
      cardNumber?: string
      expiryDate?: string
      cvv?: string
      nameOnCard?: string
      general?: string
    } = {}

    if (selectedGateway === "card") {
      if (!formData.cardNumber) {
        newErrors.cardNumber = "Card number is required"
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number"
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = "Expiry date is required"
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
      }

      if (!formData.cvv) {
        newErrors.cvv = "CVV is required"
      } else if (!/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = "Please enter a valid 3-digit CVV"
      }

      if (!formData.nameOnCard) {
        newErrors.nameOnCard = "Name on card is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onNext()
    } catch (error) {
      setErrors({
        general: "Payment processing failed. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Payment Validation</h2>
      <p className="text-gray-600 mt-2 mb-6">
        To validate your account, we require a payment of ₹100. This amount will be refunded to your account within 3-5
        business days.
      </p>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">{errors.general}</div>
      )}

      {/* Payment Gateway Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className={cn(
            "border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all",
            selectedGateway === "card" ? "border-primary bg-gray-50" : "border-gray-200",
          )}
          onClick={() => setSelectedGateway("card")}
        >
          <CreditCard className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Card</h3>
        </div>

        <div
          className={cn(
            "border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all",
            selectedGateway === "upi" ? "border-primary bg-gray-50" : "border-gray-200",
          )}
          onClick={() => setSelectedGateway("upi")}
        >
          <QrCode className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">UPI</h3>
        </div>
      </div>

      {/* Card Payment Form */}
      {selectedGateway === "card" && (
        <div className="space-y-6 border rounded-lg p-6">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              className={errors.cardNumber ? "border-red-300 focus-visible:ring-red-500" : ""}
              placeholder="1234 5678 9012 3456"
            />
            <p className="text-xs text-gray-500">Enter the 16-digit number on the front of your card</p>
            {errors.cardNumber && <p className="text-sm text-red-600 mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                placeholder="MM/YY"
                className={errors.expiryDate ? "border-red-300 focus-visible:ring-red-500" : ""}
              />
              {errors.expiryDate && <p className="text-sm text-red-600 mt-1">{errors.expiryDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                value={formData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                placeholder="123"
                maxLength={3}
                className={errors.cvv ? "border-red-300 focus-visible:ring-red-500" : ""}
              />
              {errors.cvv && <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameOnCard">Name on Card</Label>
            <Input
              id="nameOnCard"
              value={formData.nameOnCard}
              onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
              placeholder="John Doe"
              className={errors.nameOnCard ? "border-red-300 focus-visible:ring-red-500" : ""}
            />
            {errors.nameOnCard && <p className="text-sm text-red-600 mt-1">{errors.nameOnCard}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="save-card" checked={formData.saveCard} onCheckedChange={handleCheckboxChange} />
            <label htmlFor="save-card" className="text-sm cursor-pointer">
              Save card securely for future payments
            </label>
          </div>
        </div>
      )}

      {/* UPI Payment Form */}
      {selectedGateway === "upi" && (
        <div className="border rounded-lg p-6 text-center">
          <p className="mb-4">Please scan the QR code or enter UPI ID to make payment</p>
          <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
            <QrCode className="h-24 w-24 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">UPI payment instructions will be shown here</p>
        </div>
      )}

      {/* Security Message */}
      <div className="flex items-center gap-2 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
        <p className="text-sm text-gray-600">
          Your payment information is secure. We use industry-standard encryption to protect your sensitive data.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
          {isLoading ? "Processing payment..." : "Pay ₹100"}
        </Button>
      </div>
    </div>
  )
}
