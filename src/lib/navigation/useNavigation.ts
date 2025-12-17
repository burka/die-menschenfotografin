'use client';

import { useCallback } from 'react';
import { useNavigationContext } from './NavigationContext';
import { useViewTransition } from './useViewTransition';

export function useNavigation() {
  const { state, dispatch, updateURL } = useNavigationContext();
  const { startTransition } = useViewTransition();

  const toGallery = useCallback((category: string) => {
    startTransition(() => {
      dispatch({ type: 'NAVIGATE_TO_GALLERY', category });
    }).then(() => {
      updateURL();
    });
  }, [dispatch, startTransition, updateURL]);

  const toHome = useCallback(() => {
    startTransition(() => {
      dispatch({ type: 'NAVIGATE_TO_HOME' });
    }).then(() => {
      updateURL();
    });
  }, [dispatch, startTransition, updateURL]);

  const openLightbox = useCallback((imageId: string) => {
    startTransition(() => {
      dispatch({ type: 'OPEN_LIGHTBOX', imageId });
    }).then(() => {
      updateURL();
    });
  }, [dispatch, startTransition, updateURL]);

  const closeLightbox = useCallback(() => {
    startTransition(() => {
      dispatch({ type: 'CLOSE_LIGHTBOX' });
    }).then(() => {
      updateURL();
    });
  }, [dispatch, startTransition, updateURL]);

  const toLightboxImage = useCallback((imageId: string) => {
    dispatch({ type: 'NAVIGATE_LIGHTBOX', imageId });
    updateURL();
  }, [dispatch, updateURL]);

  return {
    state,
    toGallery,
    toHome,
    openLightbox,
    closeLightbox,
    toLightboxImage,
  };
}
