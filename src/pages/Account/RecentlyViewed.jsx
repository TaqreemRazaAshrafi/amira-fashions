import { useCallback } from 'react'
import { Eye } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { useAsync } from '../../hooks/useAsync'
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed'
import productService from '../../services/productService'
import Button from '../../components/common/Button'
import { EmptyState, ErrorState } from '../../components/common/States'
import { ProductGridSkeleton } from '../../components/common/Skeleton'
import ProductGrid from '../../components/product/ProductGrid'
import AccountLayout from '../../components/account/AccountLayout'

/**
 * Recently viewed.
 *
 * The hook stores slugs only, so each is re-fetched here — that way a price or
 * stock change since the visit is reflected rather than a stale snapshot.
 * `allSettled` keeps one delisted product from emptying the whole page.
 */
export default function RecentlyViewedPage() {
  const { slugs, clear } = useRecentlyViewed()

  const fetcher = useCallback(async () => {
    const results = await Promise.allSettled(slugs.map((slug) => productService.getBySlug(slug)))
    return results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
  }, [slugs])

  const { data, isLoading, isError, retry } = useAsync(fetcher, [slugs.join(',')])
  const products = data ?? []

  return (
    <AccountLayout
      title="Recently Viewed"
      description="Pieces you have looked at recently."
      canonicalPath={ROUTES.accountRecentlyViewed}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-fluid-xl">Recently Viewed</h2>
          <p className="mt-3 max-w-prose text-fluid-sm leading-relaxed text-muted">
            Prices and availability are live, not what you saw at the time.
          </p>
        </div>
        {products.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-fluid-xs uppercase tracking-wide text-muted underline-offset-4 hover:text-text hover:underline"
          >
            Clear history
          </button>
        )}
      </div>

      <div className="mt-10">
        {isLoading && slugs.length > 0 && <ProductGridSkeleton count={4} />}

        {isError && (
          <ErrorState
            title="We could not load these pieces."
            description="Something went wrong on the way. Please try again."
            onRetry={retry}
          />
        )}

        {!isLoading && !isError && products.length === 0 && (
          <EmptyState
            icon={Eye}
            title="Nothing here yet"
            description="Pieces you open will appear here so you can find your way back to them."
            action={
              <Button to={ROUTES.shop} variant="outline">
                Start browsing
              </Button>
            }
            className="py-16"
          />
        )}

        {!isLoading && !isError && products.length > 0 && (
          <ProductGrid products={products} />
        )}
      </div>
    </AccountLayout>
  )
}
