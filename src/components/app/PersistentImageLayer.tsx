'use client'

import { CATEGORIES } from '@/data/categories'
import { useNavigation } from '@/lib/navigation'
import { CategoryImage, type ImagePosition } from './CategoryImage'
import styles from './PersistentImageLayer.module.css'

interface PersistentImageLayerProps {
  hoveredCategory?: string | null
}

function getImagePosition(
  view: string,
  activeCategory: string | null,
  slug: string,
): ImagePosition {
  if (view === 'home') {
    return 'tile'
  }
  if ((view === 'gallery' || view === 'lightbox') && activeCategory === slug) {
    return 'header'
  }
  return 'hidden'
}

export function PersistentImageLayer({ hoveredCategory }: PersistentImageLayerProps) {
  const { state } = useNavigation()
  const isAnyHovered = hoveredCategory !== null && hoveredCategory !== undefined

  return (
    <div className={styles.layer} data-view={state.view}>
      {CATEGORIES.map((category) => {
        const position = getImagePosition(state.view, state.activeCategory, category.slug)

        return (
          <div
            key={category.slug}
            className={styles.imageSlot}
            data-category={category.slug}
            data-position={position}
          >
            <CategoryImage
              category={category}
              position={position}
              isHovered={hoveredCategory === category.slug}
              isAnyHovered={isAnyHovered}
            />
          </div>
        )
      })}
    </div>
  )
}
