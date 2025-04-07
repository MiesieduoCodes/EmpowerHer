"use client"

import { useState } from "react"
import Image from "next/image"
import { PremiumBadge, usePremiumCheck } from "@/lib/premium-check"
import { PremiumModal } from "@/components/premium-modal"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Sparkles, Briefcase, MapPin, Clock, Lock } from "lucide-react"

// Mock mentor data
const mentors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    expertise: ["Software Development", "AI", "Leadership"],
    availability: "2 hours/week",
    bio: "Dr. Johnson has 15+ years of experience in software development and AI research. She's passionate about mentoring women in tech.",
    image: "/placeholder-user.jpg",
    isPremium: false,
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    title: "Marketing Director",
    company: "Global Brands",
    location: "New York, NY",
    expertise: ["Digital Marketing", "Brand Strategy", "Content Creation"],
    availability: "1 hour/week",
    bio: "Maria has helped scale multiple startups through innovative marketing strategies. She specializes in digital marketing and brand development.",
    image: "/placeholder-user.jpg",
    isPremium: false,
  },
  {
    id: "3",
    name: "Dr. Emily Chen",
    title: "Research Scientist",
    company: "BioTech Research",
    location: "Boston, MA",
    expertise: ["Biotechnology", "Research Methods", "Grant Writing"],
    availability: "3 hours/week",
    bio: "Dr. Chen leads groundbreaking research in biotechnology. She's committed to supporting women pursuing careers in scientific research.",
    image: "/placeholder-user.jpg",
    isPremium: true,
  },
  {
    id: "4",
    name: "Priya Patel",
    title: "Investment Banker",
    company: "Global Finance Partners",
    location: "Chicago, IL",
    expertise: ["Finance", "Investment Strategy", "Networking"],
    availability: "2 hours/week",
    bio: "Priya has over a decade of experience in investment banking. She's passionate about financial literacy and helping women succeed in finance.",
    image: "/placeholder-user.jpg",
    isPremium: true,
  },
  {
    id: "5",
    name: "Alexandra Williams",
    title: "Creative Director",
    company: "Design Forward",
    location: "Los Angeles, CA",
    expertise: ["UX/UI Design", "Creative Direction", "Portfolio Development"],
    availability: "2 hours/week",
    bio: "Alexandra has worked with major brands on award-winning design campaigns. She loves helping emerging designers develop their portfolios.",
    image: "/placeholder-user.jpg",
    isPremium: false,
  },
  {
    id: "6",
    name: "Dr. Olivia Taylor",
    title: "Chief Medical Officer",
    company: "Health Innovations",
    location: "Seattle, WA",
    expertise: ["Healthcare Administration", "Medical Research", "Leadership"],
    availability: "1 hour/week",
    bio: "Dr. Taylor has pioneered innovative healthcare solutions throughout her career. She mentors women pursuing careers in medicine and healthcare leadership.",
    image: "/placeholder-user.jpg",
    isPremium: true,
  },
]

export default function MentorshipPage() {
  const { isPremium, isProfileCompleted } = usePremiumCheck()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null)

  // Filter mentors based on search term and active tab
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "premium") return matchesSearch && mentor.isPremium
    if (activeTab === "regular") return matchesSearch && !mentor.isPremium

    return matchesSearch
  })

  const handleMentorClick = (id: string, isPremiumMentor: boolean) => {
    if (isPremiumMentor && !isPremium) {
      setSelectedMentor(id)
      setShowPremiumModal(true)
    } else {
      // Navigate to mentor details or open request modal
      console.log(`Request mentorship from ${id}`)
    }
  }

  return (
    <div className="container py-10">
      <ScrollAnimation>
        <h1 className="mb-6 text-3xl font-bold">Find a Mentor</h1>
      </ScrollAnimation>

      <ScrollAnimation delay={0.2}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search mentors by name, expertise, or company..."
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
            <TabsTrigger value="all">All Mentors</TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Premium
            </TabsTrigger>
            <TabsTrigger value="regular">Regular</TabsTrigger>
          </TabsList>
        </Tabs>
      </ScrollAnimation>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.map((mentor, index) => (
          <ScrollAnimation key={mentor.id} delay={0.3 + index * 0.1} direction="up">
            <Card className={`relative ${mentor.isPremium ? "border-amber-500" : ""}`}>
              {mentor.isPremium && <PremiumBadge />}

              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      src={mentor.image || "/placeholder.svg"}
                      alt={mentor.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{mentor.name}</CardTitle>
                    <CardDescription>{mentor.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mentor.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mentor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Availability: {mentor.availability}</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Expertise:</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{mentor.bio}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleMentorClick(mentor.id, mentor.isPremium)}
                  disabled={!isProfileCompleted}
                >
                  {mentor.isPremium && !isPremium ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Unlock Premium
                    </>
                  ) : !isProfileCompleted ? (
                    "Complete Profile to Connect"
                  ) : (
                    "Request Mentorship"
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

