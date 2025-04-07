"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/user-store"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isLoggedIn, logout } = useUserStore()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/mentorship", label: "Mentorship" },
    { href: "/about", label: "About" },
    { href: "/insights", label: "Insights" },
  ]

  const authLinks = isLoggedIn
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/profile", label: "Profile" },
      ]
    : [
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">EmpowerHer</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          {authLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant={link.label === "Register" ? "default" : "outline"} size="sm">
                {link.label}
              </Button>
            </Link>
          ))}
          {isLoggedIn && (
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background md:hidden">
            <div className="container flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">EmpowerHer</span>
              </Link>
              <Button variant="outline" size="icon" onClick={toggleMenu}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="container grid gap-6 pb-8 pt-6">
              <div className="grid gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center py-2 text-lg font-semibold"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="grid gap-3">
                {authLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMenu}>
                    <Button variant={link.label === "Register" ? "default" : "outline"} className="w-full">
                      {link.label}
                    </Button>
                  </Link>
                ))}
                {isLoggedIn && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      logout()
                      closeMenu()
                    }}
                  >
                    Logout
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

