'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs'
import { useLegalOverlay } from '@/lib/LegalOverlayContext'
import { VIEW_TRANSITION_NAMES } from '@/lib/navigation/types'
import styles from './GalleryHeader.module.css'

interface GalleryHeaderProps {
  title: string
  heroImage: string
  categorySlug: string
  breadcrumbs: BreadcrumbItem[]
  onBackClick: () => void
  skipEntryAnimation?: boolean
}

export function GalleryHeader({
  title,
  heroImage,
  categorySlug,
  breadcrumbs,
  onBackClick,
  skipEntryAnimation = false,
}: GalleryHeaderProps) {
  const { openLegal } = useLegalOverlay()
  // When coming from view transition, show content immediately
  // When loading directly, fade in after short delay
  const [textVisible, setTextVisible] = useState(skipEntryAnimation)

  useEffect(() => {
    if (skipEntryAnimation) {
      // Already visible
      return
    }
    // Direct page load - fade in after mount
    const timer = setTimeout(() => {
      setTextVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [skipEntryAnimation])

  // View transition name for image - must match HomeTile for animation
  // Title fades in separately (not part of view transition)
  const imageViewTransitionName = VIEW_TRANSITION_NAMES.categoryImage(categorySlug)

  return (
    <div className={styles.header}>
      <div className={styles.heroImageWrapper}>
        <img
          src={heroImage}
          alt={title}
          className={styles.heroImage}
          style={{ viewTransitionName: imageViewTransitionName }}
        />
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Top right branding */}
      <motion.div
        className={styles.topBranding}
        initial={skipEntryAnimation ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : -10 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Link
          href="/"
          className={styles.brandingLink}
          onClick={(e) => {
            e.preventDefault()
            onBackClick()
          }}
        >
          Kathrin Krause
        </Link>
        <span className={styles.brandingSeparator}>/</span>
        <Link
          href="/"
          className={styles.brandingLink}
          onClick={(e) => {
            e.preventDefault()
            onBackClick()
          }}
        >
          die Menschenfotografin
        </Link>
        <span className={styles.brandingSeparator}>/</span>
        <button className={styles.legalLink} onClick={() => openLegal('impressum')}>
          Impressum
        </button>
        <span className={styles.legalSeparator}>&amp;</span>
        <button className={styles.legalLink} onClick={() => openLegal('datenschutz')}>
          Datenschutz
        </button>
      </motion.div>

      <div className={styles.content}>
        <motion.div
          initial={skipEntryAnimation ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : -10 }}
          transition={{ duration: 0.3 }}
        >
          <Breadcrumbs
            items={breadcrumbs}
            className={styles.breadcrumbs}
            onHomeClick={onBackClick}
          />
        </motion.div>
        <motion.h1
          className={styles.title}
          initial={skipEntryAnimation ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          suppressHydrationWarning
        >
          {title}
        </motion.h1>
      </div>

      {/* Mobile legal links */}
      <motion.div
        className={styles.mobileLegalLinks}
        initial={skipEntryAnimation ? false : { opacity: 0 }}
        animate={{ opacity: textVisible ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <button className={styles.legalLink} onClick={() => openLegal('impressum')}>
          Impressum
        </button>
        <span className={styles.legalSeparator}>&amp;</span>
        <button className={styles.legalLink} onClick={() => openLegal('datenschutz')}>
          Datenschutz
        </button>
      </motion.div>
    </div>
  )
}
