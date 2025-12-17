'use client'

import { useCallback } from 'react'
import { useNavigationContext } from './NavigationContext'
import { useViewTransition } from './useViewTransition'

export function useNavigation() {
  const { state, dispatchSync, updateURL } = useNavigationContext()
  const { startTransition } = useViewTransition()

  const toGallery = useCallback(
    (category: string) => {
      startTransition(() => {
        // Use dispatchSync to force synchronous DOM update inside view transition
        dispatchSync({ type: 'NAVIGATE_TO_GALLERY', category })
      }).then(() => {
        updateURL()
      })
    },
    [dispatchSync, startTransition, updateURL],
  )

  const toHome = useCallback(() => {
    startTransition(() => {
      dispatchSync({ type: 'NAVIGATE_TO_HOME' })
    }).then(() => {
      updateURL()
    })
  }, [dispatchSync, startTransition, updateURL])

  const openLightbox = useCallback(
    (imageId: string) => {
      startTransition(() => {
        dispatchSync({ type: 'OPEN_LIGHTBOX', imageId })
      }).then(() => {
        updateURL()
      })
    },
    [dispatchSync, startTransition, updateURL],
  )

  const closeLightbox = useCallback(() => {
    startTransition(() => {
      dispatchSync({ type: 'CLOSE_LIGHTBOX' })
    }).then(() => {
      updateURL()
    })
  }, [dispatchSync, startTransition, updateURL])

  const toLightboxImage = useCallback(
    (imageId: string) => {
      dispatchSync({ type: 'NAVIGATE_LIGHTBOX', imageId })
      updateURL()
    },
    [dispatchSync, updateURL],
  )

  return {
    state,
    toGallery,
    toHome,
    openLightbox,
    closeLightbox,
    toLightboxImage,
  }
}
