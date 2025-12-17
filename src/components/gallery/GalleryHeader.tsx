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
  const [textVisible, setTextVisible] = useState(skipEntryAnimation)

  useEffect(() => {
    // Skip fade-in animation if coming from view transition
    if (skipEntryAnimation) {
      setTextVisible(true)
      return
    }
    // Simple fade in after mount
    const timer = setTimeout(() => {
      setTextVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [skipEntryAnimation])

  // View transition names - must match HomeTile for animation
  const imageViewTransitionName = VIEW_TRANSITION_NAMES.categoryImage(categorySlug)
  const titleViewTransitionName = VIEW_TRANSITION_NAMES.categoryTitle(categorySlug)

  return (
    <div className={styles.header}>
      <div className={styles.heroImageWrapper}>
        <img
          src={heroImage}
          alt={title}
          className={styles.heroImage}
          style={{ viewTransitionName: imageViewTransitionName }}
        />
        <div className={styles.overlay} />
      </div>

      {/* Top right branding */}
      <motion.div
        className={styles.topBranding}
        initial={{ opacity: 0, y: -10 }}
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
          transition={{ duration: skipEntryAnimation ? 0 : 0.4, delay: skipEntryAnimation ? 0 : 0.05 }}
          style={{ viewTransitionName: titleViewTransitionName }}
          suppressHydrationWarning
        >
          {title}
        </motion.h1>
      </div>

      {/* Mobile legal links */}
      <motion.div
        className={styles.mobileLegalLinks}
        initial={{ opacity: 0 }}
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
