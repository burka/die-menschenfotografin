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
 * Union type of all available content blocks
 */
export type ContentBlock = GalleryBlockData | RichTextBlockData
