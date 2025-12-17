'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigation } from '@/lib/navigation'
import { CATEGORIES } from '@/data/categories'
import { MOCK_IMAGES } from '@/data/mockImages'
import { GalleryTransitionProvider, useGalleryTransition } from '@/lib/useGalleryTransition'
import { GalleryHeader } from './GalleryHeader'
import { GalleryGrid } from './GalleryGrid'
import { LightboxOverlay } from '@/components/lightbox/LightboxOverlay'
import { LightboxImage } from '@/components/lightbox/LightboxImage'
import { LightboxNavigation } from '@/components/lightbox/LightboxNavigation'
import type { GalleryImage } from '@/types/gallery'
import type { BreadcrumbItem } from '@/components/layout/Breadcrumbs'
import styles from './GalleryView.module.css'

function GalleryViewContent() {
  const { state, toHome } = useNavigation()
  const category = CATEGORIES.find((c) => c.slug === state.activeCategory)

  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const { startOpen, startClose, completeTransition, isTransitioning, direction } =
    useGalleryTransition()

  // If no valid category, this shouldn't render (handled by ContentLayer)
  if (!category) {
    return null
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: category.title, href: `/${category.slug}`, isCurrent: true },
  ]

  const handleImageClick = (image: GalleryImage, rect: DOMRect) => {
    const index = MOCK_IMAGES.findIndex((img) => img.id === image.id)
    if (index === -1) return

    setSelectedImage(image)
    setSelectedIndex(index)

    const gridElement = document.querySelector('[data-gallery-grid]') as HTMLElement
    if (gridElement) {
      const gridRect = gridElement.getBoundingClientRect()
      startOpen(image.id, rect, gridRect)
    }
  }

  const handleClose = () => {
    startClose()
    setTimeout(() => {
      setSelectedImage(null)
      setSelectedIndex(-1)
      completeTransition()
    }, 700)
  }

  const handlePrev = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1
      setSelectedIndex(newIndex)
      setSelectedImage(MOCK_IMAGES[newIndex])
    }
  }

  const handleNext = () => {
    if (selectedIndex < MOCK_IMAGES.length - 1) {
      const newIndex = selectedIndex + 1
      setSelectedIndex(newIndex)
      setSelectedImage(MOCK_IMAGES[newIndex])
    }
  }

  const handleBackClick = () => {
    toHome()
  }

  const isOpening = direction === 'opening'
  const isClosing = direction === 'closing'
  const isFromHome = state.previousView === 'home'

  return (
    <div className={styles.container}>
      {/* White overlay - fades in over the persistent background */}
      <motion.div
        className={styles.backgroundOverlay}
        initial={isFromHome ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: isFromHome ? 0.2 : 0 }}
      />

      <GalleryHeader
        title={category.title}
        heroImage={category.previewImage}
        categorySlug={category.slug}
        breadcrumbs={breadcrumbs}
        onBackClick={handleBackClick}
        skipEntryAnimation={isFromHome}
      />

      <main className={styles.main}>
        <div data-gallery-grid>
          <GalleryGrid images={MOCK_IMAGES} onImageClick={handleImageClick} />
        </div>
      </main>

      {selectedImage && (
        <LightboxOverlay
          isOpen={!!selectedImage}
          onClose={handleClose}
          isClosing={isClosing}
          isOpening={isOpening}
        >
          <LightboxNavigation
            currentIndex={selectedIndex}
            totalImages={MOCK_IMAGES.length}
            onPrev={selectedIndex > 0 ? handlePrev : null}
            onNext={selectedIndex < MOCK_IMAGES.length - 1 ? handleNext : null}
            onClose={handleClose}
            isVisible={!isTransitioning}
            isClosing={isClosing}
            isOpening={isOpening}
          />
          <LightboxImage
            image={selectedImage}
            isAnimating={isTransitioning}
            isClosing={isClosing}
            isOpening={isOpening}
          />
        </LightboxOverlay>
      )}
    </div>
  )
}

export function GalleryView() {
  return (
    <GalleryTransitionProvider>
      <GalleryViewContent />
    </GalleryTransitionProvider>
  )
}
