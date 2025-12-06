'use client'

import { motion } from 'framer-motion'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs'
import styles from './GalleryHeader.module.css'

interface GalleryHeaderProps {
  title: string
  heroImage: string
  breadcrumbs: BreadcrumbItem[]
}

export function GalleryHeader({ title, heroImage, breadcrumbs }: GalleryHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.heroImageWrapper}>
        <img src={heroImage} alt={title} className={styles.heroImage} />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <Breadcrumbs items={breadcrumbs} className={styles.breadcrumbs} />
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          suppressHydrationWarning
        >
          {title}
        </motion.h1>
      </div>
    </div>
  )
}
