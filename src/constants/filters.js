/** Filter + sort vocabularies. Keys double as URL query values. */
export const SORT_OPTIONS = [
  { value: 'featured', label: 'Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'name-asc', label: 'Alphabetical' },
]

/**
 * Size vocabularies.
 *
 * The catalogue mixes alpha sizing, waist measurements, UK shoe sizes and
 * one-size pieces, so the filter groups them rather than offering one flat list
 * of incompatible values. Which groups actually render is decided by the facets
 * the catalogue returns for the current scope, never by this constant alone.
 */
export const SIZE_GROUPS = [
  { id: 'alpha', label: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'waist', label: 'Waist', values: ['24', '26', '28', '30', '32', '34', '36', '38'] },
  { id: 'shoe', label: 'Shoe size (UK)', values: ['6', '7', '8', '9', '10', '11'] },
  { id: 'one', label: 'One size', values: ['One Size'] },
]

/** Flat list, kept for anything that just needs "every known size". */
export const SIZES = SIZE_GROUPS.flatMap((group) => group.values)

export const COLORS = [
  { value: 'ivory', label: 'Ivory', hex: '#F3EDE4' },
  { value: 'sand', label: 'Sand', hex: '#C9B29B' },
  { value: 'blush', label: 'Blush', hex: '#E6C7C2' },
  { value: 'champagne', label: 'Champagne', hex: '#D8BE93' },
  { value: 'rust', label: 'Rust', hex: '#9E5233' },
  { value: 'wine', label: 'Wine', hex: '#5C1F2B' },
  { value: 'olive', label: 'Olive', hex: '#5A6247' },
  { value: 'emerald', label: 'Emerald', hex: '#2F5D50' },
  { value: 'sapphire', label: 'Sapphire', hex: '#2A3D63' },
  { value: 'navy', label: 'Navy', hex: '#1F2A44' },
  { value: 'charcoal', label: 'Charcoal', hex: '#3A3A3C' },
  { value: 'grey', label: 'Grey', hex: '#9A9A9C' },
  { value: 'silver', label: 'Silver', hex: '#C9CBCC' },
  { value: 'black', label: 'Black', hex: '#161412' },
]

/** Lookup used wherever a colour swatch is rendered from a raw value. */
export const COLOR_MAP = Object.fromEntries(COLORS.map((color) => [color.value, color]))

export const PRICE_BOUNDS = { min: 0, max: 25000, step: 500 }

export const AVAILABILITY = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
]

/** Minimum-discount buckets, coarsest last so the list reads top-down. */
export const DISCOUNT_OPTIONS = [
  { value: '10', label: '10% and above' },
  { value: '20', label: '20% and above' },
  { value: '30', label: '30% and above' },
  { value: '40', label: '40% and above' },
]

/** Minimum-rating buckets. */
export const RATING_OPTIONS = [
  { value: '4', label: '4★ and above' },
  { value: '3', label: '3★ and above' },
]

/** Query-param names, kept in one place so the shop URL contract is stable. */
export const QUERY_KEYS = {
  department: 'department',
  category: 'category',
  collection: 'collection',
  brand: 'brand',
  size: 'size',
  color: 'color',
  sort: 'sort',
  min: 'min',
  max: 'max',
  discount: 'discount',
  rating: 'rating',
  sale: 'sale',
  availability: 'availability',
  q: 'q',
  page: 'page',
}
