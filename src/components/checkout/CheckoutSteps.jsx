import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Checkout progress indicator.
 *
 * Completed steps are clickable so a shopper can go back and correct an
 * address without losing the rest of their input; steps ahead are inert,
 * because skipping forward past validation would only fail on submit.
 */
export function CheckoutSteps({ steps, current, onSelect, className }) {
  return (
    <nav aria-label="Checkout progress" className={cn('w-full', className)}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isComplete = index < current
          const isCurrent = index === current
          const canGoBack = isComplete && Boolean(onSelect)

          return (
            <li key={step.id} className={cn('flex items-center', index > 0 && 'flex-1')}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'mx-2 h-px flex-1 transition-colors duration-400 sm:mx-3',
                    isComplete || isCurrent ? 'bg-text' : 'bg-line'
                  )}
                />
              )}

              <span className="flex items-center gap-2.5">
                {canGoBack ? (
                  <button
                    type="button"
                    onClick={() => onSelect(index)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-text text-background transition-opacity duration-250 hover:opacity-75"
                    aria-label={`Back to ${step.label}`}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                  </button>
                ) : (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] tabular-nums transition-colors duration-400',
                      isCurrent
                        ? 'border-text bg-text text-background'
                        : 'border-line text-muted'
                    )}
                  >
                    {index + 1}
                  </span>
                )}

                <span
                  aria-current={isCurrent ? 'step' : undefined}
                  className={cn(
                    'hidden whitespace-nowrap text-fluid-xs uppercase tracking-wide sm:inline',
                    isCurrent ? 'text-text' : 'text-muted'
                  )}
                >
                  {step.label}
                </span>
              </span>
            </li>
          )
        })}
      </ol>

      {/* On phones the labels are hidden above; this keeps the current step named. */}
      <p className="mt-4 text-fluid-xs uppercase tracking-luxe text-muted sm:hidden">
        Step {current + 1} of {steps.length} · {steps[current]?.label}
      </p>
    </nav>
  )
}

export default CheckoutSteps
