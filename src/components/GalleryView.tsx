'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useHashRouter } from '@/lib/hashRouter'
import type { GalleryImage } from '@/types/gallery'
import styles from './GalleryView.module.css'

interface GalleryViewProps {
  categorySlug: string
  images: GalleryImage[]
  categoryTitle: string
}

interface ZoomState {
  scale: number
  x: number
  y: number
}

export function GalleryView({ categorySlug, images, categoryTitle }: GalleryViewProps) {
  const { navigateTo } = useHashRouter()
  const [zoomState, setZoomState] = useState<ZoomState>({ scale: 1, x: 0, y: 0 })
  const [isZooming, setIsZooming] = useState(false)

  const handleImageClick = (image: GalleryImage, event: React.MouseEvent<HTMLImageElement>) => {
    if (isZooming) return

    const target = event.currentTarget
    const rect = target.getBoundingClientRect()

    // Calculate the center of the clicked image relative to viewport
    const imageCenterX = rect.left + rect.width / 2
    const imageCenterY = rect.top + rect.height / 2

    // Viewport center
    const viewportCenterX = window.innerWidth / 2
    const viewportCenterY = window.innerHeight / 2

    // Calculate scale to make image fill most of the viewport
    const targetScale = Math.min(
      (window.innerWidth * 0.9) / rect.width,
      (window.innerHeight * 0.85) / rect.height
    )

    // Calculate translation to center the clicked image
    // We need to account for the scale transform origin (center of gallery)
    const translateX = (viewportCenterX - imageCenterX) / targetScale
    const translateY = (viewportCenterY - imageCenterY) / targetScale

    setIsZooming(true)
    setZoomState({ scale: targetScale, x: translateX, y: translateY })

    // Navigate after zoom animation completes
    setTimeout(() => {
      navigateTo(`gallery/${categorySlug}/${image.id}`)
    }, 700)
  }

  return (
    <div className={styles.wrapper}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isZooming ? 0 : 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {categoryTitle}
      </motion.h1>

      <motion.div
        className={styles.galleryGrid}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: zoomState.scale,
          x: zoomState.x,
          y: zoomState.y,
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.2 },
          scale: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
          x: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
          y: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
        }}
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
            whileHover={!isZooming ? { scale: 1.05, transition: { duration: 0.2 } } : {}}
          >
            <img
              src={image.src}
              alt={image.alt}
              onClick={(e) => handleImageClick(image, e)}
              className={styles.image}
              style={{ cursor: isZooming ? 'default' : 'pointer' }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
