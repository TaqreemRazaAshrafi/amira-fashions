import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { cn } from '../../utils/cn'
import { SORT_OPTIONS } from '../../constants/filters'
import { pluralize } from '../../utils/format'

/**
 * The bar above the grid: result count, mobile filter trigger and sort.
 * Sort is a native <select> — it is the control every platform already knows
 * how to render well on a phone.
 */
export function ShopToolbar({
  total,
  sort,
  onSortChange,
  onOpenFilters,
  activeCount = 0,
  showFilterButton = true,
  isLoading = false,
  isError = false,
  className,
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-b border-line pb-4 sm:gap-4',
        className
      )}
    >
      {/* A count is only meaningful once a request has succeeded — printing
          "0 pieces" beside a failed request reads as an empty catalogue. */}
      <p
        aria-live="polite"
        className="whitespace-nowrap text-fluid-xs uppercase tracking-wide text-muted"
      >
        {isError ? '—' : isLoading ? 'Loading…' : pluralize(total, 'piece')}
      </p>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {showFilterButton && (
          <button
            type="button"
            onClick={onOpenFilters}
            className="flex items-center gap-2 border border-line px-3 py-2 text-fluid-xs uppercase tracking-wide transition-colors duration-250 hover:border-text lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            Filter
            {activeCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] text-background">
                {activeCount}
              </span>
            )}
          </button>
        )}

        {/* A native <select> takes the width of its widest option, and
            "Price: Low to High" is wide enough to push the whole toolbar past a
            320px viewport. Capping the width lets the control shrink; the option
            list itself is rendered by the platform at full width regardless. */}
        <div className="relative min-w-0">
          <label htmlFor="sort" className="sr-only">
            Sort products
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full max-w-[46vw] cursor-pointer appearance-none truncate border border-line bg-transparent py-2 pl-3 pr-9 text-fluid-xs uppercase tracking-wide transition-colors duration-250 hover:border-text focus:border-text focus:outline-none sm:max-w-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}

export default ShopToolbar
