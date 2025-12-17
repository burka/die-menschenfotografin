import { useEffect, useRef, useState, useCallback } from 'react'
import { calculateSectionHeights } from '@/lib/services/SectionHeightCalculator'
import { VALID_CATEGORIES } from '@/lib/navigation/types'

// Configuration for height distribution
// Total available height = 100vh - branding (8vh) - padding (~2vh) = ~90vh
const AVAILABLE_HEIGHT_VH = 90
const HEIGHT_CONFIG = {
  activeToInactiveRatio: 5.5,
  minHeightPercent: 10,
  maxHeightPercent: 58,
}

interface TileHeights {
  [slug: string]: number // Height in vh
}

interface UseMobileScrollActivationReturn {
  activeCategory: string | null
  tileHeights: TileHeights
  scrollProgress: number // 0 to 1 representing progress through all sections
  observeElement: (slug: string, element: HTMLElement | null) => void
  unobserveElement: (slug: string) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function useMobileScrollActivation(
  enabled: boolean = true,
): UseMobileScrollActivationReturn {
  const [activeCategory, setActiveCategory] = useState<string | null>(VALID_CATEGORIES[0])
  const [scrollProgress, setScrollProgress] = useState(0)
  const [tileHeights, setTileHeights] = useState<TileHeights>(() => {
    // Initial state: calculate heights for scroll position 0
    const result = calculateSectionHeights(VALID_CATEGORIES.length, 0, HEIGHT_CONFIG)
    const heights: TileHeights = {}
    VALID_CATEGORIES.forEach((slug, index) => {
      // Convert percentage of available height to vh
      heights[slug] = (result.heights[index] / 100) * AVAILABLE_HEIGHT_VH
    })
    return heights
  })

  const elementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Handle scroll events - directly update heights based on scroll position
  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return

      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight - container.clientHeight

      // Calculate progress (0 to 1)
      const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0

      setScrollProgress(progress)

      // Use the pure calculator service - guaranteed to sum correctly
      const result = calculateSectionHeights(VALID_CATEGORIES.length, progress, HEIGHT_CONFIG)

      // Convert percentages to vh values
      const heights: TileHeights = {}
      VALID_CATEGORIES.forEach((slug, index) => {
        heights[slug] = (result.heights[index] / 100) * AVAILABLE_HEIGHT_VH
      })

      setTileHeights(heights)
      setActiveCategory(VALID_CATEGORIES[result.activeIndex] || null)
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
  }, [enabled])

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
