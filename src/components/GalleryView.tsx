'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useHashRouter } from '@/lib/hashRouter'
import type { GalleryImage } from '@/types/gallery'
import styles from './GalleryView.module.css'

interface GalleryViewProps {
  categorySlug: string
  images: GalleryImage[]
  categoryTitle: string
}

export function GalleryView({ categorySlug, images, categoryTitle }: GalleryViewProps) {
  const { navigateTo } = useHashRouter()
  const gridRef = useRef<HTMLDivElement>(null)
  const [clickedImageRect, setClickedImageRect] = useState<DOMRect | null>(null)
  const [gridRect, setGridRect] = useState<DOMRect | null>(null)
  const [targetImage, setTargetImage] = useState<GalleryImage | null>(null)

  const handleImageClick = (image: GalleryImage, event: React.MouseEvent<HTMLImageElement>) => {
    if (targetImage || !gridRef.current) return // Already animating

    const imageRect = event.currentTarget.getBoundingClientRect()
    const containerRect = gridRef.current.getBoundingClientRect()

    setClickedImageRect(imageRect)
    setGridRect(containerRect)
    setTargetImage(image)

    // Navigate after animation completes
    setTimeout(() => {
      navigateTo(`gallery/${categorySlug}/${image.id}`)
    }, 700)
  }

  // Calculate animation values when we have a clicked image
  const getAnimationProps = () => {
    if (!clickedImageRect || !gridRect) {
      return { scale: 1, x: 0, y: 0, originX: '50%', originY: '50%' }
    }

    // Image center in viewport
    const imageCenterX = clickedImageRect.left + clickedImageRect.width / 2
    const imageCenterY = clickedImageRect.top + clickedImageRect.height / 2

    // Transform origin as percentage within the grid
    const originXPercent = ((imageCenterX - gridRect.left) / gridRect.width) * 100
    const originYPercent = ((imageCenterY - gridRect.top) / gridRect.height) * 100

    // Viewport center
    const viewportCenterX = window.innerWidth / 2
    const viewportCenterY = window.innerHeight / 2

    // Scale to fill viewport
    const targetScale = Math.min(
      (window.innerWidth * 0.9) / clickedImageRect.width,
      (window.innerHeight * 0.85) / clickedImageRect.height
    )

    // Move the origin point (clicked image) to viewport center
    const deltaX = viewportCenterX - imageCenterX
    const deltaY = viewportCenterY - imageCenterY

    return {
      scale: targetScale,
      x: deltaX,
      y: deltaY,
      originX: `${originXPercent}%`,
      originY: `${originYPercent}%`,
    }
  }

  const animationProps = getAnimationProps()

  return (
    <div className={styles.wrapper}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: targetImage ? 0 : 1, y: 0 }}
        transition={{ duration: 0.5 }}
        suppressHydrationWarning
      >
        {categoryTitle}
      </motion.h1>

      <motion.div
        ref={gridRef}
        className={styles.galleryGrid}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: animationProps.scale,
          x: animationProps.x,
          y: animationProps.y,
        }}
        style={{
          transformOrigin: `${animationProps.originX} ${animationProps.originY}`,
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.2 },
          scale: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
          x: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
          y: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
        }}
        suppressHydrationWarning
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className={styles.imageWrapper}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.3 + index * 0.05,
            }}
            whileHover={!targetImage ? { scale: 1.05, transition: { duration: 0.2 } } : {}}
            suppressHydrationWarning
          >
            <img
              src={image.src}
              alt={image.alt}
              onClick={(e) => handleImageClick(image, e)}
              className={styles.image}
              style={{ cursor: targetImage ? 'default' : 'pointer' }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
