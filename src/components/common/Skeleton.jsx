import { cn } from '../../utils/cn'

/** Base shimmer block. Compose these rather than showing a blank screen. */
export function Skeleton({ className, ...rest }) {
  return <div className={cn('skeleton', className)} aria-hidden="true" {...rest} />
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-2 w-2/5" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8, className }) {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className={cn('grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4', className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading products…</span>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="flex flex-col gap-5 pt-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}

export function TextSkeleton({ lines = 3, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn('h-3', index === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}

export default Skeleton
