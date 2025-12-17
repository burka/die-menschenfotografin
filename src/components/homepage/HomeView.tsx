'use client'

import { useCallback, useState } from 'react'
import { useNavigation } from '@/lib/navigation'
import { HomeTileGrid } from './HomeTileGrid'
import { DynamicBackground } from './DynamicBackground'
import { CATEGORIES } from '@/data/categories'
import styles from './HomeView.module.css'

export function HomeView() {
  const { state, toGallery } = useNavigation()
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const handleTileClick = useCallback(
    (slug: string, _rect: DOMRect, _titleRect: DOMRect) => {
      toGallery(slug)
    },
    [toGallery],
  )

  // Get background image from hovered category
  const backgroundImage = hoveredCategory
    ? (CATEGORIES.find((c) => c.slug === hoveredCategory)?.backgroundBokeh ?? null)
    : null

  // Skip entry animation when returning from gallery view (view transition handles it)
  const skipEntryAnimation = state.previousView === 'gallery'

  return (
    <div className={styles.container}>
      <DynamicBackground backgroundImage={backgroundImage} />
      <HomeTileGrid
        onTileClick={handleTileClick}
        onTileHover={setHoveredCategory}
        hoveredCategory={hoveredCategory}
        skipEntryAnimation={skipEntryAnimation}
      />
    </div>
  )
}
