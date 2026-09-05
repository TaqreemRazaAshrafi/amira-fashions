import { useState } from 'react'
import { CreditCard, Plus, ShieldCheck } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { useUserStore } from '../../store/userStore'
import { useUIStore } from '../../store/uiStore'
import { paymentMethods as gatewayMethods } from '../../data/support'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { EmptyState } from '../../components/common/States'
import { SelectField, TextField } from '../../components/common/Field'
import AccountLayout from '../../components/account/AccountLayout'

/**
 * Saved payment methods.
 *
 * This screen stores display metadata only — a label, the card brand and the
 * last four digits typed by the shopper for their own recognition. Full card
 * numbers, expiry dates and CVVs are never accepted, stored or transmitted by
 * this application: the gateway's hosted checkout collects them directly, which
 * is what keeps this app out of PCI scope.
 */
const TYPE_OPTIONS = [
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'wallet', label: 'Wallet' },
]

export default function PaymentMethodsPage() {
  const methods = useUserStore((state) => state.paymentMethods)
  const addPaymentMethod = useUserStore((state) => state.addPaymentMethod)
  const removePaymentMethod = useUserStore((state) => state.removePaymentMethod)
  const setDefaultPaymentMethod = useUserStore((state) => state.setDefaultPaymentMethod)
  const toast = useUIStore((state) => state.toast)

  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ type: 'card', label: '', hint: '' })

  const submit = (event) => {
    event.preventDefault()
    if (!form.label.trim()) return
    addPaymentMethod({
      type: form.type,
      label: form.label.trim(),
      // Kept deliberately short: a UPI handle or the last four digits, nothing more.
      hint: form.hint.trim().slice(0, 12),
    })
    toast({ title: 'Payment method saved', variant: 'success' })
    setForm({ type: 'card', label: '', hint: '' })
    setIsOpen(false)
  }

  return (
    <AccountLayout
      title="Payment Methods"
      description="Manage the payment methods shown at checkout."
      canonicalPath={ROUTES.accountPayments}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-fluid-xl">Payment Methods</h2>
          <p className="mt-3 max-w-prose text-fluid-sm leading-relaxed text-muted">
            Shortcuts for checkout. We store a label only — never a card number.
          </p>
        </div>
        <Button icon={Plus} iconPosition="left" magnetic={false} onClick={() => setIsOpen(true)}>
          Add method
        </Button>
      </div>

      <div className="mt-6 flex items-start gap-3 border border-line bg-surface-alt p-4 text-fluid-xs leading-relaxed text-muted">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
        <p>
          Card details are entered on our payment gateway&rsquo;s own secure page and never touch
          Amira&rsquo;s servers or this browser&rsquo;s storage.
        </p>
      </div>

      <div className="mt-10">
        {methods.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No saved methods"
            description="Add a shortcut so checkout remembers how you prefer to pay."
            action={
              <Button variant="outline" onClick={() => setIsOpen(true)}>
                Add a method
              </Button>
            }
            className="py-16"
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {methods.map((method) => (
              <li key={method.id}>
                <article
                  className={cn(
                    'flex h-full flex-col justify-between gap-6 border bg-surface p-6',
                    method.isDefault ? 'border-text' : 'border-line'
                  )}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-accent" aria-hidden="true" />
                      <p className="text-fluid-xs uppercase tracking-luxe text-muted">
                        {method.type}
                      </p>
                      {method.isDefault && (
                        <span className="ml-auto border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-luxe text-accent">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-fluid-base">{method.label}</p>
                    {method.hint && <p className="mt-1 text-fluid-sm text-muted">{method.hint}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-fluid-xs">
                    {!method.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        className="text-muted underline underline-offset-4 transition-colors duration-250 hover:text-text"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removePaymentMethod(method.id)}
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

      <section className="mt-14 border-t border-line pt-10">
        <h3 className="text-fluid-lg">Accepted at checkout</h3>
        <ul className="mt-5 flex flex-wrap gap-3">
          {gatewayMethods.map((method) => (
            <li
              key={method.id}
              className="border border-line px-4 py-2 text-fluid-xs uppercase tracking-wide text-muted"
            >
              {method.label}
            </li>
          ))}
        </ul>
      </section>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Add a payment method" size="md">
        <form onSubmit={submit} className="flex flex-col gap-6 p-6 sm:p-8">
          <h3 className="text-fluid-xl">Add a payment method</h3>

          <SelectField
            label="Type"
            options={TYPE_OPTIONS}
            value={form.type}
            onChange={(event) => setForm((f) => ({ ...f, type: event.target.value }))}
          />

          <TextField
            label="Label"
            required
            placeholder="HDFC Debit"
            value={form.label}
            onChange={(event) => setForm((f) => ({ ...f, label: event.target.value }))}
          />

          <TextField
            label="Reminder"
            hint="A UPI handle or the last four digits — never the full number"
            placeholder="•••• 4291"
            maxLength={12}
            value={form.hint}
            onChange={(event) => setForm((f) => ({ ...f, hint: event.target.value }))}
          />

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" magnetic={false}>
              Save method
            </Button>
            <Button
              type="button"
              variant="quiet"
              magnetic={false}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </AccountLayout>
  )
}
