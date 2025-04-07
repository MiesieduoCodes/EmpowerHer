"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/user-store"
import { ProfilePictureEditor } from "@/components/profile-picture-editor"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Sparkles } from "lucide-react"

const interestOptions = [
  "Technology",
  "Business",
  "Healthcare",
  "Education",
  "Arts",
  "Science",
  "Engineering",
  "Social Sciences",
  "Humanities",
  "Law",
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoggedIn, updateUser, updateInterests, completeProfile } = useUserStore()
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    education: "",
    achievements: "",
  })
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        education: user.education || "",
        achievements: user.achievements || "",
      })
      setSelectedInterests(user.interests || [])
    }
  }, [isLoggedIn, router, user])

  if (!mounted || !isLoggedIn || !user) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Update user profile
      updateUser({
        ...formData,
      })

      // Update interests
      updateInterests(selectedInterests)

      // Mark profile as completed if all required fields are filled
      if (formData.name && formData.email && formData.bio && formData.education && selectedInterests.length > 0) {
        completeProfile()
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <ScrollAnimation>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          {user.isPremium && (
            <Badge variant="secondary" className="bg-amber-500 text-white">
              <Sparkles className="mr-1 h-3 w-3" /> Premium Member
            </Badge>
          )}
        </div>
      </ScrollAnimation>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 md:grid-cols-3">
          <ScrollAnimation delay={0.2} className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload or link to your profile picture</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ProfilePictureEditor />
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={0.3} className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email address"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={0.4} className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Education & Achievements</CardTitle>
                <CardDescription>Share your educational background and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    placeholder="Your educational background"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievements">Achievements</Label>
                  <Textarea
                    id="achievements"
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    placeholder="Your achievements and awards"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={0.5} className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
                <CardDescription>
                  Select your interests to get matched with relevant scholarships and mentors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={selectedInterests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label htmlFor={`interest-${interest}`}>{interest}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="ml-auto">
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
              </CardFooter>
            </Card>
          </ScrollAnimation>
        </div>
      </form>
    </div>
  )
}

