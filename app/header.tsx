// Create a reusable responsive header component
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Menu, Bell, User, LogOut, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { PaymentModal } from "@/components/payment-modal"
import { useUserStore } from "@/lib/user-store"
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  showAuth?: boolean
  activePage?: string
}

export function Header({ showAuth = true, activePage }: HeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isLoggedIn, logout, profile, updateProfile } = useUserStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
  }

  const handleUpgradeToPremium = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    updateProfile({ isPremium: true })
    toast({
      title: "Premium Activated",
      description: "You now have access to all premium content!",
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
              <span className="font-bold text-xl">Empower Her</span>
            </Link>
            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 text-sm font-medium ${activePage === "dashboard" ? "text-purple-600" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/scholarships"
                className={`flex items-center gap-2 text-sm font-medium ${activePage === "scholarships" ? "text-purple-600" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Scholarships
              </Link>
              <Link
                href="/mentorship"
                className={`flex items-center gap-2 text-sm font-medium ${activePage === "mentorship" ? "text-purple-600" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Mentorship
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-2 text-sm font-medium ${activePage === "profile" ? "text-purple-600" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/insights"
                className={`flex items-center gap-2 text-sm font-medium ${activePage === "insights" ? "text-purple-600" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Insights
              </Link>
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  className="justify-start p-0 h-auto font-medium text-sm"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center md:ml-0 ml-2">
          <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
          <span className="font-bold text-xl">Empower Her</span>
        </Link>
        <nav className="mx-6 hidden md:flex md:items-center md:gap-4 lg:gap-6">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium ${activePage === "dashboard" ? "text-purple-600" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                href="/scholarships"
                className={`text-sm font-medium ${activePage === "scholarships" ? "text-purple-600" : ""}`}
              >
                Scholarships
              </Link>
              <Link
                href="/mentorship"
                className={`text-sm font-medium ${activePage === "mentorship" ? "text-purple-600" : ""}`}
              >
                Mentorship
              </Link>
              <Link
                href="/insights"
                className={`text-sm font-medium ${activePage === "insights" ? "text-purple-600" : ""}`}
              >
                Insights
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className={`text-sm font-medium ${activePage === "home" ? "text-purple-600" : ""}`}>
                Home
              </Link>
              <Link href="/about" className={`text-sm font-medium ${activePage === "about" ? "text-purple-600" : ""}`}>
                About
              </Link>
              <Link
                href="/scholarships"
                className={`text-sm font-medium ${activePage === "scholarships" ? "text-purple-600" : ""}`}
              >
                Scholarships
              </Link>
              <Link
                href="/mentorship"
                className={`text-sm font-medium ${activePage === "mentorship" ? "text-purple-600" : ""}`}
              >
                Mentorship
              </Link>
            </>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {isLoggedIn ? (
            <>
              {!profile.isPremium && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex text-amber-500 border-amber-500 hover:bg-amber-500 hover:text-white"
                  onClick={handleUpgradeToPremium}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade
                </Button>
              )}
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-medium text-white">
                  3
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </>
          ) : (
            showAuth && (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Sign up
                  </Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </header>
  )
}
