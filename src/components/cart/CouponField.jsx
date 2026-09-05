import { useState } from 'react'
import { Tag, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'
import { useCartStore } from '../../store/cartStore'
import { useUIStore } from '../../store/uiStore'
import Button from '../common/Button'

/**
 * Promotional code entry.
 *
 * Validation happens in the cart service, so a rejected code comes back with a
 * message the shopper can act on ("add ₹400 more") rather than a generic
 * failure. The applied state replaces the input entirely — an input still
 * showing a code that is already applied invites people to submit it twice.
 */
export function CouponField({ totals, className }) {
  const coupon = useCartStore((state) => state.coupon)
  const applyCoupon = useCartStore((state) => state.applyCoupon)
  const removeCoupon = useCartStore((state) => state.removeCoupon)
  const toast = useUIStore((state) => state.toast)

  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [isApplying, setIsApplying] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return

    setError(null)
    setIsApplying(true)
    try {
      const applied = await applyCoupon(trimmed)
      setCode('')
      toast({
        title: `${applied.code} applied`,
        description: applied.description,
        variant: 'success',
      })
    } catch (failure) {
      setError(failure?.message ?? 'We could not apply that code.')
    } finally {
      setIsApplying(false)
    }
  }

  if (coupon) {
    // The discount can fall to zero if the bag shrinks below the threshold, so
    // the applied state reports what the code is *currently* worth.
    const isActive = totals.discount > 0 || totals.qualifiesForFreeShipping
    return (
      <div className={cn('border border-line bg-surface-alt p-4', className)}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-fluid-sm">
              <Tag className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
              <span className="uppercase tracking-wide">{coupon.code}</span>
            </p>
            <p className="mt-1 text-fluid-xs leading-relaxed text-muted">
              {isActive
                ? coupon.type === 'shipping'
                  ? 'Delivery is on us.'
                  : `${formatPrice(totals.discount)} off this order.`
                : `Applies to orders above ${formatPrice(coupon.minSubtotal)}. Not active yet.`}
            </p>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            aria-label={`Remove coupon ${coupon.code}`}
            className="-mr-1 -mt-1 p-1 text-muted transition-colors duration-250 hover:text-danger"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className={cn('flex flex-col gap-2', className)} noValidate>
      <label htmlFor="coupon-code" className="text-fluid-xs uppercase tracking-wide text-muted">
        Promotional code
      </label>
      <div className="flex items-stretch gap-2">
        <input
          id="coupon-code"
          name="coupon"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase())
            setError(null)
          }}
          placeholder="Enter code"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'coupon-error' : undefined}
          className={cn(
            'min-w-0 flex-1 border bg-transparent px-3 py-2.5 text-fluid-sm uppercase tracking-wide text-text placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/70 focus:border-accent focus:outline-none',
            error ? 'border-danger' : 'border-line'
          )}
        />
        <Button
          type="submit"
          variant="quiet"
          size="md"
          magnetic={false}
          isLoading={isApplying}
          disabled={!code.trim()}
          className="shrink-0"
        >
          Apply
        </Button>
      </div>

      {error && (
        <p id="coupon-error" role="alert" className="text-fluid-xs leading-relaxed text-danger">
          {error}
        </p>
      )}
    </form>
  )
}

export default CouponField
