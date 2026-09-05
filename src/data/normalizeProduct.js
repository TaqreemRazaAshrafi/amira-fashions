import { photo } from '../utils/images'
import { slugify } from '../utils/slug'

/**
 * The product contract.
 *
 * Products are authored in a compact shape per department and expanded here, so
 * shared copy (care, shipping, returns) lives in exactly one place and every
 * consumer — cards, filters, the PDP, structured data — codes against one
 * object. Swapping these files for a `GET /products` response requires no UI
 * change provided the server returns this shape.
 */
export const SHARED = {
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  menSizes: ['S', 'M', 'L', 'XL', 'XXL'],
  care: [
    'Dry clean only. Do not bleach.',
    'Cool iron on reverse; avoid direct heat on embellishment.',
    'Store folded with tissue, away from direct sunlight.',
  ],
  shipping:
    'Dispatched within 2 business days. Free standard shipping on orders above ₹2,999 across India. Express delivery available at checkout.',
  returns:
    'Easy 7-day returns on unworn pieces with tags intact. Sale and made-to-order items are final sale.',
}

/** Percentage off, rounded — null when the piece is not discounted. */
export function discountPercentOf(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

/**
 * Deterministic pseudo-random in [0,1) from a string seed.
 *
 * Used only for derived display values (units sold, review counts) so a given
 * product shows the same numbers on every render and every reload — a plain
 * Math.random() here would make the catalogue flicker between paints.
 */
function seededUnit(seed) {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 100000) / 100000
}

/** Expands one authored entry into the full product contract. */
function normalize(raw, index, department) {
  const slug = slugify(raw.name)
  const stock = raw.stock ?? 0
  const compareAtPrice = raw.compareAtPrice ?? null
  const onSale = Boolean(compareAtPrice && compareAtPrice > raw.price)
  const collectionSlugs = raw.collections ?? []
  const rating = raw.rating ?? 4.5
  const reviewCount = raw.reviewCount ?? 0
  const defaultSizes = department === 'men' ? SHARED.menSizes : SHARED.sizes

  return {
    id: `amira-${department.slice(0, 1)}${String(index + 1).padStart(3, '0')}`,
    sku: `AF-${department.slice(0, 1).toUpperCase()}${raw.category.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
    slug,
    name: raw.name,
    brand: raw.brand ?? 'Amira',
    department,
    description: raw.description,
    price: raw.price,
    compareAtPrice,
    onSale,
    discountPercent: discountPercentOf(raw.price, compareAtPrice),
    images: raw.images.map(photo),
    video: raw.video ?? null,
    category: raw.category,
    /** Kept as an array — a product can sit in more than one edit. */
    collections: onSale ? Array.from(new Set([...collectionSlugs, 'sale'])) : collectionSlugs,
    sizes: raw.sizes ?? defaultSizes,
    colors: raw.colors ?? ['ivory'],
    stock,
    inStock: stock > 0,
    lowStock: stock > 0 && stock <= 5,
    featured: Boolean(raw.featured),
    bestseller: Boolean(raw.bestseller),
    newArrival: Boolean(raw.newArrival),
    rating,
    reviewCount,
    /** Drives the "Best selling" sort. Derived, but stable per product. */
    unitsSold: raw.unitsSold ?? Math.round(reviewCount * 7 + seededUnit(slug) * 400),
    releasedAt: raw.releasedAt,
    material: raw.material,
    fit: raw.fit ?? 'True to size',
    sizeAndFit:
      raw.sizeAndFit ??
      'Model is 5′9″ and wears a size S. For an oversized drape, take one size up.',
    specifications: raw.specifications ?? null,
    care: raw.care ?? SHARED.care,
    shipping: SHARED.shipping,
    returns: SHARED.returns,
  }
}

/**
 * Normalises one department's authored list.
 * @param {Array} rawList authored entries
 * @param {string} department department slug the entries belong to
 */
export function normalizeCatalog(rawList, department) {
  return rawList.map((raw, index) => normalize(raw, index, department))
}
