'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs'
import { useLegalOverlay } from '@/lib/LegalOverlayContext'
import styles from './GalleryHeader.module.css'

interface GalleryHeaderProps {
  title: string
  breadcrumbs: BreadcrumbItem[]
  onBackClick: () => void
}

export function GalleryHeader({
  title,
  breadcrumbs,
  onBackClick,
}: GalleryHeaderProps) {
  const { openLegal } = useLegalOverlay()
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    // Simple fade in after mount
    const timer = setTimeout(() => {
      setTextVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.header}>
      {/* Hero image comes from PersistentImageLayer */}

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
          initial={{ opacity: 0, y: -10 }}
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
          initial={{ opacity: 0, y: 20 }}
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
