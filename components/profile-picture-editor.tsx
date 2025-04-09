"use client"

import { useState } from "react"
import Image from "next/image"
import { useUserStore } from "@/lib/user-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"

export function ProfilePictureEditor() {
  const { user, updateProfilePicture } = useUserStore()
  const [imageUrl, setImageUrl] = useState(user?.profilePicture || "")
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState("")

  const handleSave = () => {
    if (!imageUrl) {
      setError("Please enter an image URL")
      return
    }

    // Simple URL validation
    try {
      new URL(imageUrl)
      updateProfilePicture(imageUrl)
      setIsOpen(false)
      setError("")
    } catch (e) {
      setError("Please enter a valid URL")
    }
  }

  return (
    <div className="relative">
      <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted">
        {user?.profilePicture ? (
          <Image src={user.profilePicture || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
        ) : (
          <Image src="/placeholder-user.jpg" alt="Default Profile" fill className="object-cover" />
        )}
      </div>
      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-0 right-0 rounded-full"
        onClick={() => setIsOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
            <DialogDescription>Enter the URL of your profile picture.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="picture">Picture URL</Label>
              <Input
                id="picture"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/your-image.jpg"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            {imageUrl && (
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={() => setError("Invalid image URL")}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
