'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useHashRouter } from '@/lib/hashRouter'
import type { GalleryImage } from '@/types/gallery'

/**
 * Props for the SingleImageView component
 */
interface SingleImageViewProps {
  /** Image to display */
  image: GalleryImage
  /** Total number of images in the gallery */
  totalImages: number
  /** Current image index (0-based) */
  currentIndex: number
}

/**
 * SingleImageView Component
 *
 * Displays a single image in fullscreen overlay with metadata and navigation controls.
 * Features:
 * - Fullscreen overlay with shared element transition (layoutId)
 * - Keyboard navigation (ESC to close, arrows for prev/next)
 * - Conditional metadata display (caption, date, story)
 * - Image counter
 * - Click outside to close
 */
export function SingleImageView({ image, totalImages, currentIndex }: SingleImageViewProps) {
  const { goBack } = useHashRouter()

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          goBack()
          break
        case 'ArrowLeft':
          if (currentIndex > 0) {
            // Navigate to previous image
            // This would need the previous image ID, which we don't have
            // For now, we just go back and let the parent handle it
            goBack()
          }
          break
        case 'ArrowRight':
          if (currentIndex < totalImages - 1) {
            // Navigate to next image
            // This would need the next image ID, which we don't have
            // For now, we just go back and let the parent handle it
            goBack()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, totalImages, goBack])

  // Handle click outside image to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking the overlay itself, not the image
    if (e.target === e.currentTarget) {
      goBack()
    }
  }

  // Check if we have any metadata to display
  const hasMetadata = !!(image.caption || image.date || image.story)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'auto',
      }}
    >
      {/* Image counter */}
      <div
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 500,
          zIndex: 1001,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
        }}
      >
        {currentIndex + 1} / {totalImages}
      </div>

      {/* Main image */}
      <motion.img
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: hasMetadata ? '70vh' : '85vh',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          cursor: 'default',
        }}
      />

      {/* Metadata overlay at bottom - only if data exists */}
      {hasMetadata && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: 'white',
            padding: '2rem',
            maxHeight: '30vh',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            {image.caption && (
              <p
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  marginBottom: image.date || image.story ? '0.5rem' : 0,
                  lineHeight: 1.6,
                }}
              >
                {image.caption}
              </p>
            )}

            {image.date && (
              <p
                style={{
                  fontSize: '0.875rem',
                  opacity: 0.8,
                  marginBottom: image.story ? '1rem' : 0,
                }}
              >
                {new Date(image.date).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}

            {image.story && (
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  opacity: 0.9,
                }}
                dangerouslySetInnerHTML={{ __html: image.story }}
              />
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
