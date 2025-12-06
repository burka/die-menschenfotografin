'use client';

import { motion } from 'framer-motion';
import { CategoryTile, TileState } from '@/types/homepage';
import styles from './HomeTile.module.css';

interface HomeTileProps {
  category: CategoryTile;
  state: TileState;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick?: () => void;
}

const TRANSITION_EASING = [0.4, 0, 0.2, 1] as const;
const HOVER_DURATION = 0.4;
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

export function HomeTile({
  category,
  state,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: HomeTileProps) {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, filter: 'blur(20px)' }}
      animate={{
        opacity: 1,
        scale: getScaleForState(state),
        filter: getFilterForState(state),
      }}
      transition={{
        opacity: { duration: ENTRY_DURATION, ease: TRANSITION_EASING },
        filter: { duration: ENTRY_DURATION, ease: TRANSITION_EASING },
        scale: { duration: HOVER_DURATION, ease: TRANSITION_EASING },
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        zIndex: state === 'active' ? 5 : 1,
      }}
    >
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${category.previewImage})` }}
      />
      <div className={styles.overlay}>
        <h3 className={styles.title}>{category.title}</h3>
      </div>
    </motion.div>
  );
}
