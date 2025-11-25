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
}

export function GalleryView({ categorySlug, images, categoryTitle }: GalleryViewProps) {
  const { navigateTo } = useHashRouter()
  const [zoomState, setZoomState] = useState<ZoomState>({ scale: 1, x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleImageClick = (image: GalleryImage, event: React.MouseEvent<HTMLImageElement>) => {
    if (isAnimating) return

    const target = event.currentTarget
    const rect = target.getBoundingClientRect()

    // Calculate the center of the clicked image
    const imageCenterX = rect.left + rect.width / 2
    const imageCenterY = rect.top + rect.height / 2

    // Calculate the viewport center
    const viewportCenterX = window.innerWidth / 2
    const viewportCenterY = window.innerHeight / 2

    // Calculate the translation needed to center the image
    const scale = 2.5
    const translateX = -(imageCenterX - viewportCenterX) * scale
    const translateY = -(imageCenterY - viewportCenterY) * scale

    setIsAnimating(true)
    setZoomState({ scale, x: translateX, y: translateY })

    // Navigate after animation completes
    setTimeout(() => {
      navigateTo(`gallery/${categorySlug}/${image.id}`)
    }, 800)
  }

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <h1 className={styles.title}>{categoryTitle}</h1>

      <motion.div
        className={styles.galleryGrid}
        animate={{
          scale: zoomState.scale,
          x: zoomState.x,
          y: zoomState.y,
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {images.map((image) => (
          <motion.div
            key={image.id}
            className={styles.imageWrapper}
            whileHover={!isAnimating ? { scale: 1.05 } : {}}
            transition={{ duration: 0.2 }}
          >
            <motion.img
              layoutId={image.id}
              src={image.src}
              alt={image.alt}
              onClick={(e) => handleImageClick(image, e)}
              className={styles.image}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
