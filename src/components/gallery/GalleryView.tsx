'use client'

import { useState } from 'react'
import { useNavigation } from '@/lib/navigation'
import { CATEGORIES } from '@/data/categories'
import { GalleryTransitionProvider, useGalleryTransition } from '@/lib/useGalleryTransition'
import { GalleryHeader } from './GalleryHeader'
import { GalleryGrid } from './GalleryGrid'
import { LightboxOverlay } from '@/components/lightbox/LightboxOverlay'
import { LightboxImage } from '@/components/lightbox/LightboxImage'
import { LightboxNavigation } from '@/components/lightbox/LightboxNavigation'
import type { GalleryImage } from '@/types/gallery'
import type { BreadcrumbItem } from '@/components/layout/Breadcrumbs'

// Mock images (same as before)
const MOCK_IMAGES: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=1600&fit=crop',
    alt: 'Wedding ceremony',
    caption: 'A beautiful wedding ceremony',
    date: '2024-06-15',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
    alt: 'Wedding couple',
    caption: 'The happy couple',
    date: '2024-06-15',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=1200&fit=crop',
    alt: 'Event photography',
    caption: 'Corporate event',
    date: '2024-07-20',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=1200&fit=crop',
    alt: 'Family portrait',
    caption: 'Family memories',
    date: '2024-08-05',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=1600&fit=crop',
    alt: 'Children playing',
    caption: 'Kindergarten fun',
    date: '2024-09-10',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=1200&h=800&fit=crop',
    alt: 'Family outdoor',
    caption: 'Family day out',
    date: '2024-09-25',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&h=1200&fit=crop',
    alt: 'Kindergarten activities',
    caption: 'Learning through play',
    date: '2024-10-15',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=1200&fit=crop',
    alt: 'Business meeting',
    caption: 'Corporate event',
    date: '2024-11-01',
  },
]

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

  return (
    <>
      <GalleryHeader
        title={category.title}
        heroImage={category.previewImage}
        categorySlug={category.slug}
        breadcrumbs={breadcrumbs}
        onBackClick={handleBackClick}
      />

      <main style={{ background: 'white', minHeight: '100vh', padding: '2rem' }}>
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
    </>
  )
}

export function GalleryView() {
  return (
    <GalleryTransitionProvider>
      <GalleryViewContent />
    </GalleryTransitionProvider>
  )
}
