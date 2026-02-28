import { getPayload } from 'payload'
import config from '@payload-config'
import type { CMSCategory, CMSMedia, CMSSiteSettings, ContentBlock } from '@/types/cms'
import type { CategoryTile } from '@/types/homepage'

/**
 * Get the Payload instance (uses Local API - no HTTP requests needed)
 */
async function getPayloadClient() {
  return getPayload({ config })
}

/**
 * Helper to extract URL from a media field (handles both populated and ID-only references)
 */
function getMediaUrl(media: CMSMedia | string | undefined | null): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media.url || ''
}

/**
 * Helper to extract alt text from a media field
 */
function getMediaAlt(media: CMSMedia | string | undefined | null): string {
  if (!media) return ''
  if (typeof media === 'string') return ''
  return media.alt || ''
}

/**
 * Fetch all categories sorted by sortOrder for the homepage
 */
export async function getCategories(): Promise<CategoryTile[]> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'categories',
    sort: 'sortOrder',
    depth: 1,
    limit: 100,
  })

  return result.docs.map((doc) => ({
    slug: doc.slug as string,
    title: doc.title as string,
    previewImage: getMediaUrl(doc.previewImage as unknown as CMSMedia | string | undefined),
    backgroundBokeh: getMediaUrl(doc.heroImage as unknown as CMSMedia | string | undefined),
  }))
}

/**
 * Fetch a single category by slug with full content blocks
 */
export async function getCategoryBySlug(slug: string): Promise<CMSCategory | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: slug },
    },
    depth: 2,
    limit: 1,
  })

  if (result.docs.length === 0) return null

  const doc = result.docs[0]

  return {
    id: String(doc.id),
    title: doc.title as string,
    slug: doc.slug as string,
    sortOrder: (doc.sortOrder as number) || 0,
    heroImage: doc.heroImage as unknown as CMSMedia | string | undefined,
    previewImage: doc.previewImage as unknown as CMSMedia | string | undefined,
    description: doc.description as string | undefined,
    content: (doc.content as ContentBlock[] | undefined) || [],
  }
}

/**
 * Fetch site settings (branding, contact, legal texts)
 */
export async function getSiteSettings(): Promise<CMSSiteSettings> {
  const payload = await getPayloadClient()

  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
  })

  return {
    photographerName: (settings.photographerName as string) || 'Kathrin Krause',
    brandName: (settings.brandName as string) || 'die Menschenfotografin',
    tagline: (settings.tagline as string) || 'Fine portraits for fine people',
    contact: {
      email: (settings.contact as Record<string, string>)?.email || 'info@die-menschenfotografin.de',
      phone: (settings.contact as Record<string, string>)?.phone || '',
      address: (settings.contact as Record<string, string>)?.address || '',
    },
    impressum: settings.impressum as CMSSiteSettings['impressum'],
    datenschutz: settings.datenschutz as CMSSiteSettings['datenschutz'],
  }
}

/**
 * Fetch all category slugs (for static generation)
 */
export async function getAllCategorySlugs(): Promise<string[]> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 100,
  })

  return result.docs.map((doc) => doc.slug as string)
}

/**
 * Helper: Get media URL for use in components
 */
export { getMediaUrl, getMediaAlt }
