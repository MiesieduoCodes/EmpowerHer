"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, Check, Crown, Eye, EyeOff, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"
import { useUserStore } from "@/lib/user-store"
import { useToast } from "@/hooks/use-toast"

// Flutterwave configuration
declare global {
  interface Window {
    FlutterwaveCheckout: any
  }
}

// Premium plan options
const premiumPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 1000,
    features: ["Access to 5 premium scholarships", "Basic mentorship access", "Standard application tracking"],
    recommended: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: 3500,
    features: [
      "Access to 15 premium scholarships",
      "Priority mentorship matching",
      "Advanced application tracking",
      "Monthly scholarship alerts",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 7000,
    features: [
      "Unlimited premium scholarships",
      "VIP mentorship access",
      "Comprehensive application tracking",
      "Weekly scholarship alerts",
      "Application review assistance",
    ],
    recommended: false,
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const updateProfile = useUserStore((state) => state.updateProfile)
  const login = useUserStore((state) => state.login)

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"free" | string>("free")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
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

    // For premium plans, process payment with Flutterwave
    if (selectedPlan !== "free") {
      try {
        // Find the selected plan
        const plan = premiumPlans.find((p) => p.id === selectedPlan)
        if (!plan) {
          throw new Error("Invalid plan selected")
        }

        // Load Flutterwave script if not already loaded
        if (!window.FlutterwaveCheckout) {
          const script = document.createElement("script")
          script.src = "https://checkout.flutterwave.com/v3.js"
          document.body.appendChild(script)
          script.onload = () => initializePayment(plan)
        } else {
          initializePayment(plan)
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

  const initializePayment = (plan: (typeof premiumPlans)[0]) => {
    window.FlutterwaveCheckout({
      public_key: "FLWPUBK_TEST-XXXXX-X", // Replace with your actual Flutterwave public key
      tx_ref: `empowerher-${Date.now()}`,
      amount: plan.price,
      currency: "NGN",
      payment_options: "card,banktransfer,ussd",
      customer: {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
      },
      customizations: {
        title: "Empower Her Premium",
        description: `${plan.name} Plan Subscription`,
        logo: "https://your-logo-url.com/logo.png", // Replace with your logo URL
      },
      callback: (response: any) => {
        // Verify the transaction on your backend
        if (response.status === "successful") {
          completeRegistration(true, plan.id)
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

  const completeRegistration = (isPremium: boolean, planId?: string) => {
    // In a real app, you would make an API call to register the user
    // For this demo, we'll simulate a successful registration
    setTimeout(() => {
      // Update user profile with form data
      updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        isPremium: isPremium,
        premiumPlan: planId || null,
        profileCompleted: false,
      })

      // Log the user in
      login()

      setIsLoading(false)
      toast({
        title: "Registration Successful",
        description: isPremium
          ? `Welcome to Empower Her! You've signed up for the ${premiumPlans.find((p) => p.id === planId)?.name} plan.`
          : "Welcome to Empower Her! Please complete your profile to get personalized recommendations.",
      })

      // Redirect to profile page to complete setup
      router.push("/profile")
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    handlePayment()
  }

  const getPlanPrice = (planId: string) => {
    if (planId === "free") return "Free"
    const plan = premiumPlans.find((p) => p.id === planId)
    return plan ? `₦${plan.price.toLocaleString()}` : ""
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-8">
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center">
        <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
        <span className="font-bold text-xl">Empower Her</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-4xl">
        <ScrollAnimationWrapper>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join Empower Her</h1>
            <p className="mt-2 text-muted-foreground">
              Create an account to access scholarships and mentorship opportunities
            </p>
          </div>
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper delay={0.2}>
          <Tabs defaultValue="free" className="mb-8" onValueChange={(value) => setSelectedPlan(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="free">Free</TabsTrigger>
              {premiumPlans.map((plan) => (
                <TabsTrigger key={plan.id} value={plan.id} className="flex items-center gap-1">
                  {plan.recommended && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
                  {plan.name}
                </TabsTrigger>
              ))}
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

            {premiumPlans.map((plan) => (
              <TabsContent key={plan.id} value={plan.id} className="mt-6">
                <Card className={plan.recommended ? "border-amber-500" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-1">
                          {plan.recommended && <Sparkles className="h-5 w-5 text-amber-500" />}
                          {plan.name} Plan
                        </CardTitle>
                        <CardDescription>
                          {plan.id === "basic"
                            ? "Essential premium features"
                            : plan.id === "standard"
                              ? "Most popular premium option"
                              : "Complete premium experience"}
                        </CardDescription>
                      </div>
                      {plan.recommended && <Badge className="bg-amber-500 text-white">Recommended</Badge>}
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
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">{feature}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <p className="text-2xl font-bold">₦{plan.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>
                Enter your details to {selectedPlan === "free" ? "get started" : "sign up for premium"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? "border-destructive" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
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
                      onChange={handleChange}
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
                    <Link href="/terms" className="text-purple-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-purple-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}

                {selectedPlan !== "free" && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                    <p className="flex items-center gap-1 font-medium text-amber-800 dark:text-amber-400">
                      <Crown className="h-4 w-4" />
                      {premiumPlans.find((p) => p.id === selectedPlan)?.name} Plan Selected
                    </p>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                      You'll be charged {getPlanPrice(selectedPlan)}/month after completing registration. Cancel
                      anytime.
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                  {isLoading
                    ? "Processing..."
                    : selectedPlan === "free"
                      ? "Create Free Account"
                      : `Sign Up & Pay ${getPlanPrice(selectedPlan)} with Flutterwave`}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-600 hover:underline">
                    Log in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </ScrollAnimationWrapper>
      </div>
    </div>
  )
}
