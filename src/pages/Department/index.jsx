import { ArrowRight } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { getDepartment } from '../../data/departments'
import { QUERY_KEYS } from '../../constants/filters'
import { photo } from '../../utils/images'
import Seo, { structuredData } from '../../components/common/Seo'
import Redirect from '../../components/common/Redirect'
import Button from '../../components/common/Button'
import PageHero from '../../components/layout/PageHero'
import CategoryRail from '../../components/collection/CategoryRail'
import CategoryGrid from '../../components/home/CategoryGrid'
import ProductSection from '../../components/home/ProductSection'
import BrandPromise from '../../components/home/BrandPromise'

/** Cover imagery per department — editorial, not a product shot. */
const COVERS = {
  women: photo('1509319117193-57bab727e09d'),
  men: photo('1516257984-b1b4d707412e'),
}

/**
 * Department landing page — `/men` and `/women`.
 *
 * Deliberately editorial rather than a grid: the department is an entry point,
 * and shoppers who want the full listing take "Shop all" or a category. Every
 * rail fetches independently and is scoped to this department, so a slow or
 * empty rail never blocks the rest of the page.
 */
export default function DepartmentPage({ department }) {
  const dept = getDepartment(department)

  // The route table only mounts this for known departments; this guards direct
  // imports and any future data-driven route generation.
  if (!dept) return <Redirect to={ROUTES.shop} />

  const listingPath = `${ROUTES.shop}?${QUERY_KEYS.department}=${dept.slug}`
  const crumbs = [
    { label: 'Home', to: ROUTES.home },
    { label: dept.name, to: ROUTES.department(dept.slug) },
  ]

  return (
    <>
      <Seo
        title={dept.tagline}
        description={dept.description}
        image={COVERS[dept.slug]}
        canonicalPath={ROUTES.department(dept.slug)}
        jsonLd={structuredData.breadcrumbs(crumbs)}
      />

      <PageHero
        eyebrow={dept.tagline}
        title={dept.headline}
        description={dept.description}
        image={COVERS[dept.slug]}
        height="lg"
        breadcrumbs={crumbs}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <Button to={listingPath} variant="light" size="lg">
            Shop all {dept.name}
          </Button>
          <Button
            to={`${ROUTES.department(dept.slug)}?${QUERY_KEYS.sale}=true`}
            variant="outlineLight"
            size="lg"
          >
            View sale
          </Button>
        </div>
      </PageHero>

      <div className="shell pt-10 sm:pt-14">
        <CategoryRail department={dept.slug} />
      </div>

      <CategoryGrid
        department={dept.slug}
        eyebrow={`${dept.name} — shop by category`}
        title="Where to begin"
      />

      <ProductSection
        department={dept.slug}
        flag="newArrival"
        eyebrow="Just landed"
        title="New Arrivals"
        description={`The latest ${dept.name.toLowerCase()}'s pieces to leave the studio.`}
        action={{
          label: 'View everything new',
          to: `${listingPath}&${QUERY_KEYS.collection}=new-arrivals`,
        }}
      />

      <ProductSection
        className="bg-surface-alt"
        department={dept.slug}
        trending
        eyebrow="Moving fastest"
        title="Trending Now"
        description="Ranked by what our community is actually buying and rating this month."
        action={{ label: 'Shop trending', to: `${listingPath}&${QUERY_KEYS.sort}=best-selling` }}
      />

      <ProductSection
        department={dept.slug}
        flag="bestseller"
        eyebrow="Loved on repeat"
        title="Best Sellers"
        description="The styles that sell out first and come back on request."
        action={{
          label: 'Shop best sellers',
          to: `${listingPath}&${QUERY_KEYS.collection}=best-sellers`,
        }}
      />

      {/* Closing entry point for anyone who scrolled the whole page. */}
      <section className="shell pb-section">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-line pt-12 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow mb-3">The full catalogue</p>
            <h2 className="text-fluid-xl">Everything in {dept.name}</h2>
          </div>
          <Button to={listingPath} variant="outline" icon={ArrowRight}>
            Browse all {dept.name.toLowerCase()}'s pieces
          </Button>
        </div>
      </section>

      <BrandPromise />
    </>
  )
}
