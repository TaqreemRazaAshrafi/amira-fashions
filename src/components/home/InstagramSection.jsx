import { Heart, Play } from 'lucide-react'
import { INSTAGRAM_HANDLE } from '../../constants/site'
import { instagramPosts, instagramProfile } from '../../data/instagram'
import Button from '../common/Button'
import Image from '../common/Image'
import { InstagramIcon } from '../common/BrandIcons'
import Reveal from '../animations/Reveal'
import TextReveal from '../animations/TextReveal'
import { Stagger, StaggerItem } from '../animations/Stagger'

const compact = new Intl.NumberFormat('en-IN', { notation: 'compact' })

/**
 * Instagram grid.
 *
 * The brand started on Instagram, so this is treated as a primary section
 * rather than a footer afterthought: an editorial CTA beside a live-feeling
 * grid of posts and reels, each opening the real permalink in a new tab.
 */
export function InstagramSection() {
  return (
    <section className="section-y bg-surface-alt">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-center lg:gap-16">
          <div>
            <Reveal as="p" className="eyebrow mb-4">
              Follow the Amira woman
            </Reveal>
            <TextReveal as="h2" text={`@${INSTAGRAM_HANDLE}`} className="text-fluid-2xl" />
            <Reveal as="p" delay={0.1} className="mt-5 max-w-md text-fluid-sm leading-relaxed text-muted">
              Discover our latest looks, styling inspiration and behind-the-scenes moments from the
              studio in Bandra.
            </Reveal>
            <Reveal delay={0.15} className="mt-6 flex items-center gap-6 text-fluid-xs text-muted">
              <span>
                <strong className="text-text">{instagramProfile.followers}</strong> followers
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-line" />
              <span>Friday drops, 8 PM IST</span>
            </Reveal>
            <Reveal delay={0.2} className="mt-9">
              <Button href={instagramProfile.url} size="lg" icon={InstagramIcon} iconPosition="left">
                Follow on Instagram
              </Button>
            </Reveal>
          </div>

          <Stagger
            as="ul"
            stagger={0.05}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
          >
            {instagramPosts.map((post) => (
              <StaggerItem as="li" key={post.id}>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="View on Instagram"
                  className="group relative block overflow-hidden bg-background focus-visible:outline-none"
                >
                  <Image
                    src={post.image}
                    alt={post.caption}
                    ratio="square"
                    width={520}
                    sizes="(max-width: 640px) 50vw, 20vw"
                    imgClassName="transition-transform duration-800 ease-luxe group-hover:scale-105"
                  />

                  {post.type === 'reel' && (
                    <span className="absolute right-2 top-2 text-background drop-shadow">
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                      <span className="sr-only">Reel</span>
                    </span>
                  )}

                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-text/60 text-background opacity-0 transition-opacity duration-400 ease-luxe group-hover:opacity-100 group-focus-visible:opacity-100">
                    <InstagramIcon className="h-5 w-5" />
                    <span className="flex items-center gap-1 text-fluid-xs">
                      <Heart className="h-3 w-3 fill-current" aria-hidden="true" />
                      {compact.format(post.likes)}
                    </span>
                    <span className="px-3 text-center text-[10px] uppercase tracking-luxe">
                      View on Instagram
                    </span>
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}

export default InstagramSection
