'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useHashRouter } from '@/lib/hashRouter'
import { useGalleryTransition, zoomTransition, TRANSITION } from '@/lib/useGalleryTransition'
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
  const { isTransitioning, direction, targetImageId, startOpen, getZoomTransform } =
    useGalleryTransition()

  const handleImageClick = (image: GalleryImage, event: React.MouseEvent<HTMLImageElement>) => {
    if (isTransitioning || !gridRef.current) return

    const imageRect = event.currentTarget.getBoundingClientRect()
    const gridRect = gridRef.current.getBoundingClientRect()

    // Start the opening transition
    startOpen(image.id, imageRect, gridRect)

    // Navigate after animation completes
    setTimeout(() => {
      navigateTo(`gallery/${categorySlug}/${image.id}`)
    }, TRANSITION.duration)
  }

  // Get zoom transform (returns null if not transitioning)
  const zoomTransform = getZoomTransform()

  // Calculate states based on direction
  const isOpening = direction === 'opening'
  const isClosing = direction === 'closing'

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

  return (
    <div className={styles.wrapper}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: isClosing ? 0 : 0, y: -20 }}
        animate={{
          opacity: isTransitioning ? 0 : 1,
          y: 0,
        }}
        transition={{ duration: 0.5, delay: isClosing ? 0.3 : 0 }}
        suppressHydrationWarning
      >
        {categoryTitle}
      </motion.h1>

      <motion.div
        ref={gridRef}
        className={styles.galleryGrid}
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
          const isTargetImage = targetImageId === image.id

          // Opening: target stays visible, others fade out and blur
          // Closing: target stays visible, others fade IN and unblur
          // Idle: all visible

          const getImageInitial = () => {
            if (isClosing) {
              // When closing, non-target images start hidden/blurred
              return isTargetImage
                ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                : { opacity: 0, scale: 1, filter: 'blur(10px)' }
            }
            // Normal mount: start invisible for staggered entrance
            return { opacity: 0, scale: 0.8, filter: 'blur(0px)' }
          }

          const getImageAnimate = () => {
            if (isOpening) {
              // Opening: target visible, others fade out and blur
              return isTargetImage
                ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                : { opacity: 0, scale: 1, filter: 'blur(10px)' }
            }
            // Closing or idle: all visible
            return { opacity: 1, scale: 1, filter: 'blur(0px)' }
          }

          const getImageTransition = () => {
            if (isOpening && !isTargetImage) {
              // Fade out quickly during opening
              return {
                opacity: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
                filter: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
                scale: { duration: 0.3 },
              }
            }
            if (isClosing && !isTargetImage) {
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
              key={image.id}
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
                onClick={(e) => handleImageClick(image, e)}
                className={styles.image}
                style={{ cursor: isTransitioning ? 'default' : 'pointer' }}
              />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
