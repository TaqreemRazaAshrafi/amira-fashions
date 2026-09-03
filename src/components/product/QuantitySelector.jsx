import { Minus, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'

/** Stepper with a live-announced value and hard min/max clamping. */
export function QuantitySelector({ value, onChange, min = 1, max = 10, className, size = 'md' }) {
  const dimensions = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
  const button =
    'flex items-center justify-center text-text transition-colors duration-250 hover:text-accent disabled:opacity-30 disabled:hover:text-text'

  return (
    <div className={cn('inline-flex items-center border border-line', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(button, dimensions)}
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className={cn('min-w-8 text-center text-fluid-sm tabular-nums', size === 'sm' && 'text-fluid-xs')}
      >
        {value}
        <span className="sr-only"> in bag</span>
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(button, dimensions)}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default QuantitySelector
