import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Disclosure list. Uses real buttons with aria-expanded/aria-controls so the
 * whole thing is operable and announced correctly from the keyboard.
 */
export function Accordion({ items, defaultOpenId = null, className, allowMultiple = false }) {
  const [openIds, setOpenIds] = useState(defaultOpenId ? [defaultOpenId] : [])
  const baseId = useId()

  const toggle = (id) =>
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id)
      return allowMultiple ? [...current, id] : [id]
    })

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)
        const panelId = `${baseId}-${item.id}-panel`
        const buttonId = `${baseId}-${item.id}-button`

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-250 hover:text-accent"
              >
                <span className="font-sans text-fluid-sm uppercase tracking-wide">
                  {item.title ?? item.question}
                </span>
                <Plus
                  aria-hidden="true"
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-400 ease-luxe',
                    isOpen && 'rotate-45'
                  )}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="max-w-prose pb-6 pr-8 text-fluid-sm leading-relaxed text-muted">
                    {item.content ?? item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
