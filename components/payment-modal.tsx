"use client"

import { useState } from "react"
import { CheckCircle, Crown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from "@/lib/user-store"

// Premium plan options
const premiumPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 1000,
    features: ["Access to 5 premium scholarships", "Basic mentorship access", "Standard application tracking"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 3500,
    features: [
      "Access to 15 premium scholarships",
      "Priority mentorship matching",
      "Advanced application tracking",
      "Monthly scholarship alerts",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 7000,
    features: [
      "Unlimited premium scholarships",
      "VIP mentorship access",
      "Comprehensive application tracking",
      "Weekly scholarship alerts",
      "Application review assistance",
    ],
  },
]

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  selectedPlan?: string
}

export function PaymentModal({ isOpen, onClose, onSuccess, selectedPlan = "standard" }: PaymentModalProps) {
  const { toast } = useToast()
  const { updateProfile } = useUserStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const plan = premiumPlans.find((p) => p.id === selectedPlan) || premiumPlans[1] // Default to standard if not found

  const handlePayment = () => {
    setIsProcessing(true)

    // Simulate Flutterwave payment integration
    try {
      // Load Flutterwave script if not already loaded
      if (typeof window !== "undefined") {
        if (!window.FlutterwaveCheckout) {
          const script = document.createElement("script")
          script.src = "https://checkout.flutterwave.com/v3.js"
          document.body.appendChild(script)
          script.onload = initializePayment
        } else {
          initializePayment()
        }
      }
    } catch (error) {
      console.error("Payment initialization failed:", error)
      setIsProcessing(false)
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const initializePayment = () => {
    if (typeof window === "undefined" || !window.FlutterwaveCheckout) {
      setIsProcessing(false)
      return
    }

    window.FlutterwaveCheckout({
      public_key: "FLWPUBK_TEST-XXXXX-X", // Replace with your actual Flutterwave public key
      tx_ref: `empowerher-${Date.now()}`,
      amount: plan.price,
      currency: "NGN",
      payment_options: "card,banktransfer,ussd",
      customer: {
        email: "user@example.com", // This would come from the user's profile in a real app
        name: "User Name",
      },
      customizations: {
        title: "Empower Her Premium",
        description: `${plan.name} Plan Subscription`,
        logo: "https://your-logo-url.com/logo.png", // Replace with your logo URL
      },
      callback: (response: any) => {
        // Verify the transaction on your backend
        if (response.status === "successful") {
          // Mock successful payment
          updateProfile({
            isPremium: true,
            premiumPlan: plan.id,
          })
          setIsProcessing(false)
          toast({
            title: "Payment Successful",
            description: `You now have access to the ${plan.name} plan!`,
          })
          onSuccess()
        } else {
          setIsProcessing(false)
          toast({
            title: "Payment Failed",
            description: "Your payment was not successful. Please try again.",
            variant: "destructive",
          })
        }
      },
      onclose: () => {
        setIsProcessing(false)
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Crown className="h-5 w-5 text-amber-500 mr-2" />
            Upgrade to {plan.name} Plan
          </DialogTitle>
          <DialogDescription>Get premium access to scholarships and mentorship opportunities.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Premium Benefits</h3>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              ₦{plan.price.toLocaleString()}
              <span className="text-lg font-normal">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">Cancel anytime</p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            <Crown className="h-4 w-4 mr-2" />
            {isProcessing ? "Processing..." : "Pay with Flutterwave"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
