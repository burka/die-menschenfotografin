import { useEffect, useRef, useState, useCallback } from 'react'

// Category slugs in order
const CATEGORY_ORDER = ['business-event', 'hochzeiten-feiern', 'familie-kind', 'kindergarten']

interface TileHeights {
  [slug: string]: number // Height as percentage (0-100)
}

interface UseMobileScrollActivationReturn {
  activeCategory: string | null
  tileHeights: TileHeights
  scrollProgress: number // 0 to 1 representing progress through all sections
  observeElement: (slug: string, element: HTMLElement | null) => void
  unobserveElement: (slug: string) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

// Height constants
const ACTIVE_HEIGHT = 55 // vh for active tile
const INACTIVE_HEIGHT = 10 // vh for inactive tiles
const BRANDING_HEIGHT = 8 // vh for branding row

export function useMobileScrollActivation(
  enabled: boolean = true,
): UseMobileScrollActivationReturn {
  const [activeCategory, setActiveCategory] = useState<string | null>(CATEGORY_ORDER[0])
  const [scrollProgress, setScrollProgress] = useState(0)
  const [tileHeights, setTileHeights] = useState<TileHeights>(() => {
    // Initial state: first tile active
    const heights: TileHeights = {}
    CATEGORY_ORDER.forEach((slug, index) => {
      heights[slug] = index === 0 ? ACTIVE_HEIGHT : INACTIVE_HEIGHT
    })
    return heights
  })

  const elementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const containerRef = useRef<HTMLDivElement | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
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

  // Calculate tile heights based on scroll progress
  const calculateHeights = useCallback((progress: number) => {
    const numTiles = CATEGORY_ORDER.length
    // Each tile gets an equal portion of the scroll range
    const segmentSize = 1 / numTiles

    const heights: TileHeights = {}
    let newActiveCategory: string | null = null

    CATEGORY_ORDER.forEach((slug, index) => {
      const segmentStart = index * segmentSize
      const segmentEnd = (index + 1) * segmentSize

      // Calculate how "active" this tile is (0 to 1)
      let activation = 0

      if (progress >= segmentStart && progress < segmentEnd) {
        // This tile's segment - it's becoming or is active
        const segmentProgress = (progress - segmentStart) / segmentSize
        // Peak activation at the middle of the segment
        activation = 1 - Math.abs(segmentProgress - 0.5) * 2
        activation = Math.max(0.3, activation) // Minimum activation when in segment
        newActiveCategory = slug
      } else if (index > 0 && progress >= (index - 1) * segmentSize && progress < segmentStart) {
        // Transitioning from previous tile
        const transitionProgress = (progress - (index - 1) * segmentSize) / segmentSize
        activation = transitionProgress * 0.3
      } else if (
        index < numTiles - 1 &&
        progress >= segmentEnd &&
        progress < (index + 2) * segmentSize
      ) {
        // Transitioning to next tile
        const transitionProgress = (progress - segmentEnd) / segmentSize
        activation = (1 - transitionProgress) * 0.3
      }

      // Interpolate height based on activation
      const height = INACTIVE_HEIGHT + activation * (ACTIVE_HEIGHT - INACTIVE_HEIGHT)
      heights[slug] = height
    })

    // Handle edge case: at the very end, last tile is fully active
    if (progress >= 1 - 0.001) {
      newActiveCategory = CATEGORY_ORDER[numTiles - 1]
      heights[CATEGORY_ORDER[numTiles - 1]] = ACTIVE_HEIGHT
    }

    // Handle edge case: at the very beginning, first tile is fully active
    if (progress <= 0.001) {
      newActiveCategory = CATEGORY_ORDER[0]
      heights[CATEGORY_ORDER[0]] = ACTIVE_HEIGHT
    }

    return { heights, activeCategory: newActiveCategory }
  }, [])

  // Handle scroll events - directly update heights based on scroll position
  useEffect(() => {
    if (!enabled || !isMobile) return

    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return

      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight - container.clientHeight

      // Calculate progress (0 to 1)
      const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0

      setScrollProgress(progress)

      const { heights, activeCategory: newActive } = calculateHeights(progress)
      setTileHeights(heights)
      if (newActive) {
        setActiveCategory(newActive)
      }
    }

    const container = containerRef.current
    if (!container) return

    // Initial calculation
    handleScroll()

    // Listen for scroll - using requestAnimationFrame for smooth updates
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    container.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', onScroll)
    }
  }, [enabled, isMobile, calculateHeights])

  const observeElement = useCallback((slug: string, element: HTMLElement | null) => {
    if (element) {
      element.setAttribute('data-slug', slug)
      elementsRef.current.set(slug, element)
    } else {
      elementsRef.current.delete(slug)
    }
  }, [])

  const unobserveElement = useCallback((slug: string) => {
    elementsRef.current.delete(slug)
  }, [])

  return {
    activeCategory,
    tileHeights,
    scrollProgress,
    observeElement,
    unobserveElement,
    containerRef,
  }
}
