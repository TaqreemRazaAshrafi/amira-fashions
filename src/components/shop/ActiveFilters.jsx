import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { titleCase } from '../../utils/format'

/** Removable chips for every filter currently applied. */
export function ActiveFilters({ chips, onRemove, onClear, className }) {
  if (!chips.length) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.button
            key={`${chip.key}-${chip.value}`}
            layout
            type="button"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            onClick={() => onRemove(chip)}
            className="group inline-flex items-center gap-2 border border-line px-3 py-1.5 text-fluid-xs transition-colors duration-250 hover:border-text"
          >
            <span>{titleCase(chip.label)}</span>
            <X
              className="h-3 w-3 text-muted transition-colors group-hover:text-text"
              aria-hidden="true"
            />
            <span className="sr-only">Remove filter</span>
          </motion.button>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={onClear}
        className="ml-1 text-fluid-xs uppercase tracking-wide text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}

export default ActiveFilters
