'use client';

import { useCallback, useEffect, useRef } from 'react';

// View Transitions API types
type ViewTransitionCallback = () => void | Promise<void>;

interface ViewTransitionResult {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

// Type for document with View Transitions API
type DocumentWithViewTransitions = {
  startViewTransition?: (callback: ViewTransitionCallback) => ViewTransitionResult;
};

let polyfillLoaded = false;
let polyfillLoading: Promise<void> | null = null;

async function ensurePolyfill(): Promise<void> {
  if (typeof document === 'undefined') return;
  if ((document as unknown as DocumentWithViewTransitions).startViewTransition) return; // Native support
  if (polyfillLoaded) return;

  if (!polyfillLoading) {
    // @ts-expect-error - view-transitions-polyfill has no type definitions
    polyfillLoading = import('view-transitions-polyfill')
      .then(() => { polyfillLoaded = true; })
      .catch(err => console.warn('View Transitions polyfill failed:', err));
  }

  await polyfillLoading;
}

interface ViewTransitionOptions {
  skipTransition?: boolean;
}

export function useViewTransition() {
  const isSupported = useRef(false);

  useEffect(() => {
    ensurePolyfill().then(() => {
      isSupported.current = typeof document !== 'undefined' &&
        !!(document as unknown as DocumentWithViewTransitions).startViewTransition;
    });
  }, []);

  const startTransition = useCallback(async (
    updateDOM: () => void | Promise<void>,
    options: ViewTransitionOptions = {}
  ): Promise<void> => {
    const doc = document as unknown as DocumentWithViewTransitions;

    // Skip transition if requested or not supported
    if (options.skipTransition || !doc.startViewTransition) {
      await updateDOM();
      return;
    }

    const transition = doc.startViewTransition(async () => {
      await updateDOM();
    });

    try {
      await transition.finished;
    } catch (error) {
      // Transition was skipped (user navigated away, etc.)
      console.debug('View transition skipped:', error);
    }
  }, []);

  return {
    startTransition,
    isSupported: isSupported.current
  };
}
