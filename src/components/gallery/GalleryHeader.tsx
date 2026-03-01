'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs'
import { usePageTransition } from '@/lib/PageTransitionContext'
import { useLegalOverlay } from '@/lib/LegalOverlayContext'
import { useSiteSettings } from '@/lib/SiteSettingsContext'
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
  const settings = useSiteSettings()
  const titleRef = useRef<HTMLHeadingElement>(null)
  // Hide title during transitions (both forward and backward)
  const isTransitioning = transition.isActive && transition.phase === 'animating'
  const [textVisible, setTextVisible] = useState(!isTransitioning)

  const isForwardTransition = transition.isActive && transition.direction === 'forward'
  const isBackwardTransition = transition.isActive && transition.direction === 'backward'

  useEffect(() => {
    if (isForwardTransition && transition.phase === 'animating') {
      // Show text at halfway point of animation
      const timer = setTimeout(() => {
        setTextVisible(true)
      }, 300)
      return () => clearTimeout(timer)
    } else if (isBackwardTransition && transition.phase === 'animating') {
      // Hide text during backward transition
      setTextVisible(false)
    } else if (!transition.isActive) {
      setTextVisible(true)
    }
  }, [isForwardTransition, isBackwardTransition, transition.phase, transition.isActive])

  const handleBackClick = () => {
    if (!titleRef.current) return

    // Start reverse transition using stored tile rect and current title position
    const titleRect = titleRef.current.getBoundingClientRect()
    startReverseTransition(categorySlug, titleRect)

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
          {settings.photographerName}
        </Link>
        <span className={styles.brandingSeparator}>/</span>
        <Link href="/" className={styles.brandingLink} onClick={(e) => { e.preventDefault(); handleBackClick(); }}>
          {settings.brandName}
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
          ref={titleRef}
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
