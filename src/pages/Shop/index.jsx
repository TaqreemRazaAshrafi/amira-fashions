import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PackageOpen } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { categorySlugs, getCategoryBySlug } from '../../data/categories'
import { useShopFilters } from '../../hooks/useShopFilters'
import { useAsync } from '../../hooks/useAsync'
import { useUIStore } from '../../store/uiStore'
import productService from '../../services/productService'
import Seo, { structuredData } from '../../components/common/Seo'
import Button from '../../components/common/Button'
import Pagination from '../../components/common/Pagination'
import { ProductGridSkeleton } from '../../components/common/Skeleton'
import { EmptyState, ErrorState } from '../../components/common/States'
import Redirect from '../../components/common/Redirect'
import PageHero from '../../components/layout/PageHero'
import CategoryRail from '../../components/collection/CategoryRail'
import ProductGrid from '../../components/product/ProductGrid'
import FilterPanel from '../../components/shop/FilterPanel'
import FilterDrawer from '../../components/shop/FilterDrawer'
import ActiveFilters from '../../components/shop/ActiveFilters'
import ShopToolbar from '../../components/shop/ShopToolbar'

const PER_PAGE = 12

/**
 * Shop — the main discovery surface.
 *
 * Serves both `/shop` and `/shop/:category`; when a category is in the path it
 * is locked (removed from the filter panel and from the removable chips) so the
 * URL and the UI can never disagree.
 *
 * All filter state lives in the query string via `useShopFilters`, which makes
 * every filtered view shareable and correct on back/forward.
 */
export default function ShopPage() {
  const { category: categoryParam } = useParams()
  const openFilterDrawer = useUIStore((state) => state.openFilterDrawer)

  const category = categoryParam ? getCategoryBySlug(categoryParam) : null
  const isUnknownCategory = Boolean(categoryParam) && !categorySlugs.includes(categoryParam)

  const {
    filters,
    sort,
    page,
    activeChips,
    activeCount,
    update,
    toggleValue,
    removeChip,
    clearAll,
    setSort,
    setPage,
  } = useShopFilters({ lockedCategory: categoryParam ?? undefined })

  // A single primitive key keeps the effect dependency list stable in length.
  const requestKey = useMemo(() => JSON.stringify({ filters, sort, page }), [filters, sort, page])

  const fetcher = useCallback(
    () => productService.list({ ...filters, sort, page, perPage: PER_PAGE }),
    [filters, sort, page]
  )
  const { data, isLoading, isError, retry } = useAsync(fetcher, [requestKey])

  if (isUnknownCategory) return <Redirect to={ROUTES.shop} />

  const products = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const title = category ? category.name : 'Shop All'
  const description = category
    ? category.description
    : 'The complete Amira catalogue — dresses, co-ords, tops, ethnic and party wear, filtered however you like.'

  const panelProps = {
    filters,
    update,
    toggleValue,
    lockedCategory: categoryParam ?? undefined,
  }

  return (
    <>
      <Seo
        title={title}
        description={description}
        image={category?.image}
        canonicalPath={category ? ROUTES.shopCategory(category.slug) : ROUTES.shop}
        jsonLd={structuredData.breadcrumbs(
          [
            { label: 'Home', to: ROUTES.home },
            { label: 'Shop', to: ROUTES.shop },
            category && { label: category.name, to: ROUTES.shopCategory(category.slug) },
          ].filter(Boolean)
        )}
      />

      <PageHero
        eyebrow={category ? 'Category' : 'The catalogue'}
        title={title}
        description={description}
        image={category?.image}
        height="sm"
        breadcrumbs={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Shop', to: ROUTES.shop },
          ...(category ? [{ label: category.name, to: ROUTES.shopCategory(category.slug) }] : []),
        ]}
      />

      <div className="shell pb-section pt-10 sm:pt-14">
        <CategoryRail className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
          {/* Desktop filters */}
          <aside aria-label="Filters" className="hidden lg:block">
            <div className="sticky top-[calc(var(--nav-height)+1.5rem)] max-h-[calc(100vh-var(--nav-height)-3rem)] overflow-y-auto pr-2">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-fluid-xs uppercase tracking-luxe">Filter</h2>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-fluid-xs text-muted underline-offset-4 hover:text-text hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <FilterPanel {...panelProps} />
            </div>
          </aside>

          <div className="min-w-0">
            <ShopToolbar
              total={total}
              sort={sort}
              onSortChange={setSort}
              onOpenFilters={openFilterDrawer}
              activeCount={activeCount}
            />

            <ActiveFilters
              chips={activeChips}
              onRemove={removeChip}
              onClear={clearAll}
              className="mt-5"
            />

            <div className="mt-8">
              {isLoading && <ProductGridSkeleton count={PER_PAGE} />}

              {isError && (
                <ErrorState
                  title="We could not load these pieces."
                  description="Something went wrong fetching the catalogue. Please try again."
                  onRetry={retry}
                />
              )}

              {!isLoading && !isError && products.length === 0 && (
                <EmptyState
                  icon={PackageOpen}
                  title="No pieces match those filters"
                  description="Try removing a filter, widening the price range, or browsing the full catalogue."
                  action={
                    <Button variant="outline" onClick={clearAll}>
                      Clear all filters
                    </Button>
                  }
                />
              )}

              {!isLoading && !isError && products.length > 0 && (
                <>
                  <ProductGrid products={products} />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                    className="mt-16"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <FilterDrawer
        {...panelProps}
        total={total}
        activeCount={activeCount}
        onClear={clearAll}
      />
    </>
  )
}
