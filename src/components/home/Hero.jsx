import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { MOTION } from '../../constants/site'
import { heroSlides } from '../../data/hero'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { imageSrcSet, imageUrl } from '../../utils/images'
import Button from '../common/Button'

const SLIDE_DURATION = 7000

const copy = {
  hidden: { opacity: 0, y: 26 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.25 + i * 0.12, duration: 0.9, ease: MOTION.ease },
  }),
}

/**
 * Cinematic hero.
 *
 * One slide at a time, cross-faded with a slow Ken Burns push on the
 * photograph. The first image is eager with a high fetch priority — it is the
 * LCP element — while the rest lazy-load as they come round.
 *
 * Under reduced motion the rotation and the zoom both stop: the visitor gets a
 * single still frame with no movement at all.
 */
export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const goTo = useCallback((next) => setIndex(next % heroSlides.length), [])

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return undefined
    const timer = setTimeout(() => goTo(index + 1), SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [index, isPaused, prefersReducedMotion, goTo])

  const slide = heroSlides[index]

  return (
    <section
      aria-label="Featured collections"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-text text-background"
    >
      {/* Imagery */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: MOTION.ease }}
        >
          <motion.img
            src={imageUrl(slide.image, 1800)}
            srcSet={imageSrcSet(slide.image, [768, 1200, 1600, 2000])}
            sizes="100vw"
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
            style={{ objectPosition: slide.focal }}
            className="h-full w-full object-cover"
            initial={prefersReducedMotion ? false : { scale: 1.08 }}
            animate={prefersReducedMotion ? undefined : { scale: 1 }}
            transition={{ duration: 9, ease: 'linear' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-text/85 via-text/35 to-text/45"
          />
        </motion.div>
      </AnimatePresence>

      {/* Copy */}
      <div className="shell relative z-20 pb-16 pt-[calc(var(--nav-height)+7rem)] sm:pb-24">
        <AnimatePresence mode="wait">
          <div key={slide.id} className="max-w-3xl">
            <motion.p
              custom={0}
              variants={copy}
              initial="hidden"
              animate="visible"
              className="eyebrow mb-5 text-background/75"
            >
              {slide.eyebrow}
            </motion.p>

            <motion.h1
              custom={1}
              variants={copy}
              initial="hidden"
              animate="visible"
              className="text-fluid-hero leading-[0.92]"
            >
              {slide.title}
            </motion.h1>

            <motion.p
              custom={2}
              variants={copy}
              initial="hidden"
              animate="visible"
              className="mt-6 max-w-xl text-fluid-base leading-relaxed text-background/80"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              custom={3}
              variants={copy}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <Button to={slide.cta.to} variant="light" size="lg">
                {slide.cta.label}
              </Button>
              {/* Slides that split by department carry a second, equal-weight entry point. */}
              {slide.ctaSecondary && (
                <Button to={slide.ctaSecondary.to} variant="outlineLight" size="lg">
                  {slide.ctaSecondary.label}
                </Button>
              )}
            </motion.div>
          </div>
        </AnimatePresence>

        {/* Slide controls */}
        <div className="mt-14 flex items-center gap-4">
          {heroSlides.map((entry, entryIndex) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => goTo(entryIndex)}
              aria-label={`Show slide ${entryIndex + 1}: ${entry.title}`}
              aria-current={entryIndex === index}
              className="group py-2"
            >
              <span
                className={cn(
                  'block h-px transition-all duration-600 ease-luxe',
                  entryIndex === index
                    ? 'w-16 bg-background'
                    : 'w-8 bg-background/35 group-hover:bg-background/70'
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-fluid-xs tabular-nums text-background/60">
            {String(index + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Slide ${index + 1} of ${heroSlides.length}: ${slide.title}`}
      </p>
    </section>
  )
}

export default Hero
