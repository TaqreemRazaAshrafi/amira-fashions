import { photo } from '../utils/images'

/**
 * Product categories — a product belongs to exactly one.
 * `slug` is the value used in /shop/:category and the `category` query param.
 */
export const categories = [
  {
    id: 'cat-dresses',
    slug: 'dresses',
    name: 'Dresses',
    description:
      'Fluid silhouettes cut for evenings that run long — slip dresses, column midis and the occasional grand gesture.',
    image: photo('1595777457583-95e059d581b8'),
    order: 1,
  },
  {
    id: 'cat-tops',
    slug: 'tops',
    name: 'Tops',
    description:
      'The quiet workhorses of a considered wardrobe. Sculpted shoulders, clean necklines, fabric that holds its shape.',
    image: photo('1485462537746-965f33f7f6a7'),
    order: 2,
  },
  {
    id: 'cat-co-ords',
    slug: 'co-ords',
    name: 'Co-ords',
    description:
      'Two pieces, one decision. Matched sets that read as tailoring and wear like loungewear.',
    image: photo('1594633312681-425c7b97ccd1'),
    order: 3,
  },
  {
    id: 'cat-ethnic-wear',
    slug: 'ethnic-wear',
    name: 'Ethnic Wear',
    description:
      'Handwork, drape and heritage textiles, reworked for a modern silhouette. Made in limited runs.',
    image: photo('1610030469983-98e550d6193c'),
    order: 4,
  },
  {
    id: 'cat-party-wear',
    slug: 'party-wear',
    name: 'Party Wear',
    description: 'Sequins, satin and structure — for the nights that deserve a second look.',
    image: photo('1571945153237-4929e783af4a'),
    order: 5,
  },
]

export const getCategoryBySlug = (slug) => categories.find((c) => c.slug === slug) || null
export const categorySlugs = categories.map((c) => c.slug)
