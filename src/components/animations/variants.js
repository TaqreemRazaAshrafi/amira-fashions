import { MOTION } from '../../constants/site'

/**
 * Shared Framer Motion variants.
 *
 * Keeping them here means every reveal in the app shares one easing curve and
 * one distance, which is most of what makes motion read as "designed" rather
 * than "animated". Distances stay small on purpose — luxury motion is quiet.
 */
const ease = MOTION.ease

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: MOTION.base, ease } },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export const fadeDown = {
  hidden: { opacity: 0, y: -14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export const fadeLeft = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
}

export const fadeRight = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease } },
}

/** Image mask reveal — the block wipes up to expose the photograph. */
export const maskReveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.05, ease } },
}

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

/** Word-by-word headline reveal, used on the hero and collection headers. */
export const wordReveal = {
  hidden: { opacity: 0, y: '55%' },
  visible: { opacity: 1, y: '0%', transition: { duration: 0.9, ease } },
}

export const drawerRight = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.5, ease } },
  exit: { x: '100%', transition: { duration: 0.35, ease } },
}

export const drawerLeft = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.5, ease } },
  exit: { x: '-100%', transition: { duration: 0.35, ease } },
}

export const overlayFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease } },
  exit: { opacity: 0, transition: { duration: 0.25, ease } },
}

export const searchPanel = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  exit: { opacity: 0, y: -18, transition: { duration: 0.28, ease } },
}

export const pageTransition = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease } },
}

/** Default viewport config: fire once, slightly before the element is centred. */
export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' }
