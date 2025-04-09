"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserProfile, SavedScholarship, ScholarshipApplication, Scholarship, Notification } from "./types"
import { mockApplications } from "./mock-data"

interface UserState {
  // User profile
  profile: UserProfile
  updateProfile: (profile: Partial<UserProfile>) => void
  checkProfileCompletion: () => boolean
  updateStreak: (
    activityType: "profile_update" | "mentor_interaction" | "topic_added" | "application_submitted",
    details?: string,
  ) => void

  // Saved scholarships
  savedScholarships: SavedScholarship[]
  saveScholarship: (scholarshipId: number) => void
  unsaveScholarship: (scholarshipId: number) => void
  isSaved: (scholarshipId: number) => boolean

  // Applications
  applications: ScholarshipApplication[]
  startApplication: (scholarshipId: number) => number
  submitApplication: (applicationId: number) => void
  getApplicationStatus: (scholarshipId: number) => string | null

  // AI-generated scholarships
  aiScholarships: Scholarship[]
  setAIScholarships: (scholarships: Scholarship[]) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => void
  markNotificationAsRead: (id: number) => void
  markAllNotificationsAsRead: () => void
  unreadNotificationsCount: () => number

  // Authentication
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

// Default user profile
const defaultProfile: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  educationLevel: "",
  school: "",
  graduationYear: "",
  interests: [],
  skills: [],
  bio: "",
  profilePicture: "/placeholder.svg?height=128&width=128",
  isPremium: false,
  premiumPlan: null,
  profileCompleted: false,
  streakData: {
    lastActive: new Date().toISOString(),
    currentStreak: 0,
    longestStreak: 0,
    activityDates: [],
    activities: [],
  },
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // User profile
      profile: defaultProfile,
      updateProfile: (newProfileData) =>
        set((state) => {
          const updatedProfile = { ...state.profile, ...newProfileData }
          const isCompleted = get().checkProfileCompletion()

          // If profile picture is updated, update streak
          if (newProfileData.profilePicture && newProfileData.profilePicture !== state.profile.profilePicture) {
            get().updateStreak("profile_update", "Updated profile picture")
          }

          // If interests are updated, update streak
          if (
            newProfileData.interests &&
            JSON.stringify(newProfileData.interests) !== JSON.stringify(state.profile.interests)
          ) {
            get().updateStreak("topic_added", "Updated interests")
          }

          return {
            profile: {
              ...updatedProfile,
              profileCompleted: isCompleted,
            },
          }
        }),

      checkProfileCompletion: () => {
        const { profile } = get()

        // Check if all required fields are filled
        return (
          profile.firstName.trim() !== "" &&
          profile.lastName.trim() !== "" &&
          profile.email.trim() !== "" &&
          profile.phone.trim() !== "" &&
          profile.country.trim() !== "" &&
          profile.educationLevel.trim() !== "" &&
          profile.school.trim() !== "" &&
          profile.graduationYear.trim() !== "" &&
          profile.bio.trim() !== "" &&
          profile.interests.length > 0
        )
      },

