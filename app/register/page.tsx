"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUserStore } from "@/lib/user-store"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Check, Sparkles, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

// Flutterwave configuration
declare global {
  interface Window {
    FlutterwaveCheckout: any
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium">("free")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = () => {
    setIsLoading(true)

    // For premium plan, process payment with Flutterwave
    if (selectedPlan === "premium") {
      try {
        // Load Flutterwave script if not already loaded
        if (!window.FlutterwaveCheckout) {
          const script = document.createElement("script")
          script.src = "https://checkout.flutterwave.com/v3.js"
          document.body.appendChild(script)
          script.onload = initializePayment
        } else {
          initializePayment()
        }
      } catch (error) {
        console.error("Payment initialization failed:", error)
        setIsLoading(false)
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      // For free plan, just register the user
      completeRegistration(false)
    }
  }

  const initializePayment = () => {
    window.FlutterwaveCheckout({
      public_key: "FLWPUBK_TEST-3614527a79f7edf4d1a6e7dc93674123-X", // Replace with your actual public key
      tx_ref: `empowerher-${Date.now()}`,
      amount: 9.99,
      currency: "USD",
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: formData.email,
        name: formData.name,
      },
      customizations: {
        title: "EmpowerHer Premium",
        description: "Premium Membership Payment",
        logo: "https://your-logo-url.com/logo.png", // Replace with your logo URL
      },
      callback: (response: any) => {
        // Verify the transaction on your backend
        if (response.status === "successful") {
          completeRegistration(true)
        } else {
          setIsLoading(false)
          toast({
            title: "Payment Failed",
            description: "Your payment was not successful. Please try again.",
            variant: "destructive",
          })
        }
      },
      onclose: () => {
        setIsLoading(false)
      },
    })
  }

  const completeRegistration = (isPremium: boolean) => {
    // In a real app, you would make an API call to register the user
    // For this demo, we'll simulate a successful registration
    setTimeout(() => {
      const userId = uuidv4()

      // Create user in store
      login({
        id: userId,
        name: formData.name,
        email: formData.email,
        interests: [],
        isPremium: isPremium,
        profileCompleted: false,
      })

      setIsLoading(false)
      toast({
        title: "Registration Successful",
        description: `Welcome to EmpowerHer! You've signed up for the ${isPremium ? "Premium" : "Free"} plan.`,
      })

      // Redirect to dashboard
      router.push("/profile")
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    handlePayment()
  }

  return (
    <div className="container max-w-4xl py-10">
      <ScrollAnimation>
        <h1 className="mb-6 text-center text-3xl font-bold">Join EmpowerHer</h1>
        <p className="mb-8 text-center text-muted-foreground">
          Create an account to access scholarships and mentorship opportunities
        </p>
      </ScrollAnimation>

      <ScrollAnimation delay={0.2}>
        <Tabs
          defaultValue="free"
          className="mb-8"
          onValueChange={(value) => setSelectedPlan(value as "free" | "premium")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="free">Free Plan</TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Premium Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="free" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Free Plan</CardTitle>
                <CardDescription>Get started with basic features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Basic scholarship access</p>
                      <p className="text-sm text-muted-foreground">Browse and apply to standard scholarships</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Standard mentorship</p>
                      <p className="text-sm text-muted-foreground">Connect with available mentors</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-muted-foreground">Premium scholarships</p>
                      <p className="text-sm text-muted-foreground">Access to exclusive scholarship opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-muted-foreground">Priority mentorship</p>
                      <p className="text-sm text-muted-foreground">Priority matching with top mentors</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-2xl font-bold">Free</p>
                  <p className="text-sm text-muted-foreground">No payment required</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="premium" className="mt-6">
            <Card className="border-amber-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-1">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      Premium Plan
                    </CardTitle>
                    <CardDescription>Unlock all features and opportunities</CardDescription>
                  </div>
                  <Badge className="bg-amber-500 text-white">Recommended</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">All free plan features</p>
                      <p className="text-sm text-muted-foreground">Everything in the free plan, plus:</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Premium scholarships</p>
                      <p className="text-sm text-muted-foreground">Access to exclusive high-value scholarships</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Priority mentorship</p>
                      <p className="text-sm text-muted-foreground">Get matched with top industry mentors</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Advanced application tracking</p>
                      <p className="text-sm text-muted-foreground">Track and manage all your applications</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-2xl font-bold">$9.99</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollAnimation>

      <ScrollAnimation delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Enter your details to {selectedPlan === "premium" ? "sign up for premium" : "get started"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({ ...prev, agreeToTerms: checked === true }))
                    if (errors.agreeToTerms) {
                      setErrors((prev) => {
                        const newErrors = { ...prev }
                        delete newErrors.agreeToTerms
                        return newErrors
                      })
                    }
                  }}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}

              {selectedPlan === "premium" && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                  <p className="flex items-center gap-1 font-medium text-amber-800 dark:text-amber-400">
                    <Sparkles className="h-4 w-4" />
                    Premium Plan Selected
                  </p>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    You'll be charged $9.99/month after completing registration. Cancel anytime.
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Processing..."
                  : selectedPlan === "premium"
                    ? "Sign Up & Pay with Flutterwave"
                    : "Create Free Account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </ScrollAnimation>
    </div>
  )
}

