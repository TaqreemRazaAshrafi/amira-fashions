import { SITE } from '../constants/site'

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: SITE.currency,
  maximumFractionDigits: 0,
})

/** ₹2,499 — Indian digit grouping, no trailing decimals. */
export function formatPrice(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return priceFormatter.format(Number(value))
}

/** Raw number for structured data / analytics (no symbol, no grouping). */
export function toPriceString(value) {
  return Number(value || 0).toFixed(2)
}

export function formatDiscount(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return null
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

export function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date)
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function titleCase(value = '') {
  return value
    .split(/[-\s_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}
