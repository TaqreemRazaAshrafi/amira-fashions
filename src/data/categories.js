import { photo } from '../utils/images'
import { CATEGORY_GROUPS, departments } from './departments'

/**
 * Product categories — a product belongs to exactly one.
 *
 * A category is identified by the pair (department, slug): `shirts` exists in
 * both departments and the URL carries the department, so `/men/shirts` and
 * `/women/shirts` are distinct listings that never collide.
 *
 * `group` places the category inside a mega-menu column. Adding a category is a
 * single entry here — navigation, filters and landing pages all derive from it,
 * which is also why a server-driven category list can replace this file wholesale.
 */
const RAW = [
  // ============================ WOMEN ============================
  {
    slug: 'dresses',
    name: 'Dresses',
    department: 'women',
    group: 'Clothing',
    description:
      'Fluid silhouettes cut for evenings that run long — slip dresses, column midis and the occasional grand gesture.',
    image: '1595777457583-95e059d581b8',
    featured: true,
  },
  {
    slug: 'tops',
    name: 'Tops',
    department: 'women',
    group: 'Clothing',
    description:
      'The quiet workhorses of a considered wardrobe. Sculpted shoulders, clean necklines, fabric that holds its shape.',
    image: '1485462537746-965f33f7f6a7',
    featured: true,
  },
  {
    slug: 'co-ords',
    name: 'Co-ords',
    department: 'women',
    group: 'Clothing',
    description:
      'Two pieces, one decision. Matched sets that read as tailoring and wear like loungewear.',
    image: '1594633312681-425c7b97ccd1',
  },
  {
    slug: 'party-wear',
    name: 'Party Wear',
    department: 'women',
    group: 'Clothing',
    description: 'Sequins, satin and structure — for the nights that deserve a second look.',
    image: '1571945153237-4929e783af4a',
  },
  {
    slug: 't-shirts',
    name: 'T-Shirts',
    department: 'women',
    group: 'Clothing',
    description: 'Weighted cotton, cut close to the body and washed so it stays that way.',
    image: '1521146764736-56c929d59c83',
  },
  {
    slug: 'shirts',
    name: 'Shirts',
    department: 'women',
    group: 'Clothing',
    description: 'Poplin, silk and linen shirting — borrowed proportions, precise finishing.',
    image: '1499939667766-4afceb292d05',
  },
  {
    slug: 'jeans',
    name: 'Jeans',
    department: 'women',
    group: 'Clothing',
    description: 'Rigid and stretch denim in the rises we actually reach for.',
    image: '1541099649105-f69ad21f3246',
    featured: true,
  },
  {
    slug: 'trousers',
    name: 'Trousers',
    department: 'women',
    group: 'Clothing',
    description: 'Pleats, wide legs and a crease that survives the commute.',
    image: '1506794778202-cad84cf45f1d',
  },
  {
    slug: 'skirts',
    name: 'Skirts',
    department: 'women',
    group: 'Clothing',
    description: 'Bias midis, sharp minis and a column or two, cut to move.',
    image: '1583743814966-8936f5b7be1a',
  },
  {
    slug: 'jackets',
    name: 'Jackets',
    department: 'women',
    group: 'Clothing',
    description: 'Outerwear with a spine — blazers, trenches and a leather that softens with wear.',
    image: '1551028719-00167b16eac5',
  },
  {
    slug: 'hoodies',
    name: 'Hoodies',
    department: 'women',
    group: 'Clothing',
    description: 'Heavy loopback cotton in colours that do not shout.',
    image: '1620799140408-edc6dcb6d633',
  },
  {
    slug: 'ethnic-wear',
    name: 'Ethnic Wear',
    department: 'women',
    group: 'Ethnic Wear',
    description:
      'Handwork, drape and heritage textiles, reworked for a modern silhouette. Made in limited runs.',
    image: '1610030469983-98e550d6193c',
    featured: true,
  },
  {
    slug: 'sarees',
    name: 'Sarees',
    department: 'women',
    group: 'Ethnic Wear',
    description: 'Six yards of chanderi, organza and handloom silk, finished in our own workroom.',
    image: '1631217868264-e5b90bb7e133',
  },
  {
    slug: 'kurtis',
    name: 'Kurtis',
    department: 'women',
    group: 'Ethnic Wear',
    description: 'Everyday ethnic — block prints, clean cuts and cotton that breathes.',
    image: '1618932260643-eee4a2f652a6',
    featured: true,
  },
  {
    slug: 'footwear',
    name: 'Footwear',
    department: 'women',
    group: 'Footwear',
    description: 'Heels you can stand in, flats you can walk in, and boots for the rest.',
    image: '1543076447-215ad9ba6923',
  },
  {
    slug: 'handbags',
    name: 'Handbags',
    department: 'women',
    group: 'Accessories',
    description: 'Structured leather and soft slouch, in sizes that hold a life.',
    image: '1584917865442-de89df76afd3',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    department: 'women',
    group: 'Accessories',
    description: 'Belts, scarves and jewellery — the last decision before leaving.',
    image: '1611312449408-fcece27cdbb7',
  },

  // ============================= MEN ==============================
  {
    slug: 't-shirts',
    name: 'T-Shirts',
    department: 'men',
    group: 'Clothing',
    description: 'Garment-dyed cotton with a collar that keeps its shape past the first wash.',
    image: '1521572163474-6864f9cf17ab',
    featured: true,
  },
  {
    slug: 'shirts',
    name: 'Shirts',
    department: 'men',
    group: 'Clothing',
    description: 'Oxford, poplin and linen — cut trim through the body, never tight.',
    image: '1602810318383-e386cc2a3ccf',
    featured: true,
  },
  {
    slug: 'jeans',
    name: 'Jeans',
    department: 'men',
    group: 'Clothing',
    description: 'Japanese and Turkish denim in slim, straight and relaxed.',
    image: '1542272604-787c3835535d',
    featured: true,
  },
  {
    slug: 'trousers',
    name: 'Trousers',
    department: 'men',
    group: 'Clothing',
    description: 'Chinos, pleated wool and a travel trouser that refuses to crease.',
    image: '1473966968600-fa801b869a1a',
  },
  {
    slug: 'jackets',
    name: 'Jackets',
    department: 'men',
    group: 'Clothing',
    description: 'Overshirts, bombers and unstructured blazers built for real weather.',
    image: '1551028719-00167b16eac5',
    featured: true,
  },
  {
    slug: 'hoodies',
    name: 'Hoodies',
    department: 'men',
    group: 'Clothing',
    description: 'Brushed-back fleece, heavyweight, with a hood that stands up.',
    image: '1556821840-3a63f95609a7',
  },
  {
    slug: 'sweatshirts',
    name: 'Sweatshirts',
    department: 'men',
    group: 'Clothing',
    description: 'Loopback crewnecks in the weights we wear nine months a year.',
    image: '1620799140408-edc6dcb6d633',
  },
  {
    slug: 'shorts',
    name: 'Shorts',
    department: 'men',
    group: 'Clothing',
    description: 'Seven-inch inseams in linen, ripstop and washed twill.',
    image: '1591195853828-11db59a44f6b',
  },
  {
    slug: 'innerwear',
    name: 'Innerwear',
    department: 'men',
    group: 'Clothing',
    description: 'Supima cotton and modal basics, sold in packs, priced to restock.',
    image: '1618354691373-d851c5c3a990',
  },
  {
    slug: 'ethnic-wear',
    name: 'Ethnic Wear',
    department: 'men',
    group: 'Ethnic Wear',
    description: 'Kurtas, bandhgalas and nehru jackets, tailored rather than draped.',
    image: '1610030469983-98e550d6193c',
    featured: true,
  },
  {
    slug: 'footwear',
    name: 'Footwear',
    department: 'men',
    group: 'Footwear',
    description: 'Leather derbies, court sneakers and a boot that takes a resole.',
    image: '1549298916-b41d501d3772',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    department: 'men',
    group: 'Accessories',
    description: 'Belts, wallets, watch straps and the occasional very good sock.',
    image: '1611312449408-fcece27cdbb7',
  },
]

