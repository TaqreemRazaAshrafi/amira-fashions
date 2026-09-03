import { testimonials } from '../../data/testimonials'
import { Stagger, StaggerItem } from '../animations/Stagger'
import SectionHeader from '../layout/SectionHeader'

/** Customer quotes, set as pull-quotes rather than cards. */
export function Testimonials() {
  return (
    <section className="shell section-y">
      <SectionHeader
        eyebrow="From the community"
        title="Worn and reviewed"
        align="center"
      />

      <Stagger as="ul" stagger={0.1} className="grid gap-10 md:grid-cols-3 md:gap-8">
        {testimonials.map((entry) => (
          <StaggerItem as="li" key={entry.id}>
            <figure className="flex h-full flex-col border-t border-line pt-8">
              <span aria-hidden="true" className="mb-4 font-display text-fluid-2xl leading-none text-accent">
                &ldquo;
              </span>
              <blockquote className="flex-1 font-display text-fluid-lg leading-snug">
                {entry.quote}
              </blockquote>
              <figcaption className="mt-6 text-fluid-xs uppercase tracking-wide text-muted">
                {entry.author} · {entry.location}
                <span className="mt-1 block normal-case tracking-normal text-muted/70">
                  {entry.product}
                </span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export default Testimonials
