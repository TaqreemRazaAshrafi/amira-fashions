import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { calculateTotals } from '../../services/cartService'
import { useCartStore } from '../../store/cartStore'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import { EmptyState } from '../../components/common/States'
import PageHero from '../../components/layout/PageHero'
import CartLineItem from '../../components/cart/CartLineItem'
import CartSummary from '../../components/cart/CartSummary'
import FreeShippingMeter from '../../components/cart/FreeShippingMeter'

/** The full bag: line items on the left, a sticky order summary on the right. */
export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const deliveryId = useCartStore((state) => state.deliveryId)
  const clear = useCartStore((state) => state.clear)
  const totals = useMemo(() => calculateTotals(items, deliveryId), [items, deliveryId])

  return (
    <>
      <Seo
        title="Shopping bag"
        description="Review the pieces in your Amira Fashions bag before checkout."
        canonicalPath={ROUTES.cart}
        noIndex
      />

      <PageHero
        eyebrow="Your selection"
        title="Shopping bag"
        breadcrumbs={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Bag', to: ROUTES.cart },
        ]}
      />

      <div className="shell pb-section">
        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is empty"
            description="Nothing here yet. The Friday edit is a good place to start."
            action={
              <Button to={ROUTES.collection('new-arrivals')} variant="outline">
                Shop new arrivals
              </Button>
            }
          />
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            <section aria-label="Bag contents">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h2 className="text-fluid-xs uppercase tracking-luxe">
                  {totals.itemCount} item{totals.itemCount === 1 ? '' : 's'}
                </h2>
                <button
                  type="button"
                  onClick={clear}
                  className="text-fluid-xs text-muted underline-offset-4 transition-colors hover:text-danger hover:underline"
                >
                  Empty bag
                </button>
              </div>

              <ul className="divide-y divide-line">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartLineItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </ul>

              <Link
                to={ROUTES.shop}
                className="group mt-8 inline-flex items-center gap-2 text-fluid-xs uppercase tracking-luxe transition-colors hover:text-accent"
              >
                <ArrowLeft
                  className="h-4 w-4 transition-transform duration-400 ease-luxe group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                Continue shopping
              </Link>
            </section>

            <aside aria-label="Order summary">
              <div className="sticky top-[calc(var(--nav-height)+1.5rem)] border border-line bg-surface p-6 sm:p-8">
                <h2 className="text-fluid-xs uppercase tracking-luxe">Order summary</h2>
                <FreeShippingMeter totals={totals} className="mt-6" />
                <CartSummary totals={totals} className="mt-6" />

                <Button
                  to={ROUTES.checkout}
                  size="lg"
                  fullWidth
                  magnetic={false}
                  className="mt-8"
                >
                  Proceed to checkout
                </Button>

                <p className="mt-4 text-center text-fluid-xs text-muted">
                  Secure checkout · Easy 7-day returns
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
