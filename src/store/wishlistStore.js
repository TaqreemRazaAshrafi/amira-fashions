import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS } from '../utils/storage'

/**
 * Wishlist holds a lightweight snapshot per product so the wishlist page can
 * render without a second fetch, while `productId` stays the source of truth.
 */
export const useWishlistStore = create()(
  persist(
    (set, get) => ({
      items: [],

      add: (product) =>
        set((state) =>
          state.items.some((i) => i.productId === product.id)
            ? state
            : {
                items: [
                  {
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    image: product.images[0],
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    addedAt: new Date().toISOString(),
                  },
                  ...state.items,
                ],
              }
        ),

      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      /** @returns {boolean} the state *after* toggling — used to drive the heart animation. */
      toggle: (product) => {
        const wasSaved = get().has(product.id)
        if (wasSaved) get().remove(product.id)
        else get().add(product)
        return !wasSaved
      },

      has: (productId) => get().items.some((i) => i.productId === productId),
      clear: () => set({ items: [] }),
      count: () => get().items.length,
    }),
    {
      name: STORAGE_KEYS.wishlist,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)

export const selectWishlistCount = (state) => state.items.length