      updateStreak: (activityType, details) => {
        set((state) => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const todayStr = today.toISOString().split("T")[0]

          const streakData = state.profile.streakData || {
            lastActive: new Date().toISOString(),
            currentStreak: 0,
            longestStreak: 0,
            activityDates: [],
            activities: [],
          }

          // Check if already active today
          const alreadyActiveToday = streakData.activityDates.includes(todayStr)

          // Calculate streak
          let { currentStreak, longestStreak } = streakData
          const lastActiveDate = new Date(streakData.lastActive)
          lastActiveDate.setHours(0, 0, 0, 0)

          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)

          if (!alreadyActiveToday) {
            // If last active was yesterday, increment streak
            if (lastActiveDate.getTime() === yesterday.getTime()) {
              currentStreak += 1
            }
            // If last active was before yesterday, reset streak
            else if (lastActiveDate < yesterday) {
              currentStreak = 1
            }
            // If last active is today, keep streak

            // Update longest streak if needed
            longestStreak = Math.max(longestStreak, currentStreak)
          }

          // Add today to activity dates if not already there
          const updatedActivityDates = alreadyActiveToday
            ? streakData.activityDates
            : [...streakData.activityDates, todayStr]

          // Add new activity
          const newActivity = {
            date: new Date().toISOString(),
            type: activityType,
            details: details || "",
          }

          // Add notification for streak milestones
          if (currentStreak > 0 && currentStreak % 5 === 0 && !alreadyActiveToday) {
            get().addNotification({
              title: "Streak Milestone!",
              message: `Congratulations! You've maintained a ${currentStreak}-day streak on Empower Her.`,
              type: "success",
              link: "/profile",
            })
          }

          return {
            profile: {
              ...state.profile,
              streakData: {
                lastActive: today.toISOString(),
                currentStreak,
                longestStreak,
                activityDates: updatedActivityDates,
                activities: [...streakData.activities, newActivity],
              },
            },
          }
        })
      },

      // Saved scholarships
      savedScholarships: [],
      saveScholarship: (scholarshipId) =>
        set((state) => {
          if (state.savedScholarships.some((s) => s.scholarshipId === scholarshipId)) {
            return state // Already saved
          }

          // Add notification when saving a scholarship
          get().addNotification({
            title: "Scholarship Saved",
            message: "You have successfully saved a scholarship to your list.",
            type: "success",
            link: "/profile",
          })

          return {
            savedScholarships: [...state.savedScholarships, { scholarshipId, savedAt: new Date().toISOString() }],
          }
        }),
      unsaveScholarship: (scholarshipId) =>
        set((state) => ({
          savedScholarships: state.savedScholarships.filter((s) => s.scholarshipId !== scholarshipId),
        })),
      isSaved: (scholarshipId) => {
        const { savedScholarships } = get()
        return savedScholarships.some((s) => s.scholarshipId === scholarshipId)
      },

      // Applications
      applications: mockApplications,
      startApplication: (scholarshipId) => {
        const { applications } = get()

        // Check if application already exists
        const existingApp = applications.find((a) => a.scholarshipId === scholarshipId)
        if (existingApp) {
          return existingApp.id
        }

        // Create new application
        const newApplicationId = Math.max(0, ...applications.map((a) => a.id), 0) + 1
        const newApplication: ScholarshipApplication = {
          id: newApplicationId,
          scholarshipId,
          status: "draft",
          appliedDate: new Date().toISOString(),
        }

        set((state) => ({
          applications: [...state.applications, newApplication],
        }))

        return newApplicationId
      },
      submitApplication: (applicationId) => {
        // Update streak for application submission
        get().updateStreak("application_submitted", "Submitted scholarship application")

        // Add notification for application submission
        get().addNotification({
          title: "Application Submitted",
          message: "Your scholarship application has been successfully submitted.",
          type: "success",
          link: "/dashboard",
        })

        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId ? { ...app, status: "submitted" as const } : app,
          ),
        }))
      },
      getApplicationStatus: (scholarshipId) => {
        const { applications } = get()
        const app = applications.find((a) => a.scholarshipId === scholarshipId)
        return app ? app.status : null
      },

      // AI-generated scholarships
      aiScholarships: [],
      setAIScholarships: (scholarships) => set({ aiScholarships: scholarships }),

      // Notifications
      notifications: [
        {
          id: 1,
          title: "Welcome to Empower Her!",
          message: "Thank you for joining our platform. Complete your profile to get personalized recommendations.",
          type: "info",
          date: new Date().toISOString(),
          read: false,
          link: "/profile",
        },
      ],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              id: Math.max(0, ...state.notifications.map((n) => n.id)) + 1,
              ...notification,
              date: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      unreadNotificationsCount: () => {
        const { notifications } = get()
        return notifications.filter((n) => !n.read).length
      },

      // Authentication
      isLoggedIn: false,
      login: () => {
        set({ isLoggedIn: true })

        // Add welcome notification on login
        const { notifications } = get()
        if (notifications.length === 0) {
          get().addNotification({
            title: "Welcome to Empower Her!",
            message: "Thank you for joining our platform. Complete your profile to get personalized recommendations.",
            type: "info",
            link: "/profile",
          })
        }
      },
      logout: () =>
        set({
          isLoggedIn: false,
          // Reset user data on logout
          profile: defaultProfile,
          savedScholarships: [],
          applications: [],
          aiScholarships: [],
          notifications: [],
        }),
    }),
    {
      name: "empower-her-storage",
    },
  ),
)
