/**
 * Minimal className joiner. Accepts strings, arrays and objects and drops
 * falsy values. Avoids pulling in clsx for what is a five-line utility.
 */
export function cn(...args) {
  const out = []
  for (const arg of args) {
    if (!arg) continue
    if (typeof arg === 'string' || typeof arg === 'number') out.push(String(arg))
    else if (Array.isArray(arg)) {
      const nested = cn(...arg)
      if (nested) out.push(nested)
    } else if (typeof arg === 'object') {
      for (const [key, value] of Object.entries(arg)) if (value) out.push(key)
    }
  }
  return out.join(' ')
}
