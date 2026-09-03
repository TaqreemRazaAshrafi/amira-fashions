import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Fire-once redirect.
 *
 * React Router's `<Navigate>` calls `navigate()` in an effect with no
 * dependency array, so it re-runs on every render. Inside an
 * AnimatePresence-managed route tree the outgoing page keeps rendering while it
 * animates away, which turns a route guard into a navigation loop that never
 * settles — the destination page never mounts.
 *
 * This runs exactly once per mount and renders nothing.
 */
export function Redirect({ to, replace = true, state }) {
  const navigate = useNavigate()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (hasRedirected.current) return
    hasRedirected.current = true
    navigate(to, { replace, state })
  }, [to, replace, state, navigate])

  return null
}

export default Redirect
