"use client"

import { useState } from "react"
import { Filter, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MentorCard } from "@/components/mentor-card"
import { Header } from "@/app/header"

const mockMentors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Computer Science Professor",
    institution: "MIT",
    field: "STEM",
    image: "https://images.pexels.com/photos/8423069/pexels-photo-8423069.jpeg?auto=compress&cs=tinysrgb&w=600",
    availability: "Available for mentoring",
  },
  {
    id: 2,
    name: "Amina Diallo",
    title: "Business Consultant",
    institution: "McKinsey & Co.",
    field: "Business",
    image: "https://images.pexels.com/photos/6266987/pexels-photo-6266987.jpeg?auto=compress&cs=tinysrgb&w=600",
    availability: "2 spots available",
  },
  {
    id: 3,
    name: "Dr. Maya Patel",
    title: "Medical Researcher",
    institution: "Johns Hopkins University",
    field: "Healthcare",
    image: "https://images.pexels.com/photos/5905551/pexels-photo-5905551.jpeg?auto=compress&cs=tinysrgb&w=600",
    availability: "Available next month",
  },
  {
    id: 4,
    name: "Prof. Elena Rodriguez",
    title: "Literature Professor",
    institution: "Oxford University",
    field: "Arts",
    image: "https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg?auto=compress&cs=tinysrgb&w=600",
    availability: "Currently full",
  },
  {
    id: 5,
    name: "Dr. Fatima Al-Farsi",
    title: "Aerospace Engineer",
    institution: "NASA",
    field: "STEM",
    image: "https://images.pexels.com/photos/9034265/pexels-photo-9034265.jpeg?auto=compress&cs=tinysrgb&w=600",
    availability: "1 spot available",
  },
  {
    id: 6,
    name: "Grace Mayer",
    title: "Finance Director",
    institution: "Goldman Sachs",
    field: "Business",
    image: "https://images.pexels.com/photos/6503000/pexels-photo-6503000.jpeg?auto=compress&cs=tinysrgb&w=600",
    availability: "Available for mentoring",
  },
]

export default function MentorshipPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [field, setField] = useState("all")
  const [filteredMentors, setFilteredMentors] = useState(mockMentors)
  const [activeTab, setActiveTab] = useState("all")

  const handleSearch = () => {
    let filtered = mockMentors

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.institution.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by field
    if (field !== "all") {
      filtered = filtered.filter((mentor) => mentor.field === field)
    }

    setFilteredMentors(filtered)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    if (value === "all") {
      setFilteredMentors(mockMentors)
    } else {
      setFilteredMentors(mockMentors.filter((mentor) => mentor.field.toLowerCase() === value.toLowerCase()))
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header activePage="mentorship" />
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Mentorship</h1>
              <p className="text-muted-foreground">
                Connect with inspiring female professionals who can guide you on your academic and career journey.
              </p>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2 md:col-span-2">
                    <Input
                      placeholder="Search mentors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                    <Button onClick={handleSearch} className="whitespace-nowrap">
                      <Search className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Search</span>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={field} onValueChange={setField}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Fields" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Fields</SelectItem>
                        <SelectItem value="STEM">STEM</SelectItem>
                        <SelectItem value="Arts">Arts & Humanities</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleSearch} className="whitespace-nowrap">
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Filter</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="stem">STEM</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="arts">Arts</TabsTrigger>
                <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    name={mentor.name}
                    title={mentor.title}
                    institution={mentor.institution}
                    image={mentor.image}
                    availability={mentor.availability}
                  />
                ))}
                {filteredMentors.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <User className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-medium mt-4">No mentors found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("")
                        setField("all")
                        setFilteredMentors(mockMentors)
                      }}
                    >
                      Reset Search
                    </Button>
                  </div>
                )}
              </TabsContent>
              {["stem", "business", "arts", "healthcare"].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {filteredMentors.length > 0 ? (
                    filteredMentors.map((mentor) => (
                      <MentorCard
                        key={mentor.id}
                        name={mentor.name}
                        title={mentor.title}
                        institution={mentor.institution}
                        image={mentor.image}
                        availability={mentor.availability}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <User className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium mt-4">No mentors found in this category</h3>
                      <p className="text-muted-foreground mt-1">Try another category or check back later</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setActiveTab("all")
                          setFilteredMentors(mockMentors)
                        }}
                      >
                        View All Mentors
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Become a Mentor</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Are you a professional woman looking to give back? Join our mentorship program and help guide the next
                generation of female leaders.
              </p>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Apply to be a Mentor
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

