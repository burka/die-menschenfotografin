'use client'

import { useCallback } from 'react'
import { useNavigation } from '@/lib/navigation'
import { useBackground } from '@/lib/BackgroundContext'
import { HomeTileGrid } from './HomeTileGrid'
import styles from './HomeView.module.css'

export function HomeView() {
  const { state, toGallery } = useNavigation()
  const { setHoveredCategory } = useBackground()

  const handleTileClick = useCallback(
    (slug: string, _rect: DOMRect, _titleRect: DOMRect) => {
      toGallery(slug)
    },
    [toGallery],
  )

  // Skip entry animation when returning from gallery view (view transition handles it)
  const skipEntryAnimation = state.previousView === 'gallery'

  return (
    <div className={styles.container}>
      {/* DynamicBackground is now rendered at AppShell level */}
      <HomeTileGrid
        onTileClick={handleTileClick}
        onTileHover={setHoveredCategory}
        skipEntryAnimation={skipEntryAnimation}
      />
    </div>
  )
}
