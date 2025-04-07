"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useUserStore } from "@/lib/user-store"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

export function PremiumBadge() {
  return (
    <Badge variant="secondary" className="absolute right-2 top-2 bg-amber-500 text-white hover:bg-amber-600">
      <Lock className="mr-1 h-3 w-3" /> Premium
    </Badge>
  )
}

export function usePremiumCheck() {
  const { user, isLoggedIn } = useUserStore()
  const router = useRouter()

  const isPremium = user?.isPremium || false
  const isProfileCompleted = user?.profileCompleted || false

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  return {
    isPremium,
    isProfileCompleted,
    isLoggedIn,
  }
}

