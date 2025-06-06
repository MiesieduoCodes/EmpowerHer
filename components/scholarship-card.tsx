"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Award, Calendar, ExternalLink, Bookmark, CheckCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PremiumBadge } from "@/components/premium-badge"
import { PaymentModal } from "@/components/payment-modal"
import type { Scholarship } from "@/lib/types"
import { useUserStore } from "@/lib/user-store"
import { useToast } from "@/hooks/use-toast"

interface ScholarshipCardProps {
  scholarship: Scholarship
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { saveScholarship, unsaveScholarship, isSaved, startApplication, getApplicationStatus, isLoggedIn, profile } =
    useUserStore()

  const [saved, setSaved] = useState(isSaved(scholarship.id))
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const applicationStatus = getApplicationStatus(scholarship.id)
  const isPremiumContent = scholarship.isPremium && !profile.isPremium

  const handleSave = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to save scholarships",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!profile.profileCompleted) {
      toast({
        title: "Complete Your Profile",
        description: "Please complete your profile before saving scholarships",
        variant: "destructive",
      })
      router.push("/profile")
      return
    }

    if (saved) {
      unsaveScholarship(scholarship.id)
      setSaved(false)
      toast({
        title: "Scholarship Removed",
        description: "Scholarship has been removed from your saved list",
      })
    } else {
      saveScholarship(scholarship.id)
      setSaved(true)
      toast({
        title: "Scholarship Saved",
        description: "Scholarship has been added to your saved list",
      })
    }
  }

  const handleApply = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to apply for scholarships",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!profile.profileCompleted) {
      toast({
        title: "Complete Your Profile",
        description: "Please complete your profile before applying for scholarships",
        variant: "destructive",
      })
      router.push("/profile")
      return
    }

    if (isPremiumContent) {
      setShowPaymentModal(true)
      return
    }

    const applicationId = startApplication(scholarship.id)
    router.push(`/scholarships/apply/${applicationId}`)
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    // Now that the user is premium, they can apply
    const applicationId = startApplication(scholarship.id)
    router.push(`/scholarships/apply/${applicationId}`)
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col relative">
      {scholarship.isPremium && <PremiumBadge />}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg line-clamp-1">{scholarship.title}</CardTitle>
            <CardDescription className="line-clamp-1">{scholarship.provider}</CardDescription>
          </div>
          <Badge
            className={
              scholarship.isAIGenerated
                ? "bg-teal-600 whitespace-nowrap text-xs"
                : "bg-purple-600 whitespace-nowrap text-xs"
            }
          >
            {scholarship.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="grid gap-2">
          <div className="flex items-center text-sm">
            <Award className="mr-2 h-4 w-4 flex-shrink-0 text-purple-600" />
            <span className="truncate">{scholarship.amount}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 flex-shrink-0 text-purple-600" />
            <span className="truncate">Deadline: {scholarship.deadline}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{scholarship.description}</p>
          {scholarship.isAIGenerated && (
            <Badge variant="outline" className="w-fit mt-1">
              AI Recommended
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className={saved ? "text-purple-600 border-purple-600" : ""}
          disabled={!profile.profileCompleted}
        >
          {saved ? (
            <>
              <CheckCircle className="mr-2 h-3 w-3" />
              <span className="hidden sm:inline">Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="mr-2 h-3 w-3" />
              <span className="hidden sm:inline">Save</span>
            </>
          )}
        </Button>
        <Button
          size="sm"
          className={isPremiumContent ? "bg-amber-500 hover:bg-amber-600" : "bg-purple-600 hover:bg-purple-700"}
          onClick={handleApply}
          disabled={applicationStatus === "submitted" || applicationStatus === "pending" || !profile.profileCompleted}
        >
          {isPremiumContent ? (
            <>
              <Lock className="mr-2 h-3 w-3" />
              <span className="hidden sm:inline">Unlock</span>
              <span className="sm:hidden">Unlock</span>
            </>
          ) : applicationStatus ? (
            applicationStatus === "draft" ? (
              <>
                <span className="hidden sm:inline">Continue</span>
                <span className="sm:hidden">Continue</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Applied</span>
                <span className="sm:hidden">Applied</span>
              </>
            )
          ) : (
            <>
              <span className="hidden sm:inline">Apply Now</span>
              <span className="sm:hidden">Apply</span>
              <ExternalLink className="ml-2 h-3 w-3" />
            </>
          )}
        </Button>
      </CardFooter>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </Card>
  )
}
