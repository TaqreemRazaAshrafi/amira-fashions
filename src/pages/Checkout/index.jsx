import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, MapPin, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { COD_LIMIT } from '../../data/support'
import { formatPrice } from '../../utils/format'
import { calculateTotals } from '../../services/cartService'
import orderService from '../../services/orderService'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { useUserStore } from '../../store/userStore'
import { useOrderStore } from '../../store/orderStore'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import { TextField } from '../../components/common/Field'
import Redirect from '../../components/common/Redirect'
import PageHero from '../../components/layout/PageHero'
import AddressForm, { formatAddress } from '../../components/account/AddressForm'
import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import OrderSummary from '../../components/checkout/OrderSummary'
import OrderConfirmation from '../../components/checkout/OrderConfirmation'
import { DeliverySelector, PaymentSelector } from '../../components/checkout/OptionCards'
import { OrderLineItem } from '../../components/account/OrderCard'

const STEPS = [
  { id: 'address', label: 'Address' },
  { id: 'review', label: 'Review' },
  { id: 'payment', label: 'Payment' },
]

/** Section heading shared by the three steps. */
function StepHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-fluid-xl">{title}</h2>
        {description && <p className="mt-2 text-fluid-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/**
 * Checkout — address, review, payment, confirmation.
 *
 * The steps are component state rather than routes: a half-completed checkout is
 * not something to link to or restore from history, and keeping it in one mount
 * means the back button leaves the flow instead of stepping through it.
 *
 * Payment is delegated to `orderService.place`, which drives the
 * gateway-agnostic `paymentService`. No key, amount or signature is ever trusted
 * from this component — the server recomputes the amount and verifies the
 * signature before capturing.
 */
export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const deliveryId = useCartStore((state) => state.deliveryId)
  const setDelivery = useCartStore((state) => state.setDelivery)
  const coupon = useCartStore((state) => state.coupon)
  const clearCart = useCartStore((state) => state.clear)

  const user = useAuthStore((state) => state.user)
  const savedAddresses = useUserStore((state) => state.addresses)
  const addAddress = useUserStore((state) => state.addAddress)
  const recordOrder = useOrderStore((state) => state.add)

  const totals = useMemo(
    () => calculateTotals(items, deliveryId, coupon),
    [items, deliveryId, coupon]
  )
  const codDisabled = totals.total > COD_LIMIT

  const [step, setStep] = useState(0)
  const [address, setAddress] = useState(null)
  // Start on the form only when there is nothing saved to pick from.
  const [isAddingAddress, setIsAddingAddress] = useState(savedAddresses.length === 0)
  const [selectedAddressId, setSelectedAddressId] = useState(
    () => savedAddresses.find((entry) => entry.isDefault)?.id ?? savedAddresses[0]?.id ?? null
  )

  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [order, setOrder] = useState(null)
  const [isPlacing, setIsPlacing] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  /**
   * Guests still need somewhere to send the receipt and the tracking link, so
   * the email is collected here rather than forcing an account first — an
   * account requirement at checkout is where carts go to die.
   */
  const [guestEmail, setGuestEmail] = useState('')
  const [guestEmailError, setGuestEmailError] = useState(null)
  const email = user?.email ?? guestEmail.trim()

  const chosenAddress = address ?? savedAddresses.find((entry) => entry.id === selectedAddressId)

  /** @returns {boolean} whether the contact email is usable. */
  const validateEmail = () => {
    if (user?.email) return true
    if (!/^\S+@\S+\.\S+$/.test(guestEmail.trim())) {
      setGuestEmailError('Enter an email so we can send your receipt and tracking link.')
      return false
    }
    setGuestEmailError(null)
    return true
  }

  const advanceToReview = () => {
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToReview = () => {
    if (!chosenAddress || !validateEmail()) return
    advanceToReview()
  }

  /** New address from the form: saved to the book, then used for this order. */
  const handleNewAddress = async (values) => {
    if (!validateEmail()) return
    const saved = await addAddress(values)
    setAddress(saved)
    setSelectedAddressId(saved.id)
    setIsAddingAddress(false)
    advanceToReview()
  }

  const placeOrder = async () => {
    if (!chosenAddress) {
      setStep(0)
      return
    }
    setSubmitError(null)
    setIsPlacing(true)
    try {
      const placed = await orderService.place({
        items,
        customer: { name: chosenAddress.name, email, phone: chosenAddress.phone },
        address: chosenAddress,
        delivery: deliveryId,
        totals,
        coupon,
        paymentMethod: codDisabled && paymentMethod === 'cod' ? 'upi' : paymentMethod,
      })
      // Recorded before the bag is cleared so a failure here cannot lose the order.
      recordOrder(placed)
      setOrder(placed)
      clearCart()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setSubmitError(
        error?.message ??
          'We could not complete your payment. No money has been taken — please try again.'
      )
    } finally {
      setIsPlacing(false)
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
            <CheckoutSteps
              steps={STEPS}
              current={step}
              onSelect={setStep}
              className="mb-12 border-b border-line pb-8"
            />

            <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
              <div className="min-w-0">
                {/* ------------------------- 1. Address ------------------------- */}
                {step === 0 && (
                  <section aria-label="Delivery address">
                    {!user?.email && (
                      <div className="mb-10 border-b border-line pb-10">
                        <h2 className="text-fluid-xl">Contact</h2>
                        <p className="mt-2 text-fluid-sm text-muted">
                          For your receipt and delivery updates.
                        </p>
                        <TextField
                          label="Email"
                          type="email"
                          required
                          autoComplete="email"
                          inputMode="email"
                          className="mt-6 max-w-md"
                          value={guestEmail}
                          error={guestEmailError}
                          onChange={(event) => {
                            setGuestEmail(event.target.value)
                            setGuestEmailError(null)
                          }}
                        />
                        <p className="mt-4 text-fluid-xs text-muted">
                          Have an account?{' '}
                          <Link
                            to={ROUTES.login}
                            state={{ from: ROUTES.checkout }}
                            className="text-text underline underline-offset-4 hover:decoration-accent"
                          >
                            Sign in
                          </Link>{' '}
                          to use your saved addresses.
                        </p>
                      </div>
                    )}

                    <StepHeader
                      title="Delivery address"
                      description="Where should we send this order?"
                      action={
                        savedAddresses.length > 0 && (
                          <Button
                            variant="quiet"
                            size="sm"
                            magnetic={false}
                            icon={isAddingAddress ? undefined : Plus}
                            iconPosition="left"
                            onClick={() => setIsAddingAddress((value) => !value)}
                          >
                            {isAddingAddress ? 'Use a saved address' : 'Add new address'}
                          </Button>
                        )
                      }
                    />

                    {!isAddingAddress && savedAddresses.length > 0 && (
                      <>
                        <fieldset className="flex flex-col gap-3">
                          <legend className="sr-only">Choose a saved address</legend>
                          {savedAddresses.map((entry) => (
                            <label
                              key={entry.id}
                              className={cn(
                                'flex cursor-pointer items-start gap-4 border p-5 transition-colors duration-250',
                                selectedAddressId === entry.id
                                  ? 'border-text bg-surface'
                                  : 'border-line hover:border-text/40'
                              )}
                            >
                              <input
                                type="radio"
                                name="address"
                                value={entry.id}
                                checked={selectedAddressId === entry.id}
                                onChange={() => {
                                  setSelectedAddressId(entry.id)
                                  setAddress(null)
                                }}
                                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[rgb(var(--color-accent))]"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-baseline gap-2">
                                  <span className="text-fluid-sm">{entry.name}</span>
                                  {entry.label && (
                                    <span className="text-fluid-xs uppercase tracking-wide text-muted">
                                      {entry.label}
                                    </span>
                                  )}
                                </span>
                                <span className="mt-1 block text-fluid-xs leading-relaxed text-muted">
                                  {formatAddress(entry)}
                                </span>
                                <span className="mt-1 block text-fluid-xs text-muted">
                                  {entry.phone}
                                </span>
                              </span>
                            </label>
                          ))}
                        </fieldset>

                        <Button
                          size="lg"
                          fullWidth
                          magnetic={false}
                          className="mt-8"
                          disabled={!chosenAddress}
                          onClick={goToReview}
                        >
                          Continue to review
                        </Button>
                      </>
                    )}

                    {(isAddingAddress || savedAddresses.length === 0) && (
                      <AddressForm
                        defaultValues={{ name: user?.name ?? '', phone: user?.phone ?? '' }}
                        onSubmit={handleNewAddress}
                        onCancel={
                          savedAddresses.length > 0 ? () => setIsAddingAddress(false) : undefined
                        }
                        submitLabel="Save and continue"
                      />
                    )}
                  </section>
                )}

                {/* ------------------------- 2. Review -------------------------- */}
                {step === 1 && (
                  <section aria-label="Order review">
                    <StepHeader
                      title="Review your order"
                      description="Check the pieces and the address before you pay."
                    />

                    <div className="border border-line bg-surface p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <MapPin
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                            aria-hidden="true"
                          />
                          <div>
                            <p className="text-fluid-sm">{chosenAddress?.name}</p>
                            <p className="mt-1 text-fluid-xs leading-relaxed text-muted">
                              {chosenAddress ? formatAddress(chosenAddress) : ''}
                            </p>
                            <p className="mt-1 text-fluid-xs text-muted">{chosenAddress?.phone}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep(0)}
                          className="shrink-0 text-fluid-xs underline underline-offset-4 transition-colors duration-250 hover:text-accent"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-10 text-fluid-lg">Items</h3>
                    <ul className="mt-4 border-t border-line">
                      {items.map((item) => (
                        <OrderLineItem key={item.id} item={item} />
                      ))}
                    </ul>

                    <h3 className="mt-10 text-fluid-lg">Delivery method</h3>
                    <DeliverySelector
                      value={deliveryId}
                      onChange={setDelivery}
                      subtotal={totals.subtotal}
                      className="mt-4"
                    />

                    <div className="mt-10 flex flex-wrap items-center gap-3">
                      <Button
                        size="lg"
                        magnetic={false}
                        onClick={() => {
                          setStep(2)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        Continue to payment
                      </Button>
                      <Button variant="quiet" size="lg" magnetic={false} to={ROUTES.cart}>
                        Back to bag
                      </Button>
                    </div>
                  </section>
                )}

                {/* ------------------------- 3. Payment ------------------------- */}
                {step === 2 && (
                  <section aria-label="Payment">
                    <StepHeader
                      title="Payment"
                      description={`You will be charged ${formatPrice(totals.total)}.`}
                    />

                    <PaymentSelector
                      value={codDisabled && paymentMethod === 'cod' ? 'upi' : paymentMethod}
                      onChange={setPaymentMethod}
                      codDisabled={codDisabled}
                    />

                    {submitError && (
                      <p role="alert" className="mt-6 text-fluid-sm text-danger">
                        {submitError}
                      </p>
                    )}

                    <Button
                      size="lg"
                      fullWidth
                      magnetic={false}
                      isLoading={isPlacing}
                      className="mt-8"
                      onClick={placeOrder}
                    >
                      {isPlacing ? 'Processing' : `Place order · ${formatPrice(totals.total)}`}
                    </Button>

                    <p className="mt-4 flex items-center justify-center gap-2 text-center text-fluid-xs text-muted">
                      <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.4} aria-hidden="true" />
                      Payments are processed on our gateway&rsquo;s secure servers. Card details
                      never reach Amira.
                    </p>
                  </section>
                )}
              </div>

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
