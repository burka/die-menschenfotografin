/**
 * Shared seed data used by both the manual seed script (src/seed.ts)
 * and the auto-seed onInit hook (src/payload.config.ts).
 */

export const categoriesData = [
  {
    title: 'Business & Event',
    slug: 'business-event',
    sortOrder: 1,
    description:
      'Professionelle Business- und Event-Fotografie für Unternehmen und Veranstaltungen.',
  },
  {
    title: 'Hochzeiten & Feiern',
    slug: 'hochzeiten-feiern',
    sortOrder: 2,
    description: 'Emotionale Hochzeitsfotografie und Dokumentation besonderer Feiern.',
  },
  {
    title: 'Familie & Kind',
    slug: 'familie-kind',
    sortOrder: 3,
    description: 'Authentische Familien- und Kinderfotografie mit Herz.',
  },
  {
    title: 'Kindergarten',
    slug: 'kindergarten',
    sortOrder: 4,
    description:
      'Moderne Kindergartenfotografie mit Herz – Strahlende Kinderaugen, lautes Gekicher, viel Spaß und authentische Bilder.',
  },
] as const

export const siteSettingsData = {
  photographerName: 'Kathrin Krause',
  brandName: 'die Menschenfotografin',
  tagline: 'Fine portraits for fine people',
  contact: {
    email: 'info@die-menschenfotografin.de',
    phone: '+49 1556 6222336',
    address: 'Kathrin Krause\nFichtenweg 28\n22962 Siek',
  },
} as const
