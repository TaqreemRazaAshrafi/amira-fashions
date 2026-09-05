import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { categoriesByDepartment, categories } from '../../data/categories'

/**
 * Category navigation.
 *
 * A horizontally scrollable rail on phones (edge-to-edge, scrollbar hidden) and
 * a centred inline list from large up. The active category is marked with
 * aria-current, not only with weight.
 *
 * Scoped to a department when one is given, which is how `/men` and `/women`
 * each show only their own sections; without one it falls back to the
 * cross-department `/shop` rail.
 */
export function CategoryRail({ department, className, includeAll = true }) {
  const { pathname } = useLocation()

  const allPath = department ? ROUTES.department(department) : ROUTES.shop

  /**
   * Without a department the rail is deduplicated by slug: "Shirts" exists in
   * both departments but `/shop/shirts` lists them together, so showing the
   * label twice would offer two chips that go to the same place.
   */
  const scoped = department
    ? categoriesByDepartment(department)
    : categories.filter(
        (category, index, all) => all.findIndex((c) => c.slug === category.slug) === index
      )

  const entries = [
    ...(includeAll ? [{ id: 'all', name: 'All', to: allPath }] : []),
    ...scoped.map((category) => ({
      id: category.id,
      name: category.name,
      to: department
        ? ROUTES.departmentCategory(category.department, category.slug)
        : ROUTES.shopCategory(category.slug),
    })),
  ]

  /**
   * Centring a rail that overflows clips both ends and can leave the first
   * items unreachable, so only a short rail is centred. A department with a
   * dozen categories starts at the left and scrolls.
   */
  const fitsOnOneLine = entries.length <= 7

  return (
    <nav aria-label="Product categories" className={cn('relative', className)}>
      <ul
        className={cn(
          'no-scrollbar -mx-gutter flex snap-x gap-2 overflow-x-auto px-gutter sm:gap-3 lg:mx-0 lg:px-0',
          fitsOnOneLine ? 'lg:justify-center' : 'lg:flex-wrap lg:justify-start'
        )}
      >
        {entries.map((entry) => {
          const isActive = pathname === entry.to

          return (
            <li key={entry.id} className="shrink-0 snap-start">
              <Link
                to={entry.to}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-block whitespace-nowrap border px-4 py-2.5 text-fluid-xs uppercase tracking-luxe transition-colors duration-250',
                  isActive
                    ? 'border-text bg-text text-background'
                    : 'border-line text-muted hover:border-text hover:text-text'
                )}
              >
                {entry.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default CategoryRail
