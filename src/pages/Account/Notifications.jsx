import { ROUTES } from '../../constants/routes'
import { useUserStore } from '../../store/userStore'
import AccountLayout from '../../components/account/AccountLayout'

const PREFERENCES = [
  {
    key: 'orderUpdates',
    label: 'Order updates',
    description: 'Dispatch, delivery and return confirmations. We recommend keeping this on.',
  },
  {
    key: 'newArrivals',
    label: 'New arrivals',
    description: 'The Friday edit, the evening it goes live.',
  },
  {
    key: 'salesAndOffers',
    label: 'Sales and offers',
    description: 'Seasonal markdowns and early access, a handful of times a year.',
  },
  {
    key: 'backInStock',
    label: 'Back in stock',
    description: 'When a piece you saved returns in your size.',
  },
]

/** Notification preferences. Each toggle is a real checkbox, labelled and keyboard-operable. */
export default function NotificationsPage() {
  const notifications = useUserStore((state) => state.notifications)
  const toggleNotification = useUserStore((state) => state.toggleNotification)

  return (
    <AccountLayout
      title="Notifications"
      description="Choose what Amira Fashions sends you."
      canonicalPath={ROUTES.accountNotifications}
    >
      <h2 className="text-fluid-xl">Notifications</h2>
      <p className="mt-3 max-w-prose text-fluid-sm leading-relaxed text-muted">
        Choose what reaches you. Order updates are sent to the email and mobile on your profile.
      </p>

      <ul className="mt-10 max-w-2xl">
        {PREFERENCES.map((preference) => {
          const isOn = Boolean(notifications[preference.key])
          return (
            <li key={preference.key} className="border-b border-line first:border-t">
              <label className="flex cursor-pointer items-start justify-between gap-6 py-6">
                <span className="min-w-0">
                  <span className="block text-fluid-base">{preference.label}</span>
                  <span className="mt-1 block text-fluid-sm leading-relaxed text-muted">
                    {preference.description}
                  </span>
                </span>

                {/* The track and the knob are both siblings of the input: Tailwind's
                    `peer-*` variants compile to a sibling combinator, so a knob
                    nested inside the track would never receive the checked state. */}
                <span className="relative mt-1 h-6 w-11 shrink-0">
                  <input
                    type="checkbox"
                    checked={isOn}
                    onChange={() => toggleNotification(preference.key)}
                    className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full bg-line transition-colors duration-250 checked:bg-accent"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow-soft transition-transform duration-250 ease-luxe peer-checked:translate-x-5"
                  />
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </AccountLayout>
  )
}
