import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS } from '../utils/storage'
import userService from '../services/userService'

/**
 * Account records that belong to a person rather than to a session: the address
 * book, saved payment methods and notification preferences.
 *
 * Kept separate from `authStore` so signing out clears credentials without
 * having to reason about which parts of the profile survive. `clear()` is called
 * explicitly on sign-out.
 *
 * Payment methods hold display metadata only — brand, last four digits, expiry.
 * Card numbers and CVVs are never accepted, stored or transmitted by this app;
 * the gateway's own hosted checkout takes them directly.
 */
const newId = (prefix) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export const useUserStore = create()(
  persist(
    (set, get) => ({
      addresses: [],
      paymentMethods: [],
      notifications: {
        orderUpdates: true,
        newArrivals: true,
        salesAndOffers: true,
        backInStock: false,
      },

      // ------------------------------ addresses ------------------------------
      addAddress: async (address) => {
        const saved = await userService.createAddress(address)
        const record = { ...address, ...saved, id: saved.id ?? newId('addr') }
        set((state) => ({
          addresses: [
            // The first address saved becomes the default automatically.
            { ...record, isDefault: record.isDefault || state.addresses.length === 0 },
            ...state.addresses.map((a) =>
              record.isDefault ? { ...a, isDefault: false } : a
            ),
          ],
        }))
        return record
      },

      updateAddress: async (id, patch) => {
        await userService.updateAddress(id, patch)
        set((state) => ({
          addresses: state.addresses.map((address) =>
            address.id === id
              ? { ...address, ...patch }
              : patch.isDefault
                ? { ...address, isDefault: false }
                : address
          ),
        }))
      },

      removeAddress: async (id) => {
        await userService.deleteAddress(id)
        set((state) => {
          const remaining = state.addresses.filter((a) => a.id !== id)
          // Never leave the book without a default.
          if (remaining.length && !remaining.some((a) => a.isDefault)) {
            remaining[0] = { ...remaining[0], isDefault: true }
          }
          return { addresses: remaining }
        })
      },

      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),

      defaultAddress: () => get().addresses.find((a) => a.isDefault) ?? get().addresses[0] ?? null,

      // -------------------------- payment methods ---------------------------
      /** @param {{type:string,label:string,brand?:string,last4?:string,expiry?:string}} method */
      addPaymentMethod: (method) =>
        set((state) => ({
          paymentMethods: [
            { ...method, id: newId('pm'), isDefault: state.paymentMethods.length === 0 },
            ...state.paymentMethods,
          ],
        })),

      removePaymentMethod: (id) =>
        set((state) => ({ paymentMethods: state.paymentMethods.filter((m) => m.id !== id) })),

      setDefaultPaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map((m) => ({ ...m, isDefault: m.id === id })),
        })),

      // ---------------------------- preferences -----------------------------
      toggleNotification: (key) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: !state.notifications[key] },
        })),

      /** Called on sign-out — account records must not outlive the session. */
      clear: () =>
        set({
          addresses: [],
          paymentMethods: [],
          notifications: {
            orderUpdates: true,
            newArrivals: true,
            salesAndOffers: true,
            backInStock: false,
          },
        }),
    }),
    {
      name: STORAGE_KEYS.user,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)

export const selectAddresses = (state) => state.addresses
export const selectPaymentMethods = (state) => state.paymentMethods
