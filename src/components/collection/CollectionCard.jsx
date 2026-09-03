import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import Image from '../common/Image'

/**
 * Editorial collection tile.
 *
 * The image is the link; type sits over a bottom gradient so it stays legible
 * on any photograph. `size="feature"` is the taller treatment used for the
 * first card in an asymmetric grid.
 */
export function CollectionCard({ collection, size = 'default', priority = false, className }) {
  const isFeature = size === 'feature'

  return (
    <article className={cn('group relative isolate overflow-hidden bg-surface-alt', className)}>
      <Link
        to={ROUTES.collection(collection.slug)}
        data-cursor="View"
        className="block focus-visible:outline-none"
      >
        <motion.div
          initial={false}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full"
        >
          <Image
            src={collection.image}
            alt=""
            ratio={isFeature ? 'portrait' : 'editorial'}
            width={isFeature ? 1200 : 900}
            sizes={isFeature ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 100vw, 33vw'}
            priority={priority}
            className="h-full w-full"
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-text/80 via-text/15 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 p-6 text-background sm:p-8">
          <p className="eyebrow mb-2 text-background/70">{collection.subtitle}</p>
          <h3 className={cn('font-display', isFeature ? 'text-fluid-2xl' : 'text-fluid-xl')}>
            {collection.name}
          </h3>
          <p className="mt-2 max-w-sm text-fluid-xs leading-relaxed text-background/75">
            {collection.description}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-fluid-xs uppercase tracking-luxe">
            Explore
            <ArrowRight
              className="h-4 w-4 transition-transform duration-400 ease-luxe group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  )
}

export default CollectionCard
