import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/**
 * CMS Gallery Block Data Structure
 * Represents a gallery section with multiple images
 */
export interface GalleryBlockData {
  blockType: 'galleryBlock'
  id?: string
  images: {
    image: {
      url: string
      alt: string
      width: number
      height: number
    }
    caption?: string
  }[]
}

/**
 * CMS Rich Text Block Data Structure
 * Represents a rich text content section using Lexical editor
 */
export interface RichTextBlockData {
  blockType: 'richTextBlock'
  id?: string
  content: SerializedEditorState
}

/**
 * CMS Image + Text Block Data Structure
 * Represents a side-by-side image and text section
 */
export interface ImageTextBlockData {
  blockType: 'imageTextBlock'
  id?: string
  image: {
    url: string
    alt: string
    width: number
    height: number
  }
  heading?: string
  text: SerializedEditorState
  imagePosition: 'left' | 'right'
}

/**
 * CMS Heading Block Data Structure
 * Represents a heading with optional description
 */
export interface HeadingBlockData {
  blockType: 'headingBlock'
  id?: string
  heading: string
  level: 'h2' | 'h3' | 'h4'
  description?: string
}

/**
 * Union type of all available content blocks
 */
export type ContentBlock = GalleryBlockData | RichTextBlockData | ImageTextBlockData | HeadingBlockData

/**
 * CMS Category data as returned by Payload
 */
export interface CMSCategory {
  id: string
  title: string
  slug: string
  sortOrder: number
  heroImage?: CMSMedia | string
  previewImage?: CMSMedia | string
  description?: string
  content?: ContentBlock[]
}

/**
 * CMS Media data as returned by Payload
 */
export interface CMSMedia {
  id: string
  url: string
  alt: string
  width?: number
  height?: number
  filename?: string
}

/**
 * CMS Site Settings
 */
export interface CMSSiteSettings {
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
