'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

/**
 * Shared animation configuration - single source of truth
 */
export const TRANSITION = {
  duration: 700,
  easing: [0.4, 0, 0.2, 1] as const,
  fadeDelay: 0.1,
} as const

/**
 * Framer Motion transition preset for zoom animations
 */
export const zoomTransition = {
  duration: TRANSITION.duration / 1000,
  ease: TRANSITION.easing,
}

/**
 * Framer Motion transition preset for fade animations
 */
export const fadeTransition = {
  duration: TRANSITION.duration / 1000,
  ease: TRANSITION.easing,
}

/**
 * Framer Motion transition preset for blur animations
 */
export const blurTransition = {
  duration: (TRANSITION.duration * 0.7) / 1000,
  ease: TRANSITION.easing,
}

/**
 * Calculate zoom transform values for animating from thumbnail to fullscreen
 * Used by both GalleryView (zoom) and for positioning calculations
 */
export function calculateZoomTransform(
  imageRect: DOMRect,
  gridRect: DOMRect,
  viewport: { width: number; height: number } = typeof window !== 'undefined'
    ? { width: window.innerWidth, height: window.innerHeight }
    : { width: 1920, height: 1080 }
) {
  // Image center in viewport
  const imageCenterX = imageRect.left + imageRect.width / 2
  const imageCenterY = imageRect.top + imageRect.height / 2

  // Transform origin as percentage within the grid
  const originXPercent = ((imageCenterX - gridRect.left) / gridRect.width) * 100
  const originYPercent = ((imageCenterY - gridRect.top) / gridRect.height) * 100

  // Viewport center
  const viewportCenterX = viewport.width / 2
  const viewportCenterY = viewport.height / 2

  // Scale to fill viewport (90% width, 85% height max)
  const targetScale = Math.min(
    (viewport.width * 0.9) / imageRect.width,
    (viewport.height * 0.85) / imageRect.height
  )

  // Translation to move image center to viewport center
  const deltaX = viewportCenterX - imageCenterX
  const deltaY = viewportCenterY - imageCenterY

  return {
    scale: targetScale,
    x: deltaX,
    y: deltaY,
    originX: `${originXPercent}%`,
    originY: `${originYPercent}%`,
  }
}

/**
 * Transition direction
 */
export type TransitionDirection = 'opening' | 'closing' | null

/**
 * Transition state
 */
interface TransitionState {
  isTransitioning: boolean
  direction: TransitionDirection
  targetImageId: string | null
  imageRect: DOMRect | null
  gridRect: DOMRect | null
}

/**
 * Context value interface
 */
interface GalleryTransitionContextValue extends TransitionState {
  /** Start opening animation (gallery → single image) */
  startOpen: (imageId: string, imageRect: DOMRect, gridRect: DOMRect) => void
  /** Start closing animation (single image → gallery) */
  startClose: () => void
  /** Complete the transition (called after animation finishes) */
  completeTransition: () => void
  /** Get zoom transform for current target */
  getZoomTransform: () => ReturnType<typeof calculateZoomTransform> | null
}

const initialState: TransitionState = {
  isTransitioning: false,
  direction: null,
  targetImageId: null,
  imageRect: null,
  gridRect: null,
}

const GalleryTransitionContext = createContext<GalleryTransitionContextValue | undefined>(undefined)

interface GalleryTransitionProviderProps {
  children: ReactNode
}

/**
 * Provider for gallery transition state
 * Manages the shared animation state between GalleryView and SingleImageView
 */
export function GalleryTransitionProvider({ children }: GalleryTransitionProviderProps) {
  const [state, setState] = useState<TransitionState>(initialState)

  const startOpen = useCallback((imageId: string, imageRect: DOMRect, gridRect: DOMRect) => {
    setState({
      isTransitioning: true,
      direction: 'opening',
      targetImageId: imageId,
      imageRect,
      gridRect,
    })
  }, [])

  const startClose = useCallback(() => {
    setState(prev => ({
      ...prev,
      isTransitioning: true,
      direction: 'closing',
    }))
  }, [])

  const completeTransition = useCallback(() => {
    setState(initialState)
  }, [])

  const getZoomTransform = useCallback(() => {
    if (!state.imageRect || !state.gridRect) return null
    return calculateZoomTransform(state.imageRect, state.gridRect)
  }, [state.imageRect, state.gridRect])

  const value: GalleryTransitionContextValue = {
    ...state,
    startOpen,
    startClose,
    completeTransition,
    getZoomTransform,
  }

  return (
    <GalleryTransitionContext.Provider value={value}>
      {children}
    </GalleryTransitionContext.Provider>
  )
}

/**
 * Hook to access gallery transition state and controls
 */
export function useGalleryTransition(): GalleryTransitionContextValue {
  const context = useContext(GalleryTransitionContext)

  if (!context) {
    throw new Error('useGalleryTransition must be used within a GalleryTransitionProvider')
  }

  return context
}
