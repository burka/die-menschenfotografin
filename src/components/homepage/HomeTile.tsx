'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { CategoryTile, TileState } from '@/types/homepage';
import styles from './HomeTile.module.css';

interface HomeTileProps {
  category: CategoryTile;
  state: TileState;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick?: (rect: DOMRect) => void;
  skipEntryAnimation?: boolean;
}

const TRANSITION_EASING = [0.4, 0, 0.2, 1] as const;
const HOVER_DURATION = 0.5;
const ENTRY_DURATION = 0.7;

const getScaleForState = (state: TileState): number => {
  switch (state) {
    case 'active':
      return 1.5;
    case 'inactive':
      return 0.5;
    default:
      return 1;
  }
};

const getFilterForState = (state: TileState): string => {
  if (state === 'inactive') {
    return 'blur(4px) grayscale(50%)';
  }
  return 'blur(0px) grayscale(0%)';
};

// Image zoom: cropped (1.3x) when idle, full (1x) when active
const getImageScaleForState = (state: TileState): number => {
  return state === 'active' ? 1 : 1.3;
};

export function HomeTile({
  category,
  state,
  onMouseEnter,
  onMouseLeave,
  onClick,
  skipEntryAnimation = false,
}: HomeTileProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (containerRef.current && onClick) {
      const rect = containerRef.current.getBoundingClientRect();
      onClick(rect);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={styles.container}
      initial={skipEntryAnimation ? false : { opacity: 0, filter: 'blur(20px)' }}
      animate={{
        opacity: 1,
        scale: getScaleForState(state),
        filter: getFilterForState(state),
      }}
      transition={{
        opacity: { duration: skipEntryAnimation ? 0 : ENTRY_DURATION, ease: TRANSITION_EASING },
        filter: { duration: skipEntryAnimation ? 0 : ENTRY_DURATION, ease: TRANSITION_EASING },
        scale: { duration: HOVER_DURATION, ease: TRANSITION_EASING },
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      style={{
        zIndex: state === 'active' ? 5 : 1,
      }}
    >
      <motion.div
        className={styles.image}
        style={{ backgroundImage: `url(${category.previewImage})` }}
        initial={skipEntryAnimation ? { scale: 1.3 } : undefined}
        animate={{
          scale: getImageScaleForState(state),
        }}
        transition={{
          duration: HOVER_DURATION,
          ease: TRANSITION_EASING,
        }}
      />
      <div className={styles.overlay}>
        <h3 className={styles.title}>{category.title}</h3>
      </div>
    </motion.div>
  );
}
