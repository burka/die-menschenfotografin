'use client'

import { useState, useCallback } from 'react'
import { NavigationProvider } from '@/lib/navigation'
import { LegalOverlayProvider } from '@/lib/LegalOverlayContext'
import { PersistentImageLayer } from './PersistentImageLayer'
import { ContentLayer } from './ContentLayer'
import { LegalOverlay } from '@/components/legal/LegalOverlay'

// Context for hover state communication between layers
import { createContext, useContext } from 'react'

interface HoverContextType {
  hoveredCategory: string | null
  setHoveredCategory: (slug: string | null) => void
}

const HoverContext = createContext<HoverContextType>({
  hoveredCategory: null,
  setHoveredCategory: () => {},
})

export function useHoverContext() {
  return useContext(HoverContext)
}

export function AppShell() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const handleSetHoveredCategory = useCallback((slug: string | null) => {
    setHoveredCategory(slug)
  }, [])

  return (
    <LegalOverlayProvider>
      <NavigationProvider>
        <HoverContext.Provider
          value={{
            hoveredCategory,
            setHoveredCategory: handleSetHoveredCategory,
          }}
        >
          <PersistentImageLayer hoveredCategory={hoveredCategory} />
          <ContentLayer />
        </HoverContext.Provider>
        <LegalOverlay />
      </NavigationProvider>
    </LegalOverlayProvider>
  )
}
