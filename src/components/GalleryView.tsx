'use client'

import { motion } from 'framer-motion'
import { useHashRouter } from '@/lib/hashRouter'
import type { GalleryImage } from '@/types/gallery'
import styles from './GalleryView.module.css'

interface GalleryViewProps {
  categorySlug: string
  images: GalleryImage[]
  categoryTitle: string
}

export function GalleryView({ categorySlug, images, categoryTitle }: GalleryViewProps) {
  const { navigateTo } = useHashRouter()

  const handleImageClick = (image: GalleryImage) => {
    // Navigate immediately - framer-motion's layoutId will handle the smooth animation
    navigateTo(`gallery/${categorySlug}/${image.id}`)
  }

  return (
    <div className={styles.wrapper}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {categoryTitle}
      </motion.h1>

      <motion.div
        className={styles.galleryGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className={styles.imageWrapper}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.3 + index * 0.05,
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <motion.img
              layoutId={image.id}
              src={image.src}
              alt={image.alt}
              onClick={() => handleImageClick(image)}
              className={styles.image}
              style={{ cursor: 'pointer' }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
