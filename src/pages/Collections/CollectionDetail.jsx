import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PackageOpen } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { getCollectionBySlug } from '../../data/collections'
import { useShopFilters } from '../../hooks/useShopFilters'
import { useAsync } from '../../hooks/useAsync'
import productService from '../../services/productService'
import Seo, { structuredData } from '../../components/common/Seo'
import Button from '../../components/common/Button'
import Pagination from '../../components/common/Pagination'
import { ProductGridSkeleton } from '../../components/common/Skeleton'
import { EmptyState, ErrorState } from '../../components/common/States'
import Redirect from '../../components/common/Redirect'
import PageHero from '../../components/layout/PageHero'
import ProductGrid from '../../components/product/ProductGrid'
import ShopToolbar from '../../components/shop/ShopToolbar'
import Reveal from '../../components/animations/Reveal'

const PER_PAGE = 12

/**
 * A single edit.
 *
 * Editorial header and story, then the products. Sorting is available; the full
 * filter panel is not — the point of an edit is that someone already curated it.
 */
export default function CollectionDetailPage() {
  const { slug } = useParams()
  const collection = getCollectionBySlug(slug)

  const { sort, page, setSort, setPage } = useShopFilters({ lockedCollection: slug })
  const requestKey = useMemo(() => JSON.stringify({ slug, sort, page }), [slug, sort, page])

  const fetcher = useCallback(
    () => productService.list({ collection: slug, sort, page, perPage: PER_PAGE }),
    [slug, sort, page]
  )
  const { data, isLoading, isError, retry } = useAsync(fetcher, [requestKey])

  if (!collection) return <Redirect to={ROUTES.collections} />

  const products = data?.items ?? []

  return (
    <>
      <Seo
        title={collection.name}
        description={collection.description}
        image={collection.cover}
        canonicalPath={ROUTES.collection(collection.slug)}
        jsonLd={structuredData.breadcrumbs([
          { label: 'Home', to: ROUTES.home },
          { label: 'Collections', to: ROUTES.collections },
          { label: collection.name, to: ROUTES.collection(collection.slug) },
        ])}
      />

      <PageHero
        eyebrow={collection.subtitle}
        title={collection.name}
        description={collection.description}
        image={collection.cover}
        height="lg"
        breadcrumbs={[
          { label: 'Home', to: ROUTES.home },
          { label: 'Collections', to: ROUTES.collections },
          { label: collection.name, to: ROUTES.collection(collection.slug) },
        ]}
      />

      <div className="shell pb-section pt-12 sm:pt-16">
        <Reveal
          as="p"
          className="mx-auto mb-14 max-w-prose text-center font-display text-fluid-lg leading-relaxed text-muted sm:mb-20"
        >
          {collection.story}
        </Reveal>

        <ShopToolbar
          total={data?.total ?? 0}
          sort={sort}
          onSortChange={setSort}
          showFilterButton={false}
          className="mb-8"
        />

        {isLoading && <ProductGridSkeleton count={PER_PAGE} />}

        {isError && (
          <ErrorState
            title="We could not load this collection."
            description="Something went wrong on the way. Please try again."
            onRetry={retry}
          />
        )}

        {!isLoading && !isError && products.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="This edit is closed"
            description="Every piece in this collection has sold out. The next drop lands Friday at 8 PM IST."
            action={
              <Button to={ROUTES.collection('new-arrivals')} variant="outline">
                Shop new arrivals
              </Button>
            }
          />
        )}

        {!isLoading && !isError && products.length > 0 && (
          <>
            <ProductGrid products={products} />
            <Pagination
              page={page}
              totalPages={data?.totalPages ?? 1}
              onChange={setPage}
              className="mt-16"
            />
          </>
        )}
      </div>
    </>
  )
}
