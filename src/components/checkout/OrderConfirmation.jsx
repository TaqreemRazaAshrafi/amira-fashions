import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { formatDate, formatPrice } from '../../utils/format'
import Button from '../common/Button'

/** Post-purchase screen. Shown in place of the form once an order succeeds. */
export function OrderConfirmation({ order }) {
  const rows = [
    { label: 'Order number', value: order.id },
    { label: 'Total', value: formatPrice(order.totals.total) },
    {
      label: 'Payment',
      value: order.payment?.method === 'cod' ? 'Cash on delivery' : 'Paid online',
    },
    { label: 'Estimated delivery', value: formatDate(order.estimatedDelivery) },
  ]

  return (
    <div className="mx-auto max-w-2xl py-16 text-center sm:py-24">
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-text text-background"
      >
        <Check className="h-7 w-7" strokeWidth={1.4} aria-hidden="true" />
      </motion.span>

      <p className="eyebrow mb-4">Order placed successfully</p>
      <h1 className="text-fluid-2xl">Thank you — your order is confirmed.</h1>
      <p className="mx-auto mt-4 max-w-prose text-fluid-sm leading-relaxed text-muted">
        {order.customer?.email
          ? `A confirmation is on its way to ${order.customer.email}.`
          : 'A confirmation is on its way.'}{' '}
        We pack and dispatch within two business days, and you will get a tracking link the moment
        it leaves the studio.
      </p>

      <dl className="mx-auto mt-12 grid max-w-md gap-px border-y border-line text-left">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-4">
            <dt className="text-fluid-xs uppercase tracking-wide text-muted">{row.label}</dt>
            <dd className="text-fluid-sm tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button to={ROUTES.order(order.id)} size="lg">
          View order
        </Button>
        <Button to={ROUTES.shop} variant="outline" size="lg">
          Continue shopping
        </Button>
      </div>
    </div>
  )
}

export default OrderConfirmation
