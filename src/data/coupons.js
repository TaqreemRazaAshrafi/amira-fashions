/**
 * Promotional codes.
 *
 * Kept as data so marketing can change an offer without a component edit. A
 * real backend must validate codes server-side as well — this list is public the
 * moment it ships in the bundle, so it is a convenience for the shopper, never a
 * security control. `cartService.applyCoupon` is the seam where that server
 * check replaces this lookup.
 *
 * `type`:
 *   percent  — `value`% off the subtotal, optionally capped by `maxDiscount`
 *   fixed    — a flat rupee amount off the subtotal
 *   shipping — waives the delivery fee
 */
export const coupons = [
  {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    maxDiscount: 1500,
    minSubtotal: 2000,
    description: '10% off your first order, up to ₹1,500.',
  },
  {
    code: 'AMIRA500',
    type: 'fixed',
    value: 500,
    minSubtotal: 3500,
    description: '₹500 off orders above ₹3,500.',
  },
  {
    code: 'FREESHIP',
    type: 'shipping',
    value: 0,
    minSubtotal: 0,
    description: 'Complimentary delivery on any order.',
  },
  {
    code: 'FESTIVE20',
    type: 'percent',
    value: 20,
    maxDiscount: 3000,
    minSubtotal: 6000,
    description: '20% off orders above ₹6,000, up to ₹3,000.',
  },
]

export const findCoupon = (code) =>
  coupons.find((coupon) => coupon.code === String(code ?? '').trim().toUpperCase()) ?? null
