'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styles from './DynamicBackground.module.css';

interface DynamicBackgroundProps {
  backgroundImage: string | null;
}

const TRANSITION_EASING = [0.4, 0, 0.2, 1] as const;
const TRANSITION_DURATION = 0.7;

// Default blurry dark nature background when no tile is hovered
const DEFAULT_BACKGROUND = '/images/bg-nature-dark.jpg';

export function DynamicBackground({ backgroundImage }: DynamicBackgroundProps) {
  return (
    <div className={styles.container}>
      {/* Base layer - always visible */}
      <div
        className={styles.baseBackground}
        style={{ backgroundImage: `url(${DEFAULT_BACKGROUND})` }}
      />

      {/* Active background - crossfades on hover */}
      <AnimatePresence mode="wait">
        {backgroundImage && (
          <motion.div
            key={backgroundImage}
            className={styles.background}
            style={{ backgroundImage: `url(${backgroundImage})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: TRANSITION_DURATION,
              ease: TRANSITION_EASING,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
