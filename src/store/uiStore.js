import { create } from 'zustand'

/**
 * Ephemeral interface state: overlays, drawers and toasts.
 * Nothing here is persisted — a reload should always land on a clean page.
 */
let toastId = 0

export const useUIStore = create((set, get) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileNavOpen: false,
  isFilterDrawerOpen: false,
  quickViewProduct: null,
  toasts: [],

  openCart: () => set({ isCartOpen: true, isSearchOpen: false, isMobileNavOpen: false }),
  closeCart: () => set({ isCartOpen: false }),

  openSearch: () => set({ isSearchOpen: true, isCartOpen: false, isMobileNavOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),

  toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen, isCartOpen: false })),
  closeMobileNav: () => set({ isMobileNavOpen: false }),

  openFilterDrawer: () => set({ isFilterDrawerOpen: true }),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),

  openQuickView: (product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),

  /** Closes every overlay — used on route change. */
  closeAll: () =>
    set({
      isCartOpen: false,
      isSearchOpen: false,
      isMobileNavOpen: false,
      isFilterDrawerOpen: false,
      quickViewProduct: null,
    }),

  toast: ({ title, description, variant = 'default', duration = 3200 }) => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, title, description, variant }] }))
    if (duration) setTimeout(() => get().dismissToast(id), duration)
    return id
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
