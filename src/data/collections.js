import { photo } from '../utils/images'

/**
 * Editorial collections. A product may sit in several collections, so
 * membership is derived from product flags plus the `collections` array
 * on each product (see data/products.js).
 */
export const collections = [
  {
    id: 'col-new-arrivals',
    slug: 'new-arrivals',
    name: 'New Arrivals',
    subtitle: 'The latest edit',
    description:
      'A curated selection of the newest Amira pieces — released weekly, in small numbers, and rarely repeated.',
    story:
      'Every Friday at 8 PM we release a handful of new styles. They are cut in limited runs, photographed the way we wear them, and once an edit closes it does not return.',
    image: photo('1483985988355-763728e1935b'),
    cover: photo('1469334031218-e382a71b716b'),
    featured: true,
    order: 1,
  },
  {
    id: 'col-best-sellers',
    slug: 'best-sellers',
    name: 'Best Sellers',
    subtitle: 'Loved on repeat',
    description: 'The pieces our community keeps coming back for — restocked by request.',
    story:
      'These are the styles that sell out first, get tagged most and come back on request. Consider them the house canon.',
    image: photo('1490481651871-ab68de25d43d'),
    cover: photo('1496747611176-843222e1e57c'),
    featured: true,
    order: 2,
  },
  {
    id: 'col-premium',
    slug: 'premium-collection',
    name: 'Premium Collection',
    subtitle: 'Atelier line',
    description:
      'Our most considered work — heavier fabrics, hand-finished detail and construction that takes twice as long.',
    story:
      'The atelier line is where we stop counting hours. Silk and hand-embroidery, finished in-house, numbered and made to be kept.',
    image: photo('1596783074918-c84cb06531ca'),
    cover: photo('1603189343302-e603f7add05a'),
    featured: true,
    order: 3,
  },
  {
    id: 'col-aurelia',
    slug: 'aurelia',
    name: 'Aurelia',
    subtitle: 'Autumn / Winter',
    description:
      'Warm metallics, low light and long evenings. Aurelia is built around champagne, bronze and deep ink.',
    story:
      'Aurelia began with a single swatch of antique champagne satin. The rest of the collection followed the light in it.',
    image: photo('1600185365483-26d7a4cc7519'),
    cover: photo('1618932260643-eee4a2f652a6'),
    featured: true,
    order: 4,
  },
  {
    id: 'col-sale',
    slug: 'sale',
    name: 'Sale',
    subtitle: 'Final cuts',
    description: 'Closing sizes and past-season pieces at reduced prices. Final sale, no returns.',
    story:
      'When an edit closes we release the remaining sizes here. What is listed is what is left.',
    image: photo('1529139574466-a303027c1d8b'),
    cover: photo('1550614000-4895a10e1bfd'),
    featured: false,
    order: 5,
  },
]

export const getCollectionBySlug = (slug) => collections.find((c) => c.slug === slug) || null
export const featuredCollections = collections.filter((c) => c.featured)
