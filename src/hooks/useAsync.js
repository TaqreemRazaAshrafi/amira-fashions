import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Runs an async function and tracks its lifecycle.
 *
 * Handles the two things hand-rolled fetch effects usually get wrong: state
 * updates after unmount, and out-of-order responses when the arguments change
 * mid-flight (only the newest run is allowed to commit).
 *
 * @param {Function} asyncFn
 * @param {Array} deps          re-runs when these change
 * @param {{ immediate?: boolean, initialData?: any }} options
 */
export function useAsync(asyncFn, deps = [], { immediate = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData)
  const [status, setStatus] = useState(immediate ? 'loading' : 'idle')
  const [error, setError] = useState(null)

  const mounted = useRef(true)
  const runId = useRef(0)
  const fnRef = useRef(asyncFn)
  fnRef.current = asyncFn

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const run = useCallback(async (...args) => {
    const id = ++runId.current
    setStatus('loading')
    setError(null)
    try {
      const result = await fnRef.current(...args)
      if (!mounted.current || id !== runId.current) return undefined
      setData(result)
      setStatus('success')
      return result
    } catch (err) {
      if (!mounted.current || id !== runId.current) return undefined
      setError(err)
      setStatus('error')
      return undefined
    }
  }, [])

  useEffect(() => {
    if (immediate) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
    run,
    retry: run,
    setData,
  }
}
