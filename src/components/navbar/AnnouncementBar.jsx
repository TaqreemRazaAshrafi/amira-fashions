import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ANNOUNCEMENTS } from '../../constants/site'

/**
 * Rotating announcement strip above the navbar.
 * Only one message is in the DOM at a time and the region is polite, so the
 * rotation never spams a screen reader.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative z-[60] flex h-9 items-center justify-center overflow-hidden bg-text px-4 text-background">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="truncate text-[10px] uppercase tracking-luxe sm:text-[11px]"
        >
          {ANNOUNCEMENTS[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export default AnnouncementBar
