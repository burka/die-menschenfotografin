'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLegalOverlay } from '@/lib/LegalOverlayContext';
import styles from './BrandingOverlay.module.css';

interface BrandingOverlayProps {
  isAnyTileActive: boolean;
}

const TRANSITION_EASING = [0.4, 0, 0.2, 1] as const;
const TRANSITION_DURATION = 0.4;

export function BrandingOverlay({ isAnyTileActive }: BrandingOverlayProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { openLegal } = useLegalOverlay();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      className={`${styles.container} ${isAnyTileActive ? styles.compact : ''}`}
      animate={{
        scale: isAnyTileActive ? 0.85 : 1,
        opacity: isAnyTileActive ? 0.7 : 1,
      }}
      transition={{
        duration: TRANSITION_DURATION,
        ease: TRANSITION_EASING,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className={styles.mainLine}>
        <h1 className={styles.title}>Kathrin Krause</h1>
        <AnimatePresence mode="wait">
          {isAnyTileActive && (
            <motion.span
              className={styles.separator}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              —
            </motion.span>
          )}
        </AnimatePresence>
        <motion.h2
          className={styles.subtitle}
          layout
          transition={{ duration: TRANSITION_DURATION, ease: TRANSITION_EASING }}
        >
          die Menschenfotografin
        </motion.h2>
      </div>
      <AnimatePresence mode="wait">
        {!isAnyTileActive && (
          <motion.div
            key={isHovered ? 'legal' : 'tagline'}
            className={styles.bottomLine}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {isHovered && !isMobile ? (
              <div className={styles.legalLinks}>
                <button
                  className={styles.legalLink}
                  onClick={() => openLegal('impressum')}
                >
                  Impressum
                </button>
                <span className={styles.legalSeparator}>|</span>
                <button
                  className={styles.legalLink}
                  onClick={() => openLegal('datenschutz')}
                >
                  Datenschutz
                </button>
              </div>
            ) : (
              <>
                <p className={styles.tagline}>Fine portraits for fine people</p>
                {isMobile && (
                  <div className={styles.legalLinksMobile}>
                    <button
                      className={styles.legalLink}
                      onClick={() => openLegal('impressum')}
                    >
                      Impressum
                    </button>
                    <span className={styles.legalSeparator}>|</span>
                    <button
                      className={styles.legalLink}
                      onClick={() => openLegal('datenschutz')}
                    >
                      Datenschutz
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
