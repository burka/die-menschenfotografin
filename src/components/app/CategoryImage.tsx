'use client'

import { memo } from 'react'
import { VIEW_TRANSITION_NAMES } from '@/lib/navigation/types'
import type { CategoryTile } from '@/types/homepage'
import styles from './CategoryImage.module.css'

export type ImagePosition = 'tile' | 'header' | 'hidden'

interface CategoryImageProps {
  category: CategoryTile
  position: ImagePosition
  isHovered?: boolean
  isAnyHovered?: boolean
}

export const CategoryImage = memo(function CategoryImage({
  category,
  position,
  isHovered = false,
  isAnyHovered = false,
}: CategoryImageProps) {
  const viewTransitionName = VIEW_TRANSITION_NAMES.categoryImage(category.slug)

  return (
    <div
      className={styles.imageWrapper}
      data-position={position}
      data-hover={isHovered}
      data-any-hover={isAnyHovered}
      data-category={category.slug}
      style={{ viewTransitionName }}
    >
      <img
        src={category.previewImage}
        alt={category.title}
        className={styles.image}
        loading="eager"
        decoding="async"
      />
      <div className={styles.overlay} />
    </div>
  )
})
