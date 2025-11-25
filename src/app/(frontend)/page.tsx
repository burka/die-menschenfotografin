'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useHashRouter } from '@/lib/hashRouter'
import { GalleryView } from '@/components/GalleryView'
import { SingleImageView } from '@/components/SingleImageView'
import type { GalleryImage } from '@/types/gallery'

const MOCK_IMAGES: GalleryImage[] = [
  {
    id: 'img-1',
    src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1200&fit=crop',
    alt: 'Kind auf dem Spielplatz',
  },
  {
    id: 'img-2',
    src: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&h=1200&fit=crop',
    alt: 'Lachendes Kindergartenkind',
    caption: 'Freude pur im Kindergartenalltag',
    date: '2024-09-15',
  },
  {
    id: 'img-3',
    src: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&h=1200&fit=crop',
    alt: 'Kind beim Malen',
  },
  {
    id: 'img-4',
    src: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=800&h=1200&fit=crop',
    alt: 'Kleinkind im Garten',
    caption: 'Entdeckungsreise im Kindergarten-Garten',
    date: '2024-08-22',
    story: '<p>Ein wunderschöner Nachmittag im Garten des Kindergartens. Die Kinder haben die Natur erkundet und viele spannende Dinge entdeckt.</p>',
  },
  {
    id: 'img-5',
    src: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=1200&fit=crop',
    alt: 'Kind mit Luftballons',
  },
  {
    id: 'img-6',
    src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1200&fit=crop&q=90',
    alt: 'Kindergruppe beim Spielen',
  },
  {
    id: 'img-7',
    src: 'https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=800&h=1200&fit=crop',
    alt: 'Kind beim Basteln',
  },
  {
    id: 'img-8',
    src: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=1200&fit=crop',
    alt: 'Porträt eines Kindergartenkindes',
    caption: 'Authentische Kinderporträts',
    date: '2024-10-05',
  },
  {
    id: 'img-9',
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1200&fit=crop',
    alt: 'Kind beim Lesen',
  },
  {
    id: 'img-10',
    src: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=800&h=1200&fit=crop',
    alt: 'Kinder in der Gruppe',
  },
  {
    id: 'img-11',
    src: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800&h=1200&fit=crop',
    alt: 'Kind mit Teddy',
  },
  {
    id: 'img-12',
    src: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=800&h=1200&fit=crop',
    alt: 'Glückliches Kind im Kindergarten',
  },
]

export default function HomePage() {
  const { route, navigateTo } = useHashRouter()

  if (route.view === 'home') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 300,
              marginBottom: '1rem',
              color: 'white',
            }}
          >
            die-menschenfotografin.de
          </motion.h1>

          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '3rem',
              maxWidth: '600px',
            }}
          >
            Authentische Menschenfotografie von Janina
          </motion.p>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo('gallery/kindergarten')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'black',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Kindergarten Galerie
          </motion.button>
        </motion.div>
      </AnimatePresence>
    )
  }

  if (route.view === 'gallery' && route.category === 'kindergarten') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GalleryView
            categorySlug="kindergarten"
            categoryTitle="Kindergarten"
            images={MOCK_IMAGES}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  if (route.view === 'single' && route.category === 'kindergarten') {
    const currentIndex = MOCK_IMAGES.findIndex((img) => img.id === route.imageId)
    if (currentIndex === -1) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Bild nicht gefunden
        </div>
      )
    }

    return (
      <AnimatePresence mode="wait">
        <SingleImageView
          key={route.imageId}
          image={MOCK_IMAGES[currentIndex]}
          totalImages={MOCK_IMAGES.length}
          currentIndex={currentIndex}
        />
      </AnimatePresence>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      404 - Seite nicht gefunden
    </div>
  )
}
