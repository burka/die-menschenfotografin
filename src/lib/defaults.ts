import { siteSettingsData } from '@/seed-data'

/**
 * Default site settings used as fallbacks throughout the app.
 * Single source of truth - derived from seed-data.
 */
export const DEFAULTS = {
  photographerName: siteSettingsData.photographerName,
  brandName: siteSettingsData.brandName,
  tagline: siteSettingsData.tagline,
  contact: siteSettingsData.contact,
} as const
