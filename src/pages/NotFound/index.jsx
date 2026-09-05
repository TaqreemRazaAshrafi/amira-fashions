import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { featuredCategories } from '../../data/categories'
import { departments } from '../../data/departments'
import Seo from '../../components/common/Seo'
import Button from '../../components/common/Button'
import TextReveal from '../../components/animations/TextReveal'
import Reveal from '../../components/animations/Reveal'

/** 404 — offers a way onward rather than a dead end. */
export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you were looking for does not exist."
        noIndex
      />

      <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <Reveal as="p" className="eyebrow mb-6">
          Error 404
        </Reveal>

        <p aria-hidden="true" className="font-display text-fluid-hero leading-none text-accent/25">
          404
        </p>

        <TextReveal
          as="h1"
          text="This piece is no longer here."
          className="mt-6 max-w-2xl text-fluid-2xl"
        />

        <Reveal as="p" delay={0.1} className="mt-5 max-w-prose text-fluid-sm leading-relaxed text-muted">
          The page may have moved, or the edit it belonged to has closed. Our collections are
          released in small runs and retired when they sell out.
        </Reveal>

        <Reveal delay={0.18} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button to={ROUTES.home} size="lg">
            Back to home
          </Button>
          <Button to={ROUTES.shop} variant="outline" size="lg">
            Shop the catalogue
          </Button>
        </Reveal>

        <Reveal delay={0.24} className="mt-14 w-full max-w-2xl border-t border-line pt-8">
          <p className="eyebrow mb-5">Or browse a category</p>
          {/* Featured categories only — the full tree of twenty-nine would read as
              a sitemap rather than a way out. */}
          <ul className="flex flex-wrap justify-center gap-2">
            {departments.flatMap((d) => featuredCategories(d.slug)).map((category) => (
              <li key={category.id}>
                <Link
                  to={ROUTES.departmentCategory(category.department, category.slug)}
                  className="inline-block border border-line px-4 py-2 text-fluid-xs uppercase tracking-wide transition-colors duration-250 hover:border-text hover:bg-text hover:text-background"
                >
                  {category.department} {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </>
  )
}
