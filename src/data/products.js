import { normalizeCatalog } from './normalizeProduct'
import { womenRaw } from './products.women'
import { menRaw } from './products.men'

/**
 * The catalogue.
 *
 * Authored per department, normalised through one function, and exposed as a
 * single flat array — the same shape a `GET /products` response would return.
 * Nothing outside `services/` should import this module directly.
 */
export const products = [
  ...normalizeCatalog(womenRaw, 'women'),
  ...normalizeCatalog(menRaw, 'men'),
]

export const getProductBySlug = (slug) => products.find((p) => p.slug === slug) || null
export const getProductById = (id) => products.find((p) => p.id === id) || null

/** Every distinct brand in the catalogue, alphabetical. */
export const brands = Array.from(new Set(products.map((p) => p.brand))).sort()

export const productsByDepartment = (department) =>
  products.filter((p) => p.department === department)
