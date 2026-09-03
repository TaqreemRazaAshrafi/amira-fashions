import { Link } from 'react-router-dom'
import { Clock, TrendingUp, X } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { POPULAR_SEARCHES } from '../../store/searchStore'
import { formatPrice } from '../../utils/format'
import Image from '../common/Image'
import { Skeleton } from '../common/Skeleton'

/** Shown while the query is too short to search — recent + popular terms. */
export function SearchSuggestions({ recent, onSelect, onRemoveRecent, onClearRecent }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {recent.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="eyebrow flex items-center gap-2">
              <Clock className="h-3 w-3" aria-hidden="true" /> Recent
            </h3>
            <button
              type="button"
              onClick={onClearRecent}
              className="text-fluid-xs text-muted underline-offset-4 hover:text-text hover:underline"
            >
              Clear
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {recent.map((entry) => (
              <li key={entry} className="group flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelect(entry)}
                  className="flex-1 py-1.5 text-left text-fluid-sm transition-colors hover:text-accent"
                >
                  {entry}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveRecent(entry)}
                  aria-label={`Remove ${entry} from recent searches`}
                  className="p-1 text-muted opacity-0 transition-opacity hover:text-text focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="eyebrow mb-4 flex items-center gap-2">
          <TrendingUp className="h-3 w-3" aria-hidden="true" /> Popular
        </h3>
        <ul className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((entry) => (
            <li key={entry}>
              <button
                type="button"
                onClick={() => onSelect(entry)}
                className="border border-line px-3 py-1.5 text-fluid-xs uppercase tracking-wide transition-colors duration-250 hover:border-text hover:bg-text hover:text-background"
              >
                {entry}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/** Live product results, with loading and empty states. */
export function SearchResults({ term, results, isSearching, onNavigate, onSeeAll }) {
  if (isSearching) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2" aria-label="Searching">
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index} className="flex items-center gap-4">
            <Skeleton className="h-20 w-16 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (!results.length) {
    return (
      <div className="py-12 text-center">
        <p className="font-display text-fluid-lg">No pieces match &ldquo;{term}&rdquo;.</p>
        <p className="mx-auto mt-2 max-w-sm text-fluid-sm text-muted">
          Try a shorter term, a colour, or browse the full collection.
        </p>
        <Link
          to={ROUTES.shop}
          onClick={onNavigate}
          className="mt-6 inline-block text-fluid-xs uppercase tracking-luxe underline underline-offset-4 hover:text-accent"
        >
          Browse everything
        </Link>
      </div>
    )
  }

  return (
    <div>
      <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {results.map((product) => (
          <li key={product.id}>
            <Link
              to={ROUTES.product(product.slug)}
              onClick={onNavigate}
              className="group flex items-center gap-4 py-2"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                ratio="portrait"
                width={160}
                sizes="64px"
                className="w-16 shrink-0"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-fluid-sm transition-colors group-hover:text-accent">
                  {product.name}
                </span>
                <span className="mt-1 block text-fluid-xs text-muted">
                  {formatPrice(product.price)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onSeeAll}
        className="mt-6 text-fluid-xs uppercase tracking-luxe underline underline-offset-4 transition-colors hover:text-accent"
      >
        See all results for &ldquo;{term}&rdquo;
      </button>
    </div>
  )
}
