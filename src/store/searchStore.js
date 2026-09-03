import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS } from '../utils/storage'

const MAX_RECENT = 6

export const POPULAR_SEARCHES = [
  'satin slip dress',
  'chanderi anarkali',
  'linen co-ord',
  'sequin',
  'ivory',
  'party wear',
]

export const useSearchStore = create()(
  persist(
    (set) => ({
      recent: [],
      addRecent: (term) => {
        const value = term.trim()
        if (!value) return
        set((state) => ({
          recent: [value, ...state.recent.filter((t) => t !== value)].slice(0, MAX_RECENT),
        }))
      },
      removeRecent: (term) => set((s) => ({ recent: s.recent.filter((t) => t !== term) })),
      clearRecent: () => set({ recent: [] }),
    }),
    { name: STORAGE_KEYS.recentSearches, storage: createJSONStorage(() => localStorage) }
  )
)
