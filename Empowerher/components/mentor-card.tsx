"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from "@/lib/user-store"

interface MentorCardProps {
  name: string
  title: string
  institution: string
  image: string
  availability: string
}

export function MentorCard({ name, title, institution, image, availability }: MentorCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isLoggedIn } = useUserStore()
  const [requested, setRequested] = useState(false)

  const handleConnect = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to connect with mentors",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setRequested(true)
    toast({
      title: "Connection Request Sent",
      description: `Your request to connect with ${name} has been sent.`,
    })
  }

  const handleViewProfile = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to view mentor profiles",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    toast({
      title: "Viewing Profile",
      description: `Viewing ${name}'s full profile and availability.`,
    })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-medium truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate">{title}</p>
            <p className="text-xs text-muted-foreground truncate">{institution}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 flex-shrink-0 text-purple-600" />
          <span className="truncate">{availability}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
        <Button variant="outline" size="sm" onClick={handleViewProfile}>
          <span className="hidden sm:inline">View Profile</span>
          <span className="sm:hidden">View</span>
        </Button>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={handleConnect}
          disabled={requested || availability === "Currently full"}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{requested ? "Requested" : "Connect"}</span>
          <span className="sm:hidden">{requested ? "Sent" : "Connect"}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

