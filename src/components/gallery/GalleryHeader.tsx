'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs'
import { usePageTransition } from '@/lib/PageTransitionContext'
import { useLegalOverlay } from '@/lib/LegalOverlayContext'
import styles from './GalleryHeader.module.css'

interface GalleryHeaderProps {
  title: string
  heroImage: string
  breadcrumbs: BreadcrumbItem[]
  categorySlug: string
}

export function GalleryHeader({ title, heroImage, breadcrumbs, categorySlug }: GalleryHeaderProps) {
  const router = useRouter()
  const { transition, startReverseTransition } = usePageTransition()
  const { openLegal } = useLegalOverlay()
  const [textVisible, setTextVisible] = useState(!transition.isActive || transition.direction === 'backward')

  const isForwardTransition = transition.isActive && transition.direction === 'forward'

  useEffect(() => {
    if (isForwardTransition && transition.phase === 'animating') {
      // Show text at halfway point of animation
      const timer = setTimeout(() => {
        setTextVisible(true)
      }, 300)
      return () => clearTimeout(timer)
    } else if (!transition.isActive) {
      setTextVisible(true)
    }
  }, [isForwardTransition, transition.phase, transition.isActive])

  const handleBackClick = () => {
    // Start reverse transition using stored tile rect
    startReverseTransition(categorySlug)

    setTimeout(() => {
      router.push('/')
    }, 50)
  }

  return (
    <div className={styles.header}>
      <div className={styles.heroImageWrapper}>
        {/* Image always renders - overlay fades out to reveal it */}
        <img src={heroImage} alt={title} className={styles.heroImage} />
        <div className={styles.overlay} />
      </div>

      {/* Top right branding */}
      <motion.div
        className={styles.topBranding}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : -10 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Link href="/" className={styles.brandingLink} onClick={(e) => { e.preventDefault(); handleBackClick(); }}>
          Kathrin Krause
        </Link>
        <span className={styles.brandingSeparator}>/</span>
        <Link href="/" className={styles.brandingLink} onClick={(e) => { e.preventDefault(); handleBackClick(); }}>
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
          <Breadcrumbs items={breadcrumbs} className={styles.breadcrumbs} onHomeClick={handleBackClick} />
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
    </div>
  )
}
