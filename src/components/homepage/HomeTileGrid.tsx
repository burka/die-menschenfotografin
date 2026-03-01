'use client'

import { useRef, useEffect } from 'react'
import { useHomeTileInteraction } from '@/lib/hooks/useHomeTileInteraction'
import type { CategoryTile } from '@/types/homepage'
import { usePageTransition } from '@/lib/PageTransitionContext'
import { BrandingOverlay } from './BrandingOverlay'
import { DynamicBackground } from './DynamicBackground'
import { HomeTile } from './HomeTile'
import styles from './HomeTileGrid.module.css'

interface HomeTileGridProps {
  categories: CategoryTile[]
  onTileClick?: (slug: string, rect: DOMRect, titleRect: DOMRect) => void
}

export function HomeTileGrid({ categories, onTileClick }: HomeTileGridProps) {
  const {
    activeCategory,
    lastActiveCategory,
    handleTileEnter,
    handleTileLeave,
    getTileState,
    getTileHeight,
    observeElement,
    unobserveElement,
    containerRef,
    isMobile,
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
      ? (categories.find((cat) => cat.slug === lastActiveCategory)?.backgroundBokeh ?? null)
      : null

  // Split categories into top row (0,1) and bottom row (2,3)
  const topCategories = categories.slice(0, 2)
  const bottomCategories = categories.slice(2, 4)

  // Get height style for a tile (only on mobile)
  const getTileStyle = (slug: string): React.CSSProperties => {
    const height = getTileHeight(slug)
    if (height === undefined) return {}
    return { height: `${height}vh` }
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <DynamicBackground backgroundImage={backgroundImage} />

      {/* Sticky content that stays visible while scrolling */}
      <div className={styles.stickyContent}>
        <div className={styles.grid}>
          {/* Top row tiles */}
          {topCategories.map((category, index) => (
            <div
              key={category.slug}
              className={styles.gridItem}
              data-position={index}
              data-state={getTileState(category.slug)}
              style={getTileStyle(category.slug)}
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
              style={getTileStyle(category.slug)}
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

      {/* Scroll spacer - creates scrollable area on mobile */}
      {isMobile && <div className={styles.scrollSpacer} />}
    </div>
  )
}
