/**
 * Brand marks.
 *
 * Lucide dropped third-party brand glyphs, so the three we need are inlined
 * here as accessible SVGs with a consistent 24px box and `currentColor` fill.
 */
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
}

export function InstagramIcon({ className, ...rest }) {
  return (
    <svg {...base} className={className} {...rest}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon({ className, ...rest }) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M14.5 8.5H17V5.2h-2.6c-2.2 0-3.6 1.5-3.6 3.8v1.7H8.4v3.3h2.4V21h3.4v-7h2.5l.4-3.3h-2.9V9.4c0-.6.3-.9.8-.9Z" />
    </svg>
  )
}

export function PinterestIcon({ className, ...rest }) {
  return (
    <svg {...base} className={className} {...rest}>
      <circle cx="12" cy="12" r="10" />
      <path d="M10 20c-.4-1.3-.2-2.7 0-4l1-4.2" />
      <path d="M8.8 10.3c0-2.2 1.7-4 4-4 2.2 0 3.8 1.5 3.8 3.6 0 2.4-1.3 4.3-3.2 4.3-1 0-1.8-.9-1.5-1.9" />
    </svg>
  )
}

export function WhatsAppIcon({ className, ...rest }) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M3.5 20.5l1.3-4.2A8.2 8.2 0 1 1 8 19.3l-4.5 1.2Z" />
      <path d="M9 9.3c.2 1.6 2.1 3.6 3.8 4 .6.1 1.2-.1 1.5-.7.2-.4 0-.8-.4-1l-1-.5c-.3-.2-.7 0-.9.2-.7-.4-1.3-1-1.6-1.7.3-.2.4-.5.3-.9l-.4-1c-.2-.4-.6-.6-1-.4-.5.2-.8.7-.7 1.3Z" />
    </svg>
  )
}
