"use client"

import { Checkbox } from "@/components/ui/checkbox"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Save, Camera, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"
import { useUserStore } from "@/lib/user-store"
import { useToast } from "@/hooks/use-toast"
import { mockScholarships } from "@/lib/mock-data"
import { Header } from "@/app/header"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    profile,
    updateProfile,
    isLoggedIn,
    applications,
    savedScholarships,
    aiScholarships,
    checkProfileCompletion,
  } = useUserStore()

  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(profile)
  const [isSaving, setIsSaving] = useState(false)
  const [profilePictureUrl, setProfilePictureUrl] = useState(profile.profilePicture || "")
  const [showProfilePictureInput, setShowProfilePictureInput] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to access your profile",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [isLoggedIn, router, toast])

  // Update local state when profile changes
  useEffect(() => {
    setProfileData(profile)
    setProfilePictureUrl(profile.profilePicture || "")
  }, [profile])

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Simulate saving delay
    setTimeout(() => {
      const updatedProfile = {
        ...profileData,
        profilePicture: profilePictureUrl,
      }

      updateProfile(updatedProfile)
      setIsEditing(false)
      setIsSaving(false)
      setShowProfilePictureInput(false)

      const isCompleted = checkProfileCompletion()

      toast({
        title: "Profile Updated",
        description: isCompleted
          ? "Your profile has been updated successfully! You now have access to personalized recommendations."
          : "Your profile has been updated. Complete all fields to unlock personalized recommendations.",
      })
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfilePictureChange = () => {
    if (profilePictureUrl.trim() !== "") {
      setShowProfilePictureInput(false)
    }
  }

  // Get scholarship details for applications
  const getScholarshipDetails = (scholarshipId: number) => {
    const allScholarships = [...mockScholarships, ...aiScholarships]
    return allScholarships.find((s) => s.id === scholarshipId)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header activePage="profile" />
      <main className="flex-1 py-6">
        <div className="container">
          <ScrollAnimationWrapper>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                  <p className="text-muted-foreground">Manage your personal information and preferences</p>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                  className={isEditing ? "bg-purple-600 hover:bg-purple-700" : ""}
                  disabled={isSaving}
                >
                  {isEditing ? (
                    isSaving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>

              {!profile.profileCompleted && (
                <Alert className="border-amber-500">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertTitle>Complete your profile</AlertTitle>
                  <AlertDescription>
                    Fill in all required fields to unlock personalized scholarship recommendations and mentorship
                    opportunities.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-6 md:grid-cols-7">
                <Card className="md:col-span-7 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profilePictureUrl} alt="Profile picture" />
                      <AvatarFallback>
                        {profileData.firstName.charAt(0)}
                        {profileData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => setShowProfilePictureInput(!showProfilePictureInput)}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Change Photo
                        </Button>

                        {showProfilePictureInput && (
                          <div className="mt-4 w-full space-y-2">
                            <Label htmlFor="profilePictureUrl">Image URL</Label>
                            <div className="flex gap-2">
                              <Input
                                id="profilePictureUrl"
                                value={profilePictureUrl}
                                onChange={(e) => setProfilePictureUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                              />
                              <Button size="sm" onClick={handleProfilePictureChange}>
                                Apply
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div className="mt-6 text-center">
                      <h3 className="font-medium text-lg">
                        {profileData.firstName} {profileData.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{profileData.educationLevel} Student</p>
                      <p className="text-sm text-muted-foreground">{profileData.school}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {profileData.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="md:col-span-7 lg:col-span-5">
                  <Tabs defaultValue="personal">
                    <TabsList className="mb-4 flex w-full overflow-x-auto">
                      <TabsTrigger value="personal" className="flex-1">
                        Personal
                      </TabsTrigger>
                      <TabsTrigger value="education" className="flex-1">
                        Education
                      </TabsTrigger>
                      <TabsTrigger value="interests" className="flex-1">
                        Interests
                      </TabsTrigger>
                      <TabsTrigger value="applications" className="flex-1">
                        Applications
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="personal">
                      <Card>
                        <CardHeader>
                          <CardTitle>Personal Information</CardTitle>
                          <CardDescription>Update your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First name</Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={profileData.firstName}
                                disabled={!isEditing}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last name</Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={profileData.lastName}
                                disabled={!isEditing}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={profileData.email}
                              disabled={!isEditing}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={profileData.phone}
                              disabled={!isEditing}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            {isEditing ? (
                              <Select
                                value={profileData.country}
                                onValueChange={(value) => handleSelectChange("country", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                                  <SelectItem value="Ghana">Ghana</SelectItem>
                                  <SelectItem value="Kenya">Kenya</SelectItem>
                                  <SelectItem value="South Africa">South Africa</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input id="country" value={profileData.country} disabled />
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              name="bio"
                              value={profileData.bio}
                              disabled={!isEditing}
                              onChange={handleInputChange}
                              rows={4}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="education">
                      <Card>
                        <CardHeader>
                          <CardTitle>Education</CardTitle>
                          <CardDescription>Your educational background</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="educationLevel">Education Level</Label>
                            {isEditing ? (
                              <Select
                                value={profileData.educationLevel}
                                onValueChange={(value) => handleSelectChange("educationLevel", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your education level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Secondary School">Secondary School</SelectItem>
                                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                                  <SelectItem value="Graduate">Graduate</SelectItem>
                                  <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input id="educationLevel" value={profileData.educationLevel} disabled />
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="school">School/Institution</Label>
                            <Input
                              id="school"
                              name="school"
                              value={profileData.school}
                              disabled={!isEditing}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                            {isEditing ? (
                              <Select
                                value={profileData.graduationYear}
                                onValueChange={(value) => handleSelectChange("graduationYear", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select graduation year" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2024">2024</SelectItem>
                                  <SelectItem value="2025">2025</SelectItem>
                                  <SelectItem value="2026">2026</SelectItem>
                                  <SelectItem value="2027">2027</SelectItem>
                                  <SelectItem value="2028">2028</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input id="graduationYear" value={profileData.graduationYear} disabled />
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Academic Achievements</Label>
                            {isEditing ? (
                              <Textarea placeholder="List your academic achievements, awards, and honors" rows={4} />
                            ) : (
                              <p className="text-sm text-muted-foreground">No achievements added yet.</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="interests">
                      <Card>
                        <CardHeader>
                          <CardTitle>Interests & Skills</CardTitle>
                          <CardDescription>Help us match you with relevant scholarships and mentors</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Areas of Interest</Label>
                            {isEditing ? (
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="interest-cs"
                                    className="rounded border-gray-300"
                                    checked={profileData.interests.includes("Computer Science")}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: [...prev.interests, "Computer Science"],
                                        }))
                                      } else {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: prev.interests.filter((i) => i !== "Computer Science"),
                                        }))
                                      }
                                    }}
                                  />
                                  <Label htmlFor="interest-cs">Computer Science</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="interest-math"
                                    className="rounded border-gray-300"
                                    checked={profileData.interests.includes("Mathematics")}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: [...prev.interests, "Mathematics"],
                                        }))
                                      } else {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: prev.interests.filter((i) => i !== "Mathematics"),
                                        }))
                                      }
                                    }}
                                  />
                                  <Label htmlFor="interest-math">Mathematics</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="interest-business"
                                    className="rounded border-gray-300"
                                    checked={profileData.interests.includes("Entrepreneurship")}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: [...prev.interests, "Entrepreneurship"],
                                        }))
                                      } else {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: prev.interests.filter((i) => i !== "Entrepreneurship"),
                                        }))
                                      }
                                    }}
                                  />
                                  <Label htmlFor="interest-business">Entrepreneurship</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="interest-engineering"
                                    className="rounded border-gray-300"
                                    checked={profileData.interests.includes("Engineering")}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: [...prev.interests, "Engineering"],
                                        }))
                                      } else {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: prev.interests.filter((i) => i !== "Engineering"),
                                        }))
                                      }
                                    }}
                                  />
                                  <Label htmlFor="interest-engineering">Engineering</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="interest-medicine"
                                    className="rounded border-gray-300"
                                    checked={profileData.interests.includes("Medicine")}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: [...prev.interests, "Medicine"],
                                        }))
                                      } else {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: prev.interests.filter((i) => i !== "Medicine"),
                                        }))
                                      }
                                    }}
                                  />
                                  <Label htmlFor="interest-medicine">Medicine</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="interest-arts"
                                    className="rounded border-gray-300"
                                    checked={profileData.interests.includes("Arts & Design")}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: [...prev.interests, "Arts & Design"],
                                        }))
                                      } else {
                                        setProfileData((prev) => ({
                                          ...prev,
                                          interests: prev.interests.filter((i) => i !== "Arts & Design"),
                                        }))
                                      }
                                    }}
                                  />
                                  <Label htmlFor="interest-arts">Arts & Design</Label>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {profileData.interests.length > 0 ? (
                                  profileData.interests.map((interest, index) => (
                                    <Badge key={index} variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
                                      {interest}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No interests added yet.</p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Skills</Label>
                            {isEditing ? (
                              <Textarea
                                placeholder="List your skills (e.g., programming languages, leadership, public speaking)"
                                rows={3}
                                value={profileData.skills?.join(", ") || ""}
                                onChange={(e) => {
                                  const skillsArray = e.target.value
                                    .split(",")
                                    .map((skill) => skill.trim())
                                    .filter(Boolean)
                                  setProfileData((prev) => ({ ...prev, skills: skillsArray }))
                                }}
                              />
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {profileData.skills && profileData.skills.length > 0 ? (
                                  profileData.skills.map((skill, index) => (
                                    <Badge key={index} variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
                                      {skill}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No skills added yet.</p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Career Goals</Label>
                            {isEditing ? (
                              <Textarea placeholder="Describe your career aspirations and goals" rows={3} />
                            ) : (
                              <p className="text-sm text-muted-foreground">No career goals added yet.</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="applications">
                      <Card>
                        <CardHeader>
                          <CardTitle>Scholarship Applications</CardTitle>
                          <CardDescription>Track your scholarship applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {applications.length > 0 ? (
                              applications.map((application) => {
                                const scholarship = getScholarshipDetails(application.scholarshipId)
                                if (!scholarship) return null

                                return (
                                  <div key={application.id} className="rounded-lg border p-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-medium">{scholarship.title}</h3>
                                        <p className="text-sm text-muted-foreground">{scholarship.provider}</p>
                                      </div>
                                      <Badge
                                        className={
                                          application.status === "pending"
                                            ? "bg-yellow-500"
                                            : application.status === "submitted"
                                              ? "bg-green-600"
                                              : application.status === "draft"
                                                ? "bg-gray-400"
                                                : "bg-purple-600"
                                        }
                                      >
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                      </Badge>
                                    </div>
                                    <div className="mt-2 text-sm">
                                      <p>Applied: {application.appliedDate}</p>
                                      {application.decisionDate && <p>Decision expected: {application.decisionDate}</p>}
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-2"
                                      onClick={() => {
                                        if (application.status === "draft") {
                                          router.push(`/scholarships/apply/${application.id}`)
                                        } else {
                                          toast({
                                            title: "Application Details",
                                            description: `Viewing details for ${scholarship.title} application`,
                                          })
                                        }
                                      }}
                                    >
                                      {application.status === "draft" ? "Continue Application" : "View Application"}
                                    </Button>
                                  </div>
                                )
                              })
                            ) : (
                              <div className="text-center py-6">
                                <p className="text-muted-foreground">You haven't applied for any scholarships yet.</p>
                                <Button variant="outline" className="mt-4" onClick={() => router.push("/scholarships")}>
                                  Browse Scholarships
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        {applications.length > 0 && (
                          <CardFooter>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                toast({
                                  title: "All Applications",
                                  description: "Viewing all your scholarship applications",
                                })
                              }}
                            >
                              View All Applications
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </main>
    </div>
  )
}
