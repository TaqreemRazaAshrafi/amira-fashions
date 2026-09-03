import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS } from '../utils/storage'
import authService from '../services/authService'

export const useAuthStore = create()(
  persist(
    (set) => ({
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