/** Expands the authored shape into the full category contract. */
export const categories = RAW.map((raw, index) => ({
  id: `cat-${raw.department}-${raw.slug}`,
  slug: raw.slug,
  name: raw.name,
  department: raw.department,
  group: raw.group,
  description: raw.description,
  image: photo(raw.image),
  featured: Boolean(raw.featured),
  /** Canonical path — a category is always department-scoped. */
  path: `/${raw.department}/${raw.slug}`,
  order: index + 1,
}))

/** Every category in one department, in authored order. */
export const categoriesByDepartment = (department) =>
  categories.filter((category) => category.department === department)

/**
 * Categories of one department bucketed into mega-menu columns.
 * @returns {Array<{ group: string, items: Array }>} — empty groups are dropped.
 */
export const categoryGroupsFor = (department) =>
  CATEGORY_GROUPS.map((group) => ({
    group,
    items: categories.filter((c) => c.department === department && c.group === group),
  })).filter((column) => column.items.length > 0)

/** The precise category — a slug alone is ambiguous across departments. */
export const getCategory = (department, slug) =>
  categories.find((c) => c.department === department && c.slug === slug) || null

/**
 * First category matching a slug in any department. Used by the
 * department-agnostic `/shop/:category` route, which deliberately lists both
 * departments' pieces under one heading.
 */
export const getCategoryBySlug = (slug) => categories.find((c) => c.slug === slug) || null

/** Distinct slugs — one shared by both departments appears once. */
export const categorySlugs = Array.from(new Set(categories.map((c) => c.slug)))

export const isCategorySlug = (department, slug) => Boolean(getCategory(department, slug))

/** Landing-page tiles: the categories flagged `featured` in a department. */
export const featuredCategories = (department) =>
  categories.filter((c) => c.department === department && c.featured)

export const departmentOf = (slug) => departments.find((d) => d.slug === slug) || null
