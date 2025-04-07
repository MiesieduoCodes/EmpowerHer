import type { Scholarship } from "./types"
import { mockScholarships } from "./mock-data"

// AI matching algorithm to find relevant scholarships based on user profile
export function matchScholarshipsToProfile(
  profile: {
    educationLevel: string
    interests: string[]
    skills?: string[]
    country?: string
    graduationYear?: string
  },
  allScholarships: Scholarship[] = mockScholarships,
): Scholarship[] {
  // Calculate match score for each scholarship
  const scoredScholarships = allScholarships.map((scholarship) => {
    let score = 0

    // Match by education level (highest priority)
    if (scholarship.eligibility?.educationLevels?.includes(profile.educationLevel)) {
      score += 30
    } else if (!scholarship.eligibility?.educationLevels) {
      // If no specific education level is required, give partial points
      score += 15
    }

    // Match by interests/category (high priority)
    if (
      profile.interests.some(
        (interest) =>
          scholarship.category.toLowerCase().includes(interest.toLowerCase()) ||
          scholarship.title.toLowerCase().includes(interest.toLowerCase()),
      )
    ) {
      score += 25
    }

    // Match by country eligibility (medium priority)
    if (
      !scholarship.eligibility?.countries ||
      !profile.country ||
      scholarship.eligibility.countries.includes(profile.country) ||
      scholarship.eligibility.countries.includes("All")
    ) {
      score += 15
    }

    // Match by skills if available (medium priority)
    if (profile.skills && scholarship.keywords) {
      const matchingSkills = profile.skills.filter((skill) =>
        scholarship.keywords?.some((keyword) => keyword.toLowerCase().includes(skill.toLowerCase())),
      )
      score += matchingSkills.length * 5
    }

    return {
      ...scholarship,
      matchScore: score,
    }
  })

  // Sort by match score (descending)
  return scoredScholarships
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .map(({ matchScore, ...scholarship }) => scholarship) // Remove matchScore from returned objects
}

// Generate personalized scholarship recommendations
export function generateRecommendations(profile: {
  educationLevel: string
  interests: string[]
  skills?: string[]
  country?: string
  graduationYear?: string
}): Scholarship[] {
  // First get matches from existing scholarships
  const matches = matchScholarshipsToProfile(profile)

  // If we have enough matches, return them
  if (matches.length >= 5) {
    return matches.slice(0, 5)
  }

  // Otherwise, generate additional AI-powered recommendations
  const additionalRecommendations = generateAIScholarships(profile, 5 - matches.length)

  return [...matches, ...additionalRecommendations]
}

// Generate AI-powered scholarship suggestions based on profile
function generateAIScholarships(
  profile: {
    educationLevel: string
    interests: string[]
    skills?: string[]
    country?: string
    graduationYear?: string
  },
  count: number,
): Scholarship[] {
  const scholarships: Scholarship[] = []

  // Map education levels to appropriate scholarship types
  const educationMap: Record<string, string> = {
    "Secondary School": "High School Excellence",
    Undergraduate: "Undergraduate Merit",
    Graduate: "Graduate Research",
    Postgraduate: "Postgraduate Fellowship",
  }

  // Map interests to scholarship providers and focus areas
  const interestProviderMap: Record<string, [string, string][]> = {
    "Computer Science": [
      ["Google Women in Tech", "Technology"],
      ["Microsoft Diversity in Computing", "Technology"],
      ["IBM Future Leaders", "Technology"],
    ],
    Mathematics: [
      ["Mathematical Association Scholarship", "STEM"],
      ["Numerical Sciences Foundation", "STEM"],
      ["Quantitative Excellence Award", "STEM"],
    ],
    Entrepreneurship: [
      ["Young Entrepreneurs Fund", "Business"],
      ["Innovation Startup Grant", "Business"],
      ["Women in Business Initiative", "Business"],
    ],
    Engineering: [
      ["Women in Engineering Society", "STEM"],
      ["Engineering Future Leaders", "STEM"],
      ["Technical Innovation Scholarship", "STEM"],
    ],
    Arts: [
      ["Creative Expression Foundation", "Arts"],
      ["Visual Arts Excellence Award", "Arts"],
      ["Performing Arts Scholarship", "Arts"],
    ],
    Healthcare: [
      ["Future Medical Professionals", "Healthcare"],
      ["Health Sciences Scholarship", "Healthcare"],
      ["Nursing Excellence Award", "Healthcare"],
    ],
  }

  // Generate unique scholarships based on profile
  for (let i = 0; i < count; i++) {
    // Select a random interest from the profile
    const interest = profile.interests[Math.floor(Math.random() * profile.interests.length)]

    // Get potential providers for this interest
    const potentialProviders = interestProviderMap[interest] || interestProviderMap["Computer Science"] // Default if interest not found

    // Select a random provider
    const [provider, category] = potentialProviders[Math.floor(Math.random() * potentialProviders.length)]

    // Create education level specific title
    const educationPrefix = educationMap[profile.educationLevel] || "Merit"

    // Generate a deadline 3-6 months in the future
    const today = new Date()
    const futureMonths = Math.floor(Math.random() * 4) + 3 // 3-6 months
    const deadline = new Date(today.setMonth(today.getMonth() + futureMonths))
    const deadlineStr = deadline.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

    // Generate random amount between $1,000 and $20,000
    const amount = `$${(Math.floor(Math.random() * 19) + 1) * 1000}`

    // Create the scholarship
    scholarships.push({
      id: 1000 + i, // Use high IDs to avoid conflicts with existing scholarships
      title: `${interest} ${educationPrefix} Scholarship`,
      provider,
      amount,
      deadline: deadlineStr,
      category,
      description: `A scholarship opportunity for ${profile.educationLevel.toLowerCase()} students with an interest in ${interest.toLowerCase()}.`,
      eligibility: {
        educationLevels: [profile.educationLevel],
        countries: ["All"],
      },
      keywords: [interest, profile.educationLevel, ...(profile.skills || [])],
      isAIGenerated: true,
    })
  }

  return scholarships
}

