import { useCallback, useState } from 'react'
import { MessageSquare, ThumbsUp } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatDate } from '../../utils/format'
import { useAsync } from '../../hooks/useAsync'
import productService from '../../services/productService'
import Rating from '../common/Rating'
import Button from '../common/Button'
import { EmptyState, ErrorState } from '../common/States'
import { Skeleton } from '../common/Skeleton'

const PAGE_SIZE = 4

/** Horizontal bar showing what share of reviews gave this many stars. */
function DistributionRow({ stars, count, total }) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <li className="flex items-center gap-3 text-fluid-xs">
      <span className="w-8 shrink-0 tabular-nums text-muted">{stars}★</span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-alt">
        <span
          className="block h-full rounded-full bg-accent transition-[width] duration-600 ease-luxe"
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className="w-10 shrink-0 text-right tabular-nums text-muted">{count}</span>
    </li>
  )
}

function ReviewsSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16" aria-hidden="true">
      <div>
        <Skeleton className="h-16 w-24" />
        <Skeleton className="mt-4 h-3 w-32" />
      </div>
      <ul className="flex flex-col gap-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={index}>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-4 w-48" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-3/4" />
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Customer reviews.
 *
 * Fetched separately from the product so a slow review query never delays the
 * buy box — the part of the page that actually converts. The summary panel and
 * the individual reviews come from the same response, so the average, the
 * breakdown and the written reviews always agree.
 */
export function ProductReviews({ slug, className }) {
  const [visible, setVisible] = useState(PAGE_SIZE)

  const fetcher = useCallback(() => productService.getReviews(slug), [slug])
  const { data, isLoading, isError, retry } = useAsync(fetcher, [slug])

  const reviews = data?.items ?? []
  const summary = data?.summary

  if (isLoading) {
    return (
      <div className={className}>
        <ReviewsSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={className}>
        <ErrorState
          title="We could not load the reviews."
          description="They are still there — the connection dropped on the way."
          onRetry={retry}
        />
      </div>
    )
  }

  if (!reviews.length) {
    return (
      <div className={className}>
        <EmptyState
          icon={MessageSquare}
          title="No reviews yet"
          description="Be the first to tell us how this piece wears."
          className="py-12"
        />
      </div>
    )
  }

  return (
    <div className={cn('grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16', className)}>
      {/* Summary */}
      <div className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:self-start">
        <p className="font-display text-fluid-3xl leading-none">{summary.average.toFixed(1)}</p>
        <Rating value={summary.average} className="mt-3" />
        <p className="mt-3 text-fluid-xs text-muted">
          Based on {summary.total} {summary.total === 1 ? 'review' : 'reviews'}
        </p>

        <ul className="mt-6 flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <DistributionRow
              key={stars}
              stars={stars}
              count={summary.distribution[stars] ?? 0}
              total={summary.total}
            />
          ))}
        </ul>

        <p className="mt-6 border-t border-line pt-5 text-fluid-sm leading-relaxed text-muted">
          <span className="text-text">{summary.recommendPercent}%</span> of reviewers would
          recommend this piece.
        </p>
      </div>

      {/* Written reviews */}
      <div>
        <ul className="flex flex-col">
          {reviews.slice(0, visible).map((review) => (
            <li key={review.id} className="border-b border-line py-7 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Rating value={review.rating} size="sm" />
                <p className="text-fluid-xs text-muted">{formatDate(review.createdAt)}</p>
              </div>

              <h3 className="mt-3 text-fluid-base">{review.title}</h3>
              <p className="mt-2 max-w-prose text-fluid-sm leading-relaxed text-muted">
                {review.body}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-fluid-xs text-muted">
                <span className="text-text">{review.author}</span>
                {review.verified && (
                  <span className="border border-success/40 bg-success/10 px-2 py-0.5 uppercase tracking-wide text-success">
                    Verified purchase
                  </span>
                )}
                <span>Bought size {review.size}</span>
                <span>{review.sizeNote}</span>
                {review.helpfulCount > 0 && (
                  <span className="ml-auto inline-flex items-center gap-1.5">
                    <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                    {review.helpfulCount} found this helpful
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        {visible < reviews.length && (
          <div className="mt-8">
            <Button
              variant="outline"
              magnetic={false}
              onClick={() => setVisible((count) => count + PAGE_SIZE)}
            >
              Show more reviews
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductReviews
