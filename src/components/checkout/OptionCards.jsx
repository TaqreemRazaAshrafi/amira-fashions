import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'
import { deliveryOptions } from '../../data/support'

/** Shared radio-card shell for the delivery and payment choices. */
function OptionCard({ name, value, checked, onChange, title, description, meta, disabled }) {
  return (
    <label
      className={cn(
        'flex items-start gap-4 border p-5 transition-colors duration-250',
        disabled
          ? 'cursor-not-allowed border-line opacity-50'
          : 'cursor-pointer hover:border-text/40',
        checked ? 'border-text bg-surface' : 'border-line'
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[rgb(var(--color-accent))] disabled:cursor-not-allowed"
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-fluid-sm">{title}</span>
          {meta && <span className="text-fluid-sm tabular-nums text-muted">{meta}</span>}
        </span>
        <span className="mt-1 block text-fluid-xs leading-relaxed text-muted">{description}</span>
      </span>
    </label>
  )
}

/** Delivery speed. Free-shipping thresholds are reflected in the price shown. */
export function DeliverySelector({ value, onChange, subtotal }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Delivery method</legend>
      {deliveryOptions.map((option) => {
        const isFree = option.freeAbove != null && subtotal >= option.freeAbove
        return (
          <OptionCard
            key={option.id}
            name="delivery"
            value={option.id}
            checked={value === option.id}
            onChange={onChange}
            title={option.label}
            description={option.description}
            meta={isFree ? 'Complimentary' : formatPrice(option.price)}
          />
        )
      })}
    </fieldset>
  )
}

const PAYMENT_METHODS = [
  {
    id: 'online',
    title: 'Pay online',
    description: 'UPI, cards, net banking and wallets. Handled by our payment gateway.',
  },
  {
    id: 'cod',
    title: 'Cash on delivery',
    description: 'Available on orders up to ₹15,000. Please keep exact change ready.',
  },
]

export function PaymentSelector({ value, onChange, codDisabled }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Payment method</legend>
      {PAYMENT_METHODS.map((method) => (
        <OptionCard
          key={method.id}
          name="payment"
          value={method.id}
          checked={value === method.id}
          onChange={onChange}
          disabled={method.id === 'cod' && codDisabled}
          title={method.title}
          description={
            method.id === 'cod' && codDisabled
              ? 'Not available on orders above ₹15,000.'
              : method.description
          }
        />
      ))}
    </fieldset>
  )
}

export default DeliverySelector
