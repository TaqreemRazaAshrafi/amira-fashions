import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS } from '../utils/storage'

const MAX_RECENT = 6

/**
 * Terms shown before anyone types.
 *
 * Curated rather than computed: with no analytics backend there is nothing to
 * rank by, and inventing a ranking would be worse than an honest editorial pick.
 * Both departments are represented so the suggestions never read as one-sided.
 */
export const POPULAR_SEARCHES = [
  'satin slip dress',
  'oxford shirt',
  'selvedge denim',
  'linen co-ord',
  'kurta',
  'chikankari',
  'leather jacket',
  'sequin',
]

/** Shown under a Trending heading — the seasonal half of the same list. */
export const TRENDING_SEARCHES = [
  'ethnic wear',
  'party wear',
  'wide leg trousers',
  'overshirt',
  'sarees',
  'court sneaker',
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
