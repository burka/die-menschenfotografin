'use client'

import { Suspense, lazy } from 'react'
import { NavigationProvider, useNavigation } from '@/lib/navigation'
import { LegalOverlayProvider } from '@/lib/LegalOverlayContext'
import { LegalOverlay } from '@/components/legal/LegalOverlay'

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

function AppContent() {
  const { state } = useNavigation()

  return (
    <Suspense fallback={<LoadingFallback />}>
      {state.view === 'home' && <HomeView />}
      {(state.view === 'gallery' || state.view === 'lightbox') && <GalleryView />}
    </Suspense>
  )
}

export function AppShell() {
  return (
    <LegalOverlayProvider>
      <NavigationProvider>
        <AppContent />
        <LegalOverlay />
      </NavigationProvider>
    </LegalOverlayProvider>
  )
}
