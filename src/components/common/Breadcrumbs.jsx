import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

/** Semantic breadcrumb trail; the current page is marked, not linked. */
export function Breadcrumbs({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-fluid-xs text-muted', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.to ?? item.label} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-text">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link to={item.to} className="link-underline transition-colors hover:text-text">
                    {item.label}
                  </Link>
                  <ChevronRight aria-hidden="true" className="h-3 w-3 opacity-50" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
