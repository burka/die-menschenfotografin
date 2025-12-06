'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  useGalleryTransition,
  fadeTransition,
  TRANSITION,
} from '@/lib/useGalleryTransition'
import type { GalleryImage } from '@/types/gallery'

interface SingleImageViewProps {
  image: GalleryImage
  totalImages: number
  currentIndex: number
  onClose: () => void
  onPrev: (() => void) | null
  onNext: (() => void) | null
}

/**
 * SingleImageView Component
 *
 * Displays a single image in fullscreen overlay with symmetric entrance/exit animations.
 */
export function SingleImageView({
  image,
  totalImages,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: SingleImageViewProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const {
    direction,
    startClose,
    completeTransition,
  } = useGalleryTransition()

  const isClosing = direction === 'closing'
  const isOpening = direction === 'opening'

  // Handle close action
  const handleClose = useCallback(() => {
    if (isClosing) return

    // Start the closing transition
    startClose()

    // Navigate after animation completes
    setTimeout(() => {
      completeTransition()
      onClose()
    }, TRANSITION.duration)
  }, [isClosing, startClose, completeTransition, onClose])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isClosing) return

      switch (e.key) {
        case 'Escape':
          handleClose()
          break
        case 'ArrowLeft':
          if (onPrev) onPrev()
          break
        case 'ArrowRight':
          if (onNext) onNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose, onPrev, onNext, isClosing])

  // Handle click outside image to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const hasMetadata = !!(image.caption || image.date || image.story)

  const navButtonStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
    transition: 'background-color 0.2s, opacity 0.2s',
  }

  return (
    <motion.div
      onClick={handleOverlayClick}
      initial={{ opacity: isOpening ? 0 : 1 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      transition={fadeTransition}
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
      {/* Close button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation()
          handleClose()
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ ...fadeTransition, delay: isOpening ? 0.3 : 0 }}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          fontSize: '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
        }}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        aria-label="Close"
      >
        ✕
      </motion.button>

      {/* Image counter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? -10 : 0 }}
        transition={{ ...fadeTransition, delay: isOpening ? 0.3 : 0 }}
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
      </motion.div>

      {/* Previous button */}
      {onPrev && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ ...fadeTransition, delay: isOpening ? 0.3 : 0 }}
          style={{ ...navButtonStyle, left: '2rem' }}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          aria-label="Previous image"
        >
          ‹
        </motion.button>
      )}

      {/* Next button */}
      {onNext && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ ...fadeTransition, delay: isOpening ? 0.3 : 0 }}
          style={{ ...navButtonStyle, right: '2rem' }}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          aria-label="Next image"
        >
          ›
        </motion.button>
      )}

      {/* Main image */}
      <motion.img
        ref={imageRef}
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: isOpening ? 0 : 1, scale: isOpening ? 0.95 : 1 }}
        animate={{
          opacity: isClosing ? 0 : 1,
          scale: isClosing ? 0.95 : 1,
        }}
        transition={fadeTransition}
        style={{
          maxWidth: '90vw',
          maxHeight: '70vh',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          cursor: 'default',
        }}
      />

      {/* Metadata overlay at bottom */}
      {hasMetadata && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? 20 : 0 }}
          transition={{ ...fadeTransition, delay: isOpening ? 0.4 : 0 }}
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
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
