"use client"

import { useState } from "react"
import { PremiumBadge, usePremiumCheck } from "@/lib/premium-check"
import { PremiumModal } from "@/components/premium-modal"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Sparkles, Calendar, DollarSign, GraduationCap, Lock } from "lucide-react"

// Mock scholarship data
const scholarships = [
  {
    id: "1",
    title: "Women in STEM Scholarship",
    organization: "Tech Forward Foundation",
    amount: "$5,000",
    deadline: "May 15, 2025",
    category: "Technology",
    description: "For women pursuing degrees in Science, Technology, Engineering, or Mathematics.",
    isPremium: false,
  },
  {
    id: "2",
    title: "Future Leaders Grant",
    organization: "Global Leadership Initiative",
    amount: "$3,500",
    deadline: "June 30, 2025",
    category: "Business",
    description: "Supporting women with leadership potential in business and entrepreneurship.",
    isPremium: false,
  },
  {
    id: "3",
    title: "Healthcare Innovation Scholarship",
    organization: "MedTech Alliance",
    amount: "$7,500",
    deadline: "April 10, 2025",
    category: "Healthcare",
    description: "For women pursuing innovative research in healthcare and medical technologies.",
    isPremium: true,
  },
  {
    id: "4",
    title: "Creative Arts Fellowship",
    organization: "Arts Forward Foundation",
    amount: "$4,000",
    deadline: "July 22, 2025",
    category: "Arts",
    description: "Supporting women in visual arts, performing arts, and creative writing.",
    isPremium: false,
  },
  {
    id: "5",
    title: "Environmental Leadership Award",
    organization: "Green Future Initiative",
    amount: "$6,000",
    deadline: "May 30, 2025",
    category: "Science",
    description: "For women pursuing studies in environmental science and sustainability.",
    isPremium: true,
  },
  {
    id: "6",
    title: "Social Impact Scholarship",
    organization: "Community Change Foundation",
    amount: "$4,500",
    deadline: "June 15, 2025",
    category: "Social Sciences",
    description: "Supporting women committed to creating positive social change in their communities.",
    isPremium: true,
  },
]

export default function ScholarshipsPage() {
  const { isPremium, isProfileCompleted } = usePremiumCheck()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [selectedScholarship, setSelectedScholarship] = useState<string | null>(null)

  // Filter scholarships based on search term and active tab
  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "premium") return matchesSearch && scholarship.isPremium
    if (activeTab === "regular") return matchesSearch && !scholarship.isPremium

    return matchesSearch
  })

  const handleScholarshipClick = (id: string, isPremiumScholarship: boolean) => {
    if (isPremiumScholarship && !isPremium) {
      setSelectedScholarship(id)
      setShowPremiumModal(true)
    } else {
      // Navigate to scholarship details
      window.location.href = `/scholarships/apply/${id}`
    }
  }

  return (
    <div className="container py-10">
      <ScrollAnimation>
        <h1 className="mb-6 text-3xl font-bold">Scholarships</h1>
      </ScrollAnimation>

      <ScrollAnimation delay={0.2}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search scholarships..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </ScrollAnimation>

      <ScrollAnimation delay={0.3}>
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Scholarships</TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Premium
            </TabsTrigger>
            <TabsTrigger value="regular">Regular</TabsTrigger>
          </TabsList>
        </Tabs>
      </ScrollAnimation>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredScholarships.map((scholarship, index) => (
          <ScrollAnimation key={scholarship.id} delay={0.3 + index * 0.1} direction="up">
            <Card className={`relative ${scholarship.isPremium ? "border-amber-500" : ""}`}>
              {scholarship.isPremium && <PremiumBadge />}

              <CardHeader>
                <CardTitle>{scholarship.title}</CardTitle>
                <CardDescription>{scholarship.organization}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{scholarship.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Deadline: {scholarship.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{scholarship.category}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{scholarship.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleScholarshipClick(scholarship.id, scholarship.isPremium)}
                  disabled={!isProfileCompleted}
                >
                  {scholarship.isPremium && !isPremium ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Unlock Premium
                    </>
                  ) : !isProfileCompleted ? (
                    "Complete Profile to Apply"
                  ) : (
                    "View Details"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </ScrollAnimation>
        ))}
      </div>

      {/* Premium upgrade modal */}
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  )
}

