/**
 * Static brand + site configuration.
 * Runtime-configurable values are read from Vite env vars with safe defaults so
 * the app boots even when no .env file is present.
 */
const env = import.meta.env

export const SITE = {
  name: 'Amira Fashions',
  shortName: 'AMIRA',
  tagline: 'Elevate Your Everyday',
  description:
    'Amira Fashions is a modern Indian fashion house for the woman who dresses with intention — dresses, co-ords, ethnic and party wear, released in small, considered edits.',
  url: env.VITE_SITE_URL || 'https://amirafashions.com',
  locale: 'en_IN',
  currency: 'INR',
  currencySymbol: '₹',
}

export const CONTACT = {
  email: env.VITE_CONTACT_EMAIL || 'hello@amirafashions.com',
  phone: '+91 90000 00000',
  whatsapp: env.VITE_WHATSAPP_NUMBER || '919000000000',
  address: {
    line1: 'Studio 04, Linking Road',
    line2: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    country: 'India',
  },
  hours: 'Monday – Saturday, 11:00 – 20:00 IST',
}

export const INSTAGRAM_HANDLE = env.VITE_INSTAGRAM_HANDLE || 'amira__fashions'

export const SOCIALS = [
  { id: 'instagram', label: 'Instagram', href: `https://instagram.com/${INSTAGRAM_HANDLE}` },
  { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/amirafashions' },
  { id: 'pinterest', label: 'Pinterest', href: 'https://pinterest.com/amirafashions' },
  { id: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${CONTACT.whatsapp}` },
]

export const ANNOUNCEMENTS = [
  'Complimentary shipping on orders above ₹2,999',
  'New Edit — Aurelia drops every Friday, 8 PM IST',
  'Easy 7-day returns across India',
]

/** Motion timing shared by CSS transitions and Framer Motion variants. */
export const MOTION = {
  fast: 0.25,
  base: 0.4,
  slow: 0.8,
  ease: [0.16, 1, 0.3, 1],
}

export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }
