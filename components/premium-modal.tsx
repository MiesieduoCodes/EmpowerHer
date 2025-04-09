"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/user-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sparkles } from "lucide-react"

export function PremiumModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const { upgradeToPremiun } = useUserStore()
  const router = useRouter()

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Simulate payment process with Flutterwave
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // After successful payment
      upgradeToPremiun()
      onClose()
      router.refresh()
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>Get access to exclusive scholarships and mentorship opportunities.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Premium Benefits:</h3>
            <ul className="ml-4 list-disc text-sm">
              <li>Access to exclusive scholarships</li>
              <li>Priority mentorship matching</li>
              <li>Advanced application tracking</li>
              <li>Personalized recommendations</li>
              <li>Early access to new opportunities</li>
            </ul>
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold">$9.99</span>
              <span className="text-sm text-muted-foreground"> / month</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isLoading}>
            {isLoading ? "Processing..." : "Pay with Flutterwave"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
