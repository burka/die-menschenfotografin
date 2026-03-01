'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { DEFAULTS } from '@/lib/defaults'

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
    return {
      ...DEFAULTS,
      contact: { ...DEFAULTS.contact },
    }
  }
  return context
}
