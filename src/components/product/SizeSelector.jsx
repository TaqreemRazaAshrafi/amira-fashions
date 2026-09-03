import { cn } from '../../utils/cn'

/**
 * Size picker built as a radiogroup so arrow keys work and the selection is
 * announced. Unavailable sizes are disabled rather than hidden.
 */
export function SizeSelector({ sizes, value, onChange, unavailable = [], error, className }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        role="radiogroup"
        aria-label="Select a size"
        aria-invalid={error ? 'true' : undefined}
        className="flex flex-wrap gap-2"
      >
        {sizes.map((size) => {
          const isSelected = value === size
          const isDisabled = unavailable.includes(size)
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              onClick={() => onChange(size)}
              className={cn(
                'relative min-w-12 border px-4 py-2.5 text-fluid-xs uppercase tracking-wide transition-all duration-250',
                isSelected
                  ? 'border-text bg-text text-background'
                  : 'border-line text-text hover:border-text',
                isDisabled &&
                  'cursor-not-allowed border-line text-muted/50 line-through hover:border-line'
              )}
            >
              {size}
            </button>
          )
        })}
      </div>
      {error && (
        <p role="alert" className="text-fluid-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default SizeSelector
