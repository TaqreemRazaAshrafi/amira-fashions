import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

/** Builds a compact page list with ellipses: 1 … 4 [5] 6 … 12 */
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) out.push('…')
    out.push(page)
  })
  return out
}

export function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null

  const button =
    'flex h-10 min-w-10 items-center justify-center px-3 text-fluid-xs transition-colors duration-250 disabled:opacity-30'

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>
      <button
        type="button"
        className={cn(button, 'hover:text-accent')}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {pageList(page, totalPages).map((entry, index) =>
        entry === '…' ? (
          <span key={`gap-${index}`} className="px-2 text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onChange(entry)}
            aria-current={entry === page ? 'page' : undefined}
            aria-label={`Page ${entry}`}
            className={cn(
              button,
              entry === page
                ? 'border-b border-text text-text'
                : 'text-muted hover:text-text'
            )}
          >
            {entry}
          </button>
        )
      )}

      <button
        type="button"
        className={cn(button, 'hover:text-accent')}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  )
}

export default Pagination
