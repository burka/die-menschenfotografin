import { useEffect, useRef, useState, useCallback } from 'react'

interface UseMobileScrollActivationReturn {
  activeCategory: string | null
  observeElement: (slug: string, element: HTMLElement | null) => void
  unobserveElement: (slug: string) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

// First category slug for initial activation
const FIRST_CATEGORY_SLUG = 'business-event'

export function useMobileScrollActivation(
  enabled: boolean = true,
): UseMobileScrollActivationReturn {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const containerRef = useRef<HTMLDivElement | null>(null)
  const initializedRef = useRef(false)

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

  // Initialize first category as active on mobile
  useEffect(() => {
    if (enabled && isMobile && !initializedRef.current) {
      initializedRef.current = true
      setActiveCategory(FIRST_CATEGORY_SLUG)
    }
  }, [enabled, isMobile])

  // Use scroll-based detection: find element closest to viewport top
  useEffect(() => {
    if (!enabled || !isMobile) return

    const findActiveElement = () => {
      if (elementsRef.current.size === 0) return

      const viewportTop = 80 // Offset from top to determine "active" zone
      let closestSlug: string | null = null
      let closestDistance = Infinity

      elementsRef.current.forEach((element, slug) => {
        const rect = element.getBoundingClientRect()
        // Distance from element top to viewport target position
        const distance = Math.abs(rect.top - viewportTop)

        // Only consider elements that are at least partially visible
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (distance < closestDistance) {
            closestDistance = distance
            closestSlug = slug
          }
        }
      })

      if (closestSlug) {
        setActiveCategory(closestSlug)
      }
    }

    const container = containerRef.current
    if (!container) {
      // Fallback: listen to window scroll
      window.addEventListener('scroll', findActiveElement, { passive: true })
      return () => window.removeEventListener('scroll', findActiveElement)
    }

    // Listen for scroll events on the container
    container.addEventListener('scroll', findActiveElement, { passive: true })
    // Also listen to touch events for better mobile support
    container.addEventListener('touchmove', findActiveElement, { passive: true })

    return () => {
      container.removeEventListener('scroll', findActiveElement)
      container.removeEventListener('touchmove', findActiveElement)
    }
  }, [enabled, isMobile])

  const observeElement = useCallback(
    (slug: string, element: HTMLElement | null) => {
      if (element) {
        element.setAttribute('data-slug', slug)
        elementsRef.current.set(slug, element)
      } else {
        elementsRef.current.delete(slug)
      }
    },
    [],
  )

  const unobserveElement = useCallback((slug: string) => {
    elementsRef.current.delete(slug)
  }, [])

  return {
    activeCategory,
    observeElement,
    unobserveElement,
    containerRef,
  }
}
