'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CategoryTile, TileState } from '@/types/homepage'
import { usePageTransition } from '@/lib/PageTransitionContext'
import styles from './HomeTile.module.css'

interface HomeTileProps {
  category: CategoryTile
  state: TileState
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick?: (rect: DOMRect, titleRect: DOMRect) => void
  skipEntryAnimation?: boolean
}

const TRANSITION_EASING = [0.4, 0, 0.2, 1] as const
const HOVER_DURATION = 0.5
const ENTRY_DURATION = 0.7

const getScaleForState = (state: TileState, isMobile: boolean): number => {
  // On mobile, height is controlled via CSS, no scaling needed
  if (isMobile) return 1

  switch (state) {
    case 'active':
      return 1.5
    case 'inactive':
      return 0.5
    default:
      return 1
  }
}

const getFilterForState = (state: TileState, isMobile: boolean): string => {
  // On mobile, inactive tiles hide the image via CSS opacity, no filter needed
  if (isMobile) return 'blur(0px) grayscale(0%)'

  if (state === 'inactive') {
    return 'blur(4px) grayscale(50%)'
  }
  return 'blur(0px) grayscale(0%)'
}

// Image zoom: cropped (1.3x) when idle, full (1x) when active
const getImageScaleForState = (state: TileState): number => {
  return state === 'active' ? 1 : 1.3
}

export function HomeTile({
  category,
  state,
  onMouseEnter,
  onMouseLeave,
  onClick,
  skipEntryAnimation = false,
}: HomeTileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { transition } = usePageTransition()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const forceMobile = urlParams.get('mobile') === 'true'
      setIsMobile(forceMobile || window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Hide title when this tile is the target of an active transition
  const isTransitioning =
    transition.isActive &&
    transition.phase === 'animating' &&
    transition.targetSlug === category.slug

  const handleClick = () => {
    if (containerRef.current && titleRef.current && onClick) {
      const rect = containerRef.current.getBoundingClientRect()
      const titleRect = titleRef.current.getBoundingClientRect()
      onClick(rect, titleRect)
    }
  }

  return (
    <motion.div
      ref={containerRef}
      className={styles.container}
      data-mobile-state={isMobile ? state : undefined}
      initial={skipEntryAnimation ? false : { opacity: 0, filter: 'blur(20px)' }}
      animate={{
        opacity: 1,
        scale: getScaleForState(state, isMobile),
        filter: getFilterForState(state, isMobile),
      }}
      transition={{
        opacity: { duration: skipEntryAnimation ? 0 : ENTRY_DURATION, ease: TRANSITION_EASING },
        filter: { duration: skipEntryAnimation ? 0 : ENTRY_DURATION, ease: TRANSITION_EASING },
        scale: { duration: HOVER_DURATION, ease: TRANSITION_EASING },
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      style={{
        zIndex: state === 'active' ? 5 : 1,
      }}
    >
      <motion.div
        className={styles.image}
        style={{ backgroundImage: `url(${category.previewImage})` }}
        initial={skipEntryAnimation ? { scale: 1.3 } : undefined}
        animate={{
          scale: getImageScaleForState(state),
        }}
        transition={{
          duration: HOVER_DURATION,
          ease: TRANSITION_EASING,
        }}
      />
      <div className={styles.overlay}>
        <h3 ref={titleRef} className={styles.title} style={{ opacity: isTransitioning ? 0 : 1 }}>
          {category.title}
        </h3>
      </div>
    </motion.div>
  )
}
