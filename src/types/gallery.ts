/**
 * Type definitions for the gallery system
 */

/**
 * Represents a single image in the gallery
 */
export interface GalleryImage {
  /** Unique identifier for the image */
  id: string
  /** Image source URL or path */
  src: string
  /** Alternative text for accessibility */
  alt: string
  /** Optional caption text displayed with the image */
  caption?: string
  /** Optional date when the photo was taken */
  date?: string
  /** Optional story or description about the image */
  story?: string
}

/**
 * Represents a category/collection of images
 */
export interface Category {
  /** Unique identifier for the category */
  id: string
  /** URL-friendly slug for routing */
  slug: string
  /** Display title for the category */
  title: string
  /** Optional hero/featured image for the category */
  heroImage?: string
  /** Optional description of the category */
  description?: string
}

/**
 * Represents the current hash-based route state
 */
export interface HashRoute {
  /** Current view type */
  view: 'home' | 'gallery' | 'single'
  /** Category slug (present in gallery and single views) */
  category?: string
  /** Image ID (present only in single view) */
  imageId?: string
}
