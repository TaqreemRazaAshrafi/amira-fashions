import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'
import marketingService from '../../services/marketingService'
import Button from '../common/Button'

const schema = z.object({
  email: z.string().min(1, 'Please enter your email address.').email('That email does not look right.'),
})

/**
 * Newsletter capture.
 *
 * Validation is schema-driven (zod) rather than hand-rolled, and success swaps
 * the form for a confirmation instead of firing a toast the visitor may miss.
 * `variant="dark"` is used inside the footer, where the ground is ink.
 */
export function Newsletter({ variant = 'light', className }) {
  const [isDone, setIsDone] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  const isDark = variant === 'dark'

  const onSubmit = async ({ email }) => {
    setSubmitError(null)
    try {
      await marketingService.subscribe(email)
      setIsDone(true)
      reset()
    } catch {
      setSubmitError('We could not sign you up just now. Please try again.')
    }
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {isDone ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-3"
          >
            <motion.span
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              className={cn(
                'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                isDark ? 'bg-accent text-text' : 'bg-text text-background'
              )}
            >
              <Check className="h-4 w-4" aria-hidden="true" />
            </motion.span>
            <p
              className={cn(
                'text-fluid-sm leading-relaxed',
                isDark ? 'text-background/80' : 'text-muted'
              )}
              role="status"
            >
              You are on the list. Look out for the Friday edit at 8 PM IST.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            initial={false}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'newsletter-error' : undefined}
                  className={cn(
                    'w-full border-b bg-transparent py-3 text-fluid-sm focus:outline-none',
                    isDark
                      ? 'border-background/25 text-background placeholder:text-background/40 focus:border-accent'
                      : 'border-line text-text placeholder:text-muted/70 focus:border-accent',
                    errors.email && 'border-danger'
                  )}
                  {...register('email')}
                />
              </div>
              <Button
                type="submit"
                size="md"
                variant={isDark ? 'light' : 'primary'}
                isLoading={isSubmitting}
                magnetic={false}
              >
                Join
              </Button>
            </div>

            {(errors.email || submitError) && (
              <p
                id="newsletter-error"
                role="alert"
                className={cn('text-fluid-xs', isDark ? 'text-accent-soft' : 'text-danger')}
              >
                {errors.email?.message ?? submitError}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Newsletter
