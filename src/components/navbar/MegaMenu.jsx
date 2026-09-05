import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { MEGA_MENU_EDITORIAL, ROUTES } from '../../constants/routes'
import { QUERY_KEYS } from '../../constants/filters'
import { categoryGroupsFor, featuredCategories } from '../../data/categories'
import { getDepartment } from '../../data/departments'
import Image from '../common/Image'

/**
 * The department mega menu.
 *
 * Columns are derived from the category tree, so a category added in
 * `data/categories.js` — or served by a future `GET /categories` — appears here
 * with no change to this component.
 *
 * The panel is rendered inside the header's own hover region rather than as a
 * portal, so moving the pointer from the trigger down into the panel never
 * crosses a gap that would close it. Keyboard users get the same panel via
 * focus-within on the trigger's list item.
 */
export function MegaMenu({ department, onNavigate, id }) {
  const dept = getDepartment(department)
  if (!dept) return null

  const groups = categoryGroupsFor(department)
  const feature = featuredCategories(department)[0]
  const listingPath = `${ROUTES.shop}?${QUERY_KEYS.department}=${department}`

  /**
   * Clothing carries most of the tree (nine entries in menswear) while Footwear
   * and Accessories carry one each. Giving every group an equal column leaves
   * three-quarters of the panel empty, so the largest group gets its own
   * two-column block and the rest are stacked beside it.
   */
  const [primary, ...secondary] = [...groups].sort((a, b) => b.items.length - a.items.length)

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-x-0 top-full border-b border-line bg-background text-text shadow-lift"
    >
      <div className="mx-auto grid max-w-shell gap-10 px-gutter py-10 lg:grid-cols-[1fr_260px] lg:gap-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:gap-12">
          {/* Largest group — flows into two columns so it does not run long. */}
          {primary && (
            <div>
              <p className="eyebrow mb-4">{primary.group}</p>
              <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {primary.items.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={ROUTES.departmentCategory(department, category.slug)}
                      onClick={onNavigate}
                      className="link-underline text-fluid-sm text-muted transition-colors duration-250 hover:text-text"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Everything else, stacked in one column. */}
          <div className="flex flex-col gap-8">
            {secondary.map((column) => (
              <div key={column.group}>
                <p className="eyebrow mb-4">{column.group}</p>
                <ul className="flex flex-col gap-2.5">
                  {column.items.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={ROUTES.departmentCategory(department, category.slug)}
                        onClick={onNavigate}
                        className="link-underline text-fluid-sm text-muted transition-colors duration-250 hover:text-text"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <p className="eyebrow mb-4">Trending</p>
            <ul className="flex flex-col gap-2.5">
              {MEGA_MENU_EDITORIAL.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to(department)}
                    onClick={onNavigate}
                    className="link-underline text-fluid-sm text-muted transition-colors duration-250 hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-3 border-t border-line pt-4">
                <Link
                  to={listingPath}
                  onClick={onNavigate}
                  className="group inline-flex items-center gap-1.5 text-fluid-sm text-text"
                >
                  Shop all {dept.name}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Editorial tile — decorative, and hidden below the width where it fits. */}
        {feature && (
          <Link
            to={ROUTES.departmentCategory(department, feature.slug)}
            onClick={onNavigate}
            className="group relative hidden overflow-hidden bg-surface-alt lg:block"
          >
            <Image
              src={feature.image}
              alt=""
              ratio="portrait"
              width={520}
              sizes="260px"
              className="h-full w-full transition-transform duration-800 ease-luxe group-hover:scale-105"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-text/80 via-text/10 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 text-background">
              <p className="text-[10px] uppercase tracking-luxe text-background/70">
                {dept.tagline}
              </p>
              <p className="mt-1 font-display text-fluid-lg">{feature.name}</p>
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default MegaMenu
