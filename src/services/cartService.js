import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'
import { deliveryOptions } from '../data/support'

const FREE_SHIPPING_THRESHOLD = 2999
const TAX_RATE = 0 // GST is inclusive in listed prices.

/**
 * Cart maths lives here rather than in the store so totals can be recomputed
 * server-side later without touching the UI.
 */
export function calculateTotals(items, deliveryId = 'standard') {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = items.reduce(
    (sum, item) =>
      sum + (item.compareAtPrice ? (item.compareAtPrice - item.price) * item.quantity : 0),
    0
  )
  const delivery = deliveryOptions.find((option) => option.id === deliveryId) || deliveryOptions[0]

  const qualifiesForFreeShipping =
    delivery.freeAbove != null && subtotal >= delivery.freeAbove && subtotal > 0
  const shipping = subtotal === 0 || qualifiesForFreeShipping ? 0 : delivery.price
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + shipping + tax

  return {
    subtotal,
    savings,
    shipping,
    tax,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountToFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    qualifiesForFreeShipping,
  }
}

export const cartService = {
  /** Server-side cart sync. No-ops against the mock backend. */
  async sync(items) {
    if (USE_MOCK) return mockResponse({ items }, { latency: 150 })
    return apiClient.put(ENDPOINTS.cart, { items })
  },
  async fetch() {
    if (USE_MOCK) return mockResponse({ items: [] }, { latency: 150 })
    return apiClient.get(ENDPOINTS.cart)
  },
  calculateTotals,
}

export default cartService
