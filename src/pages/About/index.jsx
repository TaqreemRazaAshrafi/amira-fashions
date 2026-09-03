import { ROUTES } from '../../constants/routes'
import { brandStory, craftHighlights, founder, milestones, pillars } from '../../data/about'
import Seo, { structuredData } from '../../components/common/Seo'
import Image from '../../components/common/Image'
import PageHero from '../../components/layout/PageHero'
import SectionHeader from '../../components/layout/SectionHeader'
import InstagramSection from '../../components/home/InstagramSection'
import Reveal from '../../components/animations/Reveal'
import Parallax from '../../components/animations/Parallax'
import { Stagger, StaggerItem } from '../../components/animations/Stagger'
import { fadeLeft, fadeRight } from '../../components/animations/variants'

/**
 * Brand story.
 *
 * Laid out as an editorial feature — alternating image/text spreads, a pillar
 * grid, a founder spread and a timeline — rather than a wall of copy.
 */
export default function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        description="Amira Fashions began in 2021 as a single Instagram account in Bandra. The story, the philosophy and the hands behind the label."
        image={brandStory.image}
        canonicalPath={ROUTES.about}
        jsonLd={structuredData.organization()}
      />

      <PageHero
        eyebrow={brandStory.eyebrow}
        title={brandStory.title}
        image={brandStory.image}
        height="lg"
        breadcrumbs={[
          { label: 'Home', to: ROUTES.home },
          { label: 'About', to: ROUTES.about },
        ]}
      />

      {/* Story */}
      <section className="shell section-y">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal variants={fadeRight}>
            <p className="eyebrow mb-5">2021 — today</p>
            <h2 className="text-fluid-2xl">A label that grew out of a DM inbox.</h2>
          </Reveal>

          <Reveal variants={fadeLeft} delay={0.1} className="flex flex-col gap-6">
            {brandStory.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="max-w-prose text-fluid-base leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-line bg-surface">
        <div className="shell section-y">
          <SectionHeader
            eyebrow="What we stand for"
            title="Four things we will not compromise on"
            align="center"
          />

          <Stagger as="ul" stagger={0.09} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, index) => (
              <StaggerItem as="li" key={pillar.id}>
                <p aria-hidden="true" className="font-display text-fluid-xl text-accent">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-fluid-lg">{pillar.title}</h3>
                <p className="mt-3 text-fluid-sm leading-relaxed text-muted">{pillar.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Craft */}
      <section className="shell section-y">
        <SectionHeader
          eyebrow="Craftsmanship"
          title="How the clothes are made"
          description="Chanderi from Madhya Pradesh, chikankari from Lucknow, bandhani from Kutch. We name the hands because the work deserves the credit."
        />

        <ul className="flex flex-col gap-16 sm:gap-24">
          {craftHighlights.map((highlight, index) => (
            <li
              key={highlight.id}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                index % 2 === 1 ? 'lg:[&>figure]:order-2' : ''
              }`}
            >
              <figure className="overflow-hidden">
                <Parallax speed={0.06}>
                  <Image
                    src={highlight.image}
                    alt=""
                    ratio="editorial"
                    width={1000}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </Parallax>
              </figure>

              <Reveal variants={index % 2 === 1 ? fadeRight : fadeLeft}>
                <p className="eyebrow mb-4">{String(index + 1).padStart(2, '0')} — Craft</p>
                <h3 className="text-fluid-xl">{highlight.title}</h3>
                <p className="mt-4 max-w-prose text-fluid-sm leading-relaxed text-muted">
                  {highlight.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Founder */}
      <section className="bg-text text-background">
        <div className="shell section-y">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
            <Reveal>
              <Image
                src={founder.image}
                alt={`${founder.name}, ${founder.role}`}
                ratio="portrait"
                width={900}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Reveal>

            <Reveal variants={fadeLeft} delay={0.1}>
              <p className="eyebrow mb-6 text-background/60">Founder</p>
              <blockquote className="font-display text-fluid-2xl leading-tight">
                &ldquo;{founder.quote}&rdquo;
              </blockquote>
              <p className="mt-8 max-w-prose text-fluid-sm leading-relaxed text-background/70">
                {founder.body}
              </p>
              <p className="mt-8 text-fluid-xs uppercase tracking-luxe text-background/60">
                {founder.name} — {founder.role}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="shell section-y">
        <SectionHeader eyebrow="Timeline" title="Five years, briefly" />

        <Stagger as="ol" stagger={0.08} className="grid gap-px border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((milestone) => (
            <StaggerItem as="li" key={milestone.year} className="border-b border-line py-8 pr-6">
              <p className="font-display text-fluid-2xl text-accent">{milestone.year}</p>
              <p className="mt-3 max-w-xs text-fluid-sm leading-relaxed text-muted">
                {milestone.label}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <InstagramSection />
    </>
  )
}
