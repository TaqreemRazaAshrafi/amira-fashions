import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS } from '../utils/storage'
import { calculateTotals } from '../services/cartService'

/** A cart line is unique per product + size + colour. */
export const lineId = (productId, size, color) => `${productId}::${size ?? '-'}::${color ?? '-'}`

/** Only the fields the cart needs are copied — never the whole product object. */
function toLine(product, { size, color, quantity }) {
  return {
    id: lineId(product.id, size, color),
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0],
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    size,
    color,
    quantity,
    maxQuantity: Math.min(product.stock, 10),
  }
}

export const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      deliveryId: 'standard',
      /** Set briefly after an add so the header icon can animate. */
      lastAddedId: null,

      addItem: (product, { size, color, quantity = 1 } = {}) => {
        const id = lineId(product.id, size, color)
        set((state) => {
          const existing = state.items.find((item) => item.id === id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxQuantity) }
                  : item
              ),
              lastAddedId: id,
            }
          }
          return {
            items: [...state.items, toLine(product, { size, color, quantity })],
            lastAddedId: id,
          }
        })
        return id
      },

      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id ? { ...i, quantity: Math.min(quantity, i.maxQuantity) } : i
                ),
        })),

      increment: (id) => {
        const item = get().items.find((i) => i.id === id)
        if (item) get().updateQuantity(id, item.quantity + 1)
      },
      decrement: (id) => {
        const item = get().items.find((i) => i.id === id)
        if (item) get().updateQuantity(id, item.quantity - 1)
      },

      setDelivery: (deliveryId) => set({ deliveryId }),
      clear: () => set({ items: [], lastAddedId: null }),
      clearLastAdded: () => set({ lastAddedId: null }),

      /** Derived values — computed on read so they never drift from `items`. */
      totals: () => calculateTotals(get().items, get().deliveryId),
      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      hasItem: (productId) => get().items.some((item) => item.productId === productId),
    }),
    {
      name: STORAGE_KEYS.cart,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Transient UI state must not survive a reload.
      partialize: ({ items, deliveryId }) => ({ items, deliveryId }),
    }
  )
)

/** Stable selectors — importing these avoids re-render churn in consumers. */
export const selectCartCount = (state) => state.items.reduce((n, i) => n + i.quantity, 0)
export const selectCartItems = (state) => state.items
