import { useCallback } from 'react'
import { cn } from '../../utils/cn'
import productService from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'
import ProductRail from '../product/ProductRail'
import SectionHeader from '../layout/SectionHeader'
import { ErrorState } from '../common/States'
import { ProductCardSkeleton } from '../common/Skeleton'

/**
 * A titled product rail backed by a collection.
 *
 * Fetches through the product service (never the mock data directly) and owns
 * its own loading, error and retry states, so one slow section can never block
 * the rest of the page from rendering.
 */
export function ProductSection({
  eyebrow,
  title,
  description,
  collectionSlug,
  action,
  limit = 8,
  className,
}) {
  const fetcher = useCallback(
    () => productService.getByCollection(collectionSlug, { limit }),
    [collectionSlug, limit]
  )
  const { data, isLoading, isError, retry } = useAsync(fetcher, [collectionSlug, limit])

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

        {!isLoading && !isError && data?.length > 0 && <ProductRail products={data} />}
      </div>
    </section>
  )
}

export default ProductSection
