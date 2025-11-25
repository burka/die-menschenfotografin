'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { HashRoute } from '@/types/gallery'

/**
 * Context value interface for the hash router
 */
interface HashRouterContextValue {
  /** Current parsed route state */
  route: HashRoute
  /** Navigate to a new hash */
  navigateTo: (hash: string) => void
  /** Navigate back in browser history */
  goBack: () => void
}

/**
 * Hash router context
 */
const HashRouterContext = createContext<HashRouterContextValue | undefined>(undefined)

/**
 * Parses a hash string into a HashRoute object
 *
 * Examples:
 * - "" or "#" -> { view: 'home' }
 * - "#gallery/kindergarten" -> { view: 'gallery', category: 'kindergarten' }
 * - "#gallery/kindergarten/img-5" -> { view: 'single', category: 'kindergarten', imageId: 'img-5' }
 *
 * @param hash - The hash string to parse (with or without leading #)
 * @returns Parsed HashRoute object
 */
function parseHash(hash: string): HashRoute {
  // Remove leading # if present
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash

  // Empty hash means home
  if (!cleanHash) {
    return { view: 'home' }
  }

  // Split by / to get segments
  const segments = cleanHash.split('/').filter(Boolean)

  // Must start with 'gallery'
  if (segments[0] !== 'gallery') {
    return { view: 'home' }
  }

  // #gallery/category
  if (segments.length === 2) {
    return {
      view: 'gallery',
      category: segments[1],
    }
  }

  // #gallery/category/imageId
  if (segments.length === 3) {
    return {
      view: 'single',
      category: segments[1],
      imageId: segments[2],
    }
  }

  // Invalid format, default to home
  return { view: 'home' }
}

/**
 * Props for HashRouterProvider component
 */
interface HashRouterProviderProps {
  children: ReactNode
}

/**
 * Provider component for the hash router
 *
 * Wraps your app to enable hash-based routing
 *
 * @example
 * ```tsx
 * <HashRouterProvider>
 *   <YourApp />
 * </HashRouterProvider>
 * ```
 */
export function HashRouterProvider({ children }: HashRouterProviderProps) {
  const [route, setRoute] = useState<HashRoute>(() => {
    // Initialize with current hash if in browser
    if (typeof window !== 'undefined') {
      return parseHash(window.location.hash)
    }
    return { view: 'home' }
  })

  useEffect(() => {
    // Handler for hash changes
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash))
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    // Initial parse in case hash changed before mount
    handleHashChange()

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  /**
   * Navigate to a new hash
   */
  const navigateTo = (hash: string) => {
    // Ensure hash starts with #
    const formattedHash = hash.startsWith('#') ? hash : `#${hash}`
    window.location.hash = formattedHash
  }

  /**
   * Navigate back in browser history
   */
  const goBack = () => {
    window.history.back()
  }

  const value: HashRouterContextValue = {
    route,
    navigateTo,
    goBack,
  }

  return <HashRouterContext.Provider value={value}>{children}</HashRouterContext.Provider>
}

/**
 * Hook to access the hash router
 *
 * @returns Hash router context value
 * @throws Error if used outside of HashRouterProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { route, navigateTo, goBack } = useHashRouter()
 *
 *   return (
 *     <div>
 *       <p>Current view: {route.view}</p>
 *       <button onClick={() => navigateTo('gallery/kindergarten')}>
 *         View Gallery
 *       </button>
 *       <button onClick={goBack}>Back</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useHashRouter(): HashRouterContextValue {
  const context = useContext(HashRouterContext)

  if (!context) {
    throw new Error('useHashRouter must be used within a HashRouterProvider')
  }

  return context
}
