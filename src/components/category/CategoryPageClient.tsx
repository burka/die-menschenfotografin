'use client'

import { useState, useCallback } from 'react'
import { GalleryTransitionProvider, useGalleryTransition } from '@/lib/useGalleryTransition'
import { GalleryHeader } from '@/components/gallery/GalleryHeader'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { LightboxOverlay } from '@/components/lightbox/LightboxOverlay'
import { LightboxImage } from '@/components/lightbox/LightboxImage'
import { LightboxNavigation } from '@/components/lightbox/LightboxNavigation'
import type { ContentBlock } from '@/types/cms'
import type { GalleryImage } from '@/types/gallery'
import type { BreadcrumbItem } from '@/components/layout/Breadcrumbs'

interface CategoryPageClientProps {
  categorySlug: string
  title: string
  heroImage: string
  blocks: ContentBlock[]
}

/**
 * Collects all gallery images from content blocks for lightbox navigation
 */
function collectGalleryImages(blocks: ContentBlock[]): GalleryImage[] {
  const images: GalleryImage[] = []

  for (const block of blocks) {
    if (block.blockType === 'galleryBlock' && block.images) {
      for (const item of block.images) {
        images.push({
          id: item.image.url,
          src: item.image.url,
          alt: item.image.alt,
          caption: item.caption,
        })
      }
    }
  }

  return images
}

function CategoryPageContent({ categorySlug, title, heroImage, blocks }: CategoryPageClientProps) {
  const allImages = collectGalleryImages(blocks)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const { startOpen, startClose, completeTransition, isTransitioning, direction } =
    useGalleryTransition()

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: title, href: `/${categorySlug}`, isCurrent: true },
  ]

  const handleImageClick = useCallback(
    (image: GalleryImage, rect: DOMRect) => {
      const index = allImages.findIndex((img) => img.id === image.id)
      if (index === -1) return

      setSelectedImage(image)
      setSelectedIndex(index)

      const gridElement = document.querySelector('[data-gallery-grid]') as HTMLElement
      if (gridElement) {
        const gridRect = gridElement.getBoundingClientRect()
        startOpen(image.id, rect, gridRect)
      }
    },
    [startOpen, allImages],
  )

  const handleClose = useCallback(() => {
    startClose()

    setTimeout(() => {
      setSelectedImage(null)
      setSelectedIndex(-1)
      completeTransition()
    }, 700)
  }, [startClose, completeTransition])

  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1
      setSelectedIndex(newIndex)
      setSelectedImage(allImages[newIndex])
    }
  }, [selectedIndex, allImages])

  const handleNext = useCallback(() => {
    if (selectedIndex < allImages.length - 1) {
      const newIndex = selectedIndex + 1
      setSelectedIndex(newIndex)
      setSelectedImage(allImages[newIndex])
    }
  }, [selectedIndex, allImages])

  const isOpening = direction === 'opening'
  const isClosing = direction === 'closing'

  return (
    <>
      <GalleryHeader
        title={title}
        heroImage={heroImage}
        breadcrumbs={breadcrumbs}
        categorySlug={categorySlug}
      />

      <main
        style={{
          background: 'white',
          minHeight: '100vh',
          padding: '2rem',
        }}
      >
        <div data-gallery-grid style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <BlockRenderer blocks={blocks} onImageClick={handleImageClick} />
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
            totalImages={allImages.length}
            onPrev={selectedIndex > 0 ? handlePrev : null}
            onNext={selectedIndex < allImages.length - 1 ? handleNext : null}
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

export function CategoryPageClient(props: CategoryPageClientProps) {
  return (
    <GalleryTransitionProvider>
      <CategoryPageContent {...props} />
    </GalleryTransitionProvider>
  )
}
