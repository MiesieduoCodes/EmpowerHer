import { Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function PremiumBadge() {
  return (
    <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 text-white">
      <Crown className="h-3 w-3 mr-1" />
      Premium
    </Badge>
  )
}
