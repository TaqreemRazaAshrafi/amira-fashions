/** Size guide, FAQ and policy copy — surfaced on PDP, contact and checkout. */

/**
 * Body-measurement tables, per department.
 *
 * Menswear and womenswear are not measured the same way, so each department
 * declares its own columns rather than forcing one table to cover both. The PDP
 * picks the table by the product's department, and `columns` drives the table
 * head, so adding a measurement is a data change.
 */
export const sizeGuides = {
  women: {
    unit: 'inches',
    note: 'Measurements are of the body, not the garment. If you are between sizes, we recommend sizing up for structured pieces and down for knits.',
    columns: [
      { key: 'size', label: 'Size' },
      { key: 'bust', label: 'Bust' },
      { key: 'waist', label: 'Waist' },
      { key: 'hip', label: 'Hip' },
    ],
    rows: [
      { size: 'XS', bust: '32', waist: '25', hip: '35' },
      { size: 'S', bust: '34', waist: '27', hip: '37' },
      { size: 'M', bust: '36', waist: '29', hip: '39' },
      { size: 'L', bust: '38', waist: '31', hip: '41' },
      { size: 'XL', bust: '40', waist: '33', hip: '43' },
      { size: 'XXL', bust: '42', waist: '35', hip: '45' },
    ],
  },
  men: {
    unit: 'inches',
    note: 'Measurements are of the body, not the garment. Shirts are cut trim through the body — size up if you prefer a looser drape.',
    columns: [
      { key: 'size', label: 'Size' },
      { key: 'chest', label: 'Chest' },
      { key: 'waist', label: 'Waist' },
      { key: 'sleeve', label: 'Sleeve' },
    ],
    rows: [
      { size: 'S', chest: '36–38', waist: '30–32', sleeve: '33' },
      { size: 'M', chest: '38–40', waist: '32–34', sleeve: '34' },
      { size: 'L', chest: '40–42', waist: '34–36', sleeve: '35' },
      { size: 'XL', chest: '42–44', waist: '36–38', sleeve: '36' },
      { size: 'XXL', chest: '44–46', waist: '38–40', sleeve: '36.5' },
    ],
  },
}

/** Default table, kept for anything that has no department to hand. */
export const sizeGuide = sizeGuides.women

export const getSizeGuide = (department) => sizeGuides[department] ?? sizeGuides.women

export const faqs = [
  {
    id: 'faq-shipping',
    question: 'How long does delivery take?',
    answer:
      'Orders are dispatched within 2 business days. Standard delivery reaches metros in 3–5 days and the rest of India in 5–8. Express delivery is 1–2 days in serviceable pincodes and can be selected at checkout.',
  },
  {
    id: 'faq-free-shipping',
    question: 'Is shipping free?',
    answer: 'Standard shipping is complimentary on all orders above ₹2,999. Below that it is ₹149.',
  },
  {
    id: 'faq-returns',
    question: 'What is your return policy?',
    answer:
      'Unworn pieces with tags intact can be returned within 7 days of delivery. Sale items, made-to-order pieces and the atelier line are final sale. Return pickup is free in serviceable pincodes.',
  },
  {
    id: 'faq-sizing',
    question: 'How do I choose a size?',
    answer:
      'Every product page carries a size guide with body measurements. If you are still unsure, message us on Instagram or WhatsApp with your measurements and we will recommend a size.',
  },
  {
    id: 'faq-custom',
    question: 'Do you offer custom sizing?',
    answer:
      'For the atelier and ethnic lines, yes. Write to us within 24 hours of ordering and we will confirm feasibility and lead time, usually 2–3 weeks.',
  },
  {
    id: 'faq-international',
    question: 'Do you ship internationally?',
    answer:
      'We currently ship across India. International orders are handled case by case over WhatsApp — reach out and we will quote shipping and duties before you pay.',
  },
]

export const deliveryOptions = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    description: '3–8 business days',
    price: 149,
    freeAbove: 2999,
  },
  {
    id: 'express',
    label: 'Express Delivery',
    description: '1–2 business days, serviceable pincodes',
    price: 349,
    freeAbove: null,
  },
]

/**
 * Payment methods offered at checkout.
 *
 * `gateway: true` means the method is completed on the provider's hosted page —
 * the browser never sees card or UPI credentials. Cash on delivery is the only
 * non-gateway route, and it carries its own order-value ceiling.
 */
export const paymentMethods = [
  {
    id: 'upi',
    label: 'UPI',
    title: 'UPI',
    description: 'Google Pay, PhonePe, Paytm or any UPI app. Approve on your phone.',
    gateway: true,
  },
  {
    id: 'card',
    label: 'Card',
    title: 'Credit or debit card',
    description: 'Visa, Mastercard, RuPay and Amex. Entered on our gateway’s secure page.',
    gateway: true,
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    title: 'Net banking',
    description: 'All major Indian banks, through your own bank’s login.',
    gateway: true,
  },
  {
    id: 'wallet',
    label: 'Wallet',
    title: 'Wallet',
    description: 'Paytm, Amazon Pay, Mobikwik and other supported wallets.',
    gateway: true,
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    title: 'Cash on delivery',
    description: 'Pay the courier when it arrives. Please keep exact change ready.',
    gateway: false,
    maxOrderValue: 15000,
  },
]

/** The ceiling above which cash on delivery is withdrawn. */
export const COD_LIMIT =
  paymentMethods.find((method) => method.id === 'cod')?.maxOrderValue ?? 15000
