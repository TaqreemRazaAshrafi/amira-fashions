import { useCallback, useEffect, useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { useUIStore } from '../store/uiStore'

/**
 * Owns the "which variant, how many" state for a product plus the add-to-bag
 * side effects. Shared by the product page and the quick-view dialog so the
 * two can never drift apart.
 *
 * @param {object} product
 * @param {{ openCartOnAdd?: boolean }} options
 */
export function useProductSelection(product, { openCartOnAdd = true } = {}) {
  const singleSize = product?.sizes?.length === 1 ? product.sizes[0] : null
  const [size, setSize] = useState(singleSize)
  const [color, setColor] = useState(product?.colors?.[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState(null)

  const addItem = useCartStore((state) => state.addItem)
  const openCart = useUIStore((state) => state.openCart)
  const toast = useUIStore((state) => state.toast)

  // Reset when the dialog is reused for a different product.
  useEffect(() => {
    setSize(product?.sizes?.length === 1 ? product.sizes[0] : null)
    setColor(product?.colors?.[0] ?? null)
    setQuantity(1)
    setError(null)
  }, [product?.id, product?.sizes, product?.colors])

  const selectSize = useCallback((value) => {
    setSize(value)
    setError(null)
  }, [])

  const addToCart = useCallback(async () => {
    if (!product) return false
    if (!size) {
      setError('Please select a size to continue.')
      // Give assistive tech a moment, then move focus to the size group.
      document.querySelector('[role="radiogroup"]')?.focus?.()
      throw new Error('size_required')
    }
    if (!product.inStock) {
      setError('This piece is currently sold out.')
      throw new Error('out_of_stock')
    }

    addItem(product, { size, color, quantity })
    toast({
      title: 'Added to bag',
      description: `${product.name} · ${size}`,
      variant: 'success',
    })
    if (openCartOnAdd) openCart()
    return true
  }, [product, size, color, quantity, addItem, toast, openCart, openCartOnAdd])

  return {
    size,
    color,
    quantity,
    error,
    maxQuantity: Math.min(product?.stock ?? 1, 10),
    setSize: selectSize,
    setColor,
    setQuantity,
    addToCart,
  }
}
