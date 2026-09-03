import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

/** Star rating. The numeric value is always exposed as text for a11y. */
export function Rating({ value = 0, count, size = 'sm', showCount = true, className }) {
  const rounded = Math.round(value * 2) / 2
  const iconSize = size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index + 1 <= rounded
          const half = !filled && index + 0.5 === rounded
          return (
            <Star
              key={index}
              className={cn(
                iconSize,
                filled || half ? 'fill-accent text-accent' : 'text-line',
                half && 'opacity-60'
              )}
              strokeWidth={1.4}
            />
          )
        })}
      </span>
      <span className="text-fluid-xs text-muted">
        {value.toFixed(1)}
        {showCount && count != null ? ` (${count})` : ''}
      </span>
      <span className="sr-only">{`Rated ${value} out of 5${count != null ? ` from ${count} reviews` : ''}`}</span>
    </div>
  )
}

export default Rating
