import { useCallback, useEffect, useMemo } from 'react'
import { SearchX } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { useShopFilters } from '../../hooks/useShopFilters'
import { useAsync } from '../../hooks/useAsync'
import { useSearchStore, POPULAR_SEARCHES } from '../../store/searchStore'
import productService from '../../services/productService'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import Pagination from '../../components/common/Pagination'
import { ProductGridSkeleton } from '../../components/common/Skeleton'
import { EmptyState, ErrorState } from '../../components/common/States'
import ProductGrid from '../../components/product/ProductGrid'
import ShopToolbar from '../../components/shop/ShopToolbar'

const PER_PAGE = 12

/**
 * Full search results.
 *
 * The query lives in `?q=`, so a result page can be shared or bookmarked and
 * the browser's back button behaves. The overlay in the header hands off here
 * when someone presses Enter.
 */
export default function SearchPage() {
  const { filters, sort, page, setSort, setPage, setQuery } = useShopFilters()
  const addRecent = useSearchStore((state) => state.addRecent)

  // Landing here from a shared link should still record the term.
  useEffect(() => {
    if (filters.q) addRecent(filters.q)
  }, [filters.q, addRecent])

  const requestKey = useMemo(
    () => JSON.stringify({ q: filters.q, sort, page }),
    [filters.q, sort, page]
  )

  const fetcher = useCallback(
    () => productService.list({ q: filters.q, sort, page, perPage: PER_PAGE }),
    [filters.q, sort, page]
  )
  const { data, isLoading, isError, retry } = useAsync(fetcher, [requestKey])

  const products = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <>
      <Seo
        title={filters.q ? `Search — ${filters.q}` : 'Search'}
        description="Search the Amira Fashions catalogue."
        canonicalPath={ROUTES.search}
        noIndex
      />

      <div className="shell pb-section pt-12 sm:pt-16">
        <header className="mb-12">
          <h1 className="eyebrow mb-4">Search</h1>
          {/* Uncontrolled and keyed on the query: the URL stays the single
              source of truth without mirroring it into component state. */}
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              setQuery(new FormData(event.currentTarget).get('q').trim())
            }}
            className="flex items-center gap-4 border-b border-line pb-4"
          >
            <label htmlFor="search-page-input" className="sr-only">
              Search products
            </label>
            <input
              key={filters.q}
              id="search-page-input"
              name="q"
              type="search"
              defaultValue={filters.q}
              placeholder="Search dresses, co-ords, ethnic wear…"
              className="w-full bg-transparent font-display text-fluid-2xl placeholder:text-muted/50 focus:outline-none"
            />
            <Button type="submit" size="md" magnetic={false}>
              Search
            </Button>
          </form>

          {filters.q && (
            <p className="mt-4 text-fluid-sm text-muted" aria-live="polite">
              {total} result{total === 1 ? '' : 's'} for{' '}
              <span className="text-text">&ldquo;{filters.q}&rdquo;</span>
            </p>
          )}
        </header>

        {!filters.q ? (
          <div className="py-10">
            <p className="eyebrow mb-5">Popular searches</p>
            <ul className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((entry) => (
                <li key={entry}>
                  <button
                    type="button"
                    onClick={() => setQuery(entry)}
                    className="border border-line px-4 py-2 text-fluid-xs uppercase tracking-wide transition-colors duration-250 hover:border-text hover:bg-text hover:text-background"
                  >
                    {entry}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <ShopToolbar
              total={total}
              sort={sort}
              onSortChange={setSort}
              showFilterButton={false}
              className="mb-8"
            />

            {isLoading && <ProductGridSkeleton count={8} />}

            {isError && (
              <ErrorState
                title="Search is unavailable right now."
                description="Something went wrong reaching the catalogue. Please try again."
                onRetry={retry}
              />
            )}

            {!isLoading && !isError && products.length === 0 && (
              <EmptyState
                icon={SearchX}
                title={`No pieces match “${filters.q}”`}
                description="Try a shorter term, a colour, or browse the full catalogue."
                action={
                  <Button to={ROUTES.shop} variant="outline">
                    Browse everything
                  </Button>
                }
              />
            )}

            {!isLoading && !isError && products.length > 0 && (
              <>
                <ProductGrid products={products} />
                <Pagination
                  page={page}
                  totalPages={data?.totalPages ?? 1}
                  onChange={setPage}
                  className="mt-16"
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
