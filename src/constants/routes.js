import { departments } from '../data/departments'

/** Single source of truth for every in-app path. */
export const ROUTES = {
  home: '/',

  // Catalogue
  shop: '/shop',
  shopCategory: (slug) => `/shop/${slug}`,
  department: (dept) => `/${dept}`,
  departmentCategory: (dept, slug) => `/${dept}/${slug}`,
  men: '/men',
  women: '/women',
  collections: '/collections',
  collection: (slug) => `/collections/${slug}`,
  product: (slug) => `/product/${slug}`,

  // Editorial listings — clean URLs for the three rails in the header.
  newArrivals: '/new-arrivals',
  bestSellers: '/best-sellers',
  sale: '/sale',

  // Content
  about: '/about',
  contact: '/contact',
  search: '/search',

  // Commerce
  wishlist: '/wishlist',
  cart: '/cart',
  checkout: '/checkout',
  orders: '/orders',
  order: (id) => `/orders/${id}`,

  // Auth
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  // Account
  account: '/account',
  accountProfile: '/account/profile',
  accountOrders: '/account/orders',
  accountWishlist: '/account/wishlist',
  accountAddresses: '/account/addresses',
  accountPayments: '/account/payment-methods',
  accountNotifications: '/account/notifications',
  accountRecentlyViewed: '/account/recently-viewed',
  accountSettings: '/account/settings',
}

/**
 * Primary navigation.
 *
 * A `department` entry opens the mega menu, whose columns are derived from the
 * category tree — so a category added in `data/categories.js` appears in the
 * menu without touching this file.
 */
export const PRIMARY_NAV = [
  ...departments.map((department) => ({
    label: department.name,
    to: ROUTES.department(department.slug),
    department: department.slug,
  })),
  { label: 'New Arrivals', to: ROUTES.newArrivals },
  { label: 'Best Sellers', to: ROUTES.bestSellers },
  { label: 'Sale', to: ROUTES.sale, accent: true },
]

/** Editorial links pinned to the end of every mega menu. */
export const MEGA_MENU_EDITORIAL = [
  { label: 'Trending', to: (dept) => `${ROUTES.department(dept)}?sort=best-selling` },
  { label: 'New Arrivals', to: (dept) => `${ROUTES.department(dept)}?collection=new-arrivals` },
  { label: 'Best Sellers', to: (dept) => `${ROUTES.department(dept)}?collection=best-sellers` },
  { label: 'Sale', to: (dept) => `${ROUTES.department(dept)}?sale=true` },
]

export const FOOTER_NAV = [
  {
    title: 'Shop',
    links: [
      { label: 'Men', to: ROUTES.men },
      { label: 'Women', to: ROUTES.women },
      { label: 'New Arrivals', to: ROUTES.newArrivals },
      { label: 'Best Sellers', to: ROUTES.bestSellers },
      { label: 'Sale', to: ROUTES.sale },
      { label: 'Collections', to: ROUTES.collections },
    ],
  },
  {
    title: 'Customer Support',
    links: [
      { label: 'Contact Us', to: ROUTES.contact },
      { label: 'Shipping', to: `${ROUTES.contact}#shipping` },
      { label: 'Returns', to: `${ROUTES.contact}#returns` },
      { label: 'FAQs', to: `${ROUTES.contact}#faq` },
      { label: 'Track Order', to: ROUTES.orders },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: ROUTES.about },
      { label: 'Privacy Policy', to: `${ROUTES.about}#privacy` },
      { label: 'Terms & Conditions', to: `${ROUTES.about}#terms` },
    ],
  },
]

/** Sections of the account dashboard, in sidebar order. */
export const ACCOUNT_NAV = [
  { label: 'Overview', to: ROUTES.account, end: true },
  { label: 'Profile', to: ROUTES.accountProfile },
  { label: 'My Orders', to: ROUTES.accountOrders },
  { label: 'Wishlist', to: ROUTES.wishlist },
  { label: 'Addresses', to: ROUTES.accountAddresses },
  { label: 'Payment Methods', to: ROUTES.accountPayments },
  { label: 'Notifications', to: ROUTES.accountNotifications },
  { label: 'Recently Viewed', to: ROUTES.accountRecentlyViewed },
  { label: 'Settings', to: ROUTES.accountSettings },
]
