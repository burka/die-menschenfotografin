'use client'

import { Suspense, lazy, useEffect } from 'react'
import { NavigationProvider, useNavigation } from '@/lib/navigation'
import { LegalOverlayProvider } from '@/lib/LegalOverlayContext'
import { BackgroundProvider, useBackground } from '@/lib/BackgroundContext'
import { LegalOverlay } from '@/components/legal/LegalOverlay'
import { DynamicBackground } from '@/components/homepage/DynamicBackground'

// Lazy load views for code splitting
const HomeView = lazy(() =>
  import('@/components/homepage/HomeView').then((m) => ({ default: m.HomeView })),
)
const GalleryView = lazy(() =>
  import('@/components/gallery/GalleryView').then((m) => ({ default: m.GalleryView })),
)

function LoadingFallback() {
  return <div style={{ minHeight: '100vh' }} />
}

// Sync active category with background context
function BackgroundSync(): null {
  const { state } = useNavigation()
  const { setActiveCategory } = useBackground()

  useEffect(() => {
    // When in gallery/lightbox view, set the active category for background
    if (state.view === 'gallery' || state.view === 'lightbox') {
      setActiveCategory(state.activeCategory)
    } else {
      setActiveCategory(null)
    }
  }, [state.view, state.activeCategory, setActiveCategory])

  return null
}

function PersistentBackground() {
  const { backgroundImage } = useBackground()
  return <DynamicBackground backgroundImage={backgroundImage} />
}

function AppContent() {
  const { state } = useNavigation()

  return (
    <>
      <BackgroundSync />
      <PersistentBackground />
      <Suspense fallback={<LoadingFallback />}>
        {state.view === 'home' && <HomeView />}
        {(state.view === 'gallery' || state.view === 'lightbox') && <GalleryView />}
      </Suspense>
    </>
  )
}

export function AppShell() {
  return (
    <LegalOverlayProvider>
      <BackgroundProvider>
        <NavigationProvider>
          <AppContent />
          <LegalOverlay />
        </NavigationProvider>
      </BackgroundProvider>
    </LegalOverlayProvider>
  )
}
