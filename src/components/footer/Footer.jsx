import { Link } from 'react-router-dom'
import { FOOTER_NAV, ROUTES } from '../../constants/routes'
import { CONTACT, INSTAGRAM_HANDLE, SITE, SOCIALS } from '../../constants/site'
import { categories } from '../../data/categories'
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  WhatsAppIcon,
} from '../common/BrandIcons'
import Newsletter from './Newsletter'

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  pinterest: PinterestIcon,
  whatsapp: WhatsAppIcon,
}

/**
 * Site footer.
 *
 * Four editorial columns on desktop, stacked on mobile. Link groups come from
 * `constants/routes` and `data/categories` so a new category appears here
 * without anyone remembering to update the footer.
 */
export function Footer() {
  const year = new Date().getFullYear()

  const columns = [
    FOOTER_NAV[0],
    {
      title: 'Categories',
      links: categories.map((category) => ({
        label: category.name,
        to: ROUTES.shopCategory(category.slug),
      })),
    },
    FOOTER_NAV[1],
  ]

  return (
    <footer className="mt-auto bg-text text-background">
      <div className="shell py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-20">
          {/* Brand + newsletter */}
          <div>
            <p className="font-display text-[19px] uppercase tracking-[0.34em]">
              Amira Fashions
            </p>
            <p className="mt-5 max-w-sm text-fluid-sm leading-relaxed text-background/60">
              {SITE.description}
            </p>

            <div className="mt-10 max-w-sm">
              <p className="eyebrow mb-3 text-background/50">Stay in the know</p>
              <p className="mb-5 font-display text-fluid-lg leading-snug">
                New drops. Exclusive edits. Fashion inspiration.
              </p>
              <Newsletter variant="dark" />
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="eyebrow mb-5 text-background/50">{column.title}</h2>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="link-underline text-fluid-sm text-background/80 transition-colors duration-250 hover:text-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="eyebrow mb-5 text-background/50">Follow</h2>
              <ul className="flex flex-col gap-3">
                {SOCIALS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.id]
                  return (
                    <li key={social.id}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group inline-flex items-center gap-2 text-fluid-sm text-background/80 transition-colors duration-250 hover:text-background"
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span className="link-underline">{social.label}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>

              <address className="mt-8 not-italic text-fluid-xs leading-relaxed text-background/55">
                {CONTACT.address.line1}
                <br />
                {CONTACT.address.line2}, {CONTACT.address.city}
                <br />
                {CONTACT.address.state} {CONTACT.address.pincode}
                <br />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="mt-2 inline-block transition-colors hover:text-background"
                >
                  {CONTACT.email}
                </a>
              </address>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="shell flex flex-col gap-4 py-6 text-fluid-xs text-background/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-background"
            >
              @{INSTAGRAM_HANDLE}
            </a>
            <Link to={ROUTES.contact} className="transition-colors hover:text-background">
              Shipping &amp; Returns
            </Link>
            <Link to={`${ROUTES.contact}#faq`} className="transition-colors hover:text-background">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
