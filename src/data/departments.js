/**
 * Shopping departments.
 *
 * A department is the top level of the catalogue tree: every category and every
 * product belongs to exactly one. The mega menu, the department landing pages
 * and the `/men` / `/women` routes all read from here, so adding a department
 * later (kids, home) is a single entry plus its categories.
 */
export const departments = [
  {
    id: 'dept-women',
    slug: 'women',
    name: 'Women',
    tagline: "Women's Wear",
    headline: 'Dressed with intention',
    description:
      'Dresses, tailoring, ethnic and everyday essentials — cut in small runs for the woman who dresses on her own terms.',
    order: 1,
  },
  {
    id: 'dept-men',
    slug: 'men',
    name: 'Men',
    tagline: "Men's Wear",
    headline: 'Quiet, considered menswear',
    description:
      'Shirting, denim, outerwear and ethnic pieces built on clean lines and fabric that earns its keep.',
    order: 2,
  },
]

/** Order in which category groups appear inside a mega-menu column. */
export const CATEGORY_GROUPS = ['Clothing', 'Ethnic Wear', 'Footwear', 'Accessories']

export const departmentSlugs = departments.map((d) => d.slug)

export const getDepartment = (slug) => departments.find((d) => d.slug === slug) || null

export const isDepartmentSlug = (slug) => departmentSlugs.includes(slug)

export default departments
