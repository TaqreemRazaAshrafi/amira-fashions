import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { SITE } from '../../constants/site'
import { useAuthStore } from '../../store/authStore'
import { useUserStore } from '../../store/userStore'
import { useOrderStore } from '../../store/orderStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { useCartStore } from '../../store/cartStore'
import { useSearchStore } from '../../store/searchStore'
import { useUIStore } from '../../store/uiStore'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import AccountLayout from '../../components/account/AccountLayout'

/**
 * Settings.
 *
 * "Clear local data" wipes everything this browser holds — bag, wishlist,
 * addresses, order cache and recent searches — and signs out. It is destructive
 * and irreversible on this device, so it is confirmed in a dialog and says
 * exactly what it removes rather than hiding behind a vague label.
 */
export default function SettingsPage() {
  const navigate = useNavigate()
  const [isConfirming, setIsConfirming] = useState(false)

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const clearUser = useUserStore((state) => state.clear)
  const clearOrders = useOrderStore((state) => state.clear)
  const clearWishlist = useWishlistStore((state) => state.clear)
  const clearCart = useCartStore((state) => state.clear)
  const clearSearches = useSearchStore((state) => state.clearRecent)
  const toast = useUIStore((state) => state.toast)

  const clearEverything = async () => {
    clearCart()
    clearWishlist()
    clearOrders()
    clearSearches()
    clearUser()
    await logout()
    setIsConfirming(false)
    toast({ title: 'Local data cleared', variant: 'default' })
    navigate(ROUTES.home)
  }

  return (
    <AccountLayout
      title="Settings"
      description="Manage your Amira Fashions account settings."
      canonicalPath={ROUTES.accountSettings}
    >
      <h2 className="text-fluid-xl">Settings</h2>

      <section className="mt-10 max-w-2xl border-t border-line pt-8">
        <h3 className="text-fluid-lg">Region</h3>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-fluid-xs uppercase tracking-luxe text-muted">Country</dt>
            <dd className="mt-1 text-fluid-base">India</dd>
          </div>
          <div>
            <dt className="text-fluid-xs uppercase tracking-luxe text-muted">Currency</dt>
            <dd className="mt-1 text-fluid-base">
              {SITE.currency} ({SITE.currencySymbol})
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-fluid-xs leading-relaxed text-muted">
          We currently ship within India only. International delivery is coming.
        </p>
      </section>

      <section className="mt-10 max-w-2xl border-t border-line pt-8">
        <h3 className="text-fluid-lg">Account</h3>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-fluid-xs uppercase tracking-luxe text-muted">Signed in as</dt>
            <dd className="mt-1 break-words text-fluid-base">{user?.email ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-fluid-xs uppercase tracking-luxe text-muted">Password</dt>
            <dd className="mt-1">
              <Button to={ROUTES.forgotPassword} variant="quiet" size="sm" magnetic={false}>
                Change password
              </Button>
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10 max-w-2xl border-t border-line pt-8">
        <h3 className="text-fluid-lg">Local data</h3>
        <p className="mt-3 text-fluid-sm leading-relaxed text-muted">
          Your bag, wishlist, saved addresses, order history and recent searches are stored in this
          browser. Clearing them signs you out and cannot be undone on this device.
        </p>
        <div className="mt-6">
          <Button
            variant="quiet"
            magnetic={false}
            icon={AlertTriangle}
            iconPosition="left"
            onClick={() => setIsConfirming(true)}
          >
            Clear local data
          </Button>
        </div>
      </section>

      <Modal
        open={isConfirming}
        onClose={() => setIsConfirming(false)}
        title="Clear local data"
        size="sm"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-fluid-xl">Clear local data?</h3>
          <p className="mt-4 text-fluid-sm leading-relaxed text-muted">
            This removes your bag, wishlist, saved addresses, payment shortcuts, order history and
            recent searches from this browser, and signs you out. It cannot be undone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="quiet" magnetic={false} onClick={() => setIsConfirming(false)}>
              Keep my data
            </Button>
            <Button magnetic={false} onClick={clearEverything}>
              Clear everything
            </Button>
          </div>
        </div>
      </Modal>
    </AccountLayout>
  )
}
