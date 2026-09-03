import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { CONTACT, INSTAGRAM_HANDLE } from '../../constants/site'
import { faqs } from '../../data/support'
import marketingService from '../../services/marketingService'
import Seo, { structuredData } from '../../components/common/Seo'
import Accordion from '../../components/common/Accordion'
import Button from '../../components/common/Button'
import { TextArea, TextField } from '../../components/common/Field'
import { InstagramIcon, WhatsAppIcon } from '../../components/common/BrandIcons'
import PageHero from '../../components/layout/PageHero'
import SectionHeader from '../../components/layout/SectionHeader'
import Reveal from '../../components/animations/Reveal'

const schema = z.object({
  name: z.string().min(2, 'Please tell us your name.'),
  email: z.string().min(1, 'We need an email to reply to.').email('That email does not look right.'),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || /^[+\d][\d\s-]{7,15}$/.test(value), 'Enter a valid phone number.'),
  subject: z.string().min(2, 'A short subject helps us route your message.'),
  message: z.string().min(12, 'A little more detail will help us help you.'),
})

/**
 * Contact.
 *
 * A validated form beside the direct channels most of our customers actually
 * use — WhatsApp and Instagram DMs — plus shipping, returns and FAQ anchors
 * that the footer and product pages link into.
 */
export default function ContactPage() {
  const [isSent, setIsSent] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  })

  const onSubmit = async (values) => {
    setSubmitError(null)
    try {
      await marketingService.sendContactMessage(values)
      setIsSent(true)
      reset()
    } catch {
      setSubmitError('Your message did not go through. Please try again, or reach us on WhatsApp.')
    }
  }

  const channels = [
    {
      id: 'whatsapp',
      icon: WhatsAppIcon,
      label: 'WhatsApp',
      value: CONTACT.phone,
      href: `https://wa.me/${CONTACT.whatsapp}`,
      note: 'Fastest — usually answered within the hour.',
    },
    {
      id: 'instagram',
      icon: InstagramIcon,
      label: 'Instagram',
      value: `@${INSTAGRAM_HANDLE}`,
      href: `https://instagram.com/${INSTAGRAM_HANDLE}`,
      note: 'DMs are read by the studio team, not a bot.',
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      note: 'For orders, press and wholesale.',
    },
    {
      id: 'phone',
      icon: Phone,
      label: 'Phone',
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone.replace(/\s/g, '')}`,
      note: CONTACT.hours,
    },
  ]

  return (
    <>
      <Seo
        title="Contact"
        description="Reach the Amira Fashions studio — WhatsApp, Instagram, email or the form. Shipping, returns and frequently asked questions."
        canonicalPath={ROUTES.contact}
        jsonLd={structuredData.faq(faqs)}
      />

      <PageHero
        eyebrow="We are listening"
        title="Get in touch"
        description="Sizing questions, order updates, custom requests or a note about something you loved — the studio answers all of it."
        breadcrumbs={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Contact', to: ROUTES.contact },
        ]}
      />

      <div className="shell pb-section">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          {/* Form */}
          <section aria-labelledby="contact-form-heading">
            <h2 id="contact-form-heading" className="text-fluid-xl">
              Send a message
            </h2>

            <AnimatePresence mode="wait" initial={false}>
              {isSent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex items-start gap-4 border border-line bg-surface p-6"
                  role="status"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-text text-background">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-fluid-base">Message received.</p>
                    <p className="mt-2 text-fluid-sm leading-relaxed text-muted">
                      We reply within one business day. For anything urgent, WhatsApp is faster.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 px-0"
                      magnetic={false}
                      onClick={() => setIsSent(false)}
                    >
                      Send another
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                  exit={{ opacity: 0 }}
                  className="mt-8 flex flex-col gap-7"
                >
                  <div className="grid gap-7 sm:grid-cols-2">
                    <TextField
                      label="Name"
                      required
                      autoComplete="name"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <TextField
                      label="Email"
                      type="email"
                      required
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                    <TextField
                      label="Phone"
                      type="tel"
                      autoComplete="tel"
                      hint="Optional"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                    <TextField
                      label="Subject"
                      required
                      error={errors.subject?.message}
                      {...register('subject')}
                    />
                  </div>

                  <TextArea
                    label="Message"
                    required
                    rows={6}
                    error={errors.message?.message}
                    {...register('message')}
                  />

                  {submitError && (
                    <p role="alert" className="text-fluid-xs text-danger">
                      {submitError}
                    </p>
                  )}

                  <div>
                    <Button type="submit" size="lg" isLoading={isSubmitting} magnetic={false}>
                      Send message
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </section>

          {/* Channels + studio */}
          <aside className="flex flex-col gap-10">
            <div>
              <h2 className="text-fluid-xl">Faster routes</h2>
              <ul className="mt-8 flex flex-col divide-y divide-line border-y border-line">
                {channels.map(({ id, icon: Icon, label, value, href, note }) => (
                  <li key={id}>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
                      className="group flex items-start gap-4 py-5 transition-colors duration-250 hover:text-accent"
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.3} aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-fluid-xs uppercase tracking-luxe text-muted">
                          {label}
                        </span>
                        <span className="mt-1 block truncate text-fluid-base">{value}</span>
                        <span className="mt-1 block text-fluid-xs text-muted">{note}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-fluid-xl">The studio</h2>
              <address className="mt-6 flex flex-col gap-4 not-italic text-fluid-sm leading-relaxed text-muted">
                <span className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.3} aria-hidden="true" />
                  <span>
                    {CONTACT.address.line1}
                    <br />
                    {CONTACT.address.line2}, {CONTACT.address.city}
                    <br />
                    {CONTACT.address.state} {CONTACT.address.pincode}, {CONTACT.address.country}
                  </span>
                </span>
                <span className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.3} aria-hidden="true" />
                  {CONTACT.hours}
                </span>
              </address>
              <p className="mt-6 text-fluid-xs leading-relaxed text-muted">
                Studio visits are by appointment — message us on WhatsApp and we will find a slot.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Policies + FAQ */}
      <section className="border-t border-line bg-surface">
        <div className="shell section-y">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-12">
              <Reveal id="shipping" as="div" className="scroll-mt-32">
                <h2 className="text-fluid-xl">Shipping</h2>
                <p className="mt-4 max-w-prose text-fluid-sm leading-relaxed text-muted">
                  Orders leave the studio within two business days. Standard delivery reaches metros
                  in 3–5 days and the rest of India in 5–8. Express delivery is 1–2 days in
                  serviceable pincodes and can be chosen at checkout. Standard shipping is
                  complimentary above ₹2,999.
                </p>
              </Reveal>

              <Reveal id="returns" as="div" className="scroll-mt-32">
                <h2 className="text-fluid-xl">Returns</h2>
                <p className="mt-4 max-w-prose text-fluid-sm leading-relaxed text-muted">
                  Unworn pieces with tags intact can be returned within 7 days of delivery, with
                  free pickup in serviceable pincodes. Sale items, made-to-order pieces and the
                  atelier line are final sale.
                </p>
              </Reveal>
            </div>

            <div id="faq" className="scroll-mt-32">
              <SectionHeader eyebrow="Answers" title="Frequently asked" className="mb-8" />
              <Accordion items={faqs} defaultOpenId={faqs[0]?.id} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
