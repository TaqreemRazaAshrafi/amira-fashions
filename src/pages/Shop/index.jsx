import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PackageOpen } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { getCategory, getCategoryBySlug } from '../../data/categories'
import { getDepartment } from '../../data/departments'
import { getCollectionBySlug } from '../../data/collections'
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
 * Resolves the listing's fixed context from the route.
 *
 * A listing is scoped by some combination of department, category and
 * collection, all of which come from the path rather than the query string.
 * Working that out in one place keeps the component below free of branching on
 * "which route am I".
 */
function useListingContext({ department, collection, saleOnly, title: titleOverride }) {
  const { category: categoryParam } = useParams()

  return useMemo(() => {
    const dept = department ? getDepartment(department) : null
    const category = categoryParam
      ? department
        ? getCategory(department, categoryParam)
        : getCategoryBySlug(categoryParam)
      : null
    const edit = collection ? getCollectionBySlug(collection) : null

    // A category slug that does not exist in this department is a dead URL.
    const isUnknown = Boolean(categoryParam) && !category

    const crumbs = [{ label: 'Home', to: ROUTES.home }]
    if (dept) crumbs.push({ label: dept.name, to: ROUTES.department(dept.slug) })
    else if (!edit && !saleOnly) crumbs.push({ label: 'Shop', to: ROUTES.shop })
    if (category)
      crumbs.push({
        label: category.name,
        to: dept
          ? ROUTES.departmentCategory(dept.slug, category.slug)
          : ROUTES.shopCategory(category.slug),
      })
    if (edit) crumbs.push({ label: edit.name, to: `/${collection}` })

    const title =
      titleOverride ??
      (category ? (dept ? `${dept.name}'s ${category.name}` : category.name) : null) ??
      edit?.name ??
      (dept ? `All ${dept.name}` : 'Shop All')

    const description =
      category?.description ??
      edit?.description ??
      dept?.description ??
      'The complete Amira catalogue — menswear and womenswear, filtered however you like.'

    const canonicalPath = category
      ? dept
        ? ROUTES.departmentCategory(dept.slug, category.slug)
        : ROUTES.shopCategory(category.slug)
      : edit
        ? `/${collection}`
        : saleOnly
          ? ROUTES.sale
          : dept
            ? ROUTES.department(dept.slug)
            : ROUTES.shop

    return {
      dept,
      category,
      categoryParam,
      edit,
      isUnknown,
      crumbs,
      title,
      description,
      canonicalPath,
      eyebrow: category ? 'Category' : (edit?.subtitle ?? dept?.tagline ?? 'The catalogue'),
      image: category?.image ?? edit?.cover,
    }
  }, [department, categoryParam, collection, saleOnly, titleOverride])
}

/**
 * Product listing — the main discovery surface.
 *
 * One component serves every catalogue route: `/shop`, `/shop/:category`,
 * `/men/:category`, `/women/:category` and the editorial listings
 * (`/new-arrivals`, `/best-sellers`, `/sale`). What differs between them is the
 * locked scope, which arrives as props from the route table and as path params —
 * never as component-local state.
 *
 * All refinement state lives in the query string via `useShopFilters`, which
 * makes every filtered view shareable and correct on back/forward.
 */
export default function ShopPage({ department, collection, saleOnly = false, title }) {
  const openFilterDrawer = useUIStore((state) => state.openFilterDrawer)
  const context = useListingContext({ department, collection, saleOnly, title })

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
  } = useShopFilters({
    lockedDepartment: department,
    lockedCategory: context.categoryParam ?? undefined,
    lockedCollection: collection,
  })

  // `sale` is locked on for /sale, and otherwise left to the shopper.
  const effectiveFilters = useMemo(
    () => (saleOnly ? { ...filters, sale: true } : filters),
    [filters, saleOnly]
  )

  // A single primitive key keeps the effect dependency list stable in length.
  const requestKey = useMemo(
    () => JSON.stringify({ effectiveFilters, sort, page }),
    [effectiveFilters, sort, page]
  )

  const fetcher = useCallback(
    () => productService.list({ ...effectiveFilters, sort, page, perPage: PER_PAGE }),
    [effectiveFilters, sort, page]
  )
  const { data, isLoading, isError, retry } = useAsync(fetcher, [requestKey])

  if (context.isUnknown) {
    return <Redirect to={department ? ROUTES.department(department) : ROUTES.shop} />
  }

  const products = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const panelProps = {
    filters,
    update,
    toggleValue,
    facets: data?.facets,
    lockedDepartment: department,
    lockedCategory: context.categoryParam ?? undefined,
    lockedCollection: collection,
  }

  return (
    <>
      <Seo
        title={context.title}
        description={context.description}
        image={context.image}
        canonicalPath={context.canonicalPath}
        jsonLd={structuredData.breadcrumbs(context.crumbs)}
      />

      <PageHero
        eyebrow={context.eyebrow}
        title={context.title}
        description={context.description}
        image={context.image}
        height="sm"
        breadcrumbs={context.crumbs}
      />

      <div className="shell pb-section pt-10 sm:pt-14">
        <CategoryRail department={department} className="mb-10" />

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
              isLoading={isLoading}
              isError={isError}
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
                    activeCount > 0 ? (
                      <Button variant="outline" onClick={clearAll}>
                        Clear all filters
                      </Button>
                    ) : (
                      <Button variant="outline" to={ROUTES.shop}>
                        Browse everything
                      </Button>
                    )
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

      <FilterDrawer {...panelProps} total={total} activeCount={activeCount} onClear={clearAll} />
    </>
  )
}
