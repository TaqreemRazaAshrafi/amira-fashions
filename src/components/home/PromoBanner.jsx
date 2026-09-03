import { promoBanner } from '../../data/hero'
import Button from '../common/Button'
import Image from '../common/Image'
import Parallax from '../animations/Parallax'
import Reveal from '../animations/Reveal'
import TextReveal from '../animations/TextReveal'
import { fadeRight } from '../animations/variants'

/**
 * Full-bleed promotional band.
 * The photograph drifts against the scroll on desktop; on touch the parallax is
 * turned off, where it costs paint time and adds nothing.
 */
export function PromoBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-secondary text-background">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[46vh] overflow-hidden lg:min-h-[70vh]">
          <Parallax speed={0.1} className="absolute inset-0 h-[125%] -top-[12%]">
            <Image
              src={promoBanner.image}
              alt=""
              ratio="auto"
              width={1400}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full"
            />
          </Parallax>
        </div>

        <div className="flex flex-col justify-center px-gutter py-16 sm:py-24 lg:py-28">
          <Reveal as="p" variants={fadeRight} className="eyebrow mb-5 text-accent-soft">
            {promoBanner.eyebrow}
          </Reveal>
          <TextReveal as="h2" text={promoBanner.title} className="max-w-md text-fluid-2xl" />
          <Reveal
            as="p"
            delay={0.1}
            className="mt-6 max-w-md text-fluid-sm leading-relaxed text-background/70"
          >
            {promoBanner.body}
          </Reveal>
          <Reveal delay={0.18} className="mt-10">
            <Button to={promoBanner.cta.to} variant="light" size="lg">
              {promoBanner.cta.label}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default PromoBanner
