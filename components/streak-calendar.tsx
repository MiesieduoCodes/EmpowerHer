"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Calendar, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useUserStore } from "@/lib/user-store"

export function StreakCalendar() {
  const { profile } = useUserStore()
  const { theme } = useTheme()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarData, setCalendarData] = useState<{ date: Date; count: number; activities: any[] }[]>([])

  const streakData = profile.streakData || {
    lastActive: new Date().toISOString(),
    currentStreak: 0,
    longestStreak: 0,
    activityDates: [],
    activities: [],
  }

  useEffect(() => {
    generateCalendarData()
  }, [currentMonth, profile.streakData])

  const generateCalendarData = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // Get the first day of the month
    const firstDay = new Date(year, month, 1)

    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate the number of days to show from the previous month
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    // Calculate the start date (may be from the previous month)
    const startDate = new Date(year, month, 1 - daysFromPrevMonth)

    // Calculate the number of days to show (42 = 6 weeks)
    const totalDays = 42

    // Generate the calendar data
    const data = []

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      // Format date as YYYY-MM-DD for comparison
      const dateStr = date.toISOString().split("T")[0]

      // Check if there are activities on this date
      const activities = streakData.activities.filter((a) => a.date.split("T")[0] === dateStr)

      data.push({
        date,
        count: activities.length,
        activities,
      })
    }

    setCalendarData(data)
  }

  const getActivityColor = (count: number) => {
    if (count === 0) return "bg-muted hover:bg-muted/80"
    if (count === 1) return "bg-green-200 dark:bg-green-900/70 hover:bg-green-300 dark:hover:bg-green-900/90"
    if (count === 2) return "bg-green-300 dark:bg-green-800/80 hover:bg-green-400 dark:hover:bg-green-800"
    if (count === 3) return "bg-green-400 dark:bg-green-700/90 hover:bg-green-500 dark:hover:bg-green-700"
    return "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500"
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatActivityType = (type: string) => {
    switch (type) {
      case "profile_update":
        return "Profile Update"
      case "mentor_interaction":
        return "Mentor Interaction"
      case "topic_added":
        return "Topic Added"
      case "application_submitted":
        return "Application Submitted"
      default:
        return type
    }
  }

  const previousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Activity Streak
            </CardTitle>
            <CardDescription>Track your engagement on Empower Her</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
              Current: {streakData.currentStreak} days
            </Badge>
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
              Longest: {streakData.longestStreak} days
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-md font-medium">
            {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`
                      aspect-square rounded-sm ${getActivityColor(day.count)}
                      ${isCurrentMonth(day.date) ? "opacity-100" : "opacity-40"}
                      cursor-pointer transition-all hover:scale-110
                    `}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-medium">{formatDate(day.date)}</p>
                    {day.count > 0 ? (
                      <>
                        <p>
                          {day.count} {day.count === 1 ? "activity" : "activities"}
                        </p>
                        <ul className="text-xs space-y-1">
                          {day.activities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span>•</span>
                              <span>
                                {formatActivityType(activity.type)}: {activity.details}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p>No activity</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="h-3 w-3 rounded-sm bg-muted"></div>
              <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900/70"></div>
              <div className="h-3 w-3 rounded-sm bg-green-300 dark:bg-green-800/80"></div>
              <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700/90"></div>
              <div className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-600"></div>
            </div>
            <span>More</span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <div className="max-w-xs space-y-2">
                  <p className="font-medium">How to build your streak</p>
                  <ul className="text-xs space-y-1">
                    <li>• Update your profile information</li>
                    <li>• Add new topics/interests</li>
                    <li>• Interact with mentors</li>
                    <li>• Submit scholarship applications</li>
                  </ul>
                  <p className="text-xs">Perform at least one activity each day to maintain your streak!</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
