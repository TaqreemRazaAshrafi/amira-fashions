import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { categories } from '../../data/categories'

/**
 * Category navigation.
 *
 * A horizontally scrollable rail on phones (edge-to-edge, scrollbar hidden) and
 * a centred inline list from large up. The active category is marked with
 * aria-current, not only with weight.
 */
export function CategoryRail({ className, includeAll = true }) {
  const { pathname } = useLocation()

  const entries = [
    ...(includeAll ? [{ slug: null, name: 'All', to: ROUTES.shop }] : []),
    ...categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      to: ROUTES.shopCategory(category.slug),
    })),
  ]

  return (
    <nav aria-label="Product categories" className={cn('relative', className)}>
      <ul className="no-scrollbar -mx-gutter flex snap-x gap-2 overflow-x-auto px-gutter sm:gap-3 lg:mx-0 lg:justify-center lg:px-0">
        {entries.map((entry) => {
          const isActive = entry.slug
            ? pathname === ROUTES.shopCategory(entry.slug)
            : pathname === ROUTES.shop

          return (
            <li key={entry.name} className="shrink-0 snap-start">
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
