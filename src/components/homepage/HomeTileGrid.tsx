'use client'

import { useRef, useEffect } from 'react'
import { CATEGORIES } from '@/data/categories'
import { useHomeTileInteraction } from '@/lib/hooks/useHomeTileInteraction'
import { BrandingOverlay } from './BrandingOverlay'
import { HomeTile } from './HomeTile'
import styles from './HomeTileGrid.module.css'

interface HomeTileGridProps {
  onTileClick?: (slug: string, rect: DOMRect, titleRect: DOMRect) => void
  onTileHover?: (slug: string | null) => void
  hoveredCategory?: string | null
  skipEntryAnimation?: boolean
}

export function HomeTileGrid({ onTileClick, onTileHover, skipEntryAnimation }: HomeTileGridProps) {
  const {
    activeCategory,
    handleTileEnter,
    handleTileLeave,
    getTileState,
    getTileHeight,
    observeElement,
    unobserveElement,
    containerRef,
    isMobile,
  } = useHomeTileInteraction()

  // Refs for tile elements to enable scroll observation on mobile
  const tileRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

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

  // Split categories into top row (0,1) and bottom row (2,3)
  const topCategories = CATEGORIES.slice(0, 2)
  const bottomCategories = CATEGORIES.slice(2, 4)

  // Get height style for a tile (only on mobile)
  const getTileStyle = (slug: string): React.CSSProperties => {
    const height = getTileHeight(slug)
    if (height === undefined) return {}
    return { height: `${height}vh` }
  }

  // Handle tile hover with both internal state and external callback
  const handleEnter = (slug: string) => {
    handleTileEnter(slug)
    onTileHover?.(slug)
  }

  const handleLeave = () => {
    handleTileLeave()
    onTileHover?.(null)
  }

  return (
    <div className={styles.container} ref={containerRef}>
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
                onMouseEnter={() => handleEnter(category.slug)}
                onMouseLeave={handleLeave}
                onClick={(rect, titleRect) => onTileClick?.(category.slug, rect, titleRect)}
                skipEntryAnimation={skipEntryAnimation}
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
                onMouseEnter={() => handleEnter(category.slug)}
                onMouseLeave={handleLeave}
                onClick={(rect, titleRect) => onTileClick?.(category.slug, rect, titleRect)}
                skipEntryAnimation={skipEntryAnimation}
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
