"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/user-store"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, FileText, Sparkles, User } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoggedIn } = useUserStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  if (!mounted || !isLoggedIn || !user) {
    return null
  }

  const isProfileCompleted = user.profileCompleted
  const hasInterests = user.interests && user.interests.length > 0

  // Stats will be zero until profile is completed
  const stats = {
    matchedScholarships: isProfileCompleted ? 12 : 0,
    applications: isProfileCompleted ? 3 : 0,
    profileCompletion: isProfileCompleted ? 100 : hasInterests ? 50 : 25,
  }

  return (
    <div className="container py-10">
      <ScrollAnimation>
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      </ScrollAnimation>

      <div className="mb-8">
        <ScrollAnimation delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Completion
              </CardTitle>
              <CardDescription>
                Complete your profile to get personalized scholarship and mentorship recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">{stats.profileCompletion}% Complete</span>
                <span className="text-sm text-muted-foreground">
                  {isProfileCompleted ? "Completed" : "In Progress"}
                </span>
              </div>
              <Progress value={stats.profileCompletion} className="h-2" />

              {!isProfileCompleted && (
                <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-2 font-medium">Next steps:</h4>
                  <ul className="space-y-2">
                    {!hasInterests && (
                      <li className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Add your interests to get matched with relevant scholarships
                      </li>
                    )}
                    <li className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Complete your educational background
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Add your skills and achievements
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/profile">{isProfileCompleted ? "View Profile" : "Complete Profile"}</Link>
              </Button>
            </CardFooter>
          </Card>
        </ScrollAnimation>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ScrollAnimation delay={0.4} direction="up">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matched Scholarships</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.matchedScholarships}</div>
              <p className="text-xs text-muted-foreground">
                {isProfileCompleted ? "+5 new matches this week" : "Complete your profile to see matches"}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/scholarships">View Scholarships</Link>
              </Button>
            </CardFooter>
          </Card>
        </ScrollAnimation>

        <ScrollAnimation delay={0.5} direction="up">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applications}</div>
              <p className="text-xs text-muted-foreground">
                {isProfileCompleted ? "1 application in progress" : "Complete your profile to apply"}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" disabled={!isProfileCompleted} className="w-full">
                Track Applications
              </Button>
            </CardFooter>
          </Card>
        </ScrollAnimation>

        <ScrollAnimation delay={0.6} direction="up">
          <Card className={user.isPremium ? "border-amber-500" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Status</CardTitle>
              <Sparkles className={`h-4 w-4 ${user.isPremium ? "text-amber-500" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.isPremium ? "Active" : "Free"}</div>
              <p className="text-xs text-muted-foreground">
                {user.isPremium ? "Access to all premium features" : "Upgrade to access premium features"}
              </p>
            </CardContent>
            <CardFooter>
              {user.isPremium ? (
                <Button variant="outline" size="sm" className="w-full">
                  Manage Subscription
                </Button>
              ) : (
                <Button size="sm" className="w-full">
                  Upgrade to Premium
                </Button>
              )}
            </CardFooter>
          </Card>
        </ScrollAnimation>
      </div>

      {isProfileCompleted && (
        <div className="mt-10">
          <ScrollAnimation delay={0.7}>
            <h2 className="mb-4 text-xl font-bold">Recommended For You</h2>
          </ScrollAnimation>

          <div className="grid gap-6 md:grid-cols-2">
            <ScrollAnimation delay={0.8} direction="left">
              <Card>
                <CardHeader>
                  <CardTitle>Women in Tech Scholarship</CardTitle>
                  <CardDescription>Application deadline: May 15, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    $5,000 scholarship for women pursuing degrees in computer science, engineering, or related fields.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/scholarships">View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation delay={0.9} direction="right">
              <Card>
                <CardHeader>
                  <CardTitle>Leadership Mentorship Program</CardTitle>
                  <CardDescription>Starting: June 1, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Connect with experienced leaders in your field for a 3-month mentorship program.</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/mentorship">View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      )}
    </div>
  )
}

