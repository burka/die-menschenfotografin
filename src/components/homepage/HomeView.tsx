'use client';

import { useCallback } from 'react';
import { useNavigation } from '@/lib/navigation';
import { useHoverContext } from '@/components/app/AppShell';
import { HomeTileGrid } from './HomeTileGrid';
import { DynamicBackground } from './DynamicBackground';
import { CATEGORIES } from '@/data/categories';
import styles from './HomeView.module.css';

export function HomeView() {
  const { toGallery } = useNavigation();
  const { hoveredCategory, setHoveredCategory } = useHoverContext();

  // Adapter for old HomeTileGrid signature - ignores rect parameters
  const handleTileClick = useCallback((slug: string, _rect: DOMRect, _titleRect: DOMRect) => {
    toGallery(slug);
  }, [toGallery]);

  // Get background image from hovered category
  const backgroundImage = hoveredCategory
    ? CATEGORIES.find(c => c.slug === hoveredCategory)?.backgroundBokeh ?? null
    : null;

  return (
    <div className={styles.container}>
      <DynamicBackground backgroundImage={backgroundImage} />
      <HomeTileGrid
        onTileClick={handleTileClick}
        onTileHover={setHoveredCategory}
        hoveredCategory={hoveredCategory}
      />
    </div>
  );
}
