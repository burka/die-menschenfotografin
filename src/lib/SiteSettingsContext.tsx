'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export interface SiteSettingsData {
  photographerName: string
  brandName: string
  tagline?: string
  contact: {
    email?: string
    phone?: string
    address?: string
  }
  impressum?: SerializedEditorState
  datenschutz?: SerializedEditorState
}

const SiteSettingsContext = createContext<SiteSettingsData | null>(null)

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettingsData
  children: ReactNode
}) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings(): SiteSettingsData {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    // Fallback if provider is missing (shouldn't happen in normal flow)
    return {
      photographerName: 'Kathrin Krause',
      brandName: 'die Menschenfotografin',
      tagline: 'Fine portraits for fine people',
      contact: {
        email: 'info@die-menschenfotografin.de',
        phone: '+49 1556 6222336',
        address: 'Kathrin Krause\nFichtenweg 28\n22962 Siek',
      },
    }
  }
  return context
}
