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
      // When closing, non-target images start hidden/blurred
      return isTarget
        ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
        : { opacity: 0, scale: 1, filter: 'blur(10px)' }
    }
    // Normal mount: start invisible for staggered entrance
    return { opacity: 0, scale: 0.8, filter: 'blur(0px)' }
  }

  const getImageAnimate = () => {
    if (isTransitioning && !isTarget) {
      // Opening: non-target images fade out and blur
      return { opacity: 0, scale: 1, filter: 'blur(10px)' }
    }
    // Target image or closing/idle: all visible
    return { opacity: 1, scale: 1, filter: 'blur(0px)' }
  }

  const getImageTransition = () => {
    if (isTransitioning && !isTarget) {
      // Fade out quickly during opening, or fade in during closing
      return {
        opacity: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
        filter: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
        scale: { duration: 0.3 },
      }
    }
    if (shouldFade && !isTarget) {
      // Fade in during closing
      return {
        opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
        filter: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
        scale: { duration: 0.3 },
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
