"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, CheckCircle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from "@/lib/user-store"
import { mockScholarships } from "@/lib/mock-data"

export default function ScholarshipApplicationPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { applications, submitApplication, profile, aiScholarships } = useUserStore()

  const applicationId = Number.parseInt(params.id as string)
  const application = applications.find((app) => app.id === applicationId)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scholarship, setScholarship] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: `${profile.firstName} ${profile.lastName}`,
    email: profile.email,
    phone: profile.phone,
    school: profile.school,
    graduationYear: profile.graduationYear,
    essay: "",
    references: "",
    additionalInfo: "",
  })

  useEffect(() => {
    if (!application) {
      toast({
        title: "Application Not Found",
        description: "The application you're looking for doesn't exist",
        variant: "destructive",
      })
      router.push("/scholarships")
      return
    }

    // Find the scholarship from both regular and AI scholarships
    const allScholarships = [...mockScholarships, ...aiScholarships]
    const foundScholarship = allScholarships.find((s) => s.id === application.scholarshipId)

    if (!foundScholarship) {
      toast({
        title: "Scholarship Not Found",
        description: "The scholarship for this application doesn't exist",
        variant: "destructive",
      })
      router.push("/scholarships")
      return
    }

    setScholarship(foundScholarship)
  }, [application, router, toast, aiScholarships])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission delay
    setTimeout(() => {
      submitApplication(applicationId)

      toast({
        title: "Application Submitted",
        description: "Your scholarship application has been submitted successfully!",
      })

      router.push("/dashboard")
      setIsSubmitting(false)
    }, 1500)
  }

  if (!scholarship) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center">
            <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
            <span className="font-bold text-xl">Empower Her</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/scholarships" className="text-sm font-medium">
              Scholarships
            </Link>
            <Link href="/mentorship" className="text-sm font-medium">
              Mentorship
            </Link>
            <Link href="/profile" className="text-sm font-medium">
              Profile
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/scholarships")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scholarships
              </Button>
            </div>
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>{scholarship.title}</CardTitle>
                <CardDescription>Complete the application form for this scholarship opportunity</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Scholarship Details</h3>
                    <div className="grid gap-1 text-sm">
                      <p>
                        <span className="font-medium">Provider:</span> {scholarship.provider}
                      </p>
                      <p>
                        <span className="font-medium">Amount:</span> {scholarship.amount}
                      </p>
                      <p>
                        <span className="font-medium">Deadline:</span> {scholarship.deadline}
                      </p>
                      <p>
                        <span className="font-medium">Category:</span> {scholarship.category}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="school">School/Institution</Label>
                        <Input id="school" name="school" value={formData.school} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Application Questions</h3>
                    <div className="space-y-2">
                      <Label htmlFor="essay">Personal Statement (Why do you deserve this scholarship?)</Label>
                      <Textarea
                        id="essay"
                        name="essay"
                        value={formData.essay}
                        onChange={handleChange}
                        placeholder="Write your personal statement here..."
                        rows={6}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="references">References (List any academic or professional references)</Label>
                      <Textarea
                        id="references"
                        name="references"
                        value={formData.references}
                        onChange={handleChange}
                        placeholder="Name, Position, Contact Information"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        placeholder="Any other information you'd like to share..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Supporting Documents</h3>
                    <div className="space-y-2">
                      <Label htmlFor="transcript">Academic Transcript</Label>
                      <div className="flex items-center gap-2">
                        <Input id="transcript" type="file" className="hidden" />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("transcript")?.click()}
                          className="w-full justify-start"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Transcript
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recommendation">Letter of Recommendation</Label>
                      <div className="flex items-center gap-2">
                        <Input id="recommendation" type="file" className="hidden" />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("recommendation")?.click()}
                          className="w-full justify-start"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Letter
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/scholarships")}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Submitting Application..."
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

