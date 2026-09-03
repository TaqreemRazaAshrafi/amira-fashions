import { PackageCheck, RefreshCcw, Scissors, Truck } from 'lucide-react'
import Marquee from '../common/Marquee'
import { Stagger, StaggerItem } from '../animations/Stagger'

const PROMISES = [
  {
    icon: Scissors,
    title: 'Cut in small runs',
    body: 'Forty to eighty pieces per style. When a size closes, it closes.',
  },
  {
    icon: Truck,
    title: 'Free shipping above ₹2,999',
    body: 'Dispatched in two business days, everywhere in India.',
  },
  {
    icon: RefreshCcw,
    title: 'Easy 7-day returns',
    body: 'Unworn, tags intact, free pickup in serviceable pincodes.',
  },
  {
    icon: PackageCheck,
    title: 'Woven, not printed',
    body: 'Every zari border in the ethnic line comes off the loom.',
  },
]

const MARQUEE_ITEMS = [
  'Limited edits',
  'Handwork from Varanasi, Lucknow & Kutch',
  'Made in India',
  'New drops every Friday',
  'Since 2021',
]

/** Trust band: a running strip of brand lines above four short promises. */
export function BrandPromise() {
  return (
    <section aria-label="Why Amira" className="border-y border-line bg-surface">
      <Marquee
        items={MARQUEE_ITEMS}
        className="border-b border-line py-4 text-fluid-xs uppercase tracking-luxe text-muted"
      />

      <div className="shell py-12 sm:py-16">
        <Stagger as="ul" stagger={0.08} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <StaggerItem as="li" key={title} className="flex gap-4">
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                strokeWidth={1.3}
                aria-hidden="true"
              />
              <div>
                <h3 className="font-sans text-fluid-xs uppercase tracking-wide">{title}</h3>
                <p className="mt-2 text-fluid-xs leading-relaxed text-muted">{body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export default BrandPromise
