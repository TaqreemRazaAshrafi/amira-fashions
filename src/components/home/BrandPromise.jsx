import { Headphones, RefreshCcw, ScissorsIcon, ShieldCheck, Truck } from 'lucide-react'
import Marquee from '../common/Marquee'
import { Stagger, StaggerItem } from '../animations/Stagger'

const PROMISES = [
  {
    icon: ScissorsIcon,
    title: 'Premium quality',
    body: 'Cut in runs of forty to eighty, from cloth we buy by the roll.',
  },
  {
    icon: Truck,
    title: 'Fast delivery',
    body: 'Dispatched in two business days. Free above ₹2,999, everywhere in India.',
  },
  {
    icon: RefreshCcw,
    title: 'Easy returns',
    body: 'Seven days, unworn with tags. Free pickup in serviceable pincodes.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure payments',
    body: 'UPI, cards, net banking and wallets, on our gateway’s own secure page.',
  },
  {
    icon: Headphones,
    title: 'Support that answers',
    body: 'Reach us any day on WhatsApp or email. Real people, same time zone.',
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
        <Stagger as="ul" stagger={0.08} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
