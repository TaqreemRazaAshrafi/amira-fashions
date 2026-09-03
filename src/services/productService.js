import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { USE_MOCK, mockResponse } from '../api/mockAdapter'
import { products, getProductBySlug } from '../data/products'
import { categories } from '../data/categories'
import { collections } from '../data/collections'
import { filterProducts, sortProducts, paginate, findRelated } from '../utils/productQuery'

/**
 * Catalogue reads. Components never import `data/` directly — they come
 * through here, so the mock-to-server swap is a one-file change.
 */
export const productService = {
  /** @returns {Promise<{items, page, perPage, total, totalPages, hasMore}>} */
  async list({ page = 1, perPage = 12, sort = 'featured', ...filters } = {}) {
    if (!USE_MOCK) {
      return apiClient.get(ENDPOINTS.products, { params: { page, perPage, sort, ...filters } })
    }
    const filtered = filterProducts(products, filters)
    return mockResponse(paginate(sortProducts(filtered, sort), page, perPage))
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

  async getFeatured(limit = 8) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.products, { params: { featured: true, limit } })
    return mockResponse(products.filter((p) => p.featured).slice(0, limit))
  },

  async getByCollection(slug, { limit } = {}) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.collection(slug), { params: { limit } })
    const items = products.filter((p) => p.collections.includes(slug))
    return mockResponse(limit ? items.slice(0, limit) : items)
  },

  async getCategories() {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.categories)
    return mockResponse(categories, { latency: 120 })
  },

  async getCollections() {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.collections)
    return mockResponse(collections, { latency: 120 })
  },

  /** Lightweight search used by the header overlay — capped and fast. */
  async search(query, limit = 6) {
    if (!USE_MOCK) return apiClient.get(ENDPOINTS.search, { params: { q: query, limit } })
    const results = filterProducts(products, { q: query })
    return mockResponse(results.slice(0, limit), { latency: 180 })
  },
}

export default productService
