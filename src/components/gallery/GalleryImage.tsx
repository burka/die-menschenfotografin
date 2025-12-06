'use client'

import { motion } from 'framer-motion'
import type { GalleryImage as GalleryImageType } from '@/types/gallery'
import styles from './GalleryImage.module.css'

interface GalleryImageProps {
  image: GalleryImageType
  onClick: (rect: DOMRect) => void
  isTarget: boolean
  shouldFade: boolean
  isTransitioning: boolean
  index: number
}

export function GalleryImage({
  image,
  onClick,
  isTarget,
  shouldFade,
  isTransitioning,
  index,
}: GalleryImageProps) {
  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (isTransitioning) return
    const imageRect = event.currentTarget.getBoundingClientRect()
    onClick(imageRect)
  }

  const getImageInitial = () => {
    if (shouldFade) {
      // When closing, all images start visible (gallery zooms as whole unit)
      return { opacity: 1, scale: 1, filter: 'blur(0px)' }
    }
    // Normal mount: start invisible for staggered entrance
    return { opacity: 0, scale: 0.8, filter: 'blur(0px)' }
  }

  const getImageAnimate = () => {
    if (isTransitioning && !isTarget) {
      // Opening: non-target images fade out (but don't blur for cleaner zoom)
      return { opacity: 0, scale: 1, filter: 'blur(0px)' }
    }
    // Target image or closing/idle: all visible
    return { opacity: 1, scale: 1, filter: 'blur(0px)' }
  }

  const getImageTransition = () => {
    if (isTransitioning && !isTarget) {
      // Fade out during opening (no blur, cleaner zoom effect)
      return {
        opacity: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
        filter: { duration: 0 },
        scale: { duration: 0 },
      }
    }
    if (shouldFade) {
      // No individual animation during closing - gallery handles zoom
      // All images immediately present for smooth zoom-out
      return {
        opacity: { duration: 0 },
        filter: { duration: 0 },
        scale: { duration: 0 },
      }
    }
    // Normal staggered entrance
    return {
      opacity: { duration: 0.5, delay: 0.3 + index * 0.03 },
      scale: { duration: 0.5, delay: 0.3 + index * 0.03 },
      filter: { duration: 0.3 },
    }
  }

  return (
    <motion.div
      className={styles.imageWrapper}
      initial={getImageInitial()}
      animate={getImageAnimate()}
      transition={getImageTransition()}
      whileHover={!isTransitioning ? { scale: 1.05, transition: { duration: 0.2 } } : {}}
      suppressHydrationWarning
    >
      <img
        src={image.src}
        alt={image.alt}
        onClick={handleClick}
        className={styles.image}
        style={{ cursor: isTransitioning ? 'default' : 'pointer' }}
      />
    </motion.div>
  )
}
