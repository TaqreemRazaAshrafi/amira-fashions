import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ZoomIn } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import Image from '../common/Image'

/**
 * Product image gallery.
 *
 * Desktop gets a vertical thumbnail rail plus cursor-tracked zoom on the main
 * frame. Mobile gets a native horizontal scroll-snap carousel — real swipe
 * physics, no gesture library — with a dot indicator driven by scroll position.
 */
export function ProductGallery({ images = [], video, alt, className }) {
  const media = video ? [{ type: 'video', src: video }, ...images.map(toImage)] : images.map(toImage)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const scrollerRef = useRef(null)
  const isDesktop = useIsDesktop()

  const active = media[activeIndex] ?? media[0]

  const handlePointerMove = (event) => {
    if (!isZoomed) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setOrigin(`${x}% ${y}%`)
  }

  const onScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  if (!media.length) return null

  // ── Mobile: swipe carousel ───────────────────────────────────────────────
  if (!isDesktop) {
    return (
      <div className={cn('relative', className)}>
        <ul
          ref={scrollerRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          aria-label={`${alt} images`}
        >
          {media.map((item, index) => (
            <li key={item.src} className="w-full shrink-0 snap-center">
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-[3/4] w-full bg-surface-alt object-cover"
                />
              ) : (
                <Image
                  src={item.src}
                  alt={`${alt} — view ${index + 1}`}
                  ratio="portrait"
                  width={1000}
                  sizes="100vw"
                  priority={index === 0}
                />
              )}
            </li>
          ))}
        </ul>

        {media.length > 1 && (
          <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
            {media.map((item, index) => (
              <span
                key={item.src}
                className={cn(
                  'h-1 rounded-full transition-all duration-400 ease-luxe',
                  index === activeIndex ? 'w-6 bg-text' : 'w-1.5 bg-line'
                )}
              />
            ))}
          </div>
        )}
        <p className="sr-only" aria-live="polite">{`Image ${activeIndex + 1} of ${media.length}`}</p>
      </div>
    )
  }

  // ── Desktop: thumbnails + zoomable frame ─────────────────────────────────
  return (
    <div className={cn('flex gap-4', className)}>
      <ul className="flex w-20 shrink-0 flex-col gap-3" aria-label="Product image thumbnails">
        {media.map((item, index) => (
          <li key={item.src}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.type === 'video' ? 'video' : `image ${index + 1}`}`}
              aria-current={index === activeIndex}
              className={cn(
                'relative block w-full overflow-hidden border transition-colors duration-250',
                index === activeIndex ? 'border-text' : 'border-transparent hover:border-line'
              )}
            >
              {item.type === 'video' ? (
                <span className="flex aspect-[3/4] items-center justify-center bg-surface-alt">
                  <Play className="h-4 w-4 text-text" aria-hidden="true" />
                </span>
              ) : (
                <Image src={item.src} alt="" ratio="portrait" width={200} sizes="80px" />
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="min-w-0 flex-1">
        {active.type === 'video' ? (
          <video
            key={active.src}
            src={active.src}
            controls
            playsInline
            preload="metadata"
            className="aspect-[3/4] w-full bg-surface-alt object-cover"
          />
        ) : (
          <div
            role="button"
            tabIndex={0}
            aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            data-cursor={isZoomed ? 'Close' : 'Zoom'}
            onClick={() => setIsZoomed((value) => !value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setIsZoomed((value) => !value)
              }
            }}
            onMouseMove={handlePointerMove}
            onMouseLeave={() => setIsZoomed(false)}
            className="relative aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-surface-alt"
          >
            <motion.div
              className="h-full w-full"
              animate={{ scale: isZoomed ? 2 : 1 }}
              style={{ transformOrigin: origin }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                key={active.src}
                src={active.src}
                alt={`${alt} — view ${activeIndex + 1}`}
                ratio="auto"
                width={1400}
                sizes="(max-width: 1280px) 50vw, 640px"
                priority
                className="h-full w-full"
              />
            </motion.div>

            {!isZoomed && (
              <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 bg-background/85 px-3 py-1.5 text-[10px] uppercase tracking-luxe backdrop-blur">
                <ZoomIn className="h-3 w-3" aria-hidden="true" /> Zoom
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const toImage = (src) => ({ type: 'image', src })

export default ProductGallery
