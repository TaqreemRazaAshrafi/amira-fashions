import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Drawer from '../common/Drawer'
import NavLink from './NavLink'
import { InstagramIcon } from '../common/BrandIcons'
import { PRIMARY_NAV, ROUTES } from '../../constants/routes'
import { CONTACT, INSTAGRAM_HANDLE } from '../../constants/site'
import { categories } from '../../data/categories'
import { useUIStore } from '../../store/uiStore'

const item = {
  hidden: { opacity: 0, x: -18 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.06 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

/** Full-height mobile menu. Closes itself whenever the route changes. */
export function MobileNav() {
  const isOpen = useUIStore((state) => state.isMobileNavOpen)
  const close = useUIStore((state) => state.closeMobileNav)
  const { pathname, search } = useLocation()

  useEffect(() => {
    close()
  }, [pathname, search, close])

  return (
    <Drawer open={isOpen} onClose={close} side="left" title="Menu" className="max-w-[min(88vw,400px)]">
      <div className="flex h-full flex-col justify-between px-6 py-8">
        <div>
          <ul className="flex flex-col gap-1">
            {PRIMARY_NAV.map((link, index) => (
              <motion.li key={link.label} custom={index} variants={item} initial="hidden" animate="visible">
                <NavLink
                  to={link.to}
                  onClick={close}
                  className="block py-3 font-display text-fluid-2xl normal-case tracking-normal opacity-100"
                >
                  {link.label}
                </NavLink>
              </motion.li>
            ))}
          </ul>

          <div className="mt-10 border-t border-line pt-8">
            <p className="eyebrow mb-4">Categories</p>
            <ul className="flex flex-col gap-3">
              {categories.map((category, index) => (
                <motion.li
                  key={category.slug}
                  custom={index + PRIMARY_NAV.length}
                  variants={item}
                  initial="hidden"
                  animate="visible"
                >
                  <NavLink
                    to={ROUTES.shopCategory(category.slug)}
                    onClick={close}
                    className="text-fluid-sm tracking-wide"
                  >
                    {category.name}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8">
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-center justify-between text-fluid-xs uppercase tracking-luxe"
          >
            <span className="flex items-center gap-2">
              <InstagramIcon className="h-4 w-4" />@{INSTAGRAM_HANDLE}
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a href={`mailto:${CONTACT.email}`} className="text-fluid-xs text-muted">
            {CONTACT.email}
          </a>
        </div>
      </div>
    </Drawer>
  )
}

export default MobileNav
