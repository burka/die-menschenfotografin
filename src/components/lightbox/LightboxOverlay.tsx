'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { fadeTransition } from '@/lib/useGalleryTransition'
import styles from './LightboxOverlay.module.css'

export interface LightboxOverlayProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  isClosing?: boolean
  isOpening?: boolean
}

/**
 * LightboxOverlay Component
 *
 * Provides a fullscreen overlay backdrop with portal rendering.
 * Handles click-outside-to-close and keyboard events.
 */
export function LightboxOverlay({
  isOpen,
  onClose,
  children,
  isClosing = false,
  isOpening = false,
}: LightboxOverlayProps) {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isClosing) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isClosing, onClose])

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle click on backdrop to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isClosing) {
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <motion.div
      className={styles.overlay}
      onClick={handleOverlayClick}
      initial={{ opacity: isOpening ? 0 : 1 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      transition={fadeTransition}
      aria-modal="true"
      role="dialog"
    >
      {children}
    </motion.div>,
    document.body
  )
}
