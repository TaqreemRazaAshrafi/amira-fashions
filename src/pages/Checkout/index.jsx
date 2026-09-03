import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { calculateTotals } from '../../services/cartService'
import orderService from '../../services/orderService'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import { TextField } from '../../components/common/Field'
import Redirect from '../../components/common/Redirect'
import PageHero from '../../components/layout/PageHero'
import OrderSummary from '../../components/checkout/OrderSummary'
import OrderConfirmation from '../../components/checkout/OrderConfirmation'
import { DeliverySelector, PaymentSelector } from '../../components/checkout/OptionCards'

const COD_LIMIT = 15000

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.string().min(1, 'We need an email for the receipt.').email('That email does not look right.'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number.'),
  address: z.string().min(8, 'Please enter the full street address.'),
  city: z.string().min(2, 'Please enter your city.'),
  state: z.string().min(2, 'Please enter your state.'),
  pincode: z.string().regex(/^\d{6}$/, 'A pincode is six digits.'),
  notes: z.string().optional(),
})

/** One section of the form, numbered so progress is legible at a glance. */
function Fieldset({ step, title, description, children }) {
  return (
    <fieldset className="border-t border-line pt-8">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-baseline gap-4">
        <span aria-hidden="true" className="font-display text-fluid-lg text-accent">
          {String(step).padStart(2, '0')}
        </span>
        <div>
          <h2 className="text-fluid-lg">{title}</h2>
          {description && <p className="mt-1 text-fluid-xs text-muted">{description}</p>}
        </div>
      </div>
      {children}
    </fieldset>
  )
}

/**
 * Checkout.
 *
 * Single page, four numbered sections — customer, address, delivery, payment.
 * Payment is delegated to `orderService.place`, which drives the gateway-agnostic
 * `paymentService`; no key, amount or signature is ever trusted from here.
 */
export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const deliveryId = useCartStore((state) => state.deliveryId)
  const setDelivery = useCartStore((state) => state.setDelivery)
  const clearCart = useCartStore((state) => state.clear)
  const user = useAuthStore((state) => state.user)

  const totals = useMemo(() => calculateTotals(items, deliveryId), [items, deliveryId])
  const codDisabled = totals.total > COD_LIMIT

  const [paymentMethod, setPaymentMethod] = useState('online')
  const [order, setOrder] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      notes: '',
    },
  })

  const onSubmit = async (values) => {
    setSubmitError(null)
    try {
      const placed = await orderService.place({
        items,
        customer: { name: values.name, email: values.email, phone: values.phone },
        address: {
          line1: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
          notes: values.notes,
        },
        delivery: deliveryId,
        totals,
        paymentMethod: codDisabled ? 'online' : paymentMethod,
      })
      setOrder(placed)
      clearCart()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setSubmitError(
        error?.message ?? 'We could not complete your payment. No money has been taken — please try again.'
      )
    }
  }

  // An empty bag with no completed order means the visitor arrived by URL.
  if (!order && items.length === 0) return <Redirect to={ROUTES.cart} />

  return (
    <>
      <Seo
        title="Checkout"
        description="Complete your Amira Fashions order."
        canonicalPath={ROUTES.checkout}
        noIndex
      />

      {order ? (
        <div className="shell">
          <OrderConfirmation order={order} />
        </div>
      ) : (
        <>
          <PageHero
            eyebrow="Almost there"
            title="Checkout"
            breadcrumbs={[
              { label: 'Bag', to: ROUTES.cart },
              { label: 'Checkout', to: ROUTES.checkout },
            ]}
          />

          <div className="shell pb-section">
            <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
              <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
                <Fieldset step={1} title="Customer information" description="For your receipt and delivery updates.">
                  <div className="grid gap-7 sm:grid-cols-2">
                    <TextField
                      label="Full name"
                      required
                      autoComplete="name"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <TextField
                      label="Email"
                      type="email"
                      required
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                    <TextField
                      label="Phone"
                      type="tel"
                      required
                      inputMode="numeric"
                      autoComplete="tel-national"
                      hint="10-digit Indian mobile number"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </div>
                </Fieldset>

                <Fieldset step={2} title="Delivery address">
                  <div className="grid gap-7 sm:grid-cols-2">
                    <TextField
                      label="Address"
                      required
                      autoComplete="street-address"
                      className="sm:col-span-2"
                      error={errors.address?.message}
                      {...register('address')}
                    />
                    <TextField
                      label="City"
                      required
                      autoComplete="address-level2"
                      error={errors.city?.message}
                      {...register('city')}
                    />
                    <TextField
                      label="State"
                      required
                      autoComplete="address-level1"
                      error={errors.state?.message}
                      {...register('state')}
                    />
                    <TextField
                      label="Pincode"
                      required
                      inputMode="numeric"
                      autoComplete="postal-code"
                      error={errors.pincode?.message}
                      {...register('pincode')}
                    />
                    <TextField
                      label="Delivery notes"
                      hint="Optional — landmark, preferred time"
                      error={errors.notes?.message}
                      {...register('notes')}
                    />
                  </div>
                </Fieldset>

                <Fieldset step={3} title="Delivery method">
                  <DeliverySelector
                    value={deliveryId}
                    onChange={setDelivery}
                    subtotal={totals.subtotal}
                  />
                </Fieldset>

                <Fieldset step={4} title="Payment">
                  <PaymentSelector
                    value={codDisabled ? 'online' : paymentMethod}
                    onChange={setPaymentMethod}
                    codDisabled={codDisabled}
                  />

                  {submitError && (
                    <p role="alert" className="mt-5 text-fluid-sm text-danger">
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    magnetic={false}
                    isLoading={isSubmitting}
                    className="mt-8"
                  >
                    {isSubmitting ? 'Processing' : 'Place order'}
                  </Button>

                  <p className="mt-4 flex items-center justify-center gap-2 text-fluid-xs text-muted">
                    <Lock className="h-3.5 w-3.5" strokeWidth={1.4} aria-hidden="true" />
                    Payments are processed on our gateway&rsquo;s secure servers.
                  </p>
                </Fieldset>
              </form>

              <aside aria-label="Order summary">
                <OrderSummary
                  items={items}
                  totals={totals}
                  className="lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)]"
                />
              </aside>
            </div>
          </div>
        </>
      )}
    </>
  )
}
