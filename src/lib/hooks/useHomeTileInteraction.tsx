import { useState, useCallback, useRef, useEffect } from 'react'
import { TileState } from '@/types/homepage'
import { useMobileScrollActivation } from './useMobileScrollActivation'

interface UseHomeTileInteractionReturn {
  activeCategory: string | null
  lastActiveCategory: string | null
  handleTileEnter: (slug: string) => void
  handleTileLeave: () => void
  getTileState: (slug: string) => TileState
  observeElement: (slug: string, element: HTMLElement | null) => void
  unobserveElement: (slug: string) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

// Delay before deactivating to prevent flicker when switching tiles
const DEACTIVATION_DELAY = 100

export function useHomeTileInteraction(): UseHomeTileInteractionReturn {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [lastActiveCategory, setLastActiveCategory] = useState<string | null>(null)
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      // Enable for testing when URL contains ?mobile=true
      const urlParams =
        typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      const forceMobile = urlParams?.get('mobile') === 'true'
      const mobile = forceMobile || (typeof window !== 'undefined' && window.innerWidth <= 768)
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const {
    activeCategory: scrollActiveCategory,
    observeElement,
    unobserveElement,
    containerRef,
  } = useMobileScrollActivation(isMobile)

  // Use scroll-based active category on mobile, hover-based on desktop
  const effectiveActiveCategory = isMobile ? scrollActiveCategory : activeCategory

  // Update last active category when effective active category changes
  useEffect(() => {
    if (effectiveActiveCategory !== null) {
      setLastActiveCategory(effectiveActiveCategory)
    }
  }, [effectiveActiveCategory])

  const handleTileEnter = useCallback(
    (slug: string) => {
      // Only handle hover on desktop
      if (isMobile) return

      // Cancel any pending deactivation
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
        leaveTimeoutRef.current = null
      }
      setActiveCategory(slug)
      setLastActiveCategory(slug)
    },
    [isMobile],
  )

  const handleTileLeave = useCallback(() => {
    // Only handle hover on desktop
    if (isMobile) return

    // Delay deactivation to allow switching between tiles smoothly
    // Only deactivate the active state, keep lastActiveCategory for background
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null)
      leaveTimeoutRef.current = null
    }, DEACTIVATION_DELAY)
  }, [isMobile])

  const getTileState = useCallback(
    (slug: string): TileState => {
      if (effectiveActiveCategory === null) {
        return 'default'
      }
      return effectiveActiveCategory === slug ? 'active' : 'inactive'
    },
    [effectiveActiveCategory],
  )

  return {
    activeCategory: effectiveActiveCategory,
    lastActiveCategory,
    handleTileEnter,
    handleTileLeave,
    getTileState,
    observeElement,
    unobserveElement,
    containerRef,
  }
}
