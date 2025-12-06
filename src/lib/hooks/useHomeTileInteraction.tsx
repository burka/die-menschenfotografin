import { useState, useCallback, useRef } from 'react';
import { TileState } from '@/types/homepage';

interface UseHomeTileInteractionReturn {
  activeCategory: string | null;
  lastActiveCategory: string | null;
  handleTileEnter: (slug: string) => void;
  handleTileLeave: () => void;
  getTileState: (slug: string) => TileState;
}

// Delay before deactivating to prevent flicker when switching tiles
const DEACTIVATION_DELAY = 100;

export function useHomeTileInteraction(): UseHomeTileInteractionReturn {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lastActiveCategory, setLastActiveCategory] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTileEnter = useCallback((slug: string) => {
    // Cancel any pending deactivation
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveCategory(slug);
    setLastActiveCategory(slug);
  }, []);

  const handleTileLeave = useCallback(() => {
    // Delay deactivation to allow switching between tiles smoothly
    // Only deactivate the active state, keep lastActiveCategory for background
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
      leaveTimeoutRef.current = null;
    }, DEACTIVATION_DELAY);
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
    lastActiveCategory,
    handleTileEnter,
    handleTileLeave,
    getTileState,
  };
}
