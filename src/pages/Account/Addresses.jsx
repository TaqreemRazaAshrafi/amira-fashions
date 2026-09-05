import { useState } from 'react'
import { MapPin, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { useUserStore } from '../../store/userStore'
import { useUIStore } from '../../store/uiStore'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { EmptyState } from '../../components/common/States'
import AccountLayout from '../../components/account/AccountLayout'
import AddressForm, { formatAddress } from '../../components/account/AddressForm'

/**
 * The address book.
 *
 * Exactly one address is always the default: adding the first one promotes it,
 * and deleting the default promotes the next. That invariant lives in the store,
 * so checkout can rely on `defaultAddress()` never being wrong.
 */
export default function AddressesPage() {
  const addresses = useUserStore((state) => state.addresses)
  const addAddress = useUserStore((state) => state.addAddress)
  const updateAddress = useUserStore((state) => state.updateAddress)
  const removeAddress = useUserStore((state) => state.removeAddress)
  const setDefaultAddress = useUserStore((state) => state.setDefaultAddress)
  const toast = useUIStore((state) => state.toast)

  // `null` = closed, `'new'` = adding, otherwise the id being edited.
  const [editing, setEditing] = useState(null)

  const current = typeof editing === 'string' && editing !== 'new'
    ? addresses.find((a) => a.id === editing)
    : null

  const close = () => setEditing(null)

  const handleSubmit = async (values) => {
    if (current) {
      await updateAddress(current.id, values)
      toast({ title: 'Address updated', variant: 'success' })
    } else {
      await addAddress(values)
      toast({ title: 'Address saved', variant: 'success' })
    }
    close()
  }

  const handleDelete = async (address) => {
    await removeAddress(address.id)
    toast({ title: 'Address removed', variant: 'default' })
  }

  return (
    <AccountLayout
      title="Addresses"
      description="Manage your saved delivery addresses."
      canonicalPath={ROUTES.accountAddresses}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-fluid-xl">Addresses</h2>
          <p className="mt-3 max-w-prose text-fluid-sm leading-relaxed text-muted">
            Saved addresses appear at checkout, so you only type them once.
          </p>
        </div>
        <Button icon={Plus} iconPosition="left" magnetic={false} onClick={() => setEditing('new')}>
          Add address
        </Button>
      </div>

      <div className="mt-10">
        {addresses.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No addresses saved"
            description="Add one now and checkout becomes a two-tap affair."
            action={
              <Button variant="outline" onClick={() => setEditing('new')}>
                Add your first address
              </Button>
            }
            className="py-16"
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <li key={address.id}>
                <article
                  className={cn(
                    'flex h-full flex-col justify-between gap-6 border bg-surface p-6 transition-colors duration-250',
                    address.isDefault ? 'border-text' : 'border-line'
                  )}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-fluid-xs uppercase tracking-luxe text-muted">
                        {address.label || 'Address'}
                      </p>
                      {address.isDefault && (
                        <span className="border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-luxe text-accent">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-fluid-base">{address.name}</p>
                    <p className="mt-1 text-fluid-sm leading-relaxed text-muted">
                      {formatAddress(address)}
                    </p>
                    <p className="mt-1 text-fluid-sm text-muted">{address.phone}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-fluid-xs">
                    <button
                      type="button"
                      onClick={() => setEditing(address.id)}
                      className="underline underline-offset-4 transition-colors duration-250 hover:text-accent"
                    >
                      Edit
                    </button>
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(address.id)}
                        className="text-muted underline underline-offset-4 transition-colors duration-250 hover:text-text"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(address)}
                      className="ml-auto text-danger underline underline-offset-4 transition-opacity duration-250 hover:opacity-70"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={editing !== null}
        onClose={close}
        title={current ? 'Edit address' : 'Add a new address'}
        size="lg"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-fluid-xl">{current ? 'Edit address' : 'Add a new address'}</h3>
          <AddressForm
            className="mt-8"
            defaultValues={current ?? undefined}
            onSubmit={handleSubmit}
            onCancel={close}
            submitLabel={current ? 'Save changes' : 'Save address'}
          />
        </div>
      </Modal>
    </AccountLayout>
  )
}
