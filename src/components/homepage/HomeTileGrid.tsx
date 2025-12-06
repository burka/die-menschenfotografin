'use client';

import { CATEGORIES } from '@/data/categories';
import { useHomeTileInteraction } from '@/lib/hooks/useHomeTileInteraction';
import { BrandingOverlay } from './BrandingOverlay';
import { DynamicBackground } from './DynamicBackground';
import { HomeTile } from './HomeTile';
import styles from './HomeTileGrid.module.css';

interface HomeTileGridProps {
  onTileClick?: (slug: string) => void;
}

export function HomeTileGrid({ onTileClick }: HomeTileGridProps) {
  const { activeCategory, handleTileEnter, handleTileLeave, getTileState } =
    useHomeTileInteraction();

  const activeBackgroundImage =
    activeCategory !== null
      ? CATEGORIES.find((cat) => cat.slug === activeCategory)?.backgroundBokeh ?? null
      : null;

  return (
    <div className={styles.container}>
      <DynamicBackground backgroundImage={activeBackgroundImage} />
      <BrandingOverlay isAnyTileActive={activeCategory !== null} />

      <div className={styles.grid}>
        {CATEGORIES.map((category, index) => (
          <div key={category.slug} className={styles.gridItem} data-position={index}>
            <HomeTile
              category={category}
              state={getTileState(category.slug)}
              onMouseEnter={() => handleTileEnter(category.slug)}
              onMouseLeave={handleTileLeave}
              onClick={() => onTileClick?.(category.slug)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
