export type ViewState = 'home' | 'gallery' | 'lightbox'

export interface NavigationState {
  view: ViewState
  activeCategory: string | null // Category slug when in gallery/lightbox
  lightboxImageId: string | null // Image ID when in lightbox
  previousView: ViewState | null // For animation direction detection
  previousCategory: string | null
}

export type NavigationAction =
  | { type: 'NAVIGATE_TO_GALLERY'; category: string }
  | { type: 'NAVIGATE_TO_HOME' }
  | { type: 'OPEN_LIGHTBOX'; imageId: string }
  | { type: 'CLOSE_LIGHTBOX' }
  | { type: 'NAVIGATE_LIGHTBOX'; imageId: string }
  | { type: 'HANDLE_POPSTATE'; state: NavigationState }

// View transition names for CSS - must be unique per element
export const VIEW_TRANSITION_NAMES = {
  categoryImage: (slug: string) => `category-image-${slug}`,
  categoryTitle: (slug: string) => `category-title-${slug}`,
  galleryGrid: 'gallery-grid',
  lightboxImage: 'lightbox-image',
} as const

// Valid category slugs (for validation)
export const VALID_CATEGORIES = [
  'business-event',
  'hochzeiten-feiern',
  'familie-kind',
  'kindergarten',
] as const

export type CategorySlug = (typeof VALID_CATEGORIES)[number]
