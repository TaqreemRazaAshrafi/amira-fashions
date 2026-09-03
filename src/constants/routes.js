/** Single source of truth for every in-app path. */
export const ROUTES = {
  home: '/',
  shop: '/shop',
  shopCategory: (slug) => `/shop/${slug}`,
  collections: '/collections',
  collection: (slug) => `/collections/${slug}`,
  product: (slug) => `/product/${slug}`,
  about: '/about',
  contact: '/contact',
  wishlist: '/wishlist',
  cart: '/cart',
  checkout: '/checkout',
  search: '/search',
  account: '/account',
  login: '/login',
}

export const PRIMARY_NAV = [
  { label: 'Shop', to: ROUTES.shop },
  { label: 'New Arrivals', to: `${ROUTES.shop}?collection=new-arrivals` },
  { label: 'Collections', to: ROUTES.collections },
  { label: 'About', to: ROUTES.about },
]

export const FOOTER_NAV = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', to: `${ROUTES.shop}?collection=new-arrivals` },
      { label: 'Best Sellers', to: `${ROUTES.shop}?collection=best-sellers` },
      { label: 'Collections', to: ROUTES.collections },
      { label: 'Sale', to: `${ROUTES.shop}?sale=true` },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact', to: ROUTES.contact },
      { label: 'Shipping', to: `${ROUTES.contact}#shipping` },
      { label: 'Returns', to: `${ROUTES.contact}#returns` },
      { label: 'FAQ', to: `${ROUTES.contact}#faq` },
    ],
  },
]
