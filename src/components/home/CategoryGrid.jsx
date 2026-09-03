import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { categories } from '../../data/categories'
import Image from '../common/Image'
import SectionHeader from '../layout/SectionHeader'
import { Stagger, StaggerItem } from '../animations/Stagger'

/**
 * Category entry points.
 *
 * Asymmetric on desktop — the first tile spans two rows — which reads as an
 * editorial spread rather than a uniform grid of cards.
 */
export function CategoryGrid() {
  return (
    <section className="shell section-y">
      <SectionHeader
        eyebrow="Shop by category"
        title="Find your silhouette"
        description="Five sections, each cut with a different evening in mind."
        action={{ label: 'Shop everything', to: ROUTES.shop }}
      />

      <Stagger
        as="ul"
        stagger={0.07}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2"
      >
        {categories.map((category, index) => {
          const isFirst = index === 0
          return (
            <StaggerItem
              as="li"
              key={category.slug}
              className={isFirst ? 'col-span-2 lg:row-span-2' : ''}
            >
              <Link
                to={ROUTES.shopCategory(category.slug)}
                data-cursor="Shop"
                className="group relative block h-full overflow-hidden bg-surface-alt focus-visible:outline-none"
              >
                <motion.div
                  initial={false}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <Image
                    src={category.image}
                    alt=""
                    ratio={isFirst ? 'editorial' : 'portrait'}
                    width={isFirst ? 1200 : 700}
                    sizes={isFirst ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                    priority={isFirst}
                    className="h-full w-full"
                  />
                </motion.div>

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-text/75 via-transparent to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-background sm:p-6">
                  <div>
                    <h3 className="font-display text-fluid-lg">{category.name}</h3>
                    {isFirst && (
                      <p className="mt-2 hidden max-w-xs text-fluid-xs leading-relaxed text-background/75 sm:block">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 -translate-x-1 opacity-0 transition-all duration-400 ease-luxe group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}

export default CategoryGrid
