import { useCallback } from 'react'
import { cn } from '../../utils/cn'
import productService from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'
import ProductRail from '../product/ProductRail'
import SectionHeader from '../layout/SectionHeader'
import { EmptyState, ErrorState } from '../common/States'
import { ProductCardSkeleton } from '../common/Skeleton'

/**
 * A titled product rail.
 *
 * The rail's source is one of three shapes — an editorial collection, a product
 * flag (`newArrival` / `bestseller`), or the trending ranking — and each can be
 * scoped to a department, so the home page and both department landing pages
 * share this one component instead of three near-identical ones.
 *
 * Fetches through the product service (never the data modules directly) and owns
 * its own loading, error and retry states, so one slow section can never block
 * the rest of the page from rendering.
 */
export function ProductSection({
  eyebrow,
  title,
  description,
  collectionSlug,
  flag,
  trending = false,
  department,
  action,
  limit = 8,
  className,
}) {
  const fetcher = useCallback(() => {
    if (flag) return productService.getByFlag(flag, { limit, department })
    if (trending) return productService.getTrending({ limit, department })
    return productService.getByCollection(collectionSlug, { limit, department })
  }, [collectionSlug, flag, trending, department, limit])

  const { data, isLoading, isError, retry } = useAsync(fetcher, [
    collectionSlug,
    flag,
    trending,
    department,
    limit,
  ])

  const isEmpty = !isLoading && !isError && (data?.length ?? 0) === 0

  return (
    <section className={cn('section-y', className)}>
      <div className="shell">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} action={action} />

        {isLoading && (
          <ul className="no-scrollbar -mx-gutter flex gap-4 overflow-hidden px-gutter sm:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="w-[68vw] shrink-0 sm:w-[46vw] lg:w-[24vw] xl:w-[21vw]">
                <ProductCardSkeleton />
              </li>
            ))}
          </ul>
        )}

        {isError && (
          <ErrorState
            title="We could not load this edit."
            description="The connection dropped on the way. Try again in a moment."
            onRetry={retry}
          />
        )}

        {isEmpty && (
          <EmptyState
            title="Nothing in this edit yet"
            description="New pieces land every Friday. Check back shortly."
            className="py-12"
          />
        )}

        {!isLoading && !isError && data?.length > 0 && <ProductRail products={data} />}
      </div>
    </section>
  )
}

export default ProductSection
