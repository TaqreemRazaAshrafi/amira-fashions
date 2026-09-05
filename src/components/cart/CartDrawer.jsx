import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { calculateTotals } from '../../services/cartService'
import { useCartStore } from '../../store/cartStore'
import { useUIStore } from '../../store/uiStore'
import Button from '../common/Button'
import Drawer from '../common/Drawer'
import { EmptyState } from '../common/States'
import CartLineItem from './CartLineItem'
import CartSummary from './CartSummary'
import FreeShippingMeter from './FreeShippingMeter'

/**
 * Slide-out bag.
 *
 * Totals are derived with useMemo from the two pieces of store state they
 * depend on — selecting a computed object straight out of Zustand would return
 * a new reference on every render.
 */
export function CartDrawer() {
  const isOpen = useUIStore((state) => state.isCartOpen)
  const close = useUIStore((state) => state.closeCart)

  const items = useCartStore((state) => state.items)
  const deliveryId = useCartStore((state) => state.deliveryId)
  const coupon = useCartStore((state) => state.coupon)
  // Same maths as the cart page, coupon included — the drawer and the page must
  // never quote different totals for the same bag.
  const totals = useMemo(
    () => calculateTotals(items, deliveryId, coupon),
    [items, deliveryId, coupon]
  )

  const isEmpty = items.length === 0

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      side="right"
      title="Shopping bag"
      description={isEmpty ? undefined : `${totals.itemCount} item${totals.itemCount === 1 ? '' : 's'}`}
      footer={
        isEmpty ? null : (
          <div className="flex flex-col gap-5">
            <FreeShippingMeter totals={totals} />
            <CartSummary totals={totals} />
            <div className="flex flex-col gap-2">
              <Button to={ROUTES.checkout} onClick={close} size="lg" fullWidth magnetic={false}>
                Checkout
              </Button>
              <Button
                to={ROUTES.cart}
                onClick={close}
                variant="quiet"
                size="md"
                fullWidth
                magnetic={false}
              >
                View bag
              </Button>
            </div>
          </div>
        )
      }
    >
      {isEmpty ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Nothing here yet. The new edit is a good place to start."
          action={
            <Button to={ROUTES.collection('new-arrivals')} onClick={close} variant="outline">
              Shop new arrivals
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-line px-6">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <CartLineItem key={item.id} item={item} compact onNavigate={close} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  )
}

export default CartDrawer
