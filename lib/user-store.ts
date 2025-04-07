import { create } from "zustand"
import { persist } from "zustand/middleware"

export type User = {
  id: string
  name: string
  email: string
  profilePicture?: string
  interests: string[]
  isPremium: boolean
  profileCompleted: boolean
}

type UserStore = {
  user: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  updateProfilePicture: (url: string) => void
  updateInterests: (interests: string[]) => void
  upgradeToPremiun: () => void
  completeProfile: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      updateProfilePicture: (url) =>
        set((state) => ({
          user: state.user ? { ...state.user, profilePicture: url } : null,
        })),
      updateInterests: (interests) =>
        set((state) => ({
          user: state.user ? { ...state.user, interests } : null,
        })),
      upgradeToPremiun: () =>
        set((state) => ({
          user: state.user ? { ...state.user, isPremium: true } : null,
        })),
      completeProfile: () =>
        set((state) => ({
          user: state.user ? { ...state.user, profileCompleted: true } : null,
        })),
    }),
    {
      name: "user-store",
    },
  ),
)

