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

interface ZoomState {
  scale: number
  x: number
  y: number
  originX: number
  originY: number
}

export function GalleryView({ categorySlug, images, categoryTitle }: GalleryViewProps) {
  const { navigateTo } = useHashRouter()
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: 1,
    x: 0,
    y: 0,
    originX: 50,
    originY: 50
  })
  const [isZooming, setIsZooming] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleImageClick = (image: GalleryImage, event: React.MouseEvent<HTMLImageElement>) => {
    if (isZooming || !containerRef.current) return

    const target = event.currentTarget
    const imageRect = target.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    // Image center in viewport coordinates
    const imageCenterX = imageRect.left + imageRect.width / 2
    const imageCenterY = imageRect.top + imageRect.height / 2

    // Image center relative to container (as percentage for transform-origin)
    const originXPercent = ((imageCenterX - containerRect.left) / containerRect.width) * 100
    const originYPercent = ((imageCenterY - containerRect.top) / containerRect.height) * 100

    // Calculate scale to fill viewport
    const targetScale = Math.min(
      (window.innerWidth * 0.9) / imageRect.width,
      (window.innerHeight * 0.85) / imageRect.height
    )

    // Viewport center
    const viewportCenterX = window.innerWidth / 2
    const viewportCenterY = window.innerHeight / 2

    // Translation needed to move the origin point to viewport center
    const translateX = viewportCenterX - imageCenterX
    const translateY = viewportCenterY - imageCenterY

    setIsZooming(true)
    setZoomState({
      scale: targetScale,
      x: translateX,
      y: translateY,
      originX: originXPercent,
      originY: originYPercent
    })

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
        ref={containerRef}
        className={styles.galleryGrid}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: zoomState.scale,
          x: zoomState.x,
          y: zoomState.y,
        }}
        style={{
          transformOrigin: `${zoomState.originX}% ${zoomState.originY}%`,
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
