"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUserStore } from "@/lib/user-store"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const login = useUserStore((state) => state.login)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      // In a real app, we would authenticate with an API
      console.log("Login attempted with:", { email, password })

      // For demo purposes, any login works
      login()

      toast({
        title: "Login Successful",
        description: "Welcome back to Empower Her!",
      })

      // Redirect to dashboard after successful login
      router.push("/dashboard")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center px-4 sm:px-6">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center">
        <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
        <span className="font-bold text-xl">Empower Her</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Log in</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane.doe@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-purple-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

