'use client';

import { motion } from 'framer-motion';
import styles from './BrandingOverlay.module.css';

interface BrandingOverlayProps {
  isAnyTileActive: boolean;
}

const TRANSITION_EASING = [0.4, 0, 0.2, 1] as const;
const TRANSITION_DURATION = 0.4;

export function BrandingOverlay({ isAnyTileActive }: BrandingOverlayProps) {
  return (
    <motion.div
      className={styles.container}
      animate={{
        scale: isAnyTileActive ? 0.7 : 1,
        opacity: isAnyTileActive ? 0.6 : 1,
      }}
      transition={{
        duration: TRANSITION_DURATION,
        ease: TRANSITION_EASING,
      }}
    >
      <h1 className={styles.title}>Kathrin Krause</h1>
      <h2 className={styles.subtitle}>die Menschenfotografin</h2>
      <p className={styles.tagline}>Fine portraits for fine people</p>
    </motion.div>
  );
}
