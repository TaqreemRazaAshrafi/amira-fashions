/**
 * Image URL helpers.
 *
 * Product imagery is served from a transform-capable CDN, so widths and the
 * output format are requested per breakpoint rather than shipping one large
 * original. Swapping CDNs later means editing only this file.
 */
const UNSPLASH_BASE = 'https://images.unsplash.com/photo-'

/** Expands a bare CDN photo id into a base URL. */
export const photo = (id) => `${UNSPLASH_BASE}${id}`

const DEFAULT_WIDTHS = [400, 640, 800, 1200, 1600]

function withParams(src, { w, h, q = 72, fit = 'crop' } = {}) {
  if (!src) return ''
  // Only CDN sources accept transform params; local/imported assets pass through.
  if (!src.startsWith('https://images.unsplash.com')) return src
  const url = new URL(src)
  url.searchParams.set('auto', 'format') // negotiates AVIF / WebP per browser
  url.searchParams.set('fit', fit)
  url.searchParams.set('q', String(q))
  if (w) url.searchParams.set('w', String(w))
  if (h) url.searchParams.set('h', String(h))
  return url.toString()
}

/** Single sized URL — use for `src`. */
export function imageUrl(src, width = 800, options = {}) {
  return withParams(src, { w: width, ...options })
}

/** Comma-separated `srcset` so the browser can pick the cheapest candidate. */
export function imageSrcSet(src, widths = DEFAULT_WIDTHS, options = {}) {
  if (!src || !src.startsWith('https://images.unsplash.com')) return undefined
  return widths.map((w) => `${withParams(src, { w, ...options })} ${w}w`).join(', ')
}

/** Tiny blurred stand-in shown while the full image decodes. */
export function imagePlaceholder(src) {
  if (!src || !src.startsWith('https://images.unsplash.com')) return undefined
  return withParams(src, { w: 24, q: 20 })
}

/** Last-resort inline SVG so a dead URL never leaves an empty box. */
export const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23F4EDE6'/%3E%3Ctext x='150' y='205' font-family='Georgia,serif' font-size='22' fill='%23B08E52' text-anchor='middle'%3EAMIRA%3C/text%3E%3C/svg%3E"
