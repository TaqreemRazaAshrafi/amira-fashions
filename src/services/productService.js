import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'
import { products, brands, getProductBySlug } from '../data/products'
import { categories, categoriesByDepartment } from '../data/categories'
import { departments } from '../data/departments'
import { collections } from '../data/collections'
import { reviewsFor, reviewSummaryFor } from '../data/reviews'
import {
  filterProducts,
  sortProducts,
  paginate,
  findRelated,
  computeFacets,
} from '../utils/productQuery'

/**
 * Catalogue reads. Components never import `data/` directly — they come
 * through here, so the mock-to-server swap is a one-file change.
 */
export const productService = {
  /**
   * The listing endpoint.
   * @returns {Promise<{items, page, perPage, total, totalPages, hasMore, facets}>}
   *   `facets` describes what is filterable *within this scope*, so the filter
   *   UI can offer only values that will return something.
   */
  async list({ page = 1, perPage = 12, sort = 'featured', ...filters } = {}) {
    if (!USE_MOCK) {
      return apiClient.get(ENDPOINTS.products, { params: { page, perPage, sort, ...filters } })
    }
    // Facets are counted within the department/category scope but before the
    // shopper's own refinements, which is what makes the counts useful.
    const { department, category, collection, q } = filters
    const scoped = filterProducts(products, { department, category, collection, q })
    const filtered = filterProducts(scoped, filters)

    return mockResponse({
      ...paginate(sortProducts(filtered, sort), page, perPage),
      facets: computeFacets(scoped, filters),
    })
  },

  async getBySlug(slug) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.product(slug))
    const product = getProductBySlug(slug)
    if (!product) {
      return mockResponse(null, { latency: 200 }).then(() => {
        const error = new Error('Product not found')
        error.code = 'not_found'
        error.status = 404
        throw error
      })
    }
    return mockResponse(product)
  },

  async getRelated(slug, limit = 4) {
    if (!USE_MOCK) return apiClient.get(`${ENDPOINTS.product(slug)}/related`, { params: { limit } })
    return mockResponse(findRelated(products, getProductBySlug(slug), limit), { latency: 260 })
  },

  /** Reviews for one product, newest first, with the rating breakdown. */
  async getReviews(slug) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.reviews(slug))
    const product = getProductBySlug(slug)
    if (!product) return mockResponse({ items: [], summary: null }, { latency: 200 })
    return mockResponse(
      { items: reviewsFor(product), summary: reviewSummaryFor(product) },
      { latency: 380 }
    )
  },

  async getFeatured(limit = 8, { department } = {}) {
    if (!USE_MOCK) {
      return apiClient.get(ENDPOINTS.products, { params: { featured: true, limit, department } })
    }
    const pool = department ? products.filter((p) => p.department === department) : products
    return mockResponse(pool.filter((p) => p.featured).slice(0, limit))
  },

  /**
   * One editorial rail. `flag` is `newArrival` | `bestseller`, which lets the
   * home page ask for New Arrivals or Best Sellers without a bespoke endpoint.
   */
  async getByFlag(flag, { limit = 8, department } = {}) {
    if (!USE_MOCK) {
      return apiClient.get(ENDPOINTS.products, { params: { [flag]: true, limit, department } })
    }
    const pool = department ? products.filter((p) => p.department === department) : products
    const sort = flag === 'newArrival' ? 'newest' : 'best-selling'
    return mockResponse(sortProducts(pool.filter((p) => p[flag]), sort).slice(0, limit))
  },

  /** Trending: strong rating and strong sales, regardless of editorial flags. */
  async getTrending({ limit = 8, department } = {}) {
    if (!USE_MOCK) {
      return apiClient.get(ENDPOINTS.products, { params: { trending: true, limit, department } })
    }
    const pool = department ? products.filter((p) => p.department === department) : products
    const ranked = [...pool].sort(
      (a, b) => b.rating * Math.log1p(b.unitsSold) - a.rating * Math.log1p(a.unitsSold)
    )
    return mockResponse(ranked.slice(0, limit))
  },

  async getByCollection(slug, { limit, department } = {}) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.collection(slug), { params: { limit, department } })
    let items = products.filter((p) => p.collections.includes(slug))
    if (department) items = items.filter((p) => p.department === department)
    return mockResponse(limit ? items.slice(0, limit) : items)
  },

  /** @param {string} [department] omit for the full cross-department list. */
  async getCategories(department) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.categories, { params: { department } })
    return mockResponse(department ? categoriesByDepartment(department) : categories, {
      latency: 120,
    })
  },

  async getDepartments() {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.departments)
    return mockResponse(departments, { latency: 100 })
  },

  async getBrands() {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.brands)
    return mockResponse(brands, { latency: 100 })
  },

  async getCollections() {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.collections)
    return mockResponse(collections, { latency: 120 })
  },

  /** Lightweight search used by the header overlay — capped and fast. */
  async search(query, limit = 6) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.search, { params: { q: query, limit } })
    const results = sortProducts(filterProducts(products, { q: query }), 'featured')
    return mockResponse(results.slice(0, limit), { latency: 180 })
  },
}

export default productService
