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

// Load polyfill if needed
let polyfillPromise: Promise<void> | null = null

async function loadPolyfillIfNeeded(): Promise<boolean> {
  if (typeof document === 'undefined') return false

  // Already has native support
  if (hasViewTransitionsSupport()) {
    return true
  }

  // Load polyfill
  if (!polyfillPromise) {
    // @ts-expect-error - view-transitions-polyfill has no type definitions
    polyfillPromise = import('view-transitions-polyfill')
      .then(() => {
        console.debug('[ViewTransition] Polyfill loaded')
      })
      .catch((err) => {
        console.warn('[ViewTransition] Polyfill failed to load:', err)
      })
  }

  await polyfillPromise
  return hasViewTransitionsSupport()
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
      // Skip transition if requested or not supported
      if (options.skipTransition || !hasViewTransitionsSupport()) {
        console.debug('[ViewTransition] Skipping - not supported or skipTransition=true')
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
