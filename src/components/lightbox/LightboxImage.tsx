'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { fadeTransition } from '@/lib/useGalleryTransition'
import styles from './LightboxImage.module.css'

export interface LightboxImageProps {
  image: {
    src: string
    alt: string
    caption?: string
    date?: string
    story?: string
  }
  isAnimating?: boolean
  isClosing?: boolean
  isOpening?: boolean
}

/**
 * LightboxImage Component
 *
 * Displays the main image with optional metadata panel at bottom.
 * Handles image loading states and animations.
 */
export function LightboxImage({
  image,
  isAnimating: _isAnimating = false,
  isClosing = false,
  isOpening = false,
}: LightboxImageProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const hasMetadata = !!(image.caption || image.date || image.story)

  return (
    <>
      {/* Main image */}
      <motion.img
        ref={imageRef}
        src={image.src}
        alt={image.alt}
        className={styles.image}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: isOpening ? 0 : 1, scale: isOpening ? 0.95 : 1 }}
        animate={{
          opacity: isClosing ? 0 : 1,
          scale: isClosing ? 0.95 : 1,
        }}
        transition={fadeTransition}
      />

      {/* Metadata overlay at bottom */}
      {hasMetadata && (
        <motion.div
          className={styles.metadata}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? 20 : 0 }}
          transition={{ ...fadeTransition, delay: isOpening ? 0.4 : 0 }}
        >
          <div className={styles.metadataContent}>
            {image.caption && (
              <p className={styles.caption}>
                {image.caption}
              </p>
            )}

            {image.date && (
              <p className={styles.date}>
                {new Date(image.date).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}

            {image.story && (
              <div
                className={styles.story}
                dangerouslySetInnerHTML={{ __html: image.story }}
              />
            )}
          </div>
        </motion.div>
      )}
    </>
  )
}
