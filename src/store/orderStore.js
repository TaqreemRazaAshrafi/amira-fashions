import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS } from '../utils/storage'

/**
 * Placed orders.
 *
 * With a real backend `GET /orders` is authoritative and this store is only a
 * cache that keeps the confirmation and history pages instant. Behind the mock
 * adapter there is nowhere else for a placed order to live, so this is what
 * makes "place an order, then find it in your history" actually work.
 *
 * Only the fields the history and detail pages render are kept — never a whole
 * product object per line.
 */
export const useOrderStore = create()(
  persist(
    (set, get) => ({
      orders: [],

      /** Records a confirmed order. Newest first; duplicates by id are ignored. */
      add: (order) =>
        set((state) =>
          state.orders.some((o) => o.id === order.id)
            ? state
            : { orders: [order, ...state.orders] }
        ),

      getById: (id) => get().orders.find((order) => order.id === id) ?? null,

      /** Local-only cancellation. A real backend owns this transition. */
      cancel: (id) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status: 'cancelled' } : order
          ),
        })),

      clear: () => set({ orders: [] }),
    }),
    {
      name: STORAGE_KEYS.orders,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)

export const selectOrders = (state) => state.orders
export const selectOrderCount = (state) => state.orders.length
