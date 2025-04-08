"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserProfile, SavedScholarship, ScholarshipApplication, Scholarship } from "./types"
import { mockApplications } from "./mock-data"

interface UserState {
  // User profile
  profile: UserProfile
  updateProfile: (profile: Partial<UserProfile>) => void
  checkProfileCompletion: () => boolean

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

      // Saved scholarships
      savedScholarships: [],
      saveScholarship: (scholarshipId) =>
        set((state) => {
          if (state.savedScholarships.some((s) => s.scholarshipId === scholarshipId)) {
            return state // Already saved
          }
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
      submitApplication: (applicationId) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId ? { ...app, status: "submitted" as const } : app,
          ),
        })),
      getApplicationStatus: (scholarshipId) => {
        const { applications } = get()
        const app = applications.find((a) => a.scholarshipId === scholarshipId)
        return app ? app.status : null
      },

      // AI-generated scholarships
      aiScholarships: [],
      setAIScholarships: (scholarships) => set({ aiScholarships: scholarships }),

      // Authentication
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () =>
        set({
          isLoggedIn: false,
          // Reset user data on logout
          profile: defaultProfile,
          savedScholarships: [],
          applications: [],
          aiScholarships: [],
        }),
    }),
    {
      name: "empower-her-storage",
    },
  ),
)
