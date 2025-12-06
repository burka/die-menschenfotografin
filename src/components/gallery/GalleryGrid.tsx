'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useGalleryTransition, zoomTransition } from '@/lib/useGalleryTransition'
import { GalleryImage as GalleryImageComponent } from './GalleryImage'
import type { GalleryImage as GalleryImageType } from '@/types/gallery'
import styles from './GalleryGrid.module.css'

interface GalleryGridProps {
  images: GalleryImageType[]
  onImageClick: (image: GalleryImageType, rect: DOMRect) => void
  isTransitioning?: boolean
  targetImageId?: string | null
  transitionDirection?: 'opening' | 'closing' | null
  className?: string
}

export function GalleryGrid({
  images,
  onImageClick,
  isTransitioning: externalTransitioning,
  targetImageId: externalTargetId,
  transitionDirection: externalDirection,
  className,
}: GalleryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const { isTransitioning, direction, targetImageId, getZoomTransform } = useGalleryTransition()

  // Use external props if provided, otherwise use context
  const activeTransitioning = externalTransitioning ?? isTransitioning
  const activeTargetId = externalTargetId ?? targetImageId
  const activeDirection = externalDirection ?? direction

  // Get zoom transform (returns null if not transitioning)
  const zoomTransform = getZoomTransform()

  // Calculate states based on direction
  const isOpening = activeDirection === 'opening'
  const isClosing = activeDirection === 'closing'

  // Grid animation values
  const zoomedState = zoomTransform
    ? {
        scale: zoomTransform.scale,
        x: zoomTransform.x,
        y: zoomTransform.y,
      }
    : { scale: 1, x: 0, y: 0 }

  const normalState = { scale: 1, x: 0, y: 0 }

  // For opening: start normal, animate to zoomed
  // For closing: start zoomed, animate to normal
  // For idle: normal
  const gridInitial = isClosing ? { opacity: 1, ...zoomedState } : { opacity: 0, ...normalState }
  const gridAnimate = isOpening ? { opacity: 1, ...zoomedState } : { opacity: 1, ...normalState }

  const handleImageClick = (image: GalleryImageType, rect: DOMRect) => {
    if (activeTransitioning || !gridRef.current) return
    onImageClick(image, rect)
  }

  return (
    <motion.div
      ref={gridRef}
      className={`${styles.galleryGrid} ${className || ''}`}
      initial={gridInitial}
      animate={gridAnimate}
      style={{
        transformOrigin: zoomTransform
          ? `${zoomTransform.originX} ${zoomTransform.originY}`
          : '50% 50%',
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: zoomTransition,
        x: zoomTransition,
        y: zoomTransition,
      }}
      suppressHydrationWarning
    >
      {images.map((image, index) => {
        const isTargetImage = activeTargetId === image.id

        return (
          <GalleryImageComponent
            key={image.id}
            image={image}
            onClick={(rect) => handleImageClick(image, rect)}
            isTarget={isTargetImage}
            shouldFade={isClosing}
            isTransitioning={activeTransitioning}
            index={index}
          />
        )
      })}
    </motion.div>
  )
}
