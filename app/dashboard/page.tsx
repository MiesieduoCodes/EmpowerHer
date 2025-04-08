"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Award, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"
import { ScholarshipCard } from "@/components/scholarship-card"
import { MentorCard } from "@/components/mentor-card"
import { EducationChart } from "@/components/education-chart"
import { mockScholarships, mockMentors } from "@/lib/mock-data"
import { useUserStore } from "@/lib/user-store"
import { generateRecommendations } from "@/lib/ai-matching"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/app/header"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { profile, isLoggedIn, aiScholarships, setAIScholarships, savedScholarships, applications } = useUserStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredScholarships, setFilteredScholarships] = useState(mockScholarships.slice(0, 3))

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to access your dashboard",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [isLoggedIn, router, toast])

  // Generate AI scholarship recommendations if profile is completed
  useEffect(() => {
    if (isLoggedIn && profile.profileCompleted && aiScholarships.length === 0) {
      const recommendations = generateRecommendations(profile)
      setAIScholarships(recommendations)
    }
  }, [isLoggedIn, profile, aiScholarships.length, setAIScholarships])

  // Combine regular and AI-generated scholarships for display
  useEffect(() => {
    if (!profile.profileCompleted) {
      setFilteredScholarships([])
      return
    }

    const allScholarships = [...mockScholarships, ...aiScholarships]

    if (searchQuery.trim() === "") {
      // Show top 3 recommended scholarships
      setFilteredScholarships(allScholarships.slice(0, 3))
    } else {
      const filtered = allScholarships.filter(
        (scholarship) =>
          scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholarship.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredScholarships(filtered.slice(0, 3))
    }
  }, [searchQuery, aiScholarships, profile.profileCompleted])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header activePage="dashboard" />
      <main className="flex-1 py-6">
        <div className="container">
          {!profile.profileCompleted && (
            <Alert className="mb-6 border-amber-500">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Complete your profile</AlertTitle>
              <AlertDescription>
                Please complete your profile to unlock personalized scholarship recommendations and mentorship
                opportunities.{" "}
                <Link href="/profile" className="font-medium underline underline-offset-4">
                  Complete Profile
                </Link>
              </AlertDescription>
            </Alert>
          )}

          <ScrollAnimationWrapper>
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Matched Scholarships</CardTitle>
                    <Award className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {profile.profileCompleted ? aiScholarships.length + mockScholarships.length : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {profile.profileCompleted
                        ? `+${aiScholarships.length} AI-matched scholarships`
                        : "Complete your profile to see matches"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Applications</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-teal-600"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{applications.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {applications.filter((a) => a.status === "pending").length > 0
                        ? `${applications.filter((a) => a.status === "pending").length} pending review`
                        : "No pending applications"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saved Scholarships</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-purple-600"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{savedScholarships.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {savedScholarships.length > 0
                        ? "Click Save to bookmark scholarships"
                        : "No saved scholarships yet"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-teal-600"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{profile.profileCompleted ? "100%" : "0%"}</div>
                    <p className="text-xs text-muted-foreground">
                      <Link href="/profile" className="text-purple-600 hover:underline">
                        {profile.profileCompleted ? "Profile completed" : "Complete your profile"}
                      </Link>{" "}
                      {!profile.profileCompleted && "for better matches"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <ScrollAnimationWrapper delay={0.2} direction="right">
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                  <Card className="lg:col-span-4">
                    <CardHeader className="flex flex-row items-center">
                      <div className="grid gap-2">
                        <CardTitle>Scholarship Recommendations</CardTitle>
                        <CardDescription>AI-powered matches based on your profile</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="flex items-center mb-4">
                          <Input
                            placeholder="Search scholarships..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="max-w-sm"
                            disabled={!profile.profileCompleted}
                          />
                          <Button variant="ghost" className="ml-2" disabled={!profile.profileCompleted}>
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                        {profile.profileCompleted ? (
                          <div className="space-y-4">
                            {filteredScholarships.map((scholarship) => (
                              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                            ))}
                            {filteredScholarships.length === 0 && (
                              <div className="text-center py-4">
                                <p>No scholarships found matching your search.</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">Complete Your Profile</h3>
                            <p className="text-muted-foreground mt-1 mb-4">
                              Add your interests and education details to get personalized scholarship recommendations
                            </p>
                            <Button onClick={() => router.push("/profile")}>Update Profile</Button>
                          </div>
                        )}
                        <div className="mt-4 text-center">
                          <Button
                            variant="outline"
                            className="text-purple-600"
                            onClick={() => router.push("/scholarships")}
                          >
                            View all scholarships
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Education Insights</CardTitle>
                      <CardDescription>Real-time data on education disparities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EducationChart />
                    </CardContent>
                  </Card>
                </div>
              </ScrollAnimationWrapper>

              <ScrollAnimationWrapper delay={0.4} direction="up">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Mentors</CardTitle>
                      <CardDescription>Connect with professionals in your field of interest</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="all">
                        <TabsList className="mb-4">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="stem">STEM</TabsTrigger>
                          <TabsTrigger value="business">Business</TabsTrigger>
                          <TabsTrigger value="arts">Arts & Humanities</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                          {profile.profileCompleted ? (
                            mockMentors
                              .slice(0, 3)
                              .map((mentor) => (
                                <MentorCard
                                  key={mentor.id}
                                  name={mentor.name}
                                  title={mentor.title}
                                  institution={mentor.institution}
                                  image={mentor.image}
                                  availability={mentor.availability}
                                  isPremium={mentor.isPremium}
                                />
                              ))
                          ) : (
                            <div className="col-span-full text-center py-8">
                              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium">Complete Your Profile</h3>
                              <p className="text-muted-foreground mt-1 mb-4">
                                Add your interests and education details to get matched with mentors
                              </p>
                              <Button onClick={() => router.push("/profile")}>Update Profile</Button>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="stem" className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                          {profile.profileCompleted ? (
                            mockMentors
                              .filter((mentor) => mentor.field === "STEM")
                              .map((mentor) => (
                                <MentorCard
                                  key={mentor.id}
                                  name={mentor.name}
                                  title={mentor.title}
                                  institution={mentor.institution}
                                  image={mentor.image}
                                  availability={mentor.availability}
                                  isPremium={mentor.isPremium}
                                />
                              ))
                          ) : (
                            <div className="col-span-full text-center py-8">
                              <p>Complete your profile to see mentors in this category</p>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="business" className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                          {profile.profileCompleted ? (
                            mockMentors
                              .filter((mentor) => mentor.field === "Business")
                              .map((mentor) => (
                                <MentorCard
                                  key={mentor.id}
                                  name={mentor.name}
                                  title={mentor.title}
                                  institution={mentor.institution}
                                  image={mentor.image}
                                  availability={mentor.availability}
                                  isPremium={mentor.isPremium}
                                />
                              ))
                          ) : (
                            <div className="col-span-full text-center py-8">
                              <p>Complete your profile to see mentors in this category</p>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="arts" className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                          <div className="text-center py-4 col-span-full">
                            <p>No mentors available in this category yet.</p>
                            <Button variant="outline" className="mt-2">
                              Request a mentor
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </main>
    </div>
  )
}
