'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DynamicBackground.module.css';

interface DynamicBackgroundProps {
  backgroundImage: string | null;
}

const TRANSITION_EASING = [0.25, 0.1, 0.25, 1] as const;
const TRANSITION_DURATION = 0.4;

// Default blurry dark nature background when no tile is hovered
const DEFAULT_BACKGROUND = '/images/bg-nature-dark.jpg';

export function DynamicBackground({ backgroundImage }: DynamicBackgroundProps) {
  const previousImageRef = useRef<string | null>(null);
  const isFirstActivation = previousImageRef.current === null && backgroundImage !== null;

  useEffect(() => {
    previousImageRef.current = backgroundImage;
  }, [backgroundImage]);

  // Only animate on first activation (null -> image), instant switch between images
  const duration = isFirstActivation ? TRANSITION_DURATION : 0;

  return (
    <div className={styles.container}>
      {/* Base layer - always visible */}
      <div
        className={styles.baseBackground}
        style={{ backgroundImage: `url(${DEFAULT_BACKGROUND})` }}
      />

      {/* Active background - instant switch between images, fade in on first activation */}
      <AnimatePresence mode="sync">
        {backgroundImage && (
          <motion.div
            key={backgroundImage}
            className={styles.background}
            style={{ backgroundImage: `url(${backgroundImage})` }}
            initial={{ opacity: isFirstActivation ? 0 : 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{
              duration,
              ease: TRANSITION_EASING,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
