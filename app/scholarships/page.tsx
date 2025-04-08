"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Filter, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"
import { ScholarshipCard } from "@/components/scholarship-card"
import { mockScholarships } from "@/lib/mock-data"
import { useUserStore } from "@/lib/user-store"
import { generateRecommendations } from "@/lib/ai-matching"
import { Header } from "@/app/header"

export default function ScholarshipsPage() {
  const { profile, aiScholarships, setAIScholarships, isLoggedIn } = useUserStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [filteredScholarships, setFilteredScholarships] = useState([...mockScholarships])
  const [isLoading, setIsLoading] = useState(true)

  // Generate AI scholarship recommendations if needed
  useEffect(() => {
    if (profile.profileCompleted && aiScholarships.length === 0) {
      const recommendations = generateRecommendations(profile)
      setAIScholarships(recommendations)
    }
    setIsLoading(false)
  }, [profile, aiScholarships.length, setAIScholarships])

  // Filter scholarships when search or category changes
  useEffect(() => {
    const allScholarships = [...mockScholarships, ...aiScholarships]
    let filtered = allScholarships

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (scholarship) =>
          scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholarship.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((scholarship) => scholarship.category === category)
    }

    setFilteredScholarships(filtered)
  }, [searchQuery, category, aiScholarships])

  const handleSearch = () => {
    // Search is handled by the useEffect above
    console.log("Search query:", searchQuery)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Loading scholarships...</h2>
          <p className="text-muted-foreground">Our AI is finding the best matches for you</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header activePage="scholarships" />
      <main className="flex-1 py-6">
        <div className="container">
          <ScrollAnimationWrapper>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Scholarships</h1>
                <p className="text-muted-foreground">
                  Browse and apply for scholarships that match your profile and interests.
                </p>
              </div>

              {isLoggedIn && !profile.profileCompleted && (
                <Alert className="border-amber-500">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertTitle>Complete your profile</AlertTitle>
                  <AlertDescription>
                    Please complete your profile to unlock personalized scholarship recommendations.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-2 md:col-span-2">
                        <Input
                          placeholder="Search scholarships..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                        <Button onClick={handleSearch}>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="STEM">STEM</SelectItem>
                            <SelectItem value="Arts">Arts & Humanities</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Leadership">Leadership</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                          <ChevronDown
                            className={`h-4 w-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>
                    {showFilters && (
                      <div className="mt-4 grid gap-4 md:grid-cols-4 border-t pt-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">Amount</h3>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="amount-1" />
                              <Label htmlFor="amount-1">Under $1,000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="amount-2" />
                              <Label htmlFor="amount-2">$1,000 - $5,000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="amount-3" />
                              <Label htmlFor="amount-3">$5,000 - $10,000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="amount-4" />
                              <Label htmlFor="amount-4">$10,000+</Label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Deadline</h3>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="deadline-1" />
                              <Label htmlFor="deadline-1">Within 1 month</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="deadline-2" />
                              <Label htmlFor="deadline-2">1-3 months</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="deadline-3" />
                              <Label htmlFor="deadline-3">3+ months</Label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Education Level</h3>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="edu-1" />
                              <Label htmlFor="edu-1">High School</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="edu-2" />
                              <Label htmlFor="edu-2">Undergraduate</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="edu-3" />
                              <Label htmlFor="edu-3">Graduate</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="edu-4" />
                              <Label htmlFor="edu-4">Postgraduate</Label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Location</h3>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="loc-1" />
                              <Label htmlFor="loc-1">Local</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="loc-2" />
                              <Label htmlFor="loc-2">National</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="loc-3" />
                              <Label htmlFor="loc-3">International</Label>
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-4 flex justify-end gap-2 mt-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearchQuery("")
                              setCategory("all")
                              setFilteredScholarships([...mockScholarships, ...aiScholarships])
                            }}
                          >
                            Reset Filters
                          </Button>
                          <Button onClick={handleSearch}>Apply Filters</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredScholarships.map((scholarship) => (
                    <ScrollAnimationWrapper key={scholarship.id} delay={0.1 * (scholarship.id % 5)}>
                      <ScholarshipCard scholarship={scholarship} />
                    </ScrollAnimationWrapper>
                  ))}
                  {filteredScholarships.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <h3 className="text-lg font-medium">No scholarships found</h3>
                      <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("")
                          setCategory("all")
                          setFilteredScholarships([...mockScholarships, ...aiScholarships])
                        }}
                      >
                        Reset Search
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </main>
    </div>
  )
}
