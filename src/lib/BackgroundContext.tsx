'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CATEGORIES } from '@/data/categories'

interface BackgroundContextType {
  backgroundImage: string | null
  setHoveredCategory: (slug: string | null) => void
  setActiveCategory: (slug: string | null) => void
}

const BackgroundContext = createContext<BackgroundContextType | null>(null)

interface BackgroundProviderProps {
  children: ReactNode
}

export function BackgroundProvider({ children }: BackgroundProviderProps) {
  const [hoveredCategory, setHoveredCategoryState] = useState<string | null>(null)
  const [activeCategory, setActiveCategoryState] = useState<string | null>(null)

  const setHoveredCategory = useCallback((slug: string | null) => {
    setHoveredCategoryState(slug)
  }, [])

  const setActiveCategory = useCallback((slug: string | null) => {
    setActiveCategoryState(slug)
  }, [])

  // Priority: hovered > active > null
  // When on gallery page, use active category's background
  // When hovering on home, use hovered category's background
  const categorySlug = hoveredCategory || activeCategory
  const backgroundImage = categorySlug
    ? (CATEGORIES.find((c) => c.slug === categorySlug)?.backgroundBokeh ?? null)
    : null

  return (
    <BackgroundContext.Provider value={{ backgroundImage, setHoveredCategory, setActiveCategory }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (!context) {
    throw new Error('useBackground must be used within BackgroundProvider')
  }
  return context
}
