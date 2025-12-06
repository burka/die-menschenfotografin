import { useEffect, useRef, useState, useCallback } from 'react'

interface UseMobileScrollActivationReturn {
  activeCategory: string | null
  observeElement: (slug: string, element: HTMLElement | null) => void
  unobserveElement: (slug: string) => void
}

export function useMobileScrollActivation(
  enabled: boolean = true,
): UseMobileScrollActivationReturn {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const ratiosRef = useRef<Map<string, number>>(new Map())

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  useEffect(() => {
    if (!enabled || !isMobile) {
      // Clean up observer if disabled or not mobile
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      return
    }

    // Create Intersection Observer with custom threshold for smooth transitions
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Update ratios for all observed elements
        entries.forEach((entry) => {
          const slug = entry.target.getAttribute('data-slug')
          if (slug) {
            ratiosRef.current.set(slug, entry.intersectionRatio)
          }
        })

        // Find the element with highest intersection ratio
        let maxRatio = 0
        let mostVisibleSlug: string | null = null

        ratiosRef.current.forEach((ratio, slug) => {
          if (ratio > maxRatio) {
            maxRatio = ratio
            mostVisibleSlug = slug
          }
        })

        // Only update if we have a significantly visible element
        if (mostVisibleSlug && maxRatio > 0.1) {
          setActiveCategory(mostVisibleSlug)
        }
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0.00, 0.01, 0.02, ..., 1.00
        rootMargin: '-20% 0px -20% 0px', // Consider elements more visible when centered
      },
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [enabled, isMobile])

  const observeElement = useCallback(
    (slug: string, element: HTMLElement | null) => {
      if (!enabled || !isMobile || !observerRef.current) return

      // Remove old element if exists
      const oldElement = elementsRef.current.get(slug)
      if (oldElement) {
        observerRef.current.unobserve(oldElement)
      }

      if (element) {
        element.setAttribute('data-slug', slug)
        observerRef.current.observe(element)
        elementsRef.current.set(slug, element)
      } else {
        elementsRef.current.delete(slug)
        ratiosRef.current.delete(slug)
      }
    },
    [enabled, isMobile],
  )

  const unobserveElement = useCallback((slug: string) => {
    if (!observerRef.current) return

    const element = elementsRef.current.get(slug)
    if (element) {
      observerRef.current.unobserve(element)
      elementsRef.current.delete(slug)
      ratiosRef.current.delete(slug)
    }
  }, [])

  return {
    activeCategory,
    observeElement,
    unobserveElement,
  }
}
