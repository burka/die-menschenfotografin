'use client'

import { useCallback, useEffect, useState } from 'react'

// View Transitions API types - using native types when available
type ViewTransitionCallback = () => void | Promise<void>

// Check if View Transitions API is supported
function hasViewTransitionsSupport(): boolean {
  return (
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    typeof document.startViewTransition === 'function'
  )
}

// Load polyfill eagerly - start loading immediately when module is imported
let polyfillPromise: Promise<boolean> | null = null
let polyfillLoaded = false

function loadPolyfillIfNeeded(): Promise<boolean> {
  if (typeof document === 'undefined') return Promise.resolve(false)

  // Already has native support
  if (hasViewTransitionsSupport()) {
    polyfillLoaded = true
    return Promise.resolve(true)
  }

  // Load polyfill (only once)
  if (!polyfillPromise) {
    polyfillPromise = (async () => {
      try {
        // @ts-expect-error - view-transitions-polyfill has no type definitions
        await import('view-transitions-polyfill')
        console.debug('[ViewTransition] Polyfill loaded')
        polyfillLoaded = hasViewTransitionsSupport()
        return polyfillLoaded
      } catch (err) {
        console.warn('[ViewTransition] Polyfill failed to load:', err)
        return false
      }
    })()
  }

  return polyfillPromise
}

// Start loading polyfill immediately on module import (client-side only)
if (typeof window !== 'undefined') {
  loadPolyfillIfNeeded()
}

interface ViewTransitionOptions {
  skipTransition?: boolean
}

export function useViewTransition() {
  const [isSupported, setIsSupported] = useState(false)

  // Initialize and load polyfill if needed
  useEffect(() => {
    loadPolyfillIfNeeded().then((supported) => {
      setIsSupported(supported)
      console.debug('[ViewTransition] Support:', supported)
    })
  }, [])

  const startTransition = useCallback(
    async (updateDOM: ViewTransitionCallback, options: ViewTransitionOptions = {}): Promise<void> => {
      // Skip transition if explicitly requested
      if (options.skipTransition) {
        console.debug('[ViewTransition] Skipping - skipTransition=true')
        await updateDOM()
        return
      }

      // Wait for polyfill to load if still pending (ensures first click works)
      if (!polyfillLoaded && polyfillPromise) {
        console.debug('[ViewTransition] Waiting for polyfill...')
        await polyfillPromise
      }

      // Check support after polyfill is loaded
      if (!hasViewTransitionsSupport()) {
        console.debug('[ViewTransition] Skipping - not supported')
        await updateDOM()
        return
      }

      console.debug('[ViewTransition] Starting transition')

      const transition = document.startViewTransition(async () => {
        console.debug('[ViewTransition] Callback executing - updating DOM')
        await updateDOM()
        console.debug('[ViewTransition] Callback complete - DOM updated')
      })

      try {
        await transition.finished
        console.debug('[ViewTransition] Transition finished')
      } catch (error) {
        // Transition was skipped or aborted
        console.debug('[ViewTransition] Transition skipped:', error)
      }
    },
    [],
  )

  return {
    startTransition,
    isSupported,
  }
}
