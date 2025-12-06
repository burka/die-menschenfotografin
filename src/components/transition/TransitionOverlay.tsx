'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTransition } from '@/lib/PageTransitionContext';
import styles from './TransitionOverlay.module.css';

const TRANSITION_DURATION = 0.6;
const FADE_OUT_DURATION = 0.3;
const TRANSITION_EASING = [0.4, 0, 0.2, 1] as const;

export function TransitionOverlay() {
  const { transition, resetTransition, completeTransition } = usePageTransition();
  const [calculatedTargetRect, setCalculatedTargetRect] = useState<DOMRect | null>(null);
  const [calculatedTitleTarget, setCalculatedTitleTarget] = useState<{ x: number; y: number; fontSize: number } | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (transition.phase === 'animating' && transition.direction === 'forward') {
      const isMobile = window.innerWidth <= 768;
      const headerHeight = isMobile ? 300 : 400;
      setCalculatedTargetRect(
        new DOMRect(0, 0, window.innerWidth, headerHeight)
      );

      // Calculate target title position (matches GalleryHeader .content padding and .title position)
      const padding = isMobile ? 24 : 48;
      const titleFontSize = isMobile ? 32 : 48;
      // Title is at bottom of header with padding, breadcrumbs above it take about 40px
      setCalculatedTitleTarget({
        x: padding,
        y: headerHeight - padding - titleFontSize,
        fontSize: titleFontSize,
      });
    }
  }, [transition.phase, transition.direction]);

  // Start fade out after position animation completes
  useEffect(() => {
    if (transition.phase === 'animating' && transition.isActive) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, TRANSITION_DURATION * 1000);

      const completeTimer = setTimeout(() => {
        completeTransition();
      }, (TRANSITION_DURATION + FADE_OUT_DURATION) * 1000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [transition.phase, transition.isActive, completeTransition]);

  useEffect(() => {
    if (transition.phase === 'complete') {
      const timer = setTimeout(() => {
        resetTransition();
        setIsFadingOut(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transition.phase, resetTransition]);

  if (!transition.isActive || !transition.startRect || !transition.imageUrl) {
    return null;
  }

  const startRect = transition.startRect;
  const isForward = transition.direction === 'forward';
  const isAnimating = transition.phase === 'animating';
  const targetRect = isForward ? calculatedTargetRect : transition.targetRect;

  if (!targetRect && isAnimating) {
    return null;
  }

  // Title animation calculations
  const titleStartRect = transition.titleStartRect;
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Start values for title (from tile)
  const titleStartX = titleStartRect ? titleStartRect.left : 0;
  const titleStartY = titleStartRect ? titleStartRect.top : 0;
  const titleStartFontSize = isMobile ? 19 : 22; // 1.2rem/1.4rem converted

  // Target values for title
  let titleTargetX = 0;
  let titleTargetY = 0;
  let titleTargetFontSize = 48;

  if (isForward && calculatedTitleTarget) {
    titleTargetX = calculatedTitleTarget.x;
    titleTargetY = calculatedTitleTarget.y;
    titleTargetFontSize = calculatedTitleTarget.fontSize;
  } else if (!isForward && transition.targetRect) {
    // For backward navigation, get stored tile title position
    const storedRect = transition.targetRect;
    // Title is at bottom-left of tile with padding
    const tilePadding = isMobile ? 16 : 24;
    titleTargetX = storedRect.left + tilePadding;
    titleTargetY = storedRect.top + storedRect.height - tilePadding - titleStartFontSize;
    titleTargetFontSize = titleStartFontSize;
  }

  return (
    <AnimatePresence>
      {transition.phase !== 'complete' && (
        <div className={styles.overlay}>
          <motion.div
            className={styles.imageContainer}
            initial={{
              top: startRect.top,
              left: startRect.left,
              width: startRect.width,
              height: startRect.height,
              borderRadius: isForward ? 8 : 0,
              opacity: 1,
            }}
            animate={
              isAnimating && targetRect
                ? {
                    top: targetRect.top,
                    left: targetRect.left,
                    width: targetRect.width,
                    height: targetRect.height,
                    borderRadius: isForward ? 0 : 8,
                    opacity: isFadingOut ? 0 : 1,
                  }
                : { opacity: isFadingOut ? 0 : 1 }
            }
            transition={{
              top: { duration: TRANSITION_DURATION, ease: TRANSITION_EASING },
              left: { duration: TRANSITION_DURATION, ease: TRANSITION_EASING },
              width: { duration: TRANSITION_DURATION, ease: TRANSITION_EASING },
              height: { duration: TRANSITION_DURATION, ease: TRANSITION_EASING },
              borderRadius: { duration: TRANSITION_DURATION, ease: TRANSITION_EASING },
              opacity: { duration: FADE_OUT_DURATION, ease: 'easeOut' },
            }}
          >
            <motion.div
              className={styles.image}
              style={{ backgroundImage: `url(${transition.imageUrl})` }}
              initial={{ scale: isForward ? 1.3 : 1 }}
              animate={{ scale: isForward ? 1 : 1.3 }}
              transition={{
                duration: TRANSITION_DURATION,
                ease: TRANSITION_EASING,
              }}
            />
          </motion.div>

          {/* Animated Title */}
          {transition.title && titleStartRect && (
            <motion.h1
              className={styles.title}
              initial={{
                left: isForward ? titleStartX : titleStartX,
                top: isForward ? titleStartY : titleStartY,
                fontSize: isForward ? titleStartFontSize : titleTargetFontSize,
                opacity: 1,
              }}
              animate={
                isAnimating
                  ? {
                      left: isForward ? titleTargetX : titleTargetX,
                      top: isForward ? titleTargetY : titleTargetY,
                      fontSize: isForward ? titleTargetFontSize : titleStartFontSize,
                      opacity: isFadingOut ? 0 : 1,
                    }
                  : { opacity: isFadingOut ? 0 : 1 }
              }
              transition={{
                left: { duration: TRANSITION_DURATION, ease: TRANSITION_EASING },
                top: { duration: TRANSITION_DURATION, ease: TRANSITION_EASING },
                fontSize: { duration: TRANSITION_DURATION, ease: TRANSITION_EASING },
                opacity: { duration: FADE_OUT_DURATION, ease: 'easeOut' },
              }}
            >
              {transition.title}
            </motion.h1>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
