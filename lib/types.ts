export interface Scholarship {
  id: number
  title: string
  provider: string
  amount: string
  deadline: string
  category: string
  description: string
  eligibility?: {
    educationLevels?: string[]
    countries?: string[]
  }
  keywords?: string[]
  matchScore?: number
  isAIGenerated?: boolean
  isPremium?: boolean
}

export interface Mentor {
  id: number
  name: string
  title: string
  institution: string
  field: string
  image: string
  availability: string
  isPremium?: boolean
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  educationLevel: string
  school: string
  graduationYear: string
  interests: string[]
  skills?: string[]
  bio: string
  profilePicture?: string
  isPremium?: boolean
  premiumPlan?: string | null
  profileCompleted?: boolean
}

export interface SavedScholarship {
  scholarshipId: number
  savedAt: string
}

export interface ScholarshipApplication {
  id: number
  scholarshipId: number
  status: "draft" | "submitted" | "pending" | "accepted" | "rejected"
  appliedDate: string
  decisionDate?: string
}
