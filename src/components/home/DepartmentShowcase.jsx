import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { departments } from '../../data/departments'
import { photo } from '../../utils/images'
import Image from '../common/Image'
import Reveal from '../animations/Reveal'

/** Editorial cover per department. Decorative, so alt text stays empty. */
const COVERS = {
  women: photo('1483985988355-763728e1935b'),
  men: photo('1516257984-b1b4d707412e'),
}

/**
 * The two department doors, side by side.
 *
 * Deliberately the largest, plainest choice on the home page: most visitors
 * arrive knowing which half of the catalogue they want, and every extra decision
 * before that one costs conversions. Full-height panels, one link each.
 */
export function DepartmentShowcase() {
  return (
    <section aria-label="Shop by department" className="grid md:grid-cols-2">
      {departments.map((department) => (
        <Link
          key={department.slug}
          to={ROUTES.department(department.slug)}
          data-cursor="Shop"
          className="group relative isolate block min-h-[68vh] overflow-hidden bg-surface-alt focus-visible:outline-none md:min-h-[82vh]"
        >
          <motion.div
            initial={false}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={COVERS[department.slug]}
              alt=""
              ratio="auto"
              width={1200}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-full w-full"
            />
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-text/85 via-text/25 to-text/5 transition-opacity duration-600 group-hover:from-text/90"
          />

          <div className="absolute inset-x-0 bottom-0 p-8 text-background sm:p-12">
            <Reveal>
              <p className="eyebrow mb-4 text-background/70">{department.tagline}</p>
              <h2 className="font-display text-fluid-3xl leading-[1.02]">{department.headline}</h2>
              <p className="mt-4 max-w-md text-fluid-sm leading-relaxed text-background/75">
                {department.description}
              </p>
              <span className="mt-8 inline-flex items-center gap-3 border-b border-background/40 pb-1.5 text-fluid-xs uppercase tracking-luxe transition-colors duration-400 group-hover:border-background">
                Shop {department.name}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-400 ease-luxe group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Reveal>
          </div>
        </Link>
      ))}
    </section>
  )
}

export default DepartmentShowcase
