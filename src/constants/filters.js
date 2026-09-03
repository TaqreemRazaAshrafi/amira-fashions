/** Filter + sort vocabularies. Keys double as URL query values. */
export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Alphabetical' },
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const COLORS = [
  { value: 'ivory', label: 'Ivory', hex: '#F3EDE4' },
  { value: 'black', label: 'Black', hex: '#161412' },
  { value: 'champagne', label: 'Champagne', hex: '#D8BE93' },
  { value: 'blush', label: 'Blush', hex: '#E6C7C2' },
  { value: 'emerald', label: 'Emerald', hex: '#2F5D50' },
  { value: 'sapphire', label: 'Sapphire', hex: '#2A3D63' },
  { value: 'rust', label: 'Rust', hex: '#9E5233' },
  { value: 'sand', label: 'Sand', hex: '#C9B29B' },
  { value: 'wine', label: 'Wine', hex: '#5C1F2B' },
  { value: 'silver', label: 'Silver', hex: '#C9CBCC' },
]

export const PRICE_BOUNDS = { min: 0, max: 20000, step: 500 }

export const AVAILABILITY = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
]

/** Query-param names, kept in one place so the shop URL contract is stable. */
export const QUERY_KEYS = {
  category: 'category',
  collection: 'collection',
  size: 'size',
  color: 'color',
  sort: 'sort',
  min: 'min',
  max: 'max',
  sale: 'sale',
  availability: 'availability',
  q: 'q',
  page: 'page',
}
