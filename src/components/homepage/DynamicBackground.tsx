'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styles from './DynamicBackground.module.css';

interface DynamicBackgroundProps {
  backgroundImage: string | null;
}

const TRANSITION_EASING = [0.25, 0.1, 0.25, 1] as const;
const CROSSFADE_DURATION = 0.3;

// Default bright flower bokeh background when no tile is hovered
const DEFAULT_BACKGROUND = '/images/bg-flower-bokeh.jpg';

export function DynamicBackground({ backgroundImage }: DynamicBackgroundProps) {
  return (
    <div className={styles.container}>
      {/* Base layer - always visible */}
      <div
        className={styles.baseBackground}
        style={{ backgroundImage: `url(${DEFAULT_BACKGROUND})` }}
      />

      {/* Active background - crossfade between images */}
      <AnimatePresence mode="sync">
        {backgroundImage && (
          <motion.div
            key={backgroundImage}
            className={styles.background}
            style={{ backgroundImage: `url(${backgroundImage})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: CROSSFADE_DURATION,
              ease: TRANSITION_EASING,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
