'use client'

import { useRef, useEffect } from 'react'
import { CATEGORIES } from '@/data/categories'
import { useHomeTileInteraction } from '@/lib/hooks/useHomeTileInteraction'
import { usePageTransition } from '@/lib/PageTransitionContext'
import { BrandingOverlay } from './BrandingOverlay'
import { DynamicBackground } from './DynamicBackground'
import { HomeTile } from './HomeTile'
import styles from './HomeTileGrid.module.css'

interface HomeTileGridProps {
  onTileClick?: (slug: string, rect: DOMRect, titleRect: DOMRect) => void
}

export function HomeTileGrid({ onTileClick }: HomeTileGridProps) {
  const {
    activeCategory,
    lastActiveCategory,
    handleTileEnter,
    handleTileLeave,
    getTileState,
    observeElement,
    unobserveElement,
    containerRef,
  } = useHomeTileInteraction()
  const { transition } = usePageTransition()

  // Refs for tile elements to enable scroll observation on mobile
  const tileRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Skip entry animation during backward transition so tiles are immediately visible
  const isBackwardTransition = transition.isActive && transition.direction === 'backward'

  // Set up element observation for mobile scroll detection
  useEffect(() => {
    const currentRefs = tileRefs.current

    Object.entries(currentRefs).forEach(([slug, element]) => {
      observeElement(slug, element)
    })

    return () => {
      Object.keys(currentRefs).forEach((slug) => {
        unobserveElement(slug)
      })
    }
  }, [observeElement, unobserveElement])

  // Use lastActiveCategory for background to persist the image when leaving tiles
  const backgroundImage =
    lastActiveCategory !== null
      ? (CATEGORIES.find((cat) => cat.slug === lastActiveCategory)?.backgroundBokeh ?? null)
      : null

  // Split categories into top row (0,1) and bottom row (2,3)
  const topCategories = CATEGORIES.slice(0, 2)
  const bottomCategories = CATEGORIES.slice(2, 4)

  return (
    <div className={styles.container} ref={containerRef}>
      <DynamicBackground backgroundImage={backgroundImage} />

      <div className={styles.grid}>
        {/* Top row tiles */}
        {topCategories.map((category, index) => (
          <div
            key={category.slug}
            className={styles.gridItem}
            data-position={index}
            data-state={getTileState(category.slug)}
            ref={(el) => {
              tileRefs.current[category.slug] = el
            }}
          >
            <HomeTile
              category={category}
              state={getTileState(category.slug)}
              onMouseEnter={() => handleTileEnter(category.slug)}
              onMouseLeave={handleTileLeave}
              onClick={(rect, titleRect) => onTileClick?.(category.slug, rect, titleRect)}
              skipEntryAnimation={isBackwardTransition}
            />
          </div>
        ))}

        {/* Branding row between top and bottom tiles */}
        <div className={styles.brandingRow}>
          <BrandingOverlay isAnyTileActive={activeCategory !== null} />
        </div>

        {/* Bottom row tiles */}
        {bottomCategories.map((category, index) => (
          <div
            key={category.slug}
            className={styles.gridItem}
            data-position={index + 2}
            data-state={getTileState(category.slug)}
            ref={(el) => {
              tileRefs.current[category.slug] = el
            }}
          >
            <HomeTile
              category={category}
              state={getTileState(category.slug)}
              onMouseEnter={() => handleTileEnter(category.slug)}
              onMouseLeave={handleTileLeave}
              onClick={(rect, titleRect) => onTileClick?.(category.slug, rect, titleRect)}
              skipEntryAnimation={isBackwardTransition}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
