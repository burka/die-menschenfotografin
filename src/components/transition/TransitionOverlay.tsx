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
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (transition.phase === 'animating' && transition.direction === 'forward') {
      const headerHeight = window.innerWidth <= 768 ? 300 : 400;
      setCalculatedTargetRect(
        new DOMRect(0, 0, window.innerWidth, headerHeight)
      );
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
        </div>
      )}
    </AnimatePresence>
  );
}
