'use client'

import { motion } from 'framer-motion'
import { fadeTransition } from '@/lib/useGalleryTransition'
import styles from './LightboxNavigation.module.css'

export interface LightboxNavigationProps {
  currentIndex: number
  totalImages: number
  onPrev: (() => void) | null
  onNext: (() => void) | null
  onClose: () => void
  isVisible: boolean
  isClosing?: boolean
  isOpening?: boolean
}

/**
 * LightboxNavigation Component
 *
 * Provides navigation controls for the lightbox:
 * - Close button (top-left)
 * - Image counter (top-right)
 * - Previous/Next buttons (left/right sides)
 */
export function LightboxNavigation({
  currentIndex,
  totalImages,
  onPrev,
  onNext,
  onClose,
  isVisible: _isVisible,
  isClosing = false,
  isOpening = false,
}: LightboxNavigationProps) {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPrev) onPrev()
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onNext) onNext()
  }

  return (
    <>
      {/* Close button */}
      <motion.button
        className={styles.closeButton}
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ ...fadeTransition, delay: isOpening ? 0.3 : 0 }}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        aria-label="Close"
      >
        ✕
      </motion.button>

      {/* Image counter */}
      <motion.div
        className={styles.counter}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? -10 : 0 }}
        transition={{ ...fadeTransition, delay: isOpening ? 0.3 : 0 }}
      >
        {currentIndex + 1} / {totalImages}
      </motion.div>

      {/* Previous button */}
      {onPrev && (
        <motion.button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={handlePrev}
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ ...fadeTransition, delay: isOpening ? 0.3 : 0 }}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          aria-label="Previous image"
        >
          ‹
        </motion.button>
      )}

      {/* Next button */}
      {onNext && (
        <motion.button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={handleNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ ...fadeTransition, delay: isOpening ? 0.3 : 0 }}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          aria-label="Next image"
        >
          ›
        </motion.button>
      )}
    </>
  )
}
