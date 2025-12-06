import { useState, useCallback } from 'react';
import { TileState } from '@/types/homepage';

interface UseHomeTileInteractionReturn {
  activeCategory: string | null;
  handleTileEnter: (slug: string) => void;
  handleTileLeave: () => void;
  getTileState: (slug: string) => TileState;
}

export function useHomeTileInteraction(): UseHomeTileInteractionReturn {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleTileEnter = useCallback((slug: string) => {
    setActiveCategory(slug);
  }, []);

  const handleTileLeave = useCallback(() => {
    setActiveCategory(null);
  }, []);

  const getTileState = useCallback(
    (slug: string): TileState => {
      if (activeCategory === null) {
        return 'default';
      }
      return activeCategory === slug ? 'active' : 'inactive';
    },
    [activeCategory],
  );

  return {
    activeCategory,
    handleTileEnter,
    handleTileLeave,
    getTileState,
  };
}
