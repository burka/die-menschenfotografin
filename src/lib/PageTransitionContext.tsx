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
}

// Store original tile rects for reverse navigation
interface StoredTileRect {
  slug: string;
  rect: DOMRect;
  imageUrl: string;
}

interface PageTransitionContextType {
  transition: TransitionState;
  startTransition: (imageUrl: string, rect: DOMRect, slug: string) => void;
  startReverseTransition: (slug: string) => void;
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
};

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [transition, setTransition] = useState<TransitionState>(initialState);
  const storedTileRects = useRef<Map<string, StoredTileRect>>(new Map());

  const startTransition = useCallback((imageUrl: string, rect: DOMRect, slug: string) => {
    // Store the tile rect for potential reverse navigation
    storedTileRects.current.set(slug, { slug, rect, imageUrl });

    setTransition({
      isActive: true,
      imageUrl,
      startRect: rect,
      targetRect: null,
      targetSlug: slug,
      direction: 'forward',
      phase: 'animating',
    });
  }, []);

  const startReverseTransition = useCallback((slug: string) => {
    const stored = storedTileRects.current.get(slug);
    if (!stored) {
      // No stored rect, can't do transition
      return;
    }

    // Calculate header rect (current position)
    const headerHeight = window.innerWidth <= 768 ? 300 : 400;
    const headerRect = new DOMRect(0, 0, window.innerWidth, headerHeight);

    setTransition({
      isActive: true,
      imageUrl: stored.imageUrl,
      startRect: headerRect,
      targetRect: stored.rect,
      targetSlug: slug,
      direction: 'backward',
      phase: 'animating',
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
