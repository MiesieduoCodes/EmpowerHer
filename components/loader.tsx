"use client"

import { useEffect, useState } from "react"
import { BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "small" | "medium" | "large"
  showText?: boolean
  className?: string
}

export function Loader({ size = "medium", showText = true, className }: LoaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const sizeClasses = {
    small: "h-16 w-16",
    medium: "h-24 w-24",
    large: "h-32 w-32",
  }

  const textSizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
  }

  if (!mounted) return null

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        <div
          className={cn(
            "rounded-full border-4 border-t-purple-600 border-r-purple-400 border-b-purple-200 border-l-purple-400",
            "animate-spin",
            sizeClasses[size],
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="h-1/3 w-1/3 text-purple-600 animate-pulse" />
        </div>
      </div>

      {showText && (
        <div className="mt-4 relative overflow-hidden">
          <div className={cn("font-bold text-purple-600", textSizeClasses[size])}>
            <span className="inline-block animate-slide-up-fade">Empower Her</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-teal-500 animate-width-grow" />
        </div>
      )}
    </div>
  )
}
