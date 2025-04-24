"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface PaymentSuccessScreenProps {
  onNext: () => void
}

export function PaymentSuccessScreen({ onNext }: PaymentSuccessScreenProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold text-center">Payment Successful!</h1>
      </div>

      <p className="text-center text-gray-600">
        Your payment of ₹100 has been successfully processed. This amount will be refunded to your account within 3-5
        business days.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">₹100.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID:</span>
            <span className="font-medium">TXN565538</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="text-green-600 font-medium">Successful</span>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-600 mt-6">
        We need to verify your identity to complete the account setup. Please proceed to the next step.
      </p>

      <div className="flex justify-end mt-6">
        <Button onClick={onNext} className="w-auto">
          Continue to Verification
        </Button>
      </div>
    </div>
  )
}
