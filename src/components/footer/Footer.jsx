import { Link } from 'react-router-dom'
import { FOOTER_NAV, ROUTES } from '../../constants/routes'
import { CONTACT, INSTAGRAM_HANDLE, SITE, SOCIALS } from '../../constants/site'
import { categoriesByDepartment } from '../../data/categories'
import { departments } from '../../data/departments'
import { FacebookIcon, InstagramIcon, PinterestIcon, WhatsAppIcon } from '../common/BrandIcons'
import Newsletter from './Newsletter'

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  pinterest: PinterestIcon,
  whatsapp: WhatsAppIcon,
}

/** A footer column lists the department's first few categories, not all of them. */
const CATEGORIES_PER_DEPARTMENT = 7

/**
 * Site footer.
 *
 * Link groups come from `constants/routes` and `data/categories`, so a new
 * category or department appears here without anyone remembering to update the
 * footer. Each department gets its own column and is capped — listing all
 * twenty-nine categories would bury the support and company links entirely.
 */
export function Footer() {
  const year = new Date().getFullYear()

  const columns = [
    FOOTER_NAV[0],
    ...departments.map((department) => ({
      title: department.name,
      links: [
        ...categoriesByDepartment(department.slug)
          .slice(0, CATEGORIES_PER_DEPARTMENT)
          .map((category) => ({
            label: category.name,
            to: ROUTES.departmentCategory(category.department, category.slug),
          })),
        { label: `All ${department.name}`, to: ROUTES.department(department.slug) },
      ],
    })),
    FOOTER_NAV[1],
    FOOTER_NAV[2],
  ]

  return (
    <footer className="mt-auto bg-text text-background">
      <div className="shell py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr] lg:gap-16">
          {/* Brand + newsletter */}
          <div>
            <p className="font-display text-[19px] uppercase tracking-[0.34em]">Amira Fashions</p>
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

            <ul className="mt-10 flex flex-wrap items-center gap-5">
              {SOCIALS.map((social) => {
                const Icon = SOCIAL_ICONS[social.id]
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      className="inline-flex items-center gap-2 text-background/70 transition-colors duration-250 hover:text-background"
                    >
                      {Icon ? <Icon className="h-5 w-5" /> : social.label}
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

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 xl:grid-cols-5">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="eyebrow mb-5 text-background/50">{column.title}</h2>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
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
