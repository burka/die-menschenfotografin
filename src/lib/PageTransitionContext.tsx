'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

interface TransitionState {
  isActive: boolean;
  imageUrl: string | null;
  startRect: DOMRect | null;
  targetRect: DOMRect | null;
  targetSlug: string | null;
  direction: 'forward' | 'backward';
  phase: 'idle' | 'animating' | 'complete';
  // Title animation data
  title: string | null;
  titleStartRect: DOMRect | null;
}

// Store original tile rects for reverse navigation
interface StoredTileRect {
  slug: string;
  rect: DOMRect;
  imageUrl: string;
  title: string;
  titleRect: DOMRect;
}

interface PageTransitionContextType {
  transition: TransitionState;
  startTransition: (imageUrl: string, rect: DOMRect, slug: string, title: string, titleRect: DOMRect) => void;
  startReverseTransition: (slug: string, titleRect: DOMRect) => void;
  completeTransition: () => void;
  resetTransition: () => void;
  getStoredTileRect: (slug: string) => StoredTileRect | null;
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null);

const initialState: TransitionState = {
  isActive: false,
  imageUrl: null,
  startRect: null,
  targetRect: null,
  targetSlug: null,
  direction: 'forward',
  phase: 'idle',
  title: null,
  titleStartRect: null,
};

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [transition, setTransition] = useState<TransitionState>(initialState);
  const storedTileRects = useRef<Map<string, StoredTileRect>>(new Map());

  const startTransition = useCallback((imageUrl: string, rect: DOMRect, slug: string, title: string, titleRect: DOMRect) => {
    // Store the tile rect for potential reverse navigation
    storedTileRects.current.set(slug, { slug, rect, imageUrl, title, titleRect });

    setTransition({
      isActive: true,
      imageUrl,
      startRect: rect,
      targetRect: null,
      targetSlug: slug,
      direction: 'forward',
      phase: 'animating',
      title,
      titleStartRect: titleRect,
    });
  }, []);

  const startReverseTransition = useCallback((slug: string, titleRect: DOMRect) => {
    const stored = storedTileRects.current.get(slug);
    if (!stored) {
      // No stored rect, can't do transition
      return;
    }

    // Calculate header rect (current position)
    const isMobile = window.innerWidth <= 768;
    const headerHeight = isMobile ? 300 : 400;
    const headerRect = new DOMRect(0, 0, window.innerWidth, headerHeight);

    // The stored rect was captured in active/hovered state (container scale 1.5 on desktop).
    // On return, tiles render in default state (scale 1.0). Compute the default-state rect
    // so the overlay targets the correct position.
    let targetRect = stored.rect;
    if (!isMobile) {
      const scaleRatio = 1 / 1.5; // default(1.0) / active(1.5)
      const centerX = stored.rect.left + stored.rect.width / 2;
      const centerY = stored.rect.top + stored.rect.height / 2;
      const targetWidth = stored.rect.width * scaleRatio;
      const targetHeight = stored.rect.height * scaleRatio;
      targetRect = new DOMRect(
        centerX - targetWidth / 2,
        centerY - targetHeight / 2,
        targetWidth,
        targetHeight,
      );
    }

    setTransition({
      isActive: true,
      imageUrl: stored.imageUrl,
      startRect: headerRect,
      targetRect,
      targetSlug: slug,
      direction: 'backward',
      phase: 'animating',
      title: stored.title,
      titleStartRect: titleRect,
    });
  }, []);

  const completeTransition = useCallback(() => {
    setTransition((prev) => ({
      ...prev,
      phase: 'complete',
    }));
  }, []);

  const resetTransition = useCallback(() => {
    setTransition(initialState);
  }, []);

  const getStoredTileRect = useCallback((slug: string) => {
    return storedTileRects.current.get(slug) || null;
  }, []);

  return (
    <PageTransitionContext.Provider
      value={{
        transition,
        startTransition,
        startReverseTransition,
        completeTransition,
        resetTransition,
        getStoredTileRect,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within PageTransitionProvider');
  }
  return context;
}
