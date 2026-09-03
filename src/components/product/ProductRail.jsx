import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import ProductCard from './ProductCard'

/**
 * Horizontally scrollable product rail.
 *
 * Native scroll with snap points — no JS drag emulation, so it feels right on
 * touch and keeps keyboard scrolling intact. The arrows are a desktop
 * convenience and disable themselves at each end.
 */
export function ProductRail({ products, className, cardWidth = 'w-[68vw] sm:w-[46vw] lg:w-[24vw] xl:w-[21vw]' }) {
  const scrollerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateAffordances = () => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    updateAffordances()
    const el = scrollerRef.current
    if (!el) return undefined
    el.addEventListener('scroll', updateAffordances, { passive: true })
    window.addEventListener('resize', updateAffordances)
    return () => {
      el.removeEventListener('scroll', updateAffordances)
      window.removeEventListener('resize', updateAffordances)
    }
  }, [products.length])

  const scrollBy = (direction) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  const arrow =
    'hidden h-10 w-10 items-center justify-center border border-line transition-colors duration-250 hover:border-text disabled:opacity-25 disabled:hover:border-line lg:flex'

  return (
    <div className={cn('relative', className)}>
      <div className="mb-4 hidden justify-end gap-2 lg:flex">
        <button type="button" className={arrow} onClick={() => scrollBy(-1)} disabled={!canScrollLeft} aria-label="Scroll left">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" className={arrow} onClick={() => scrollBy(1)} disabled={!canScrollRight} aria-label="Scroll right">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <ul
        ref={scrollerRef}
        className="no-scrollbar -mx-gutter flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-2 sm:gap-6"
      >
        {products.map((product, index) => (
          <li key={product.id} className={cn('shrink-0 snap-start', cardWidth)}>
            <ProductCard
              product={product}
              priority={index < 2}
              sizes="(max-width: 640px) 68vw, (max-width: 1024px) 46vw, 24vw"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductRail
