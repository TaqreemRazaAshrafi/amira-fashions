import { cn } from '../../utils/cn'
import ProductCard from './ProductCard'
import { Stagger, StaggerItem } from '../animations/Stagger'

/**
 * Responsive product grid.
 * Two columns on phones (never one — fashion grids read better paired),
 * three on tablets, four from extra-large.
 */
export function ProductGrid({ products, className, columns, priorityCount = 4 }) {
  return (
    <Stagger
      as="ul"
      stagger={0.05}
      className={cn(
        'grid gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14',
        columns ?? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {products.map((product, index) => (
        <StaggerItem as="li" key={product.id}>
          <ProductCard product={product} priority={index < priorityCount} />
        </StaggerItem>
      ))}
    </Stagger>
  )
}

export default ProductGrid
