/**
 * Pure catalogue query helpers.
 *
 * These are deliberately free of React and of the data source: the same
 * functions run against the mock dataset today and against a server response
 * tomorrow, and they are trivially unit-testable.
 */

/** Normalised text blob used for search matching. */
function searchBlob(product) {
  return [
    product.name,
    product.description,
    product.category,
    product.material,
    ...(product.colors || []),
    ...(product.collections || []),
  ]
    .join(' ')
    .toLowerCase()
}

export function matchesQuery(product, query) {
  if (!query) return true
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const blob = searchBlob(product)
  return terms.every((term) => blob.includes(term))
}

/**
 * @param {Array} products
 * @param {object} filters category, collection, sizes[], colors[], min, max,
 *   sale, availability, q
 */
export function filterProducts(products, filters = {}) {
  const { category, collection, sizes = [], colors = [], min, max, sale, availability, q } = filters

  return products.filter((product) => {
    if (category && product.category !== category) return false
    if (collection && !product.collections.includes(collection)) return false
    if (sizes.length && !sizes.some((size) => product.sizes.includes(size))) return false
    if (colors.length && !colors.some((color) => product.colors.includes(color))) return false
    if (min != null && product.price < min) return false
    if (max != null && product.price > max) return false
    if (sale && !product.onSale) return false
    if (availability === 'in-stock' && !product.inStock) return false
    if (availability === 'low-stock' && !product.lowStock) return false
    if (!matchesQuery(product, q)) return false
    return true
  })
}

const SORTERS = {
  featured: (a, b) =>
    Number(b.featured) - Number(a.featured) ||
    Number(b.bestseller) - Number(a.bestseller) ||
    b.rating - a.rating,
  newest: (a, b) => new Date(b.releasedAt) - new Date(a.releasedAt),
  'price-low': (a, b) => a.price - b.price,
  'price-high': (a, b) => b.price - a.price,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
}

export function sortProducts(products, sort = 'featured') {
  const sorter = SORTERS[sort] || SORTERS.featured
  // Copy first — Array.prototype.sort mutates, and callers pass shared arrays.
  return [...products].sort(sorter)
}

export function paginate(items, page = 1, perPage = 12) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * perPage
  return {
    items: items.slice(start, start + perPage),
    page: safePage,
    perPage,
    total,
    totalPages,
    hasMore: safePage < totalPages,
  }
}

/**
 * Related products: same category first, then anything sharing a collection.
 * Never returns the product itself.
 */
export function findRelated(products, product, limit = 4) {
  if (!product) return []
  const pool = products.filter((p) => p.id !== product.id)
  const scored = pool.map((p) => {
    let score = 0
    if (p.category === product.category) score += 3
    score += p.collections.filter((c) => product.collections.includes(c)).length * 2
    if (p.colors.some((c) => product.colors.includes(c))) score += 1
    if (Math.abs(p.price - product.price) < product.price * 0.35) score += 1
    return { product: p, score }
  })
  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .slice(0, limit)
    .map((entry) => entry.product)
}

/** Price bounds actually present in the catalogue, rounded to clean steps. */
export function priceRangeOf(products, step = 500) {
  if (!products.length) return { min: 0, max: 0 }
  const prices = products.map((p) => p.price)
  return {
    min: Math.floor(Math.min(...prices) / step) * step,
    max: Math.ceil(Math.max(...prices) / step) * step,
  }
}
