import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'
import { deliveryOptions } from '../data/support'
import { findCoupon } from '../data/coupons'

const FREE_SHIPPING_THRESHOLD = 2999
const TAX_RATE = 0 // GST is inclusive in listed prices.

/**
 * Discount for a validated coupon against a subtotal.
 * Returns `{ discount, freeShipping }`; an inapplicable coupon yields zero
 * rather than throwing, so a code that stops qualifying when the bag shrinks
 * simply stops discounting.
 */
function couponEffect(coupon, subtotal) {
  if (!coupon || subtotal < (coupon.minSubtotal ?? 0)) {
    return { discount: 0, freeShipping: false }
  }
  if (coupon.type === 'shipping') return { discount: 0, freeShipping: true }
  if (coupon.type === 'fixed') {
    return { discount: Math.min(coupon.value, subtotal), freeShipping: false }
  }
  const raw = Math.round((subtotal * coupon.value) / 100)
  return {
    discount: Math.min(coupon.maxDiscount ?? raw, raw, subtotal),
    freeShipping: false,
  }
}

/**
 * Cart maths lives here rather than in the store so totals can be recomputed
 * server-side later without touching the UI.
 *
 * Order of operations matters and is deliberate: the coupon discounts the
 * subtotal, shipping is assessed on the *discounted* subtotal, and tax applies
 * last. Applying shipping first would let a discount push an order below the
 * free-shipping threshold while still shipping it free.
 */
export function calculateTotals(items, deliveryId = 'standard', coupon = null) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = items.reduce(
    (sum, item) =>
      sum + (item.compareAtPrice ? (item.compareAtPrice - item.price) * item.quantity : 0),
    0
  )

  const { discount, freeShipping } = couponEffect(coupon, subtotal)
  const discountedSubtotal = Math.max(0, subtotal - discount)

  const delivery = deliveryOptions.find((option) => option.id === deliveryId) || deliveryOptions[0]
  const qualifiesForFreeShipping =
    delivery.freeAbove != null && discountedSubtotal >= delivery.freeAbove && subtotal > 0

  const shipping =
    subtotal === 0 || qualifiesForFreeShipping || freeShipping ? 0 : delivery.price
  const tax = Math.round(discountedSubtotal * TAX_RATE)
  const total = discountedSubtotal + shipping + tax

  return {
    subtotal,
    savings,
    discount,
    couponCode: discount > 0 || freeShipping ? coupon?.code : null,
    shipping,
    tax,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountToFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal),
    qualifiesForFreeShipping: qualifiesForFreeShipping || freeShipping,
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

  /**
   * Validates a promotional code against the current subtotal.
   *
   * Rejections carry a message the shopper can act on — "spend ₹400 more" is
   * useful where "invalid code" is not.
   */
  async applyCoupon(code, subtotal) {
    if (!USE_MOCK) return apiClient.post(ENDPOINTS.coupon(code), { subtotal })

    await mockResponse(null, { latency: 550 })
    const coupon = findCoupon(code)

    if (!coupon) {
      const error = new Error('That code is not recognised. Check the spelling and try again.')
      error.code = 'invalid_coupon'
      throw error
    }

    if (subtotal < (coupon.minSubtotal ?? 0)) {
      const shortfall = coupon.minSubtotal - subtotal
      const error = new Error(
        `${coupon.code} applies to orders above ₹${coupon.minSubtotal.toLocaleString('en-IN')}. Add ₹${shortfall.toLocaleString('en-IN')} more to use it.`
      )
      error.code = 'coupon_min_subtotal'
      throw error
    }

    return coupon
  },

  calculateTotals,
  couponEffect,
}

export default cartService
