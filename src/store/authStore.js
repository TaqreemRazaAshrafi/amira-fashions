import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS } from '../utils/storage'
import authService from '../services/authService'

/**
 * Authentication state.
 *
 * The token is the single source of truth for "is signed in"; `status` is only
 * for driving spinners. Only `user` and `token` are persisted — a half-finished
 * `loading` status must never survive a reload.
 */
export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: 'idle', // idle | loading | authenticated | error
      error: null,

      login: async (credentials) => {
        set({ status: 'loading', error: null })
        try {
          const { user, token } = await authService.login(credentials)
          set({ user, token, status: 'authenticated' })
          return user
        } catch (error) {
          set({ status: 'error', error: error.message })
          throw error
        }
      },

      register: async (payload) => {
        set({ status: 'loading', error: null })
        try {
          const { user, token } = await authService.register(payload)
          set({ user, token, status: 'authenticated' })
          return user
        } catch (error) {
          set({ status: 'error', error: error.message })
          throw error
        }
      },

      /** Optimism is deliberate here: the server is the authority, but the form
       *  already validated, and a failed save rolls the previous user back. */
      updateProfile: async (patch) => {
        const previous = get().user
        set({ user: { ...previous, ...patch } })
        try {
          const saved = await authService.updateProfile(patch)
          set({ user: { ...previous, ...patch, ...saved } })
          return get().user
        } catch (error) {
          set({ user: previous, error: error.message })
          throw error
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } finally {
          set({ user: null, token: null, status: 'idle', error: null })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ user, token }) => ({ user, token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) state.status = 'authenticated'
      },
    }
  )
)

export const selectIsAuthenticated = (state) => Boolean(state.token)
export const selectUser = (state) => state.user
