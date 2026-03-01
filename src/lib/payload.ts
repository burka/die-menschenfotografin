import { getPayload } from 'payload'
import config from '@payload-config'
import type { CMSCategory, CMSMedia, CMSSiteSettings, ContentBlock } from '@/types/cms'
import type { CategoryTile } from '@/types/homepage'
import { DEFAULTS } from '@/lib/defaults'

/**
 * Get the Payload instance (uses Local API - no HTTP requests needed)
 */
async function getPayloadClient() {
  return getPayload({ config })
}

/**
 * Type guard: checks if a media field is a populated object (vs. a raw ID)
 */
function isMediaObject(value: unknown): value is CMSMedia {
  return typeof value === 'object' && value !== null && 'url' in value
}

/**
 * Extract URL from a media field (handles populated objects, string URLs, and IDs)
 */
function getMediaUrl(media: unknown): string {
  if (!media) return ''
  if (isMediaObject(media)) return media.url || ''
  if (typeof media === 'string') return media
  return ''
}

/**
 * Extract alt text from a media field
 */
function getMediaAlt(media: unknown): string {
  if (isMediaObject(media)) return media.alt || ''
  return ''
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
    slug: doc.slug,
    title: doc.title,
    previewImage: getMediaUrl(doc.previewImage),
    backgroundBokeh: getMediaUrl(doc.heroImage),
  }))
}

/**
 * Fetch a single category by slug with full content blocks
 */
export async function getCategoryBySlug(slug: string): Promise<CMSCategory | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  if (result.docs.length === 0) return null

  const doc = result.docs[0]

  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    sortOrder: doc.sortOrder || 0,
    heroImage: isMediaObject(doc.heroImage) ? (doc.heroImage as CMSMedia) : undefined,
    previewImage: isMediaObject(doc.previewImage) ? (doc.previewImage as CMSMedia) : undefined,
    description: doc.description ?? undefined,
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

  const contact = settings.contact as { email?: string; phone?: string; address?: string } | undefined

  return {
    photographerName: settings.photographerName || DEFAULTS.photographerName,
    brandName: settings.brandName || DEFAULTS.brandName,
    tagline: settings.tagline || DEFAULTS.tagline,
    contact: {
      email: contact?.email || DEFAULTS.contact.email,
      phone: contact?.phone || DEFAULTS.contact.phone,
      address: contact?.address || DEFAULTS.contact.address,
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

  return result.docs.map((doc) => doc.slug)
}

export { getMediaUrl, getMediaAlt }
