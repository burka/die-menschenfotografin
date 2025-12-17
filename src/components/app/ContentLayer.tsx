'use client'

import { useNavigation } from '@/lib/navigation'
import { Suspense, lazy } from 'react'

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

export function ContentLayer() {
  const { state } = useNavigation()

  return (
    <div style={{ position: 'relative', zIndex: 2 }}>
      <Suspense fallback={<LoadingFallback />}>
        {state.view === 'home' && <HomeView />}
        {(state.view === 'gallery' || state.view === 'lightbox') && <GalleryView />}
      </Suspense>
    </div>
  )
}
