import { useState } from 'react'
import { cn } from '../../utils/cn'
import { FALLBACK_IMAGE, imagePlaceholder, imageSrcSet, imageUrl } from '../../utils/images'

const RATIOS = {
  portrait: 'aspect-[3/4]',
  editorial: 'aspect-[4/5]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  cinema: 'aspect-[16/9]',
  tall: 'aspect-[2/3]',
  auto: '',
}

/**
 * The image primitive used everywhere.
 *
 * Responsibilities: an intrinsic aspect box so nothing reflows while loading,
 * a `srcset` so phones never download desktop-sized files, a blurred low-res
 * placeholder that cross-fades out, native lazy loading below the fold, and a
 * branded fallback if the URL dies. `object-cover` throughout — images are
 * never stretched.
 */
export function Image({
  src,
  alt = '',
  ratio = 'portrait',
  width = 800,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  priority = false,
  className,
  imgClassName,
  objectPosition,
  ...rest
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)

  const resolvedSrc = hasFailed || !src ? FALLBACK_IMAGE : imageUrl(src, width)
  const placeholder = hasFailed ? undefined : imagePlaceholder(src)

  return (
    <div
      className={cn('relative overflow-hidden bg-surface-alt', RATIOS[ratio] ?? RATIOS.portrait, className)}
    >
      {/* Blurred stand-in: painted immediately, faded out once the real file decodes. */}
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover blur-xl"
        />
      )}

      <img
        src={resolvedSrc}
        srcSet={hasFailed ? undefined : imageSrcSet(src)}
        sizes={hasFailed ? undefined : sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasFailed(true)
          setIsLoaded(true)
        }}
        style={objectPosition ? { objectPosition } : undefined}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-700 ease-luxe',
          isLoaded ? 'opacity-100' : 'opacity-0',
          imgClassName
        )}
        {...rest}
      />
    </div>
  )
}

export default Image
