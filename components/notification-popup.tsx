"use client"

import { useState, useRef } from "react"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUserStore } from "@/lib/user-store"
import { useRouter } from "next/navigation"
import { useOnClickOutside } from "@/hooks/use-click-outside"

export function NotificationPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, unreadNotificationsCount } = useUserStore()
  const router = useRouter()
  const popupRef = useRef<HTMLDivElement>(null)

  // Close popup when clicking outside
  useOnClickOutside(popupRef, () => setIsOpen(false))

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

    return date.toLocaleDateString()
  }

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id)

    if (notification.link) {
      router.push(notification.link)
    }

    setIsOpen(false)
  }

  const getNotificationTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
      case "warning":
        return "bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500"
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
    }
  }

  return (
    <div className="relative" ref={popupRef}>
      <Button variant="outline" size="icon" className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="h-4 w-4" />
        {unreadNotificationsCount() > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-medium text-white">
            {unreadNotificationsCount()}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50 rounded-md border bg-background shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => markAllNotificationsAsRead()}
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all as read
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="max-h-[400px]">
            {notifications.length > 0 ? (
              <div className="py-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50
                      ${notification.read ? "opacity-70" : "font-medium"}
                    `}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={`p-3 rounded-md ${getNotificationTypeStyles(notification.type)}`}>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(notification.date)}</span>
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No notifications</p>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
